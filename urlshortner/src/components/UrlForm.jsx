// import React from "react";

export default function UrlForm({ longUrl, setLongUrl, handleGenerate, error, loading }) {
  return (
    <form onSubmit={handleGenerate} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Destination URL
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            disabled={loading}
            placeholder="https://techustad.tech"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/30 active:scale-95 flex items-center justify-center min-w-[120px]"
          >
            {loading ? "Shortening..." : "Generate"}
          </button>
        </div>
      </div>
      {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
    </form>
  );
}