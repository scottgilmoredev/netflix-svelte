/**
 * API Service Module
 *
 * @module
 * @description Provides a configured Axios instance for making HTTP requests to The Movie Database API.
 * Handles base configuration, interceptors, and error handling for all API requests.
 *
 * @requires axios
 * @requires ../constants/tmdb
 * @requires ../types
 */

import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// Constants
import { API_BASE_URL } from '../constants/tmdb';

// Types
import type { TMDBConfig } from '../types';

/**
 * @type {TMDBConfig}
 */
const config: TMDBConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout for better error handling
  timeout: 10000,
};

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
const instance: AxiosInstance = axios.create(config);

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
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default instance;
