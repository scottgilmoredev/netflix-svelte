/**
 * Type Guards Utility Module
 *
 * @module
 * @description Provides type guard functions for discriminating between different media types.
 * These functions help TypeScript correctly narrow types when working with union types like AnyMedia.
 * Uses discriminated unions with the 'type' property for robust type checking.
 *
 * @requires ../types
 */

import type { AnyMedia, Media, MediaRanked, MediaWatched, MediaType } from '../types';

/**
 * Type factory function to create media objects with the correct type discriminator
 *
 * @function createMedia
 * @description Creates a media object with the appropriate type discriminator
 *
 * @template T - The specific media type
 * @param {Omit<T, 'type'>} data - The media data without the type field
 * @param {T['type']} type - The type discriminator
 * @returns {T} A properly typed media object
 *
 * @example
 * // Create a standard media object
 * const media = createMedia<Media>({ id: 1, name: 'Movie Title', ... }, 'standard');
 *
 * // Create a ranked media object
 * const MediaRanked = createMedia<MediaRanked>({ id: 1, name: 'Movie Title', rank: 1, ... }, 'ranked');
 */
export function createMedia<T extends AnyMedia>(data: Omit<T, 'type'>, type: T['type']): T {
  return {
    ...data,
    type,
  } as T;
}

/**
 * Type guard factory function for discriminated unions
 *
 * @function createTypeGuard
 * @description Creates a type guard function that checks the 'type' discriminator property
 *
 * @template T - The union type
 * @template S - The specific subtype to check for
 * @template D - The discriminator value
 *
 * @param {D} discriminator - The discriminator value to check for
 * @returns {(obj: T) => obj is S} A type guard function
 *
 * @example
 * // Create a type guard for MediaRanked
 * const isMediaRanked = createTypeGuard<AnyMedia, MediaRanked, 'ranked'>('ranked');
 */
export function createTypeGuard<T extends { type: MediaType }, S extends T, D extends MediaType>(
  discriminator: D
): (obj: T) => obj is Extract<T, { type: D }> {
  return (obj: T): obj is Extract<T, { type: D }> => {
    return obj.type === discriminator;
  };
}

/**
 * Type guard for standard Media objects
 *
 * @function isMedia
 * @description Checks if an object is a standard Media object using the type discriminator
 *
 * @param {AnyMedia} media - The media object to check
 * @returns {boolean} True if the object is a standard Media object
 *
 * @example
 * if (isMedia(item.data)) {
 *   // Handle standard media
 * }
 */
export const isMedia = createTypeGuard<AnyMedia, Media, 'standard'>('standard');

/**
 * Type guard for MediaRanked objects
 *
 * @function isMediaRanked
 * @description Checks if an object is a MediaRanked object using the type discriminator
 *
 * @param {AnyMedia} media - The media object to check
 * @returns {boolean} True if the object is a MediaRanked object
 *
 * @example
 * if (isMediaRanked(item.data)) {
 *   // Handle ranked media
 * }
 */
export const isRankedMedia = createTypeGuard<AnyMedia, MediaRanked, 'ranked'>('ranked');

/**
 * Type guard for MediaWatched objects
 *
 * @function isMediaWatched
 * @description Checks if an object is a MediaWatched object using the type discriminator
 *
 * @param {AnyMedia} media - The media object to check
 * @returns {boolean} True if the object is a MediaWatched object
 *
 * @example
 * if (isMediaWatched(item.data)) {
 *   // Handle watched media with progress
 * }
 */
export const isWatchedMedia = createTypeGuard<AnyMedia, MediaWatched, 'watched'>('watched');

/**
 * Safely determines the media type from the discriminator
 *
 * @function getMediaType
 * @description Returns the type of media object based on its discriminator
 *
 * @param {AnyMedia | null} media - The media object to check
 * @returns {MediaType | 'unknown'} The media type
 *
 * @example
 * const mediaType = getMediaType(item.data);
 * switch (mediaType) {
 *   case 'ranked': // Handle ranked media
 *   case 'watched': // Handle watched media
 *   case 'standard': // Handle standard media
 * }
 */
export function getMediaType(media: AnyMedia | null): MediaType | 'unknown' {
  if (!media) return 'unknown';
  return media.type;
}
