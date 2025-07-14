/**
 * Media Details Service System
 *
 * @module
 * @description Provides comprehensive service functions for fetching, caching, and formatting
 * detailed media information from the TMDB API. Implements intelligent batch processing,
 * efficient caching mechanisms, and data transformation utilities for enhanced media
 * presentation throughout the application.
 *
 * The service includes:
 * - Intelligent batch fetching with concurrent request management
 * - Memory-efficient caching system with duplicate request prevention
 * - Content rating extraction for US market compliance
 * - Runtime and episode formatting for user-friendly display
 * - Media type-specific data handling and transformation
 * - Error handling and recovery mechanisms
 * - Performance optimization through request batching and throttling
 *
 * @requires ./apiService
 * @requires module:@types
 */

// Services
import api from './apiService';

// Types
import type { AnyMedia } from '@types';

// Cache to store fetched details
const detailsCache = new Map<number, any>();

// Set to track media IDs that are currently being fetched
const pendingFetches = new Set<number>();

// Maximum number of items to fetch in a single batch
const MAX_BATCH_SIZE = 10;

/**
 * Fetches detailed information for a batch of media items
 *
 * @async
 * @function fetchMediaDetailsBatch
 * @description Efficiently fetches detailed information for multiple media items using
 * intelligent batch processing and caching. Prevents duplicate requests, manages
 * concurrent fetches, and implements throttling to avoid API rate limits. Extracts
 * comprehensive media details including content ratings, genres, runtime, and
 * episode information with proper error handling and recovery.
 *
 * @param {AnyMedia[]} mediaItems - Array of media items to fetch details for
 *
 * @returns {Promise<Map<number, any>>} A promise that resolves to a Map of media IDs to their detailed information
 *
 * @example
 * // Fetch details for a carousel of media items
 * const mediaCarousel = await fetchMediaByCategory('fetchTrending');
 * const detailsMap = await fetchMediaDetailsBatch(mediaCarousel);
 *
 * mediaCarousel.forEach(media => {
 *   const details = detailsMap.get(media.id);
 *   if (details) {
 *     console.log(`${media.name}: ${details.contentRating}, ${getFormattedDuration(details)}`);
 *   }
 * });
 *
 * @example
 * // Batch fetch with error handling
 * try {
 *   const mediaItems = [...netflixOriginals, ...trendingMovies];
 *   const detailsCache = await fetchMediaDetailsBatch(mediaItems);
 *
 *   if (detailsCache.size > 0) {
 *     updateMediaCarouselWithDetails(mediaItems, detailsCache);
 *   }
 * } catch (error) {
 *   console.error('Batch fetch failed:', error);
 *   displayMediaWithoutDetails(mediaItems);
 * }
 *
 * @example
 * // Progressive loading for large datasets
 * async function loadAllMediaDetails(allMedia: AnyMedia[]) {
 *   const chunks = [];
 *   for (let i = 0; i < allMedia.length; i += 50) {
 *     chunks.push(allMedia.slice(i, i + 50));
 *   }
 *
 *   for (const chunk of chunks) {
 *     await fetchMediaDetailsBatch(chunk);
 *     // Allow UI to update between batches
 *     await new Promise(resolve => setTimeout(resolve, 200));
 *   }
 * }
 */
export async function fetchMediaDetailsBatch(mediaItems: AnyMedia[]): Promise<Map<number, any>> {
  // Filter out items that are already in the cache or being fetched
  const itemsToFetch = mediaItems.filter(
    (item) => !detailsCache.has(item.id) && !pendingFetches.has(item.id)
  );

  // If all items are already cached or being fetched, return the cache
  if (itemsToFetch.length === 0) {
    return detailsCache;
  }

  // Limit batch size to prevent too many simultaneous requests
  const batchItems = itemsToFetch.slice(0, MAX_BATCH_SIZE);

  // Mark these items as pending
  batchItems.forEach((item) => pendingFetches.add(item.id));

  // Create an array of promises for each item that needs to be fetched
  const fetchPromises = batchItems.map(async (media) => {
    try {
      // Determine if it's a movie or TV show
      const mediaType = media.media_type;
      const isMovie = mediaType === 'movie';

      // Construct the endpoint with append_to_response to get everything in one request
      const appendParam = isMovie ? 'release_dates' : 'content_ratings';
      const endpoint = `/${mediaType}/${media.id}?api_key=${
        import.meta.env.VITE_API_KEY
      }&append_to_response=${appendParam}`;

      // Fetch the data
      const { data } = await api.get(endpoint);

      // Extract content rating
      let contentRating = 'N/A';

      if (isMovie && data.release_dates) {
        // Find US rating if available
        const usReleases = data.release_dates.results.find(
          (result: { iso_3166_1: string; release_dates: Array<{ certification: string }> }) =>
            result.iso_3166_1 === 'US'
        );

        if (usReleases) {
          contentRating = usReleases.release_dates[0].certification;
        }
      } else if (!isMovie && data.content_ratings) {
        // Find US rating if available
        const usRating = data.content_ratings.results.find(
          (result: { iso_3166_1: string; rating: string }) => result.iso_3166_1 === 'US'
        );

        if (usRating) {
          contentRating = usRating.rating;
        }
      }

      // Extract only the needed fields
      const details = {
        // Basic information
        contentRating,
        genres: data.genres || [],
        mediaType,
        mediaTitleType: data.type,

        // Movie-specific information
        runtime: mediaType === 'movie' ? data.runtime || 0 : null,

        // TV-specific information
        number_of_episodes: mediaType === 'tv' ? data.number_of_episodes || 0 : null,
        number_of_seasons: mediaType === 'tv' ? data.number_of_seasons || 0 : null,

        // For collections/franchises
        belongs_to_collection: data.belongs_to_collection || null,
      };

      // Add to cache
      detailsCache.set(media.id, details);

      return { id: media.id, details };
    } catch (err) {
      console.error(`Error fetching details for media ID ${media.id}:`, err);
      return { id: media.id, details: null };
    } finally {
      // Remove from pending set regardless of success or failure
      pendingFetches.delete(media.id);
    }
  });

  // Wait for all fetch operations to complete
  await Promise.all(fetchPromises);

  // If there are more items to fetch, schedule the next batch
  if (itemsToFetch.length > MAX_BATCH_SIZE) {
    // Use setTimeout to give the browser a chance to breathe
    setTimeout(() => {
      fetchMediaDetailsBatch(itemsToFetch.slice(MAX_BATCH_SIZE));
    }, 100);
  }

  // Return the updated cache
  return detailsCache;
}

/**
 * Formats runtime from minutes to hours and minutes
 *
 * @function formatRuntime
 * @description Converts movie runtime from minutes to a user-friendly hours and minutes
 * format. Handles edge cases for movies with no runtime data, movies under an hour,
 * and movies with exact hour durations. Provides consistent formatting across the
 * application for runtime display in media cards and detail views.
 *
 * @param {number} minutes - Runtime in minutes from TMDB API
 *
 * @returns {string} Formatted runtime string in "Xh Ym", "Xh", "Ym", or "N/A" format
 *
 * @example
 * // Format various runtime scenarios
 * console.log(formatRuntime(142)); // "2h 22m"
 * console.log(formatRuntime(120)); // "2h"
 * console.log(formatRuntime(45));  // "45m"
 * console.log(formatRuntime(0));   // "N/A"
 * console.log(formatRuntime(null)); // "N/A"
 *
 * @example
 * // Use in media card component
 * function MediaCard({ media, details }) {
 *   const runtime = details?.runtime ? formatRuntime(details.runtime) : 'N/A';
 *
 *   return (
 *     <div className="media-card">
 *       <h3>{media.name}</h3>
 *       <p>Runtime: {runtime}</p>
 *     </div>
 *   );
 * }
 *
 * @example
 * // Batch format for multiple movies
 * const movieRuntimes = movies.map(movie => ({
 *   title: movie.name,
 *   duration: formatRuntime(movie.details?.runtime)
 * }));
 */
export function formatRuntime(minutes: number): string {
  if (!minutes) return 'N/A';

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Formats TV show seasons/episodes information
 *
 * @function formatTVInfo
 * @description Formats TV show season and episode information into user-friendly
 * display strings. Handles single season shows by displaying episode count,
 * multi-season shows by displaying season count, and edge cases with missing
 * or zero values. Provides consistent formatting for TV show metadata display.
 *
 * @param {number} seasons - Number of seasons from TMDB API
 * @param {number} episodes - Number of episodes from TMDB API
 *
 * @returns {string} Formatted TV show information string
 *
 * @example
 * // Format various TV show scenarios
 * console.log(formatTVInfo(1, 10));  // "10 Episodes"
 * console.log(formatTVInfo(5, 120)); // "5 Seasons"
 * console.log(formatTVInfo(0, 0));   // "N/A"
 * console.log(formatTVInfo(1, 1));   // "1 Episodes"
 *
 * @example
 * // Use in TV show card component
 * function TVShowCard({ show, details }) {
 *   const tvInfo = details ? formatTVInfo(details.number_of_seasons, details.number_of_episodes) : 'N/A';
 *
 *   return (
 *     <div className="tv-show-card">
 *       <h3>{show.name}</h3>
 *       <p>{tvInfo}</p>
 *     </div>
 *   );
 * }
 *
 * @example
 * // Filter shows by season count
 * const longRunningShows = tvShows.filter(show => {
 *   const details = getMediaDetails(show);
 *   return details && details.number_of_seasons >= 5;
 * });
 */
export function formatTVInfo(seasons: number, episodes: number): string {
  if (seasons === 0 && episodes === 0) return 'N/A';

  if (seasons === 1) {
    return `${episodes} Episodes`;
  }

  return `${seasons} Seasons`;
}

/**
 * Returns formatted duration information based on media type
 *
 * @function getFormattedDuration
 * @description Intelligently formats duration information based on media type,
 * automatically selecting between movie runtime formatting and TV show season/episode
 * formatting. Provides a unified interface for displaying duration across different
 * media types with proper fallback handling for missing data.
 *
 * @param {any} mediaDetails - The media details object containing type and duration information
 *
 * @returns {string} Formatted duration string appropriate for the media type
 *
 * @example
 * // Format duration for mixed media types
 * const mediaItems = [movieDetails, tvShowDetails];
 * mediaItems.forEach(details => {
 *   console.log(`Duration: ${getFormattedDuration(details)}`);
 * });
 * // Output: "Duration: 2h 15m" (movie)
 * // Output: "Duration: 3 Seasons" (TV show)
 *
 * @example
 * // Use in universal media component
 * function MediaDurationDisplay({ mediaDetails }) {
 *   const duration = getFormattedDuration(mediaDetails);
 *
 *   return (
 *     <span className="media-duration">
 *       {duration}
 *     </span>
 *   );
 * }
 *
 * @example
 * // Filter media by duration
 * function filterByDuration(mediaList: AnyMedia[], minDuration: number) {
 *   return mediaList.filter(media => {
 *     const details = getMediaDetails(media);
 *     if (!details) return false;
 *
 *     if (details.mediaType === 'movie') {
 *       return details.runtime >= minDuration;
 *     } else {
 *       return details.number_of_seasons >= Math.ceil(minDuration / 60);
 *     }
 *   });
 * }
 */
export function getFormattedDuration(mediaDetails: any): string {
  if (!mediaDetails) return 'N/A';

  const { mediaType } = mediaDetails;

  if (mediaType === 'movie') {
    return mediaDetails.runtime ? formatRuntime(mediaDetails.runtime) : 'N/A';
  } else {
    return mediaDetails.number_of_seasons
      ? formatTVInfo(mediaDetails.number_of_seasons, mediaDetails.number_of_episodes)
      : 'N/A';
  }
}

/**
 * Gets detailed information for a specific media item
 *
 * @function getMediaDetails
 * @description Retrieves cached detailed information for a specific media item by ID.
 * Provides fast access to previously fetched media details without additional API
 * calls. Returns null if the media details haven't been fetched yet, allowing
 * components to handle loading states appropriately.
 *
 * @param {AnyMedia} media - The media item to get details for
 *
 * @returns {any | null} The detailed information object or null if not available in cache
 *
 * @example
 * // Get details for a single media item
 * const media = { id: 12345, name: 'Example Movie', media_type: 'movie' };
 * const details = getMediaDetails(media);
 *
 * if (details) {
 *   console.log(`Rating: ${details.contentRating}`);
 *   console.log(`Runtime: ${formatRuntime(details.runtime)}`);
 * } else {
 *   console.log('Details not yet loaded');
 * }
 *
 * @example
 * // Use in React component with loading state
 * function MediaDetailsComponent({ media }) {
 *   const details = getMediaDetails(media);
 *
 *   if (!details) {
 *     return <div>Loading details...</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <h3>{media.name}</h3>
 *       <p>Rating: {details.contentRating}</p>
 *       <p>Duration: {getFormattedDuration(details)}</p>
 *       <p>Genres: {details.genres.map(g => g.name).join(', ')}</p>
 *     </div>
 *   );
 * }
 *
 * @example
 * // Batch check for cached details
 * function getAvailableDetails(mediaList: AnyMedia[]) {
 *   return mediaList
 *     .map(media => ({ media, details: getMediaDetails(media) }))
 *     .filter(item => item.details !== null);
 * }
 */
export function getMediaDetails(media: AnyMedia): any {
  return detailsCache.get(media.id) || null;
}
