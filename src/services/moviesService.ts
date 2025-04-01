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
 * @requires ../utils/helperUtils
 */

// Constants
import { ENDPOINTS } from '../constants/tmdb';

// Services
import api from './apiService';

// Stores
import { error } from '../stores/movieStore';

// Types
import type { APIResponse, Movie } from '../types';

// Utils
import { filterDataWithBackdrops } from '../utils/helperUtils';

/**
 * Fetches movies by category
 *
 * @async
 * @function fetchMoviesByCategory
 * @description Retrieves movie data from TMDB API for a specific category
 *
 * @param {string} category - The category key from the ENDPOINTS object (e.g., 'fetchNetflixOriginals')
 * @returns {Promise<Movie[]>} A promise that resolves to an array of movie objects with backdrops
 *
 * @example
 * const movies = await fetchMoviesByCategory('fetchNetflixOriginals');
 */
export async function fetchMoviesByCategory(category: string): Promise<Movie[]> {
  try {
    const { data } = await api.get<APIResponse>(ENDPOINTS[category]);

    // Ensure we only work with movies that have backdrops
    return filterDataWithBackdrops(data.results);
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

    // Ensure we only work with movies that have backdrops
    const filteredData = filterDataWithBackdrops(data.results);

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

/**
 * Gets a random movie from an array of movies
 *
 * @function getRandomMovie
 * @description Selects a random movie from the provided array of movies.
 * Returns null if the array is empty.
 *
 * @param {Movie[]} movies - Array of movies to select from
 * @returns {Movie | null} A randomly selected movie or null if the array is empty
 *
 * @example
 * // Get a random movie for the billboard
 * const featuredMovie = getRandomMovie(netflixOriginals);
 * if (featuredMovie) {
 *   billboardMovie.set(featuredMovie);
 * }
 */
export function getRandomMovie(movies: Movie[]): Movie | null {
  if (movies.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * movies.length);

  return movies[randomIndex];
}
