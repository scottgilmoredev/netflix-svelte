import { writable } from 'svelte/store';
import api from '../services/api';
import endpoints from '../utils/tmdbEndpoints';

// Create stores for movie data
export const actionMovies = writable([]);
export const bannerMovie = writable(null);
export const comedyMovies = writable([]);
export const documentaries = writable([]);
export const horrorMovies = writable([]);
export const netflixOriginals = writable([]);
export const romanceMovies = writable([]);
export const topRated = writable([]);
export const trending = writable([]);

export const error = writable(null);

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
async function fetchMoviesByCategory(category, store) {
  try {
    const response = await api.get(endpoints[category]);
    store.set(response.data.results);

    return response.data.results;
  } catch (err) {
    console.error(`Error fetching ${category}:`, err);
    error.set(err.message);

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
export async function initializeMovies() {
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
      fetchMoviesByCategory('fetchDocumentaries', documentaries),
      fetchMoviesByCategory('fetchHorrorMovies', horrorMovies),
      fetchMoviesByCategory('fetchRomanceMovies', romanceMovies),
      fetchMoviesByCategory('fetchTopRated', topRated),
      fetchMoviesByCategory('fetchTrending', trending),
    ]);
  } catch (err) {
    console.error('Error initializing movies:', err);
    error.set(err.message);
  }
}
