// import { encodeBase62 } from "../utils/base62";

// const STORAGE_KEY_LINKS = "url_shortener_db";
// const STORAGE_KEY_COUNTER = "url_shortener_counter";

// // Initialize auto-increment counter starting at Base62 offset for aesthetic length
// const INITIAL_COUNTER_OFFSET = 100000;

// export const linkService = {
//   // Create a short link using Base62 encoding on unique sequence ID
//   createShortLink: async (originalUrl) => {
//     const links = JSON.parse(localStorage.getItem(STORAGE_KEY_LINKS) || "[]");
//     let counter = parseInt(localStorage.getItem(STORAGE_KEY_COUNTER) || INITIAL_COUNTER_OFFSET, 10);

//     // Deduplication check
//     const existing = links.find((item) => item.original === originalUrl);
//     if (existing) {
//       return existing;
//     }

//     // Increment sequence ID and encode
//     counter += 1;
//     const shortCode = encodeBase62(counter);
//     const domain = window.location.origin;
//     const shortUrl = `${domain}/s/${shortCode}`;

//     const newLink = {
//       id: counter,
//       code: shortCode,
//       original: originalUrl,
//       short: shortUrl,
//       clicks: 0,
//       createdAt: new Date().toISOString(),
//     };

//     // Persist to database state
//     localStorage.setItem(STORAGE_KEY_COUNTER, counter.toString());
//     localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify([newLink, ...links]));

//     return newLink;
//   },

//   // Fetch all stored links
//   getAllLinks: async () => {
//     return JSON.parse(localStorage.getItem(STORAGE_KEY_LINKS) || "[]");
//   },

//   // Handle redirect lookup & update analytics click counts
//   resolveShortCode: async (code) => {
//     const links = JSON.parse(localStorage.getItem(STORAGE_KEY_LINKS) || "[]");
//     const linkIndex = links.findIndex((item) => item.code === code);

//     if (linkIndex === -1) return null;

//     // Increment click count (Analytics)
//     links[linkIndex].clicks += 1;
//     localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(links));

//     return links[linkIndex];
//   },

//   // Clear records
//   clearHistory: async () => {
//     localStorage.removeItem(STORAGE_KEY_LINKS);
//     localStorage.removeItem(STORAGE_KEY_COUNTER);
//   },
// };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const linkService = {
  createShortLink: async (originalUrl) => {
    const response = await fetch(`${API_BASE_URL}/api/shorten`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalUrl }),
    });

    if (!response.ok) throw new Error("Failed to create short URL");
    return await response.json();
  },

  getAllLinks: async () => {
    const response = await fetch(`${API_BASE_URL}/api/history`);
    if (!response.ok) throw new Error("Failed to fetch history");
    return await response.json();
  },
  resolveShortCode: async (code) => {
    const response = await fetch(`${API_BASE_URL}/s/${code}`);
    if (!response.ok) throw new Error("Failed to resolve short code");
    return await response.json();
  },
  clearHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/api/history`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to clear history");
    return await response.json();
  },
};