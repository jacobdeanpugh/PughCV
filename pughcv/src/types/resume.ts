import { z } from "zod";

export const ResumeSchema = z.object({
  fullName: z.string(),
  contact: z.object({
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    linkedin: z.string().optional(),
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
      location: z.string().optional(),
      period: z.string(),
      bullets: z
        .array(z.string())
        .describe("3-5 high-impact bullet points rewritten with strong action verbs and exact target keywords from the job description, strictly truthful to original experience."),
    })
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      year: z.string().optional(),
    })
  )
});

export type ResumeData = z.infer<typeof ResumeSchema>;