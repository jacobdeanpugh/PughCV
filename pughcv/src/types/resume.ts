import { z } from "zod";

export const ResumeSchema = z.object({
  fullName: z.string(),
  contact: z.object({
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    linkedin: z.string().nullable().describe("LinkedIn profile URL or null if not applicable"),
  }),
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
        .describe("3-5 high-impact bullet points rewritten with strong action verbs and exact target keywords from the job description, strictly truthful to original experience."),
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