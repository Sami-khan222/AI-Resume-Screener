import { useEffect, useState, useCallback } from "react";
import { Trash2, Clock } from "lucide-react";
import apiClient from "../api/client.js";

const VERDICT_DOT = {
  strong_fit: "bg-emerald-500",
  possible_fit: "bg-amber-500",
  weak_fit: "bg-rose-500",
};

export default function HistoryList({ onSelect, refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/screenings");
      setItems(data);
    } catch {
      // History is a nice-to-have; fail quietly rather than blocking the page.
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  async function handleDelete(e, id) {
    e.stopPropagation();
    await apiClient.delete(`/screenings/${id}`);
    setItems((prev) => prev.filter((item) => item._id !== id));
  }

  async function handleSelect(id) {
    const { data } = await apiClient.get(`/screenings/${id}`);
    onSelect(data);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm text-gray-500">Loading your screenings...</p>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="rounded-full bg-indigo-50 p-4 mb-4">
          <Clock className="h-8 w-8 text-indigo-400" />
        </div>
        <p className="text-sm font-medium text-gray-700">No screenings yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Your past results will appear here once you start screening candidates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div
          key={item._id}
          onClick={() => handleSelect(item._id)}
          className="group relative flex cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50/80 hover:to-transparent hover:shadow-sm active:scale-[0.99]"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <span 
                className={`block h-2.5 w-2.5 rounded-full ring-2 ring-white shadow-sm ${VERDICT_DOT[item.verdict] || "bg-gray-300"}`} 
              />
              <span className={`absolute inset-0 rounded-full animate-ping opacity-0 group-hover:opacity-40 ${VERDICT_DOT[item.verdict] || "bg-gray-300"}`} />
            </div>
            
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                {item.candidateName}
              </p>
              <p className="truncate text-xs text-gray-400 group-hover:text-gray-500 transition-colors">
                {item.jobTitle || item.fileName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="inline-flex items-center justify-center min-w-[3rem] px-2.5 py-1 text-sm font-bold text-indigo-700 bg-indigo-50 rounded-lg shadow-sm ring-1 ring-indigo-100">
              {item.matchScore}
            </span>
            
            <span className="hidden items-center gap-1.5 text-xs text-gray-400 sm:flex">
              <Clock className="h-3.5 w-3.5" />
              {new Date(item.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            
            <button
              onClick={(e) => handleDelete(e, item._id)}
              aria-label="Delete screening"
              className="rounded-lg p-1.5 text-gray-300 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 hover:shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-90"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}