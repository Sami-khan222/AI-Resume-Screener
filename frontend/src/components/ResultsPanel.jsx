import { CheckCircle2, XCircle, AlertTriangle, Lightbulb } from "lucide-react";
import ScoreStamp from "./ScoreStamp.jsx";

const SEVERITY_STYLES = {
  high: { dot: "bg-rose-500", label: "High impact", border: "border-rose-200", bg: "bg-rose-50" },
  medium: { dot: "bg-amber-500", label: "Medium impact", border: "border-amber-200", bg: "bg-amber-50" },
  low: { dot: "bg-blue-400", label: "Low impact", border: "border-blue-200", bg: "bg-blue-50" },
};

export default function ResultsPanel({ result }) {
  if (!result) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50/50 to-white px-8 text-center transition-all hover:border-indigo-200">
        <div className="rounded-full bg-indigo-50 p-4 mb-4">
          <Lightbulb className="h-8 w-8 text-indigo-400" />
        </div>
        <p className="font-display text-lg font-medium text-gray-600 max-w-md">
          Upload a resume and paste a job description to see the screening report here.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Get instant insights on candidate fit, skills, and improvements.
        </p>
      </div>
    );
  }

  const { candidateName, matchScore, verdict, summary, matchedSkills, missingSkills, mistakes, suggestions } = result;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-6 border-b border-gray-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            Candidate Profile
          </p>
          <h2 className="font-display text-3xl font-bold text-gray-800 mt-1">
            {candidateName}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-600">
            {summary}
          </p>
        </div>
        <ScoreStamp score={matchScore} verdict={verdict} />
      </div>

      {/* Skills Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Matched Skills */}
        <div className="rounded-xl bg-gradient-to-br from-emerald-50/80 to-white p-5 border border-emerald-100 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 
            Matched skills
            <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              {matchedSkills?.length || 0}
            </span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {matchedSkills?.length ? (
              matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-emerald-100/80 px-3.5 py-1.5 text-xs font-medium text-emerald-700 border border-emerald-200/50 shadow-sm transition-all hover:scale-105 hover:bg-emerald-200/80"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">No matched skills found.</p>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="rounded-xl bg-gradient-to-br from-rose-50/80 to-white p-5 border border-rose-100 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-rose-700">
            <XCircle className="h-4 w-4 text-rose-500" /> 
            Missing skills
            <span className="ml-auto rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
              {missingSkills?.length || 0}
            </span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {missingSkills?.length ? (
              missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-rose-100/80 px-3.5 py-1.5 text-xs font-medium text-rose-700 border border-rose-200/50 shadow-sm transition-all hover:scale-105 hover:bg-rose-200/80"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-emerald-600 italic">✓ Good coverage - all key skills present!</p>
            )}
          </div>
        </div>
      </div>

      {/* Mistakes Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-gray-500">
            Mistakes found in this resume
          </h3>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-600">
            {mistakes?.length || 0}
          </span>
        </div>

        {mistakes?.length ? (
          <ul className="space-y-4">
            {mistakes.map((m, i) => {
              const sev = SEVERITY_STYLES[m.severity] || SEVERITY_STYLES.medium;
              return (
                <li 
                  key={i} 
                  className={`rounded-xl border ${sev.border} ${sev.bg} p-5 shadow-sm transition-all hover:shadow-md`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${sev.dot} shadow-sm`} />
                    <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${m.severity === 'high' ? 'text-rose-600' : m.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'}`}>
                      {sev.label}
                    </span>
                    <span className="ml-auto text-[10px] font-mono text-gray-400">
                      #{i + 1}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-800">{m.issue}</p>
                    <div className="rounded-lg bg-white/60 p-3 border border-gray-100/50">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-700">💡 Why it matters: </span>
                        {m.why}
                      </p>
                    </div>
                    <p className="text-sm text-emerald-700">
                      <span className="font-medium">✓ Fix: </span>
                      {m.fix}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
            <p className="text-sm font-medium text-emerald-700">No significant mistakes found</p>
            <p className="text-xs text-emerald-600 mt-1">This is a well-written resume!</p>
          </div>
        )}
      </div>

      {/* Suggestions Section */}
      {suggestions?.length > 0 && (
        <div className="rounded-xl bg-gradient-to-br from-indigo-50/80 to-white p-6 border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
              <Lightbulb className="h-4 w-4 text-indigo-600" />
            </div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-indigo-700">
              Suggestions for this role
            </h3>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              {suggestions.length}
            </span>
          </div>
          
          <ul className="grid gap-3 sm:grid-cols-2">
            {suggestions.map((s, i) => (
              <li 
                key={i} 
                className="flex items-start gap-3 rounded-lg bg-white/60 p-3 border border-indigo-100/50 transition-all hover:bg-white hover:shadow-sm"
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700 leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}