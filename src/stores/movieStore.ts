/**
 * Movie Store Module
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

import { writable } from 'svelte/store';

// Services
import * as movieService from '../services/moviesService';

// Types
import type { Writable } from 'svelte/store';
import type { Movie } from '../types';

// Create stores for movie data
export const actionMovies: Writable<Movie[]> = writable([]);
export const billboardMovie: Writable<Movie | null> = writable(null);
export const documentaries: Writable<Movie[]> = writable([]);
export const comedyMovies: Writable<Movie[]> = writable([]);
export const horrorMovies: Writable<Movie[]> = writable([]);
export const netflixOriginals: Writable<Movie[]> = writable([]);
export const romanceMovies: Writable<Movie[]> = writable([]);
export const topRated: Writable<Movie[]> = writable([]);
export const trending: Writable<Movie[]> = writable([]);

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
 *   () => movieService.fetchMoviesByCategory('fetchTrending'),
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
 * @function initializeMovies
 * @description Fetches all movie categories from the TMDB API, updates the corresponding stores,
 * and selects a random Netflix original for the billboard. Manages error states.
 *
 * @returns {Promise<void>} A promise that resolves when all data has been fetched and stores updated
 *
 * @example Initialize all movie data on component mount
 * onMount(() => {
 *   initializeMovies();
 * });
 *
 * @example Initialize with error handling
 * try {
 *   await initializeMovies();
 *   console.log('All movies loaded successfully');
 * } catch (err) {
 *   console.error('Failed to initialize movies');
 * }
 *
 * @fires {actionMovies.set} Updates the action movies store
 * @fires {billboardMovie.set} Sets a random Netflix original as the billboard movie
 * @fires {comedyMovies.set} Updates the comedy movies store
 * @fires {documentaries.set} Updates the documentaries store
 * @fires {horrorMovies.set} Updates the horror movies store
 * @fires {netflixOriginals.set} Updates the Netflix originals store
 * @fires {romanceMovies.set} Updates the romance movies store
 * @fires {topRated.set} Updates the top rated movies store
 * @fires {trending.set} Updates the trending movies store
 *
 * @fires {error.set} Updates the error state if an error occurs
 */
export async function initializeMovies(): Promise<void> {
  error.set(null);

  try {
    // Fetch Netflix originals first for the billboard
    const originalsData = await updateStore(
      () => movieService.fetchMoviesByCategory('fetchNetflixOriginals'),
      netflixOriginals
    );

    // Set random movie for billboard
    if (originalsData.length > 0) {
      const randomMovie = movieService.getRandomMovie(originalsData);
      billboardMovie.set(randomMovie);
    }

    // Fetch other categories in parallel
    await Promise.all([
      updateStore(() => movieService.fetchMoviesByCategory('fetchActionMovies'), actionMovies),
      updateStore(() => movieService.fetchMoviesByCategory('fetchComedyMovies'), comedyMovies),
      updateStore(() => movieService.fetchMoviesByCategory('fetchDocumentaries'), documentaries),
      updateStore(() => movieService.fetchMoviesByCategory('fetchHorrorMovies'), horrorMovies),
      updateStore(() => movieService.fetchMoviesByCategory('fetchRomanceMovies'), romanceMovies),
      updateStore(() => movieService.fetchMoviesByCategory('fetchTrending'), trending),
      updateStore(() => movieService.fetchTopRatedMovies(), topRated),
    ]);
  } catch (err) {
    console.error('Error initializing movies:', err);
    error.set(err instanceof Error ? err.message : String(err));
  }
}
