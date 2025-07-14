/**
 * Media Service System
 *
 * @module
 * @description Provides comprehensive service functions for fetching and manipulating media data
 * from the TMDB API throughout the application. Handles API requests, error handling,
 * data transformation, and type mapping for all media-related operations. Ensures consistent
 * data flow between the external API and internal application state with proper error management
 * and data filtering.
 *
 * The service includes functions for:
 * - Category-based media fetching with filtering and transformation
 * - Top-rated media retrieval with ranking assignment
 * - Random media selection for featured content
 * - API response mapping to application types
 * - Error handling and logging with global state updates
 * - Data filtering to ensure quality content display
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
 * @description Retrieves media data from TMDB API for a specific category with comprehensive
 * error handling and data transformation. Filters results to ensure only media with backdrop
 * images are included, maps API responses to application types, and assigns appropriate
 * type discriminators. Provides robust error handling with global error state updates.
 *
 * @param {string} category - The category key from the ENDPOINTS object (e.g., 'fetchNetflixOriginals')
 *
 * @returns {Promise<AnyMedia[]>} A promise that resolves to an array of media objects with backdrops
 *
 * @throws {Error} Logs error to console and updates global error store, but returns empty array instead of throwing
 *
 * @example
 * // Fetch Netflix Originals
 * const netflixOriginals = await fetchMediaByCategory('fetchNetflixOriginals');
 * console.log(`Found ${netflixOriginals.length} Netflix Originals`);
 *
 * @example
 * // Fetch trending movies with error handling
 * try {
 *   const trendingMovies = await fetchMediaByCategory('fetchTrending');
 *   if (trendingMovies.length > 0) {
 *     updateMovieCarousel(trendingMovies);
 *   }
 * } catch (error) {
 *   console.log('Error handled by service, empty array returned');
 * }
 *
 * @example
 * // Fetch multiple categories
 * const categories = ['fetchActionMovies', 'fetchComedyMovies', 'fetchHorrorMovies'];
 * const allMedia = await Promise.all(
 *   categories.map(category => fetchMediaByCategory(category))
 * );
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
 * @description Retrieves top rated medias from TMDB API with comprehensive ranking system.
 * Filters results to ensure quality content, sorts by vote average in descending order,
 * limits to top 10 results, and assigns rank properties (1-10) based on position.
 * Transforms API responses to MediaRanked objects with proper type discrimination.
 *
 * @returns {Promise<MediaRanked[]>} A promise that resolves to an array of top 10 ranked medias
 *
 * @throws {Error} Logs error to console and updates global error store, but returns empty array instead of throwing
 *
 * @example
 * // Fetch top rated media for ranking display
 * const topRatedMedia = await fetchTopRatedMedia();
 * topRatedMedia.forEach(media => {
 *   console.log(`#${media.rank}: ${media.name} (${media.vote_average})`);
 * });
 *
 * @example
 * // Use top rated media in ranking component
 * const rankings = await fetchTopRatedMedia();
 * if (rankings.length === 10) {
 *   updateRankingCarousel(rankings);
 * } else {
 *   console.warn('Expected 10 ranked items, got:', rankings.length);
 * }
 *
 * @example
 * // Get top 3 media for featured section
 * const topRated = await fetchTopRatedMedia();
 * const topThree = topRated.slice(0, 3);
 * displayFeaturedContent(topThree);
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
 * @description Selects a random media from the provided array of medias using secure
 * random number generation. Provides safe handling of empty arrays and ensures
 * uniform distribution across all array elements. Commonly used for featured
 * content selection and billboard displays.
 *
 * @param {AnyMedia[]} medias - Array of medias to select from
 *
 * @returns {AnyMedia | null} A randomly selected media or null if the array is empty
 *
 * @example
 * // Get a random media for the billboard
 * const netflixOriginals = await fetchMediaByCategory('fetchNetflixOriginals');
 * const featuredMedia = getRandomMedia(netflixOriginals);
 * if (featuredMedia) {
 *   billboardMedia.set(featuredMedia);
 * }
 *
 * @example
 * // Get random media with fallback
 * function selectFeaturedContent(mediaArrays: AnyMedia[][]) {
 *   for (const mediaArray of mediaArrays) {
 *     const randomMedia = getRandomMedia(mediaArray);
 *     if (randomMedia) {
 *       return randomMedia;
 *     }
 *   }
 *   return getDefaultMedia();
 * }
 *
 * @example
 * // Get multiple random media
 * function getRandomSample(medias: AnyMedia[], count: number): AnyMedia[] {
 *   const sample: AnyMedia[] = [];
 *   const availableMedia = [...medias];
 *
 *   for (let i = 0; i < count && availableMedia.length > 0; i++) {
 *     const randomMedia = getRandomMedia(availableMedia);
 *     if (randomMedia) {
 *       sample.push(randomMedia);
 *       const index = availableMedia.indexOf(randomMedia);
 *       availableMedia.splice(index, 1);
 *     }
 *   }
 *
 *   return sample;
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
 * handling inconsistencies between movie and TV show properties from the TMDB API.
 * Normalizes field names, handles missing properties, and ensures consistent data
 * structure across different media types. Provides robust mapping for both movies
 * and TV shows with proper fallback values.
 *
 * @param {TMDBMediaResponse} response - Raw API response item from TMDB
 * @param {MediaType} [type='standard'] - The media type discriminator to assign
 *
 * @returns {AnyMedia} Properly typed media object for application use
 *
 * @example
 * // Map movie API response
 * const movieResponse = {
 *   id: 12345,
 *   title: 'Example Movie',
 *   original_title: 'Original Movie Title',
 *   overview: 'Movie description',
 *   backdrop_path: '/backdrop.jpg',
 *   poster_path: '/poster.jpg',
 *   vote_average: 8.5,
 *   media_type: 'movie'
 * };
 * const movieMedia = mapApiResponseToBaseMedia(movieResponse);
 *
 * @example
 * // Map TV show API response
 * const tvResponse = {
 *   id: 67890,
 *   name: 'Example TV Show',
 *   original_name: 'Original TV Show Name',
 *   overview: 'TV show description',
 *   backdrop_path: '/tv_backdrop.jpg',
 *   poster_path: '/tv_poster.jpg',
 *   vote_average: 9.2,
 *   media_type: 'tv'
 * };
 * const tvMedia = mapApiResponseToBaseMedia(tvResponse);
 *
 * @example
 * // Map with custom type discriminator
 * const rankedMedia = mapApiResponseToBaseMedia(apiResponse, 'ranked');
 * console.log(rankedMedia.type); // 'ranked'
 */
function mapApiResponseToBaseMedia(
  response: TMDBMediaResponse,
  type: MediaType = 'standard'
): AnyMedia {
  // Handle the name/title inconsistency
  const displayName = response.name || response.title || '';
  const mediaType =
    response.media_type || (response.title || response.original_title ? 'movie' : 'tv');
  const originalName = response.original_name || response.original_title || '';

  // Base media properties used across the application
  const baseMedia: BaseMedia = {
    type,
    backdrop_path: response.backdrop_path,
    id: response.id,
    media_type: mediaType,
    name: displayName,
    original_name: originalName,
    overview: response.overview,
    poster_path: response.poster_path,
    vote_average: response.vote_average,
  };

  return baseMedia as Media;
}
