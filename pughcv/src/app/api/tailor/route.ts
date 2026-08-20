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
You are an expert executive resume writer and ATS (Applicant Tracking System) optimization specialist.
Your task is to tailor the candidate's master resume to closely match the provided target job description.

RULES:
1. TRUTHFULNESS & ACCURACY: Never fabricate experiences, companies, degrees, or tools. You may only rephrase, re-weight, and highlight experiences actually present in the master profile.
2. ATS KEYWORD TARGETING: Analyze the target job description for critical domain keywords, required technical competencies, software, and terminology. Integrate these exact keywords naturally into the summary, skills, and bullet points.
3. BULLET POINT FORMULA: Every bullet must start with a compelling past-tense action verb (e.g., "Spearheaded", "Architected", "Negotiated", "Streamlined") and focus on measurable outcomes, operations efficiency, or business impact.
4. SUMMARY: Write a focused 2-3 sentence summary that positions the candidate directly for the target role title and its primary requirements.
5. SKILLS CURATION: Select and prioritize the 8-12 most relevant skills from the master profile that match the job description.
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
      model: openai("gpt-4o-mini"),
      schema: ResumeSchema,
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.2,
    });

    return NextResponse.json({
      success: true,
      data: tailoredResume,
    });
  } catch (err: any) {
    console.error("Tailor API Route Error:", err);
    return NextResponse.json(
      { error: err.message || "An error occurred while tailoring the resume." },
      { status: 500 }
    );
  }
}