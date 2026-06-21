import { useState, useRef } from "react";
import { UploadCloud, FileText, Loader2, X, Sparkles } from "lucide-react";
import apiClient from "../api/client.js";

export default function UploadForm({ onResult }) {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  function handleFileChosen(chosen) {
    if (!chosen) return;
    if (chosen.type !== "application/pdf") {
      setError("Only PDF resumes are supported.");
      return;
    }
    setError("");
    setFile(chosen);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFileChosen(e.dataTransfer.files?.[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError("Add a resume PDF first.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Paste the job description.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobTitle", jobTitle);
    formData.append("jobDescription", jobDescription);

    try {
      const { data } = await apiClient.post("/screenings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong while screening this resume.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Section */}
      <div>
        <label className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2.5">
          <FileText className="h-3.5 w-3.5" />
          Resume (PDF)
          <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
            Required
          </span>
        </label>

        {!file ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`group relative cursor-pointer rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-300 ${
              isDragging 
                ? "border-indigo-500 bg-indigo-50/80 shadow-lg shadow-indigo-100 scale-[1.02]" 
                : "border-gray-300 bg-gray-50/50 hover:border-indigo-400 hover:bg-indigo-50/30 hover:shadow-md"
            }`}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
            
            <div className="relative">
              <div className={`mx-auto mb-4 inline-flex rounded-full p-4 transition-all duration-300 ${
                isDragging ? "bg-indigo-100 shadow-inner" : "bg-gray-100 group-hover:bg-indigo-100"
              }`}>
                <UploadCloud className={`h-8 w-8 transition-colors duration-300 ${
                  isDragging ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-500"
                }`} />
              </div>
              
              <p className="text-sm font-medium text-gray-700">
                Drop a PDF here, or{" "}
                <span className="font-semibold text-indigo-600 underline underline-offset-2 transition-colors hover:text-indigo-700">
                  browse files
                </span>
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Maximum file size: 5MB
              </p>
              
              <div className="mt-4 flex justify-center gap-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-[10px] font-medium text-gray-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  PDF only
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-[10px] font-medium text-gray-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                  Secure upload
                </span>
              </div>
            </div>
            
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFileChosen(e.target.files?.[0])}
            />
          </div>
        ) : (
          <div className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-gradient-to-r from-indigo-50/80 to-white px-5 py-4 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-200">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB • Ready to screen
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setFile(null)}
              aria-label="Remove file"
              className="rounded-lg p-2 text-gray-400 transition-all hover:bg-rose-50 hover:text-rose-600 hover:shadow-sm"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Job Title Input */}
      <div>
        <label htmlFor="jobTitle" className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2.5">
          Role title
          <span className="text-[10px] font-normal text-gray-400">(optional)</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <span className="text-gray-300">💼</span>
          </div>
          <input
            id="jobTitle"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Backend Engineer"
            className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Job Description Textarea */}
      <div>
        <label htmlFor="jobDescription" className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
          Job description
          <span className="ml-auto rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-500">
            Required
          </span>
        </label>
        <div className="relative">
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={9}
            placeholder="Paste the full job description here..."
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
          {jobDescription && (
            <div className="absolute bottom-3 right-3 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-500">
              {jobDescription.split(/\s+/).filter(Boolean).length} words
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 backdrop-blur-sm">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-rose-100">
            <X className="h-4 w-4" />
          </div>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-300 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-lg"
      >
        {/* Loading bar animation */}
        {loading && (
          <>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-400 via-indigo-200 to-indigo-400 animate-scanline" />
          </>
        )}
        
        <span className="relative flex items-center justify-center gap-2.5">
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing resume...</span>
              <span className="text-xs font-normal text-indigo-200">
                This may take a moment
              </span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
              <span>Screen this resume</span>
              <span className="absolute right-4 text-xs font-normal text-indigo-200 opacity-0 transition-opacity group-hover:opacity-100">
                →
              </span>
            </>
          )}
        </span>
      </button>

      {/* Footer note */}
      <p className="text-center text-[11px] text-gray-400">
        Secure • AI-powered screening • Results in seconds
      </p>
    </form>
  );
}