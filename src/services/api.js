import axios from 'axios';

/**
 * Axios instance configured for The Movie Database API
 * 
 * @description Creates a pre-configured axios instance for making HTTP requests
 * to The Movie Database (TMDB) API with consistent configuration.
 * 
 * @constant {Object} instance
 * @property {string} baseURL - Base URL for all requests to TMDB API
 * @property {Object} headers - Default headers sent with each request
 * @property {number} timeout - Request timeout in milliseconds
 * 
 * @example Making a GET request to fetch movies
 * const response = await instance.get('/movie/popular');
 * const movies = response.data.results;
 */
const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    'Content-Type': 'application/json'
  },
  // Add timeout for better error handling
  timeout: 10000,
});

/**
 * Response interceptor for global error handling
 * 
 * @description Adds a response interceptor to the axios instance that processes
 * all responses and errors before they are returned to the calling code.
 * 
 * @returns {Promise} The original response for successful requests or a rejected promise for errors
 * 
 * @example This interceptor is automatically applied to all requests made with this axios instance:
 * try {
 *   const response = await instance.get('/some/endpoint');
 *   // Process successful response
 * } catch (error) {
 *   // Error has already been logged by the interceptor
 *   // Handle error in the component
 * }
 */
instance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default instance;
