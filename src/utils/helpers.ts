/**
 * Truncates a string to a specified length and adds ellipsis
 *
 * @param {string} text - The string to truncate
 * @param {number} length - Maximum length before truncation
 * @returns {string} Truncated string with ellipsis or original string if shorter than n
 */
export function truncate(text: string, length: number): string {
  if (!text) return '';
  return text.length > length ? text.slice(0, length - 1) + '...' : text;
}
