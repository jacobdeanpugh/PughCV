"use client";

import { useState } from "react";
import { ProfilePicker } from "@/components/ProfilePicker";
import {
  PreviewEmptyState,
  PreviewSkeleton,
  ResumePreview,
} from "@/components/ResumePreview";
import type { ProfileId } from "@/data/profile-meta";
import type { ResumeData } from "@/types/resume";

const MIN_DESCRIPTION_LENGTH = 30;

function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error && err.message ? err.message : fallback;
}

function StepLabel({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="grid size-5 shrink-0 place-items-center rounded-full border border-line-strong text-[0.65rem] font-semibold text-ink-muted"
      >
        {step}
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
        {children}
      </span>
    </div>
  );
}

function Alert({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-danger/40 bg-danger-soft px-3 py-2.5 text-sm text-danger"
    >
      {children}
    </p>
  );
}

export default function HomePage() {
  const [selectedProfile, setSelectedProfile] = useState<ProfileId>("dean");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tailoredResume, setTailoredResume] = useState<ResumeData | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const trimmedLength = jobDescription.trim().length;
  const canGenerate = trimmedLength >= MIN_DESCRIPTION_LENGTH && !loading;

  const handleProfileChange = (id: ProfileId) => {
    setSelectedProfile(id);
    setTailoredResume(null);
    setPdfError(null);
  };

  const handleGenerate = async () => {
    if (trimmedLength < MIN_DESCRIPTION_LENGTH) {
      setError(
        `Please paste a complete job description (at least ${MIN_DESCRIPTION_LENGTH} characters).`
      );
      return;
    }

    setLoading(true);
    setError(null);
    setPdfError(null);

    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: selectedProfile, jobDescription }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to tailor resume.");
      }

      setTailoredResume(json.data);
    } catch (err: unknown) {
      setError(errorMessage(err, "An unexpected error occurred."));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!tailoredResume) return;

    setDownloadingPdf(true);
    setPdfError(null);

    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: tailoredResume }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate PDF.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tailoredResume.fullName.replace(/\s+/g, "_")}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setPdfError(errorMessage(err, "PDF generation failed."));
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-line bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid size-8 place-items-center rounded-lg bg-accent text-sm font-bold text-white"
            >
              P
            </span>
            <div className="leading-tight">
              <h1 className="text-sm font-semibold tracking-tight">Pugh Applications</h1>
              <p className="text-xs text-ink-faint">ATS resume tailoring</p>
            </div>
          </div>

          <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-[0.65rem] font-medium text-ink-faint">
            v1.0.0
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-10">
          {/* ---------- Controls ---------- */}
          <div className="space-y-7">
            <section className="space-y-3">
              <StepLabel step={1}>Candidate profile</StepLabel>
              <ProfilePicker
                value={selectedProfile}
                onChange={handleProfileChange}
                disabled={loading}
              />
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <StepLabel step={2}>Target job description</StepLabel>
                <span
                  className={`text-xs tabular-nums ${
                    trimmedLength >= MIN_DESCRIPTION_LENGTH ? "text-ink-faint" : "text-ink-faint/70"
                  }`}
                >
                  {trimmedLength.toLocaleString()} chars
                </span>
              </div>

              <textarea
                id="job-desc"
                rows={14}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job posting here — responsibilities, requirements, and preferred qualifications. The more complete the posting, the better the keyword match."
                aria-label="Target job description"
                className="scrollbar-slim w-full resize-y rounded-xl border border-line bg-surface p-4 text-sm leading-relaxed text-ink placeholder:text-ink-faint/70 focus:border-accent focus:outline-none"
              />

              {error && <Alert>{error}</Alert>}

              <button
                type="button"
                disabled={!canGenerate}
                onClick={handleGenerate}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-faint"
              >
                {loading && (
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="size-4 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="9" className="opacity-25" />
                    <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
                  </svg>
                )}
                {loading
                  ? "Tailoring resume…"
                  : tailoredResume
                    ? "Regenerate resume"
                    : "Generate tailored resume"}
              </button>

              <p className="text-xs leading-relaxed text-ink-faint">
                Bullets are rewritten and re-weighted from the master profile only — no
                experience is invented. Output is budgeted to a single page.
              </p>
            </section>
          </div>

          {/* ---------- Preview ---------- */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-3 flex items-center justify-between gap-3">
              <StepLabel step={3}>Review &amp; export</StepLabel>

              {tailoredResume && !loading && (
                <button
                  type="button"
                  disabled={downloadingPdf}
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-2 rounded-lg bg-positive px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-positive-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="size-3.5"
                  >
                    <path d="M12 3v12m0 0 4-4m-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
                  </svg>
                  {downloadingPdf ? "Building PDF…" : "Download PDF"}
                </button>
              )}
            </div>

            {pdfError && (
              <div className="mb-3">
                <Alert>{pdfError}</Alert>
              </div>
            )}

            <div className="max-h-[calc(100vh-9rem)] overflow-y-auto lg:pr-1 scrollbar-slim">
              {loading ? (
                <PreviewSkeleton />
              ) : tailoredResume ? (
                <ResumePreview resume={tailoredResume} />
              ) : (
                <PreviewEmptyState />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
