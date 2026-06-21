import Screening from "../models/Screening.js";
import { extractTextFromPdf } from "../utils/extractTextFromPdf.js";
import { screenResumeWithGemini } from "../services/geminiService.js";

// POST /api/screenings  (multipart/form-data: resume=<file>, jobDescription=<text>, jobTitle=<text optional>)
export async function createScreening(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Upload a resume PDF using the 'resume' field." });
    }

    const jobDescription = (req.body.jobDescription || "").trim();
    if (!jobDescription) {
      return res.status(400).json({ message: "jobDescription is required." });
    }

    const resumeText = await extractTextFromPdf(req.file.buffer);
    const aiResult = await screenResumeWithGemini(resumeText, jobDescription);

    const screening = await Screening.create({
      candidateName: aiResult.candidateName || "Unknown candidate",
      fileName: req.file.originalname,
      jobTitle: (req.body.jobTitle || "").trim(),
      jobDescription,
      resumeText,
      matchScore: aiResult.matchScore,
      verdict: aiResult.verdict,
      summary: aiResult.summary,
      matchedSkills: aiResult.matchedSkills || [],
      missingSkills: aiResult.missingSkills || [],
      mistakes: aiResult.mistakes || [],
      suggestions: aiResult.suggestions || [],
    });

    return res.status(201).json(screening);
  } catch (err) {
    console.error("createScreening error:", err.message);
    return res.status(500).json({ message: err.message || "Failed to screen resume." });
  }
}

// GET /api/screenings  -> lightweight list for the history table
export async function listScreenings(req, res) {
  try {
    const screenings = await Screening.find()
      .select("candidateName fileName jobTitle matchScore verdict createdAt")
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json(screenings);
  } catch (err) {
    console.error("listScreenings error:", err.message);
    return res.status(500).json({ message: "Failed to load screening history." });
  }
}

// GET /api/screenings/:id -> full detail for one screening
export async function getScreening(req, res) {
  try {
    const screening = await Screening.findById(req.params.id);
    if (!screening) {
      return res.status(404).json({ message: "Screening not found." });
    }
    return res.json(screening);
  } catch (err) {
    console.error("getScreening error:", err.message);
    return res.status(400).json({ message: "Invalid screening id." });
  }
}

// DELETE /api/screenings/:id
export async function deleteScreening(req, res) {
  try {
    const deleted = await Screening.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Screening not found." });
    }
    return res.json({ message: "Deleted." });
  } catch (err) {
    console.error("deleteScreening error:", err.message);
    return res.status(400).json({ message: "Invalid screening id." });
  }
}
