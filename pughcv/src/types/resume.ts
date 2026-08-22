import { z } from "zod";

export const ResumeSchema = z.object({
  fullName: z.string(),
  contact: z.object({
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    linkedin: z.string().nullable().describe("LinkedIn profile URL or null if not applicable"),
  }),
  headline: z
    .string()
    .nullable()
    .describe(
      "A short professional headline (2-6 words) printed under the candidate's name, chosen to match the target job title. Prefer the target role title when the candidate's real experience genuinely supports it; otherwise use the closest truthful title. Never invent seniority the master profile does not support. Use null only if no headline fits."
    ),
  professionalSummary: z
    .string()
    .describe("A targeted 2-3 sentence summary aligning the candidate's career with the target role keywords."),
  skills: z
    .array(z.string())
    .describe("A curated list of 8-12 relevant technical, operational, and domain skills pulled from the master profile matching the JD."),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      location: z.string().nullable().describe("City, State or null if not applicable"),
      period: z
        .string()
        .describe(
          "Employment dates as 'Month YYYY - Month YYYY' or 'Month YYYY - Present', using the full month name (e.g. 'July 2004 - Present'), never numeric month abbreviations like MM/YYYY."
        ),
      bullets: z
        .array(z.string())
        .describe(
          "3-5 high-impact bullet points rewritten with strong action verbs and exact target keywords from the job description, strictly truthful to original experience. Each bullet must follow Action + Context + Result: close with a real figure from the master profile when one exists, otherwise with a truthful qualitative outcome that follows directly from the action (e.g. 'minimizing operational downtime during the transition'). Never invent numbers, percentages, or dollar amounts that are not in the master profile."
        ),
    })
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      year: z.string().nullable().describe("Graduation year or null if not applicable"),
    })
  ),
});

export type ResumeData = z.infer<typeof ResumeSchema>;