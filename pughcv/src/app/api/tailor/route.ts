import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { ResumeSchema } from "@/types/resume";
import { PROFILES } from "@/data/profiles";

export async function POST(req: NextRequest) {
  try {
    const { profileId, jobDescription } = await req.json();

    // 1. Validation
    if (!profileId || !PROFILES[profileId]) {
      return NextResponse.json(
        { error: "Invalid profile selected. Must be 'dean' or 'marc'." },
        { status: 400 }
      );
    }

    if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length < 30) {
      return NextResponse.json(
        { error: "Please provide a valid job description (at least 30 characters)." },
        { status: 400 }
      );
    }

    const masterProfile = PROFILES[profileId];

    // 2. ATS System Instructions
    const systemPrompt = `
You are an elite executive resume writer and Applicant Tracking System (ATS) optimization specialist. 
Your objective is to transform a candidate's master resume data into a highly targeted, ATS-optimized resume tailored to a specific job description.

Follow these strict directives:

1. STRICT FIDELITY (NO HALLUCINATIONS): Never fabricate experiences, metrics, companies, degrees, or tools. You may reframe, re-weight, and highlight existing data to match the target role, but the underlying facts must remain exactly as provided in the master profile.
2. ATS OPTIMIZATION: Extract critical keywords (hard skills, tools, domain terminology) from the target job description. Seamlessly weave these exact keywords into the summary, skills section, and bullet points without unnatural keyword stuffing.
3. IMPACT-DRIVEN BULLETS: Every bullet must land Action + Context + Result. A bullet that stops at the action is incomplete — it describes a job description, not a track record.
   - Start every bullet with a strong, past-tense action verb (e.g., Spearheaded, Architected, Optimized).
   - RESULT CLAUSE (REQUIRED): Close each bullet with the outcome, using this strict order of preference:
     a) If the master profile contains a real figure for that work (headcount, square footage, dollar value, volume, number of sites/accounts), lead with it verbatim. Never round, inflate, or restate it as a percentage.
     b) Otherwise, close with a truthful QUALITATIVE outcome that follows necessarily from the action itself — the reason the work mattered. Example: "Directed warehouse relocation, setup, and inventory slotting" becomes "...slotting, minimizing operational downtime during the transition." Other valid closers: preventing customs delays, protecting margin on inbound freight, sustaining fill rates, reducing mis-picks, keeping accounts in stock through peak season.
     c) The qualitative outcome must be a direct, self-evident consequence of the stated action. If you cannot name one honestly, leave the bullet as Action + Context rather than forcing a weak or generic closer.
   - HARD PROHIBITION: Never invent a number, percentage, dollar amount, headcount, or timeframe that does not appear in the master profile. "Reduced costs by 15%", "improved efficiency by 30%", and "managed $5M in freight" are FABRICATIONS unless that exact figure is in the source data. A qualitative closer with no number is always the correct choice over an invented metric.
   - SURFACE EXISTING SCALE: Any concrete figure already present in the master profile is high-value evidence. Carry it into the tailored resume rather than dropping it for smoother phrasing.
4. TARGETED HEADLINE: Choose the single best professional headline (2-6 words) to sit directly under the candidate's name. Pick the title that best bridges the candidate's real background and the target job title — mirror the target job title when the master profile genuinely supports it, otherwise use the closest truthful title. Do not default to the most recent job title, and never inflate seniority or invent a title the experience cannot back up.
5. TARGETED SUMMARY: Write a concise, 2-3 sentence executive summary. Position the candidate specifically for the target job title by synthesizing their most relevant experience and core value proposition.
6. SKILLS CURATION: Select the 8-12 most relevant skills from the master profile. Prioritize skills explicitly mentioned or strongly implied by the target job description.
7. DATE STANDARDIZATION: Format all employment dates using full month names and 4-digit years (e.g., "July 2004 - Present", "March 2001 - July 2004"). Never use numerical or abbreviated formats (e.g., "07/2004" or "Jul 2004").
8. LENGTH CONSTRAINTS (SCANNABILITY): Keep the resume dense with impact but strictly concise.
   - Allocate exactly 4 bullet points for the two most recent/relevant roles.
   - Allocate exactly 3 bullet points for all older roles.
   - Keep each bullet point strictly under 30 words to ensure it fits on 1-2 lines.
   - Eliminate filler words and fluff. The result clause from directive 3 fits inside the 30-word budget: cut adjectives and redundant context to make room for the outcome, never drop the outcome to save words.
    `;

    const userPrompt = `
=== TARGET JOB DESCRIPTION ===
${jobDescription.trim()}

=== CANDIDATE MASTER PROFILE ===
${JSON.stringify(masterProfile, null, 2)}

Tailor the candidate's resume strictly according to the schema provided.
`;

    // 3. Generate Structured Resume Object
    const { object: tailoredResume } = await generateObject({
      model: openai("gpt-4o"),
      schema: ResumeSchema,
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.2,
    });

    return NextResponse.json({
      success: true,
      data: tailoredResume,
    });
  } catch (err: unknown) {
    console.error("Tailor API Route Error:", err);
    const message =
      err instanceof Error && err.message
        ? err.message
        : "An error occurred while tailoring the resume.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}