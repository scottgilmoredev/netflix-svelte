import { writable } from 'svelte/store';
import api from '../services/api';
import endpoints from '../utils/tmdbEndpoints';

// Types
import type { Writable } from 'svelte/store';

/**
 * Represents the structure of the API response from TMDB
 *
 * @interface APIResponse
 * @description Defines the shape of the response data object returned by TMDB API endpoints.
 * It includes pagination information and an array of movie results.
 *
 * @property {number} [page] - The current page number of results
 * @property {Movie[]} results - An array of movie objects returned by the API
 * @property {number} [total_pages] - The total number of pages available for the query
 * @property {number} [total_results] - The total number of results available for the query
 */
interface APIResponse {
  page?: number;
  results: Movie[];
  total_pages?: number;
  total_results?: number;
}

/**
 * Represents a movie object from the TMDB API
 *
 * @typedef {Object} Movie
 * @property {boolean} adult - Indicates if the movie is for adults
 * @property {string|null} backdrop_path - Path to the backdrop image
 * @property {number[]} genre_ids - Array of genre IDs associated with the movie
 * @property {number} id - Unique identifier for the movie
 * @property {string} original_language - Original language of the movie
 * @property {string} original_title - Original title of the movie
 * @property {string} overview - Brief description of the movie
 * @property {number} popularity - Popularity score of the movie
 * @property {string|null} poster_path - Path to the movie poster image
 * @property {string} release_date - Release date of the movie
 * @property {string} title - Title of the movie
 * @property {boolean} video - Indicates if it's a video
 * @property {number} vote_average - Average vote rating
 * @property {number} vote_count - Number of votes
 */
interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// Create stores for movie data
export const actionMovies: Writable<Movie[]> = writable([]);
export const bannerMovie: Writable<Movie | null> = writable(null);
export const comedyMovies: Writable<Movie[]> = writable([]);
export const horrorMovies: Writable<Movie[]> = writable([]);
export const netflixOriginals: Writable<Movie[]> = writable([]);
export const romanceMovies: Writable<Movie[]> = writable([]);
export const topRated: Writable<Movie[]> = writable([]);
export const trending: Writable<Movie[]> = writable([]);

export const error: Writable<string | null> = writable(null);

/**
 * Fetches movies by category and updates the corresponding store
 *
 * @async
 * @function fetchMoviesByCategory
 * @description Retrieves movie data from TMDB API for a specific category and updates the provided store
 *
 * @param {string} category - The category key from the endpoints object (e.g., 'fetchNetflixOriginals')
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
async function fetchMoviesByCategory(category: string, store: Writable<Movie[]>): Promise<Movie[]> {
  try {
    const { data } = await api.get<APIResponse>(endpoints[category]);

    store.set(data.results);

    return data.results;
  } catch (err) {
    console.error(`Error fetching ${category}:`, err);
    error.set(err instanceof Error ? err.message : String(err));

    return [];
  }
}

/**
 * Initializes all movie data for the application
 *
 * @async
 * @function initializeMovies
 * @description Fetches all movie categories from the TMDB API, updates the corresponding stores,
 * and selects a random Netflix original for the banner. Manages error states.
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
 * @fires {bannerMovie.set} Sets a random Netflix original as the banner movie
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
    // Fetch Netflix originals first for the banner
    const originalsData = await fetchMoviesByCategory('fetchNetflixOriginals', netflixOriginals);

    // Set random movie for banner
    if (originalsData.length > 0) {
      const randomIndex = Math.floor(Math.random() * originalsData.length);
      bannerMovie.set(originalsData[randomIndex]);
    }

    // Fetch other categories in parallel
    await Promise.all([
      fetchMoviesByCategory('fetchActionMovies', actionMovies),
      fetchMoviesByCategory('fetchComedyMovies', comedyMovies),
      fetchMoviesByCategory('fetchHorrorMovies', horrorMovies),
      fetchMoviesByCategory('fetchRomanceMovies', romanceMovies),
      fetchMoviesByCategory('fetchTopRated', topRated),
      fetchMoviesByCategory('fetchTrending', trending),
    ]);
  } catch (err) {
    console.error('Error initializing movies:', err);
    error.set(err instanceof Error ? err.message : String(err));
  }
}
