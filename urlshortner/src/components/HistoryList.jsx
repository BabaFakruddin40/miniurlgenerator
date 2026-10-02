import React from "react";

export default function HistoryList({ history, handleClearHistory }) {
  if (!history.length) return null;

  return (
    <div className="mt-8 pt-6 border-t border-slate-700/60">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Recent Short Links ({history.length})
        </h2>
        <button
          onClick={handleClearHistory}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors"
        >
          Clear History
        </button>
      </div>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-3.5 flex items-center justify-between gap-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-400 truncate mb-1">{item.original}</p>
              <div className="flex items-center gap-3">
                <a
                  href={item.short}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-indigo-400 hover:underline truncate"
                >
                  {item.short}
                </a>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800/50 px-2 py-0.5 rounded-full font-medium">
                  {item.clicks} {item.clicks === 1 ? "click" : "clicks"}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(item.short)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700/50 transition-colors"
            >
              Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}