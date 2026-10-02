const BASE62_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Converts a unique integer ID to a Base62 short code.
 */
export const encodeBase62 = (num) => {
  if (num === 0) return BASE62_ALPHABET[0];
  let encoded = "";
  let n = num;
  while (n > 0) {
    encoded = BASE62_ALPHABET[n % 62] + encoded;
    n = Math.floor(n / 62);
  }
  return encoded;
};

/**
 * Ensures proper protocol prefixing and URL validation.
 */
export const sanitizeUrl = (inputUrl) => {
  let trimmed = inputUrl.trim();
  if (!trimmed) return { valid: false, error: "URL cannot be empty." };

  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, error: "Only HTTP and HTTPS protocols are supported." };
    }
    return { valid: true, url: trimmed };
  } catch (_) {
    return { valid: false, error: "Invalid URL format." };
  }
};