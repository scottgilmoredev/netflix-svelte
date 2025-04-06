import type { TMDBMediaResponse } from '../types';

/**
 * Filters out data without backdrop images
 *
 * @function filterDataWithBackdrops
 * @description Removes data that don't have backdrop images from an array of data
 *
 * @param {TMDBMediaResponse[]} data - Array of data to filter
 * @returns {TMDBMediaResponse[]} Array of data that have backdrop images
 */
export function filterDataWithBackdrops(data: TMDBMediaResponse[]): TMDBMediaResponse[] {
  return data.filter((media) => media.backdrop_path);
}

/**
 * Creates a memoized version of a function
 *
 * @function memoize
 * @description Caches results of function calls based on input arguments
 *
 * @param {Function} fn - Function to memoize
 * @returns {Function} Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();

  return ((...args: Parameters<T>): ReturnType<T> => {
    // Create a cache key from the stringified arguments
    const key = JSON.stringify(args);

    // If we have a cached result, return it
    if (cache.has(key)) {
      return cache.get(key);
    }

    // Otherwise, calculate the result and cache it
    const result = fn(...args);
    cache.set(key, result);

    return result;
  }) as T;
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
