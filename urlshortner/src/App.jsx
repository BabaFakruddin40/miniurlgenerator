// import { useState, useEffect } from "react";
// import { UrlForm, ShortenedResult, HistoryList } from "./components";
// import { sanitizeUrl } from "./utils/base62";
// import { linkService } from "./services/apiService";

// export default function App() {
//   const [longUrl, setLongUrl] = useState("");
//   const [shortUrl, setShortUrl] = useState("");
//   const [copied, setCopied] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [history, setHistory] = useState([]);

//   // 1. HTTP Redirect Interceptor Logic
//   useEffect(() => {
//     const handleRedirect = async () => {
//       const path = window.location.pathname;
//       if (path.startsWith("/s/")) {
//         const code = path.split("/s/")[1];
//         if (code) {
//           const link = await linkService.resolveShortCode(code);
//           if (link && link.original) {
//             // Industry standard redirect execution
//             window.location.href = link.original;
//           } else {
//             setError("Short URL not found or expired.");
//           }
//         }
//       }
//     };

//     handleRedirect();
//   }, []);

//   // 2. Fetch Link History on Mount
//   useEffect(() => {
//     linkService.getAllLinks().then(setHistory);
//   }, []);

//   // 3. Reset Copy Indicator Timeout
//   useEffect(() => {
//     if (!copied) return;
//     const timer = setTimeout(() => setCopied(false), 2000);
//     return () => clearTimeout(timer);
//   }, [copied]);

//   const handleGenerate = async (e) => {
//     e.preventDefault();
//     setError("");
//     setCopied(false);

//     const sanitized = sanitizeUrl(longUrl);
//     if (!sanitized.valid) {
//       setError(sanitized.error);
//       return;
//     }

//     setLoading(true);

//     try {
//       const newLink = await linkService.createShortLink(sanitized.url);
//       setShortUrl(newLink.short);
//       const updatedHistory = await linkService.getAllLinks();
//       setHistory(updatedHistory);
//     } catch (err) {
//       setError("Failed to generate short link. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClearHistory = async () => {
//     await linkService.clearHistory();
//     setHistory([]);
//     setShortUrl("");
//   };

//   return (
//     <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
//       <div className="max-w-2xl w-full bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 md:p-8">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
//             Production URL Shortener
//           </h1>
//           <p className="mt-2 text-slate-400 text-sm sm:text-base">
//             Base62 encoded sequence IDs with client redirect handling and click analytics.
//           </p>
//         </div>

//         <UrlForm
//           longUrl={longUrl}
//           setLongUrl={setLongUrl}
//           handleGenerate={handleGenerate}
//           error={error}
//           loading={loading}
//         />

//         {shortUrl && (
//           <ShortenedResult
//             shortUrl={shortUrl}
//             copied={copied}
//             setCopied={setCopied}
//           />
//         )}

//         <HistoryList
//           history={history}
//           handleClearHistory={handleClearHistory}
//         />
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { UrlForm, ShortenedResult, HistoryList } from "./components";
import { sanitizeUrl } from "./utils/base62";
import { linkService } from "./services/apiService";

export default function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    linkService.getAllLinks().then(setHistory).catch(console.error);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setCopied(false);

    const sanitized = sanitizeUrl(longUrl);
    if (!sanitized.valid) {
      setError(sanitized.error);
      return;
    }

    setLoading(true);

    try {
      const newLink = await linkService.createShortLink(sanitized.url);
      setShortUrl(newLink.shortUrl);
      const updatedHistory = await linkService.getAllLinks();
      setHistory(updatedHistory);
    } catch (err) {
      setError("Failed to generate short link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Production URL Shortener
          </h1>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Powered by PostgreSQL, Redis Caching, and Express HTTP 302 redirects.
          </p>
        </div>

        <UrlForm
          longUrl={longUrl}
          setLongUrl={setLongUrl}
          handleGenerate={handleGenerate}
          error={error}
          loading={loading}
        />

        {shortUrl && (
          <ShortenedResult
            shortUrl={shortUrl}
            copied={copied}
            setCopied={setCopied}
          />
        )}

        <HistoryList history={history} />
      </div>
    </div>
  );
}