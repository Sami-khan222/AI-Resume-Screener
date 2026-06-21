import { useState } from "react";
import UploadForm from "./components/UploadForm.jsx";
import ResultsPanel from "./components/ResultsPanel.jsx";
import HistoryList from "./components/HistoryList.jsx";

export default function App() {
  const [result, setResult] = useState(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  function handleNewResult(data) {
    setResult(data);
    setHistoryRefreshKey((k) => k + 1);
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="border-b border-[var(--color-line)] px-6 py-6 sm:px-10">
        <div className="mx-auto flex max-w-6xl items-baseline justify-between">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Resume Screener
          </h1>
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-muted)]">
            Gemini-powered
          </p>
        </div>
      </header>
       {/* Contact Information and Button Section */}
        <section className="mt-8 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="font-medium text-[var(--color-text)]">
                <span className="font-semibold">Full Name:</span> Sami Khan
              </p>
              <p className="font-medium text-[var(--color-text)]">
                <span className="font-semibold">Email:</span> sami99khan99sami99@gmail.com
              </p>
            </div>
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-[var(--color-primary)] px-6 py-3 font-medium text-black transition-all hover:opacity-90 hover:shadow-lg"
            >
              Built for Digital Heroes
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </section>
      
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
            <UploadForm onResult={handleNewResult} />
          </section>

          <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:p-8">
            <ResultsPanel result={result} />
          </section>
        </div>

        <section className="mt-10 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">History</h2>
          <HistoryList onSelect={setResult} refreshKey={historyRefreshKey} />
        </section>

        
      </main>
    </div>
  );
}