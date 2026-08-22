"use client";

import { AddButton, EditableText, RemoveButton } from "@/components/EditableText";
import type { ResumeData } from "@/types/resume";

/** Placeholder shown before the first tailoring run. */
export function PreviewEmptyState() {
  return (
    <div className="flex min-h-[26rem] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line p-10 text-center">
      <div aria-hidden className="grid size-11 place-items-center rounded-xl bg-surface-2 text-ink-faint">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
          <path d="M14 3v4a1 1 0 0 0 1 1h4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 8v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 13h6M9 17h4" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-sm font-medium text-ink-muted">No resume generated yet</p>
      <p className="max-w-xs text-xs leading-relaxed text-ink-faint">
        Choose a profile and paste the target job description. The tailored, one-page
        result will appear here for review before you export it.
      </p>
    </div>
  );
}

/** Loading shimmer that mirrors the shape of the real document. */
export function PreviewSkeleton() {
  return (
    <div
      aria-hidden
      className="min-h-[26rem] animate-pulse space-y-5 rounded-2xl bg-paper p-8 shadow-xl shadow-black/40"
    >
      <div className="space-y-2 border-b border-paper-line pb-5">
        <div className="h-6 w-52 rounded bg-paper-line" />
        <div className="h-3 w-72 rounded bg-paper-line/70" />
      </div>
      {[0, 1, 2].map((block) => (
        <div key={block} className="space-y-2">
          <div className="h-2.5 w-32 rounded bg-paper-line" />
          <div className="h-3 w-full rounded bg-paper-line/60" />
          <div className="h-3 w-11/12 rounded bg-paper-line/60" />
          <div className="h-3 w-4/5 rounded bg-paper-line/60" />
        </div>
      ))}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 border-b border-paper-line pb-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-paper-muted">
      {children}
    </h3>
  );
}

const BLANK_EXPERIENCE = {
  company: "",
  role: "",
  location: null,
  period: "",
  bullets: [""],
};

const BLANK_EDUCATION = { institution: "", degree: "", year: null };

/** Empty optional fields round-trip to null so the LaTeX renderer omits them. */
function orNull(value: string) {
  return value.trim() ? value : null;
}

/**
 * Renders the tailored resume as a light "paper" document so the preview reads
 * like the PDF that `/api/generate-pdf` produces.
 *
 * With `editing`, every field becomes an inline input writing back through
 * `onChange`. The same component renders both modes on purpose: the reviewed
 * document and the exported document cannot drift apart.
 */
export function ResumePreview({
  resume,
  editing = false,
  onChange,
}: {
  resume: ResumeData;
  editing?: boolean;
  onChange?: (next: ResumeData) => void;
}) {
  // Editing is only live when the parent supplied a writer.
  const isEditing = editing && Boolean(onChange);
  const patch = (partial: Partial<ResumeData>) =>
    onChange?.({ ...resume, ...partial });

  const patchContact = (partial: Partial<ResumeData["contact"]>) =>
    patch({ contact: { ...resume.contact, ...partial } });

  const patchExperience = (
    idx: number,
    partial: Partial<ResumeData["experience"][number]>
  ) =>
    patch({
      experience: resume.experience.map((exp, i) =>
        i === idx ? { ...exp, ...partial } : exp
      ),
    });

  const patchEducation = (
    idx: number,
    partial: Partial<ResumeData["education"][number]>
  ) =>
    patch({
      education: resume.education.map((edu, i) =>
        i === idx ? { ...edu, ...partial } : edu
      ),
    });

  const contactLine = [
    resume.contact.location,
    resume.contact.phone,
    resume.contact.email,
    resume.contact.linkedin,
  ].filter(Boolean);

  const headline = resume.headline ?? resume.experience[0]?.role;

  return (
    <article className="rounded-2xl bg-paper p-8 font-serif text-paper-ink shadow-xl shadow-black/40 sm:p-10">
      <header className="border-b border-paper-line pb-4 text-center">
        {isEditing ? (
          <div className="space-y-1.5">
            <EditableText
              value={resume.fullName}
              onChange={(v) => patch({ fullName: v })}
              label="Full name"
              className="text-center text-2xl font-bold tracking-tight"
            />
            <EditableText
              value={resume.headline ?? ""}
              onChange={(v) => patch({ headline: orNull(v) })}
              label="Headline"
              placeholder="Headline (leave blank to omit)"
              className="text-center text-sm"
            />
            <div className="grid gap-1 pt-1 text-xs sm:grid-cols-2">
              <EditableText
                value={resume.contact.location}
                onChange={(v) => patchContact({ location: v })}
                label="Location"
                placeholder="Location"
              />
              <EditableText
                value={resume.contact.phone}
                onChange={(v) => patchContact({ phone: v })}
                label="Phone"
                placeholder="Phone"
              />
              <EditableText
                value={resume.contact.email}
                onChange={(v) => patchContact({ email: v })}
                label="Email"
                placeholder="Email"
              />
              <EditableText
                value={resume.contact.linkedin ?? ""}
                onChange={(v) => patchContact({ linkedin: orNull(v) })}
                label="LinkedIn URL"
                placeholder="LinkedIn (optional)"
              />
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold tracking-tight">{resume.fullName}</h2>
            {headline ? <p className="mt-1 text-sm text-paper-ink">{headline}</p> : null}
            <p className="mt-1.5 text-xs text-paper-muted">{contactLine.join("  ·  ")}</p>
          </>
        )}
      </header>

      <div className="mt-5 space-y-5 text-[0.8rem] leading-relaxed">
        <section>
          <SectionHeading>Professional Summary</SectionHeading>
          {isEditing ? (
            <EditableText
              value={resume.professionalSummary}
              onChange={(v) => patch({ professionalSummary: v })}
              label="Professional summary"
            />
          ) : (
            <p>{resume.professionalSummary}</p>
          )}
        </section>

        <section>
          <SectionHeading>Core Skills</SectionHeading>
          <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {resume.skills.map((skill, idx) => (
              // Index keys keep the input mounted while its text changes;
              // keying on the value itself would remount and drop focus.
              <li key={idx} className="flex gap-2">
                <span aria-hidden className="text-paper-muted">
                  •
                </span>
                {isEditing ? (
                  <>
                    <EditableText
                      value={skill}
                      onChange={(v) =>
                        patch({
                          skills: resume.skills.map((s, i) => (i === idx ? v : s)),
                        })
                      }
                      label={`Skill ${idx + 1}`}
                    />
                    <RemoveButton
                      label={`Remove skill ${idx + 1}`}
                      onClick={() =>
                        patch({ skills: resume.skills.filter((_, i) => i !== idx) })
                      }
                    />
                  </>
                ) : (
                  <span>{skill}</span>
                )}
              </li>
            ))}
          </ul>
          {isEditing && (
            <AddButton onClick={() => patch({ skills: [...resume.skills, ""] })}>
              Add skill
            </AddButton>
          )}
        </section>

        <section>
          <SectionHeading>Professional Experience</SectionHeading>
          <div className="space-y-4">
            {resume.experience.map((exp, idx) => (
              <div key={idx}>
                {isEditing ? (
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <EditableText
                        value={exp.role}
                        onChange={(v) => patchExperience(idx, { role: v })}
                        label={`Role title ${idx + 1}`}
                        className="font-bold"
                      />
                      <RemoveButton
                        label={`Remove ${exp.role || "role"}`}
                        onClick={() =>
                          patch({
                            experience: resume.experience.filter((_, i) => i !== idx),
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-1 text-xs sm:grid-cols-3">
                      <EditableText
                        value={exp.company}
                        onChange={(v) => patchExperience(idx, { company: v })}
                        label={`Company ${idx + 1}`}
                        placeholder="Company"
                      />
                      <EditableText
                        value={exp.location ?? ""}
                        onChange={(v) => patchExperience(idx, { location: orNull(v) })}
                        label={`Location ${idx + 1}`}
                        placeholder="Location"
                      />
                      <EditableText
                        value={exp.period}
                        onChange={(v) => patchExperience(idx, { period: v })}
                        label={`Dates ${idx + 1}`}
                        placeholder="Month YYYY - Present"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h4 className="font-bold">{exp.role}</h4>
                      <span className="text-xs text-paper-muted">{exp.period}</span>
                    </div>
                    <p className="text-xs italic text-paper-muted">
                      {[exp.company, exp.location].filter(Boolean).join(", ")}
                    </p>
                  </>
                )}

                <ul className="mt-1.5 space-y-1">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex gap-2">
                      <span aria-hidden className="text-paper-muted">
                        •
                      </span>
                      {isEditing ? (
                        <>
                          <EditableText
                            value={bullet}
                            onChange={(v) =>
                              patchExperience(idx, {
                                bullets: exp.bullets.map((b, i) => (i === bIdx ? v : b)),
                              })
                            }
                            label={`Bullet ${bIdx + 1} of ${exp.role || "role"}`}
                          />
                          <RemoveButton
                            label={`Remove bullet ${bIdx + 1}`}
                            onClick={() =>
                              patchExperience(idx, {
                                bullets: exp.bullets.filter((_, i) => i !== bIdx),
                              })
                            }
                          />
                        </>
                      ) : (
                        <span>{bullet}</span>
                      )}
                    </li>
                  ))}
                </ul>

                {isEditing && (
                  <AddButton
                    onClick={() =>
                      patchExperience(idx, { bullets: [...exp.bullets, ""] })
                    }
                  >
                    Add bullet
                  </AddButton>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <AddButton
              onClick={() =>
                patch({ experience: [...resume.experience, { ...BLANK_EXPERIENCE }] })
              }
            >
              Add role
            </AddButton>
          )}
        </section>

        {(resume.education.length > 0 || isEditing) && (
          <section>
            <SectionHeading>Education</SectionHeading>
            <div className="space-y-1.5">
              {resume.education.map((edu, idx) => (
                <div key={idx}>
                  {isEditing ? (
                    <div className="flex items-start gap-2">
                      <div className="grid flex-1 gap-1 text-xs sm:grid-cols-3">
                        <EditableText
                          value={edu.degree}
                          onChange={(v) => patchEducation(idx, { degree: v })}
                          label={`Degree ${idx + 1}`}
                          placeholder="Degree"
                        />
                        <EditableText
                          value={edu.institution}
                          onChange={(v) => patchEducation(idx, { institution: v })}
                          label={`Institution ${idx + 1}`}
                          placeholder="Institution"
                        />
                        <EditableText
                          value={edu.year ?? ""}
                          onChange={(v) => patchEducation(idx, { year: orNull(v) })}
                          label={`Year ${idx + 1}`}
                          placeholder="Year"
                        />
                      </div>
                      <RemoveButton
                        label={`Remove ${edu.degree || "education entry"}`}
                        onClick={() =>
                          patch({
                            education: resume.education.filter((_, i) => i !== idx),
                          })
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span>
                        <span className="font-bold">{edu.degree}</span>
                        <span className="text-paper-muted"> — {edu.institution}</span>
                      </span>
                      {edu.year && <span className="text-xs text-paper-muted">{edu.year}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <AddButton
                onClick={() =>
                  patch({ education: [...resume.education, { ...BLANK_EDUCATION }] })
                }
              >
                Add education
              </AddButton>
            )}
          </section>
        )}
      </div>
    </article>
  );
}
