/**
 * Media Store Module
 *
 * @module
 * @description Centralizes movie data management for the application.
 * Provides stores for different movie categories and functions to initialize and update them.
 * Handles error states and data fetching from the movie service.
 *
 * @requires svelte/store
 * @requires ../services/moviesService
 * @requires ../types
 */

import { get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

// Services
import * as movieService from '../services/mediaService';

// Stores
import { continueWatching, createContinueWatchingList } from './continueWatchingStore';

// Types
import type { AnyMedia, Media, MediaRanked, MediaStore } from '../types';

/**
 * Creates a movie store with additional metadata
 *
 * @param displayTitle - The human-readable title for this store
 * @returns An enhanced writable store with metadata
 */
function createMediaStore<T extends AnyMedia>(displayTitle: string): MediaStore<T> {
  const store = writable<T[]>([]);

  return {
    ...store,
    displayTitle,
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,
  };
}

// Create stores for movie data
export const actionMovies = createMediaStore<Media>('Action');
export const billboardMedia: Writable<AnyMedia | null> = writable(null);
export const comedyMovies = createMediaStore<Media>('Comedy');
export const documentaries = createMediaStore<Media>('Documentaries');
export const horrorMovies = createMediaStore<Media>('Horror');
export const netflixOriginals = createMediaStore<Media>('Only on Netflix');
export const popular = createMediaStore<Media>('Popular');
export const romanceMovies = createMediaStore<Media>('Romance');
export const topRated = createMediaStore<MediaRanked>('Top 10 Movies in the U.S. Today');
export const trending = createMediaStore<Media>('Trending Now');

export const error: Writable<string | null> = writable(null);

/**
 * Updates a store with data from a fetch function
 *
 * @async
 * @function updateStore
 * @description Generic helper function to fetch data and update a store
 *
 * @template T The type of data being fetched
 * @param {() => Promise<T>} fetchFunction - Function that returns a promise with data
 * @param {Writable<T>} store - Svelte store to update with the fetched data
 * @returns {Promise<T>} The fetched data
 * @throws {Error} Propagates any errors after updating the error store
 *
 * @example
 * // Update the trending movies store
 * const data = await updateStore(
 *   () => movieService.fetchMediaByCategory('fetchTrending'),
 *   trending
 * );
 */
async function updateStore<T>(fetchFunction: () => Promise<T>, store: Writable<T>): Promise<T> {
  try {
    const data = await fetchFunction();
    store.set(data);

    return data;
  } catch (err) {
    error.set(err instanceof Error ? err.message : String(err));

    throw err;
  }
}

/**
 * Initializes all movie data for the application
 *
 * @async
 * @function initializeMedia
 * @description Fetches all movie categories from the TMDB API, updates the corresponding stores,
 * and selects a random Netflix original for the billboard. Manages error states.
 *
 * @returns {Promise<void>} A promise that resolves when all data has been fetched and stores updated
 *
 * @example Initialize all movie data on component mount
 * onMount(() => {
 *   initializeMedia();
 * });
 *
 * @example Initialize with error handling
 * try {
 *   await initializeMedia();
 *   console.log('All movies loaded successfully');
 * } catch (err) {
 *   console.error('Failed to initialize movies');
 * }
 *
 * @fires {actionMedia.set} Updates the action movies store
 * @fires {billboardMedia.set} Sets a random Netflix original as the billboard movie
 * @fires {comedyMedia.set} Updates the comedy movies store
 * @fires {documentaries.set} Updates the documentaries store
 * @fires {horrorMedia.set} Updates the horror movies store
 * @fires {netflixOriginals.set} Updates the Netflix originals store
 * @fires {romanceMedia.set} Updates the romance movies store
 * @fires {topRated.set} Updates the top rated movies store
 * @fires {trending.set} Updates the trending movies store
 * @fires {continueWatching.set} Updates the continueWatching store
 *
 * @fires {error.set} Updates the error state if an error occurs
 */
export async function initializeMedia(): Promise<void> {
  error.set(null);

  try {
    // Fetch Netflix originals first for the billboard
    const originalsData = await updateStore(
      () => movieService.fetchMediaByCategory('fetchNetflixOriginals'),
      netflixOriginals
    );

    // Set random movie for billboard
    if (originalsData.length > 0) {
      const randomMedia = movieService.getRandomMedia(originalsData);
      billboardMedia.set(randomMedia);
    }

    // Fetch other categories in parallel
    await Promise.all([
      updateStore(() => movieService.fetchMediaByCategory('fetchActionMovies'), actionMovies),
      updateStore(() => movieService.fetchMediaByCategory('fetchComedyMovies'), comedyMovies),
      updateStore(() => movieService.fetchMediaByCategory('fetchDocumentaries'), documentaries),
      updateStore(() => movieService.fetchMediaByCategory('fetchHorrorMovies'), horrorMovies),
      updateStore(() => movieService.fetchMediaByCategory('fetchRomanceMovies'), romanceMovies),
      updateStore(() => movieService.fetchMediaByCategory('fetchTrending'), trending),
      updateStore(() => movieService.fetchMediaByCategory('fetchPopular'), popular),
      updateStore(() => movieService.fetchTopRatedMedia(), topRated),
    ]);

    // Create continue watching list from existing data
    const trendingData = get(trending);
    const topRatedData = get(topRated);
    const popularData = get(popular);

    const continueWatchingData = createContinueWatchingList(
      originalsData,
      trendingData,
      topRatedData,
      popularData
    );

    continueWatching.set(continueWatchingData);
  } catch (err) {
    console.error('Error initializing movies:', err);
    error.set(err instanceof Error ? err.message : String(err));
  }
}
