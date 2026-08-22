import type { ResumeData } from "@/types/resume";

/**
 * Escapes a plain-text string for safe inclusion in LaTeX source.
 * Order matters: backslash must be escaped first, otherwise the backslashes
 * introduced by later replacements would themselves get escaped.
 */
export function escapeLatex(input: string): string {
  return input
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\$/g, "\\$")
    .replace(/&/g, "\\&")
    .replace(/#/g, "\\#")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/_/g, "\\_")
    .replace(/%/g, "\\%")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/[\r\n]+/g, " ")
    .trim();
}

const SAFE_EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const SAFE_URL = /^https?:\/\/[A-Za-z0-9._~:/?#[\]@!$&'()*+,;=-]+$/;

/**
 * Renders a contact-line item as a clickable link only when it matches a
 * conservative safe-character pattern; anything else (including anything an
 * LLM might inject) falls back to plain escaped text rather than being
 * passed raw into a \href URL argument, which has its own escaping rules.
 */
function linkify(value: string, hrefPrefix: string, pattern: RegExp): string {
  const label = escapeLatex(value);
  if (pattern.test(value)) {
    return `\\href{${hrefPrefix}${value}}{${label}}`;
  }
  return label;
}

/**
 * One rung of the fit-to-one-page ladder. Earlier rungs only tighten layout;
 * the last rungs also trim bullets from older roles, which is the standard
 * resume compromise once spacing has nothing left to give.
 */
export interface Density {
  classSize: "11pt" | "10pt";
  margin: string;
  sectionBefore: string;
  sectionAfter: string;
  topSep: string;
  itemSep: string;
  /** Negative lead that pulls a role's bullets up under its company line. */
  bulletLead: string;
  jobGap: string;
  nameGap: string;
  /**
   * Max bullets per role, indexed by role position (most recent first). The
   * last entry applies to every remaining role, so [4,3,2] means 4 bullets on
   * the newest role, 3 on the next, and 2 on all older ones. Undefined keeps
   * every bullet.
   */
  bulletCaps?: number[];
}

/**
 * Ordered loosest-to-tightest. `renderResumeLatex` is called with successive
 * rungs until the compiled PDF lands on a single page.
 */
export const DENSITY_LADDER: Density[] = [
  {
    classSize: "11pt",
    margin: "0.6in",
    sectionBefore: "0.75em",
    sectionAfter: "0.4em",
    topSep: "0.1em",
    itemSep: "0.1em",
    bulletLead: "1.0em",
    jobGap: "0.45em",
    nameGap: "0.2em",
  },
  {
    classSize: "11pt",
    margin: "0.5in",
    sectionBefore: "0.55em",
    sectionAfter: "0.3em",
    topSep: "0.05em",
    itemSep: "0.05em",
    bulletLead: "0.25em",
    jobGap: "0.3em",
    nameGap: "0.15em",
  },
  {
    classSize: "11pt",
    margin: "0.45in",
    sectionBefore: "0.4em",
    sectionAfter: "0.22em",
    topSep: "0.02em",
    itemSep: "0.02em",
    bulletLead: "0.15em",
    jobGap: "0.2em",
    nameGap: "0.1em",
  },
  {
    classSize: "10pt",
    margin: "0.5in",
    sectionBefore: "0.5em",
    sectionAfter: "0.28em",
    topSep: "0.05em",
    itemSep: "0.05em",
    bulletLead: "0.125em",
    jobGap: "0.28em",
    nameGap: "0.15em",
  },
  {
    classSize: "10pt",
    margin: "0.45in",
    sectionBefore: "0.38em",
    sectionAfter: "0.2em",
    topSep: "0.02em",
    itemSep: "0.02em",
    bulletLead: "0.1em",
    jobGap: "0.2em",
    nameGap: "0.1em",
  },
  {
    classSize: "10pt",
    margin: "0.4in",
    sectionBefore: "0.3em",
    sectionAfter: "0.16em",
    topSep: "0pt",
    itemSep: "0pt",
    bulletLead: "0.05em",
    jobGap: "0.15em",
    nameGap: "0.08em",
  },
  // From here on, spacing has nothing left to give: start trimming bullets
  // from the oldest roles first, which is what a human editor would do.
  {
    classSize: "10pt",
    margin: "0.4in",
    sectionBefore: "0.3em",
    sectionAfter: "0.16em",
    topSep: "0pt",
    itemSep: "0pt",
    bulletLead: "-0.4em",
    jobGap: "0.15em",
    nameGap: "0.08em",
    bulletCaps: [5, 4, 3],
  },
  {
    classSize: "10pt",
    margin: "0.4in",
    sectionBefore: "0.28em",
    sectionAfter: "0.14em",
    topSep: "0pt",
    itemSep: "0pt",
    bulletLead: "-0.4em",
    jobGap: "0.12em",
    nameGap: "0.08em",
    bulletCaps: [4, 3, 2],
  },
  {
    classSize: "10pt",
    margin: "0.4in",
    sectionBefore: "0.28em",
    sectionAfter: "0.14em",
    topSep: "0pt",
    itemSep: "0pt",
    bulletLead: "-0.4em",
    jobGap: "0.12em",
    nameGap: "0.08em",
    bulletCaps: [3, 3, 2, 2, 1],
  },
  {
    classSize: "10pt",
    margin: "0.4in",
    sectionBefore: "0.25em",
    sectionAfter: "0.12em",
    topSep: "0pt",
    itemSep: "0pt",
    bulletLead: "-0.45em",
    jobGap: "0.1em",
    nameGap: "0.05em",
    bulletCaps: [3, 2, 2, 1, 1],
  },
];

function bulletsFor(
  bullets: string[],
  index: number,
  density: Density
): string[] {
  const caps = density.bulletCaps;
  if (!caps || caps.length === 0) return bullets;
  const cap = caps[Math.min(index, caps.length - 1)];
  return bullets.slice(0, cap);
}

function job(
  role: string,
  company: string,
  location: string | null,
  period: string,
  bullets: string[],
  density: Density
): string {
  const companyLine = location
    ? `${escapeLatex(company)}, ${escapeLatex(location)}`
    : escapeLatex(company);
  const itemized = bullets.map((b) => `    \\item ${escapeLatex(b)}`).join("\n");

  return `\\textbf{${escapeLatex(role)}} \\hfill \\textbf{${escapeLatex(period)}}\\\\
\\textit{${companyLine}}
\\vspace{${density.bulletLead}}
\\begin{itemize}
${itemized}
\\end{itemize}`;
}

export function renderResumeLatex(
  resume: ResumeData,
  density: Density = DENSITY_LADDER[0]
): string {
  const name = escapeLatex(resume.fullName);
  const headline = resume.headline ?? resume.experience[0]?.role;

  const contactParts = [
    resume.contact.location ? escapeLatex(resume.contact.location) : null,
    resume.contact.phone ? escapeLatex(resume.contact.phone) : null,
    resume.contact.email
      ? linkify(resume.contact.email, "mailto:", SAFE_EMAIL)
      : null,
    resume.contact.linkedin
      ? linkify(resume.contact.linkedin, "", SAFE_URL)
      : null,
  ].filter((item): item is string => Boolean(item));

  const experienceSection = resume.experience
    .map((exp, i) =>
      job(
        exp.role,
        exp.company,
        exp.location,
        exp.period,
        bulletsFor(exp.bullets, i, density),
        density
      )
    )
    .join(`\n\n\\vspace{${density.jobGap}}\n\n`);

  // Two columns keeps a flat 8-12 skill list from eating a dozen lines.
  const skillsSection = `\\begin{multicols}{2}
\\begin{itemize}
${resume.skills.map((skill) => `    \\item ${escapeLatex(skill)}`).join("\n")}
\\end{itemize}
\\end{multicols}`;

  const educationSection = resume.education
    .map((edu) => {
      const left = `\\textbf{${escapeLatex(edu.degree)}}, ${escapeLatex(
        edu.institution
      )}`;
      return edu.year
        ? `${left} \\hfill \\textbf{${escapeLatex(edu.year)}}\\\\`
        : `${left}\\\\`;
    })
    .join("\n");

  return `\\documentclass[${density.classSize},letterpaper]{article}

\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=${density.margin}]{geometry}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{multicol}
\\usepackage{hyperref}

\\hypersetup{colorlinks=true, urlcolor=black, linkcolor=black, pdftitle={${name} - Resume}}

\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\columnsep}{1em}

\\titleformat{\\section}
  {\\normalfont\\large\\bfseries\\scshape}
  {}{0em}{}[\\vspace{-0.6em}\\rule{\\textwidth}{0.8pt}]
\\titlespacing*{\\section}{0pt}{${density.sectionBefore}}{${density.sectionAfter}}

\\setlist[itemize]{leftmargin=1.2em, topsep=${density.topSep}, itemsep=${density.itemSep}, parsep=0pt}

\\AtEndDocument{\\typeout{PUGHCV_PAGES=\\thepage}}

\\begin{document}

%----------------------------------------------------------------------
\\begin{center}
    {\\LARGE \\textbf{\\MakeUppercase{${name}}}}\\\\[${density.nameGap}]
    ${
      headline
        ? `{${escapeLatex(headline)}}\\\\[${density.nameGap}]\n    `
        : ""
    }{\\small ${contactParts.join(" \\textbar{} ")}}
\\end{center}

%----------------------------------------------------------------------
\\section{Summary}

${escapeLatex(resume.professionalSummary)}

%----------------------------------------------------------------------
\\section{Professional Experience}

${experienceSection}

%----------------------------------------------------------------------
\\section{Core Skills}

${skillsSection}

%----------------------------------------------------------------------
\\section{Education}

${educationSection}

\\end{document}
`;
}
