import type { Writable } from 'svelte/store';

/**
 * Union type for all media types
 */
export type AnyMedia = Media | MediaRanked | MediaWatched;

/**
 * Represents a media object from the TMDB API
 *
 * @interface BaseMedia
 * @property {MediaType} type - Discriminator field to identify the media type
 * @property {string|null} backdrop_path - Path to the backdrop image
 * @property {number} id - Unique identifier for the media
 * @property {string} name - name of the media
 * @property {string} original_name - Original name of the media
 * @property {string} overview - Brief description of the media
 * @property {string|null} poster_path - Path to the media poster image
 * @property {number} vote_average - Average vote rating
 */
export interface BaseMedia {
  type: MediaType;
  backdrop_path: string | null;
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
}

/**
 * Base props interface for all media item components
 *
 * @interface BaseMediaItemProps
 * @template T extends AnyMedia
 * @property {string} [className] - Additional CSS class names to apply to the component
 * @property {AnyMedia | null} data - The media data to display
 * @property {'backdrop' | 'poster'} [imageType] - Type of image to display
 * @property {number} [width] - Width as percentage of container
 */
export interface BaseMediaItemProps {
  className?: string;
  data: AnyMedia | null;
  imageType?: 'backdrop' | 'poster';
  width?: number;
}

/**
 * Standard media interface
 *
 * @interface Media
 * @extends BaseMedia
 */
export interface Media extends BaseMedia {
  type: 'standard';
}

/**
 * Represents a media content item in the carousel
 *
 * @interface MediaContent
 * @property {Media|null} data - The media data for this content item
 * @property {number} width - Width of the content item as a percentage
 */
export interface MediaContent {
  data: AnyMedia | null;
  width: number;
}

/**
 * Ranked media interface for top media
 *
 * @interface MediaRanked
 * @extends BaseMedia
 * @property {number} rank - Rank position (1-10)
 */
export interface MediaRanked extends BaseMedia {
  rank: number;
  type: 'ranked';
}

export interface MediaStore<T extends AnyMedia = AnyMedia> extends Writable<T[]> {
  displayTitle: string;
}

/**
 * Media Type Discriminator
 *
 * @type {string}
 * @description Used to discriminate between different media types
 */
export type MediaType = 'standard' | 'ranked' | 'watched';

/**
 * Watched media interface with progress information
 *
 * @interface MediaWatched
 * @extends BaseMedia
 * @property {number} progress - Percentage of the media that has been watched (0-80)
 */
export interface MediaWatched extends BaseMedia {
  progress: number;
  type: 'watched';
}

/**
 * Represents SVG data for rendering rank numbers
 *
 * @interface RankSvgData
 * @property {string} viewBox - SVG viewBox attribute value
 * @property {string} path - SVG path data for rendering the rank number
 */
export interface RankSvgData {
  viewBox: string;
  path: string;
}

/**
 * Valid Rank Number Type
 *
 * @type {(1|2|3|4|5|6|7|8|9|10)}
 * @description Represents the valid rank numbers that can be displayed in the rank SVG component.
 * Constrains values to integers between 1 and 10 inclusive, ensuring type safety when
 * working with rank numbers.
 */
export type RankSvgNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
