import type { Movie } from './media';

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
export interface APIResponse {
  page?: number;
  results: Movie[];
  total_pages?: number;
  total_results?: number;
}

/**
 * Configuration for The Movie Database API
 *
 * @interface TMDBConfig
 * @property {string} baseURL - Base URL for all requests to TMDB API
 * @property {Object} headers - Default headers sent with each request
 * @property {string} headers.Content-Type - Content type of the request
 * @property {number} timeout - Request timeout in milliseconds
 */
export interface TMDBConfig {
  baseURL: string;
  headers: {
    'Content-Type': string;
  };
  timeout: number;
}
