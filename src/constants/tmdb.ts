/**
 * TMDB API Constants Module
 *
 * @module
 * @description Contains constants related to The Movie Database (TMDB) API.
 * Provides base URLs, API endpoints, and configuration for interacting with
 * the TMDB API throughout the application.
 */

/**
 * Base URL for TMDB api requests
 * @constant {string}
 */
export const API_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * The Movie Database API key retrieved from environment variables
 *
 * @description API key used for authenticating requests to The Movie Database API.
 *
 * @constant {string} API_KEY
 *
 * @example
 * // Using in a request URL
 * const url = `/movie/popular?api_key=${API_KEY}`;
 *
 * @note This requires a .env file with VITE_API_KEY defined or the key
 * to be set in the environment where the application is running.
 *
 * @security This key should never be hardcoded or exposed in client-side code.
 * The Vite build process will replace this reference with the actual value.
 */
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Base URL for TMDB image assets
 * @constant {string}
 */
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

/**
 * Collection of TMDB API endpoint paths with API key included
 *
 * @description A centralized object containing all the endpoint paths used to fetch
 * different categories of movies from The Movie Database API. Each path includes
 * the API key and any necessary query parameters.
 *
 * @constant {Object} ENDPOINTS
 * @property {string} fetchActionMovies - Path to fetch action genre movies
 * @property {string} fetchComedyMovies - Path to fetch comedy genre movies
 * @property {string} fetchDocumentaries - Path to fetch documentary genre movies
 * @property {string} fetchHorrorMovies - Path to fetch horror genre movies
 * @property {string} fetchNetflixOriginals - Path to fetch Netflix original content
 * @property {string} fetchRomanceMovies - Path to fetch romance genre movies
 * @property {string} fetchTopRated - Path to fetch top rated movies
 * @property {string} fetchTrending - Path to fetch trending movies and TV shows
 *
 * @example Using with axios
 * const trendingMovies = await api.get(ENDPOINTS.fetchTrending);
 */
export const ENDPOINTS: {
  [key: string]: string;
} = {
  fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
  fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
  fetchPopular: `/tv/popular?api_key=${API_KEY}&language=en-US&page=1`,
  fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
};
