import type { Movie } from '../types';

/**
 * Filters out data without backdrop images
 *
 * @function filterDataWithBackdrops
 * @description Removes data that don't have backdrop images from an array of data
 *
 * @param {Movie[]} data - Array of data to filter
 * @returns {Movie[]} Array of data that have backdrop images
 */
export function filterDataWithBackdrops(data: Movie[]): Movie[] {
  return data.filter((movie) => movie.backdrop_path);
}

/**
 * Helper Utilities Module
 *
 * @module
 * @description Provides general utility functions used throughout the application.
 * Contains string manipulation, formatting, and other helper functions that
 * don't fit into more specific utility categories.
 */

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
