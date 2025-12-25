/**
 * Extracts filename from Content-Disposition header
 * Supports multiple formats:
 * - RFC 5987: filename*=UTF-8''example.txt
 * - Standard: filename="example.txt" or filename=example.txt
 *
 * @param contentDisposition - The Content-Disposition header value
 * @returns Extracted and sanitized filename, or null if not found
 */
export const extractFilenameFromHeader = (contentDisposition: string | null): string | null => {
  if (!contentDisposition) {
    return null;
  }

  let filename: string | null = null;

  // Pattern 1: filename*=UTF-8''filename.txt (RFC 5987 - UTF-8 encoded)
  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match) {
    filename = decodeURIComponent(utf8Match[1]);
  } else {
    // Pattern 2: filename="filename.txt" or filename=filename.txt (Standard format)
    const standardMatch = contentDisposition.match(/filename=["']?([^"';]+)["']?/i);
    if (standardMatch) {
      filename = standardMatch[1];
    }
  }

  if (!filename) {
    return null;
  }

  // Sanitize: remove trailing special characters and whitespace
  filename = filename.trim().replace(/[;,\s_]+$/, '');

  // Ensure .txt extension
  if (!filename.endsWith('.txt')) {
    filename = `${filename.replace(/\.[^.]*$/, '')}.txt`;
  }

  return filename;
};

/**
 * Generates a timestamped filename in the format: recovery_codes_YYYYMMDD_HHMMSS.txt
 *
 * @returns Timestamped filename
 */
export const generateTimestampedFilename = (): string => {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/T/, '_') // Replace T with underscore
    .replace(/\..+/, '') // Remove milliseconds and timezone
    .replace(/:/g, '') // Remove colons
    .replace(/-/g, ''); // Remove hyphens

  return `recovery_codes_${timestamp}.txt`;
};
