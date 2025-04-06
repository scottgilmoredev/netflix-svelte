/**
 * Represents the structure of the API response from TMDB
 *
 * @interface TMDBAPIResponse
 * @description Defines the shape of the response data object returned by TMDB API endpoints.
 * It includes pagination information and an array of movie results.
 *
 * @property {number} [page] - The current page number of results
 * @property {Movie[]} results - An array of movie objects returned by the API
 * @property {number} [total_pages] - The total number of pages available for the query
 * @property {number} [total_results] - The total number of results available for the query
 */
export interface TMDBAPIResponse {
  page?: number;
  results: TMDBMediaResponse[];
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

/**
 * TMDB Media Response Interface
 *
 * @interface TMDBMediaResponse
 * @description Represents the structure of a media item returned from The Movie Database (TMDB) API.
 * This interface handles both movie and TV show responses with their specific fields.
 * The API returns a unified structure with some fields specific to movies, some specific to TV shows,
 * and some common to both. The optional media_type field can be used to determine the exact type.
 *
 * The interface is organized into three sections:
 * 1. Common base fields for all media types
 * 2. Movie-specific fields (present when media_type is 'movie')
 * 3. TV-specific fields (present when media_type is 'tv')
 * 4. Additional common fields for all media types
 *
 * @property {boolean} adult - Whether the media is adult content
 * @property {string | null} backdrop_path - Path to the backdrop image, or null if none
 * @property {number[]} genre_ids - Array of genre IDs associated with the media
 * @property {number} id - Unique identifier for the media item
 * @property {string} original_language - Original language code (e.g., 'en', 'es')
 *
 * @property {string} [title] - Movie title (movie-specific)
 * @property {string} [original_title] - Original movie title (movie-specific)
 * @property {string} [release_date] - Movie release date in format 'YYYY-MM-DD' (movie-specific)
 * @property {boolean} [video] - Whether the movie has a video (movie-specific)
 *
 * @property {string} [name] - TV show name (TV-specific)
 * @property {string} [original_name] - Original TV show name (TV-specific)
 * @property {string} [first_air_date] - First air date in format 'YYYY-MM-DD' (TV-specific)
 * @property {string[]} [origin_country] - Array of country codes where the show originated (TV-specific)
 *
 * @property {'movie' | 'tv' | 'person'} [media_type] - Type of media
 * @property {string} overview - Brief description of the media
 * @property {number} popularity - Popularity score
 * @property {string | null} poster_path - Path to the poster image, or null if none
 * @property {number} vote_average - Average vote score (0-10)
 * @property {number} vote_count - Number of votes
 *
 * @example
 * // Example of processing a TMDB response
 * function processMediaResponse(response: TMDBMediaResponse) {
 *   // Determine the display name based on media type
 *   const displayName = response.title || response.name || '';
 *
 *   // Get the appropriate image path
 *   const imagePath = response.poster_path || response.backdrop_path;
 *
 *   // Use in application
 *   return {
 *     id: response.id,
 *     name: displayName,
 *     imagePath,
 *     overview: response.overview,
 *     rating: response.vote_average
 *   };
 * }
 */
export interface TMDBMediaResponse {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;

  // Movie-specific fields
  title?: string;
  original_title?: string;
  release_date?: string;
  video?: boolean;

  // TV-specific fields
  name?: string;
  original_name?: string;
  first_air_date?: string;
  origin_country?: string[];

  // Common fields
  media_type?: 'movie' | 'tv';
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
}
