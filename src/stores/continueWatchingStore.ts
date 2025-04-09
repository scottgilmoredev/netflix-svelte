/**
 * Continue Watching Store Module
 *
 * @module
 * @description Provides store and utilities for managing the "Continue Watching" list.
 * Creates a store that contains data the user has partially watched with their progress.
 *
 * @requires svelte/store
 * @requires module:@types
 * @requires module:@utils
 */

import { writable } from 'svelte/store';

// Types
import type { AnyMedia, MediaStore, MediaWatched } from '@types';

// Utils
import { createMedia } from '@utils';

/**
 * Continue Watching Store
 *
 * @constant {MediaStore<MediaWatched>}
 * @description Provides a specialized store for tracking media that the user has partially watched.
 * This store extends the base writable store with a displayTitle property and maintains
 * an array of MediaWatched objects, each containing progress information.
 *
 * The store is used to populate the "Continue Watching" row in the UI, allowing users
 * to resume watching content they've started but not completed.
 *
 * @property {string} displayTitle - Human-readable title for UI display ("Continue Watching")
 * @property {function} subscribe - Svelte store subscription method
 * @property {function} set - Method to replace the entire store content
 * @property {function} update - Method to update the store with a callback function
 *
 * @example
 * // Subscribe to the continue watching store
 * import { continueWatching } from '../stores/continueWatchingStore';
 *
 * $: watchedItems = $continueWatching;
 *
 * @example
 * // Add a new item to the continue watching list
 * continueWatching.update(items => [
 *   ...items,
 *   {
 *     id: 12345,
 *     name: 'Movie Title',
 *     backdrop_path: '/path/to/image.jpg',
 *     progress: 35, // Watched 35%
 *     type: 'watched',
 *     // other required properties...
 *   }
 * ]);
 */
export const continueWatching: MediaStore<MediaWatched> = (() => {
  const store = writable<MediaWatched[]>([]);

  return {
    ...store,
    displayTitle: 'Continue Watching',
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,
  };
})();

/**
 * Creates the "Continue Watching" list from existing store data
 *
 * @function createContinueWatchingList
 * @description Builds a continue watching list using data already loaded in stores.
 * If data exists in localStorage, it returns that. Otherwise, it creates a new list
 * from existing store data and assigns random progress.
 *
 * @param {AnyMedia[]} netflixOriginalsData - Data from Netflix Originals store
 * @param {AnyMedia[]} trendingData - Data from Trending store
 * @param {AnyMedia[]} topRatedData - Data from Top Rated store
 * @param {AnyMedia[]} popularData - Data from Popular store (if available)
 * @returns {MediaWatched[]} Array of data with watch progress
 */
export function createContinueWatchingList(
  netflixOriginalsData: AnyMedia[],
  trendingData: AnyMedia[],
  topRatedData: AnyMedia[],
  popularData: AnyMedia[] = []
): MediaWatched[] {
  // First, try to get from localStorage
  const savedData = loadContinueWatchingFromStorage();

  if (savedData && savedData.length > 0) {
    return savedData;
  }

  // If nothing in localStorage, create from existing data
  try {
    // Combine all data and filter out those without backdrops
    const allData = [...netflixOriginalsData, ...trendingData, ...topRatedData, ...popularData];

    // Shuffle the data
    const shuffledData = [...allData].sort(() => 0.5 - Math.random());

    // Take 6 random data and add progress
    const watchedItems = shuffledData.slice(0, 6).map((movie) =>
      createMedia<MediaWatched>(
        {
          ...movie,
          progress: generateRandomProgress(),
        },
        'watched'
      )
    );

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
 * @returns {MediaWatched[] | null} Array of watched data or null if none found
 */
function loadContinueWatchingFromStorage(): MediaWatched[] | null {
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
 * @param {MediaWatched[]} data - Array of watched data to save
 */
function saveContinueWatchingToStorage(data: MediaWatched[]): void {
  try {
    localStorage.setItem('netflix_continue_watching', JSON.stringify(data));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}
