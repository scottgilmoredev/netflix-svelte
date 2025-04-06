/**
 * Store Registry Module
 *
 * @module
 * @description Provides a centralized registry of all media stores and utility functions
 * for accessing them by ID or display title. This replaces the need for a separate
 * mapping between titles and store identifiers.
 *
 * @requires ./mediaStore
 * @requires ./continueWatchingStore
 * @requires ../types
 */

// Media stores
import {
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  netflixOriginals,
  popular,
  romanceMovies,
  topRated,
  trending,
} from './mediaStore';
import { continueWatching } from './continueWatchingStore';

// Types
import type { MediaStore } from '../types';

/**
 * Registry of all media stores
 *
 * @constant {Record<string, MediaStore>}
 * @description A centralized registry that maps store IDs to their corresponding store instances.
 * This allows for programmatic access to stores by their identifier.
 */
export const storeRegistry: Record<string, MediaStore> = {
  actionMovies,
  comedyMovies,
  continueWatching,
  documentaries,
  horrorMovies,
  netflixOriginals,
  popular,
  romanceMovies,
  topRated,
  trending,
};

/**
 * Gets a store by its identifier
 *
 * @function getStoreById
 * @description Retrieves a media store from the registry by its identifier
 *
 * @param {string} id - The store identifier (e.g., 'trending', 'netflixOriginals')
 * @returns {MediaStore | undefined} The media store if found, undefined otherwise
 *
 * @example
 * // Get the trending store
 * const trendingStore = getStoreById('trending');
 * if (trendingStore) {
 *   // Use the store
 *   console.log(trendingStore.displayTitle);
 * }
 */
export function getStoreById(id: string): MediaStore | undefined {
  return storeRegistry[id];
}

/**
 * Finds a store by its display title
 *
 * @function findStoreByTitle
 * @description Searches the registry for a store with the specified display title
 *
 * @param {string} title - The display title to search for (e.g., 'Trending Now')
 * @returns {MediaStore | undefined} The media store if found, undefined otherwise
 *
 * @example
 * // Find a store by its display title
 * const store = findStoreByTitle('Trending Now');
 * if (store) {
 *   // Use the store
 *   openModal(store);
 * }
 */
export function findStoreByTitle(title: string): MediaStore | undefined {
  return Object.values(storeRegistry).find((store) => store.displayTitle === title);
}

/**
 * Gets all available store titles
 *
 * @function getAllStoreTitles
 * @description Returns an array of all display titles from the registered stores
 *
 * @returns {string[]} Array of display titles
 *
 * @example
 * // Get all available titles for a dropdown menu
 * const titles = getAllStoreTitles();
 * // ['Action', 'Comedy', 'Continue Watching', ...]
 */
export function getAllStoreTitles(): string[] {
  return Object.values(storeRegistry).map((store) => store.displayTitle);
}

/**
 * Gets all store IDs
 *
 * @function getAllStoreIds
 * @description Returns an array of all store identifiers in the registry
 *
 * @returns {string[]} Array of store identifiers
 *
 * @example
 * // Get all store IDs
 * const ids = getAllStoreIds();
 * // ['actionMovies', 'comedyMovies', 'continueWatching', ...]
 */
export function getAllStoreIds(): string[] {
  return Object.keys(storeRegistry);
}
