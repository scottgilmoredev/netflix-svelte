/**
 * Continue Watching Store Module
 *
 * @module
 * @description Provides store and utilities for managing the "Continue Watching" list.
 * Creates a store that contains data the user has partially watched with their progress.
 *
 * @requires svelte/store
 * @requires ../types
 * @requires ../utils/helperUtils
 */

import { writable } from 'svelte/store';

// Types
import type { Movie, WatchedMediaItem } from '../types';

// Utils
import { filterDataWithBackdrops } from '../utils/helperUtils';

/**
 * Store for continue watching data
 */
export const continueWatching = writable<WatchedMediaItem[]>([]);

/**
 * Creates the "Continue Watching" list from existing store data
 *
 * @function createContinueWatchingList
 * @description Builds a continue watching list using data already loaded in stores.
 * If data exists in localStorage, it returns that. Otherwise, it creates a new list
 * from existing store data and assigns random progress.
 *
 * @param {Movie[]} netflixOriginalsData - Data from Netflix Originals store
 * @param {Movie[]} trendingData - Data from Trending store
 * @param {Movie[]} topRatedData - Data from Top Rated store
 * @param {Movie[]} popularData - Data from Popular store (if available)
 * @returns {WatchedMediaItem[]} Array of data with watch progress
 */
export function createContinueWatchingList(
  netflixOriginalsData: Movie[],
  trendingData: Movie[],
  topRatedData: Movie[],
  popularData: Movie[] = []
): WatchedMediaItem[] {
  // First, try to get from localStorage
  const savedData = loadContinueWatchingFromStorage();
  if (savedData && savedData.length > 0) {
    return savedData;
  }

  // If nothing in localStorage, create from existing data
  try {
    // Combine all data and filter out those without backdrops
    const allData = [...netflixOriginalsData, ...trendingData, ...topRatedData, ...popularData];
    const filteredData = filterDataWithBackdrops(allData);

    // Shuffle the data
    const shuffledData = [...filteredData].sort(() => 0.5 - Math.random());

    // Take 6 random data and add progress
    const watchedItems = shuffledData.slice(0, 6).map((movie) => ({
      ...movie,
      progress: generateRandomProgress(),
    }));

    // Save to localStorage
    saveContinueWatchingToStorage(watchedItems);

    return watchedItems;
  } catch (err) {
    console.error('Error creating continue watching list:', err);
    return [];
  }
}

/**
 * Generates a random progress percentage
 *
 * @function generateRandomProgress
 * @description Creates a random percentage between 0 and 80 to simulate watch progress
 *
 * @returns {number} A random number between 0 and 80
 */
function generateRandomProgress(): number {
  // Generate a random number between 0 and 80
  return Math.floor(Math.random() * 81);
}

/**
 * Loads continue watching data from localStorage
 *
 * @function loadContinueWatchingFromStorage
 * @description Retrieves continue watching data from localStorage
 *
 * @returns {WatchedMediaItem[] | null} Array of watched data or null if none found
 */
function loadContinueWatchingFromStorage(): WatchedMediaItem[] | null {
  try {
    const data = localStorage.getItem('netflix_continue_watching');
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Error loading from localStorage:', err);
    return null;
  }
}

/**
 * Saves continue watching data to localStorage
 *
 * @function saveContinueWatchingToStorage
 * @description Stores the continue watching data in localStorage
 *
 * @param {WatchedMediaItem[]} data - Array of watched data to save
 */
function saveContinueWatchingToStorage(data: WatchedMediaItem[]): void {
  try {
    localStorage.setItem('netflix_continue_watching', JSON.stringify(data));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}
