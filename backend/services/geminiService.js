import { GoogleGenAI, Type } from "@google/genai";

let aiClient = null;

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing. Add it to backend/.env");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Schema Gemini must return - this is what keeps the AI's answer predictable
// enough to store in MongoDB and render in the UI without extra parsing logic.
const screeningResponseSchema = {
  type: Type.OBJECT,
  properties: {
    candidateName: {
      type: Type.STRING,
      description:
        "Candidate's full name as found in the resume, or 'Unknown candidate' if not found.",
    },
    matchScore: {
      type: Type.NUMBER,
      description: "Overall fit score from 0 to 100 comparing resume to job description.",
    },
    verdict: {
      type: Type.STRING,
      enum: ["strong_fit", "possible_fit", "weak_fit"],
    },
    summary: {
      type: Type.STRING,
      description: "2-3 sentence plain-language summary of overall fit.",
    },
    matchedSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Skills/requirements from the job description the resume clearly demonstrates.",
    },
    missingSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Skills/requirements from the job description the resume does not show.",
    },
    mistakes: {
      type: Type.ARRAY,
      description:
        "Concrete mistakes/weaknesses found IN THE RESUME ITSELF (writing, formatting, content - not the job match). This is the 'explain my mistakes' feature.",
      items: {
        type: Type.OBJECT,
        properties: {
          issue: { type: Type.STRING, description: "What is wrong, quoted or paraphrased from the resume." },
          why: { type: Type.STRING, description: "Why this hurts the candidate with recruiters or ATS systems." },
          fix: { type: Type.STRING, description: "A specific, actionable rewrite or fix." },
          severity: { type: Type.STRING, enum: ["high", "medium", "low"] },
        },
        required: ["issue", "why", "fix", "severity"],
      },
    },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 short, actionable suggestions to improve the resume for this specific job.",
    },
  },
  required: [
    "candidateName",
    "matchScore",
    "verdict",
    "summary",
    "matchedSkills",
    "missingSkills",
    "mistakes",
    "suggestions",
  ],
};

function buildPrompt(resumeText, jobDescription) {
  return `You are an experienced technical recruiter and resume coach.

You will be given a JOB DESCRIPTION and a candidate's RESUME (raw extracted text, formatting may be imperfect).

Do two things:
1. Screen the resume against the job description: give a match score (0-100), a verdict, matched/missing skills, and a short summary.
2. Critique the resume itself: find concrete MISTAKES in the resume - weak or vague bullet points, missing metrics/numbers, spelling/grammar issues, poor structure, irrelevant content, anything that would hurt it with a recruiter or an ATS. For each mistake explain what it is, why it's a problem, and exactly how to fix it. If the resume is genuinely strong, return fewer mistakes rather than inventing minor ones.

Be specific and reference real content from the resume, not generic advice.

JOB DESCRIPTION:
"""
${jobDescription}
"""

RESUME:
"""
${resumeText}
"""

Respond using only the JSON structure you were given.`;
}

/**
 * Sends the resume + job description to Gemini and returns a parsed, validated result object.
 */
export async function screenResumeWithGemini(resumeText, jobDescription) {
  const ai = getClient();
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const response = await ai.models.generateContent({
    model,
    contents: buildPrompt(resumeText, jobDescription),
    config: {
      responseMimeType: "application/json",
      responseSchema: screeningResponseSchema,
      temperature: 0.3,
    },
  });

  let parsed;
  try {
    parsed = JSON.parse(response.text);
  } catch (err) {
    throw new Error("Gemini returned a response that wasn't valid JSON. Try again.");
  }

  // Clamp the score defensively in case the model drifts outside 0-100.
  parsed.matchScore = Math.max(0, Math.min(100, Math.round(parsed.matchScore)));

  return parsed;
}
