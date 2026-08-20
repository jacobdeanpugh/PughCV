import { NextRequest, NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import type { ResumeData } from "@/types/resume";
import { DENSITY_LADDER, renderResumeLatex } from "@/lib/latex-resume";

const execFileAsync = promisify(execFile);

/** Tectonic reports the final page number via the \AtEndDocument typeout. */
function pageCountFromLog(log: string): number | null {
  const match = log.match(/PUGHCV_PAGES=(\d+)/);
  return match ? Number(match[1]) : null;
}

function describeExecError(err: unknown): string | undefined {
  if (err && typeof err === "object") {
    const { stderr, stdout } = err as { stderr?: unknown; stdout?: unknown };
    if (stderr) return String(stderr);
    if (stdout) return String(stdout);
  }
  return err instanceof Error ? err.message : undefined;
}

export async function POST(req: NextRequest) {
  let workDir: string | null = null;

  try {
    const { resume } = (await req.json()) as { resume: ResumeData };

    if (!resume || !resume.fullName) {
      return NextResponse.json(
        { error: "Valid resume object is required." },
        { status: 400 }
      );
    }

    workDir = await mkdtemp(join(tmpdir(), "resume-"));
    const texPath = join(workDir, "resume.tex");
    const pdfPath = join(workDir, "resume.pdf");
    const logPath = join(workDir, "resume.log");

    // Walk the ladder loosest-to-tightest and keep the first layout that lands
    // on a single page. The last rung is the fallback if nothing fits.
    let pdfBuffer: Buffer | null = null;
    let usedLevel = -1;

    for (let level = 0; level < DENSITY_LADDER.length; level++) {
      await writeFile(
        texPath,
        renderResumeLatex(resume, DENSITY_LADDER[level]),
        "utf-8"
      );

      try {
        await execFileAsync(
          "tectonic",
          [texPath, "--outdir", workDir, "--keep-logs"],
          { timeout: 60_000 }
        );
      } catch (compileErr: unknown) {
        const details = describeExecError(compileErr);
        console.error(`Tectonic compile failed at level ${level}:`, details);
        return NextResponse.json(
          { error: "Failed to compile resume PDF.", details },
          { status: 500 }
        );
      }

      const pages = pageCountFromLog(await readFile(logPath, "latin1"));
      pdfBuffer = await readFile(pdfPath);
      usedLevel = level;

      if (pages === 1) break;

      if (pages === null) {
        console.warn(
          `Could not read page count at level ${level}; using this render.`
        );
        break;
      }
    }

    if (!pdfBuffer) {
      return NextResponse.json(
        { error: "Failed to render resume PDF." },
        { status: 500 }
      );
    }

    console.log(
      `Rendered ${resume.fullName} at density level ${usedLevel}` +
        (usedLevel === DENSITY_LADDER.length - 1
          ? " (tightest available — may still exceed one page)"
          : "")
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resume.fullName.replace(
          /\s+/g,
          "_"
        )}_Resume.pdf"`,
      },
    });
  } catch (err: unknown) {
    console.error("PDF Generation Error:", err);

    const errorMessage =
      err instanceof Error ? err.message : "Failed to generate PDF.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    if (workDir) {
      await rm(workDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}
