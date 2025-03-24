/**
 * Movies Service Module
 *
 * @module
 * @description Provides functions for fetching and manipulating movie data from the TMDB API.
 * Handles API requests, error handling, and data transformation for movie-related operations.
 *
 * @requires ../constants/tmdb
 * @requires ./apiService
 * @requires ../stores/movieStore
 * @requires ../types
 */

// Constants
import { ENDPOINTS } from '../constants/tmdb';

// Services
import api from './apiService';

// Stores
import { error } from '../stores/movieStore';

// Types
import type { APIResponse, Movie } from '../types';

/**
 * Fetches movies by category and updates the corresponding store
 *
 * @async
 * @function fetchMoviesByCategory
 * @description Retrieves movie data from TMDB API for a specific category and updates the provided store
 *
 * @param {string} category - The category key from the ENDPOINTS object (e.g., 'fetchNetflixOriginals')
 * @param {import('svelte/store').Writable} store - The Svelte writable store to update with the results
 *
 * @returns {Promise<Array>} A promise that resolves to an array of movie objects
 * @throws {Error} Logs error to console and updates global error store, but returns empty array instead of throwing
 *
 * @example Fetch Netflix originals and update the store
 * const movies = await fetchMoviesByCategory('fetchNetflixOriginals', netflixOriginals);
 * // The netflixOriginals store is now updated with the results
 * // movies contains the same data for immediate use
 */
export async function fetchMoviesByCategory(category: string): Promise<Movie[]> {
  try {
    const { data } = await api.get<APIResponse>(ENDPOINTS[category]);

    // Filter out movies without backdrop images
    return data.results.filter((result) => result.backdrop_path);
  } catch (err) {
    console.error(`Error fetching ${category}:`, err);
    error.set(err instanceof Error ? err.message : String(err));

    return [];
  }
}

/**
 * Fetches top rated movies, limits to 10, and assigns rank based on vote average
 *
 * @async
 * @function fetchTopRatedMovies
 * @description Retrieves top rated movies from TMDB API, limits to 10 results,
 * sorts by vote_average, and assigns a rank property to each movie
 *
 * @returns {Promise<Movie[]>} A promise that resolves to an array of top 10 ranked movies
 * @throws {Error} Logs error to console and updates global error store, but returns empty array instead of throwing
 */
export async function fetchTopRatedMovies(): Promise<Movie[]> {
  try {
    const { data } = await api.get<APIResponse>(ENDPOINTS.fetchTopRated);

    // Filter out movies without backdrop images
    const filteredData = data.results.filter((result) => result.backdrop_path);

    // Sort by vote_average in descending order
    const sortedData = [...filteredData].sort((a, b) => b.vote_average - a.vote_average);

    // Take only the top 10
    const top10 = sortedData.slice(0, 10);

    // Assign rank property (1-10) based on their position in the sorted array
    return top10.map((movie, index) => ({
      ...movie,
      rank: index + 1,
    }));
  } catch (err) {
    console.error('Error fetching top rated movies:', err);
    error.set(err instanceof Error ? err.message : String(err));

    return [];
  }
}

export function getRandomMovie(movies: Movie[]): Movie | null {
  if (movies.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * movies.length);

  return movies[randomIndex];
}
