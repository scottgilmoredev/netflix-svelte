/**
 * Media Service Module
 *
 * @module
 * @description Provides functions for fetching and manipulating media data from the TMDB API.
 * Handles API requests, error handling, and data transformation for media-related operations.
 *
 * @requires module:@constants
 * @requires ./apiService
 * @requires module:@stores
 * @requires module:@types
 * @requires module:@utils
 */

// Constants
import { ENDPOINTS } from '@constants';

// Services
import api from './apiService';

// Stores
import { error } from '@stores';

// Types
import type {
  AnyMedia,
  BaseMedia,
  Media,
  MediaRanked,
  MediaType,
  TMDBAPIResponse,
  TMDBMediaResponse,
} from '@types';

// Utils
import { createMedia, filterDataWithBackdrops } from '@utils';

/**
 * Fetches media by category
 *
 * @async
 * @function fetchMediaByCategory
 * @description Retrieves media data from TMDB API for a specific category
 *
 * @param {string} category - The category key from the ENDPOINTS object (e.g., 'fetchNetflixOriginals')
 * @returns {Promise<AnyMedia[]>} A promise that resolves to an array of media objects with backdrops
 *
 * @example
 * const medias = await fetchMediaByCategory('fetchNetflixOriginals');
 */
export async function fetchMediaByCategory(category: string): Promise<AnyMedia[]> {
  try {
    const { data } = await api.get<TMDBAPIResponse>(ENDPOINTS[category]);

    // Ensure we only work with medias that have backdrops
    const filteredData = filterDataWithBackdrops(data.results);

    // Convert to properly typed media objects with discriminator
    return filteredData.map((apiResponse) => {
      const mediaData = mapApiResponseToBaseMedia(apiResponse);

      // Assign the type discriminator based on the category
      return createMedia<Media>(mediaData, 'standard');
    });
  } catch (err) {
    console.error(`Error fetching ${category}:`, err);
    error.set(err instanceof Error ? err.message : String(err));

    return [];
  }
}

/**
 * Fetches top rated medias, limits to 10, and assigns rank based on vote average
 *
 * @async
 * @function fetchTopRatedMedia
 * @description Retrieves top rated medias from TMDB API, limits to 10 results,
 * sorts by vote_average, and assigns a rank property to each media
 *
 * @returns {Promise<MediaRanked[]>} A promise that resolves to an array of top 10 ranked medias
 * @throws {Error} Logs error to console and updates global error store, but returns empty array instead of throwing
 */
export async function fetchTopRatedMedia(): Promise<MediaRanked[]> {
  try {
    const { data } = await api.get<TMDBAPIResponse>(ENDPOINTS.fetchTopRated);

    // Ensure we only work with medias that have backdrops
    const filteredData = filterDataWithBackdrops(data.results);

    // Sort by vote_average in descending order
    const sortedData = [...filteredData].sort((a, b) => b.vote_average - a.vote_average);

    // Take only the top 10
    const top10 = sortedData.slice(0, 10);

    // Assign rank property (1-10) based on their position in the sorted array
    // and convert to properly typed MediaRanked objects with discriminator
    return top10.map((mediaResponse, index) => {
      const mediaData = mapApiResponseToBaseMedia(mediaResponse);
      const rankedMediaData = {
        ...mediaData,
        rank: index + 1,
      };

      // Assign the type discriminator
      return createMedia<MediaRanked>(rankedMediaData, 'ranked');
    });
  } catch (err) {
    console.error('Error fetching top rated medias:', err);
    error.set(err instanceof Error ? err.message : String(err));

    return [];
  }
}

/**
 * Gets a random media from an array of medias
 *
 * @function getRandomMedia
 * @description Selects a random media from the provided array of medias.
 * Returns null if the array is empty.
 *
 * @param {AnyMedia[]} medias - Array of medias to select from
 * @returns {AnyMedia | null} A randomly selected media or null if the array is empty
 *
 * @example
 * // Get a random media for the billboard
 * const featuredMedia = getRandomMedia(netflixOriginals);
 * if (featuredMedia) {
 *   billboardMedia.set(featuredMedia);
 * }
 */
export function getRandomMedia(medias: AnyMedia[]): AnyMedia | null {
  if (medias.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * medias.length);

  return medias[randomIndex];
}

/**
 * Maps raw API response to application media type
 *
 * @function mapApiResponseToBaseMedia
 * @description Transforms the complete API response into the focused application type,
 * handling inconsistencies between movie and TV show properties
 *
 * @param {TMDBMediaResponse} response - Raw API response item
 * @param {MediaType} type - The media type discriminator
 * @returns {AnyMedia} Properly typed media object for application use
 */
function mapApiResponseToBaseMedia(
  response: TMDBMediaResponse,
  type: MediaType = 'standard'
): AnyMedia {
  // Handle the name/title inconsistency
  const displayName = response.name || response.title || '';
  const originalName = response.original_name || response.original_title || '';

  // Base media properties used across the application
  const baseMedia: BaseMedia = {
    type,
    backdrop_path: response.backdrop_path,
    id: response.id,
    name: displayName,
    original_name: originalName,
    overview: response.overview,
    poster_path: response.poster_path,
    vote_average: response.vote_average,
  };

  return baseMedia as Media;
}
