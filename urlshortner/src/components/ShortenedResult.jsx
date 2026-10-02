import { useRef } from "react";

export default function ShortenedResult({ shortUrl, copied, setCopied }) {
  const shortUrlInputRef = useRef(null);

  const handleCopy = () => {
    if (!shortUrl) return;

    // Use useRef to select text inside DOM element
    if (shortUrlInputRef.current) {
      shortUrlInputRef.current.select();
      shortUrlInputRef.current.setSelectionRange(0, 99999);
    }

    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopied(true);
    });
  };

  return (
    <div className="mt-6 pt-6 border-t border-slate-700/60 animate-fade-in">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        Shortened URL
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          ref={shortUrlInputRef}
          type="text"
          readOnly
          value={shortUrl}
          className="flex-1 bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-3 text-indigo-300 font-mono text-sm focus:outline-none"
        />
        <button
          type="button"
          onClick={handleCopy}
          className={`font-medium px-6 py-3 rounded-xl transition-all duration-200 ${
            copied
              ? "bg-emerald-600 text-white"
              : "bg-slate-700 hover:bg-slate-600 text-slate-200"
          }`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}