/**
 * Media System Type Definitions
 *
 * @module
 * @description Provides comprehensive type definitions for the media system throughout
 * the application. Defines interfaces and types for media objects, component props,
 * store configurations, and ranking systems. Ensures type safety and consistency across
 * all media-related components, stores, and utilities in the application.
 *
 * The module includes type definitions for:
 * - Base media interfaces with TMDB API compatibility
 * - Media type discrimination and union types
 * - Component prop interfaces for media items and carousels
 * - Store interfaces for media data management
 * - Ranking system types with SVG rendering support
 * - Progress tracking for watched media content
 *
 * @requires svelte/store
 */

import type { Writable } from 'svelte/store';

/**
 * Union type for all media types
 */
export type AnyMedia = Media | MediaRanked | MediaWatched;

/**
 * Represents a media object from the TMDB API
 *
 * @interface BaseMedia
 * @property {string|null} backdrop_path - Path to the backdrop image
 * @property {number} id - Unique identifier for the media
 * @property {string} name - name of the media
 * @property {string} original_name - Original name of the media
 * @property {string} overview - Brief description of the media
 * @property {string|null} poster_path - Path to the media poster image
 * @property {MediaType} type - Discriminator field to identify the media type
 * @property {number} vote_average - Average vote rating
 */
export interface BaseMedia {
  backdrop_path: string | null;
  id: number;
  media_type: 'movie' | 'tv';
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  type: MediaType;
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
 * Genre information for media content
 *
 * @interface Genre
 * @property {number} id - Genre identifier
 * @property {string} name - Genre name
 */
export interface Genre {
  id: number;
  name: string;
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
 * Collection information for movies
 *
 * @interface MediaCollection
 * @property {number} id - Collection identifier
 * @property {string} name - Collection name
 * @property {string} poster_path - Collection poster image path
 * @property {string} backdrop_path - Collection backdrop image path
 */
export interface MediaCollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
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
 * Media details interface for processed media information
 *
 * @interface MediaDetails
 * @description Represents the processed media details structure containing
 * content rating, genre information, runtime details, and collection data.
 * Handles both movie and TV show specific properties with proper nullability.
 *
 * @property {MediaCollection|null} belongs_to_collection - Collection information for movies, null for TV shows or standalone movies
 * @property {string} contentRating - Content rating (e.g., "PG-13", "TV-14", "R")
 * @property {Genre[]} genres - Array of genre objects
 * @property {string|undefined} mediaTitleType - Media title type for TV shows, undefined for movies
 * @property {"movie"|"tv"} mediaType - Type of media content
 * @property {number|null} number_of_episodes - Number of episodes for TV shows, null for movies
 * @property {number|null} number_of_seasons - Number of seasons for TV shows, null for movies
 * @property {number|null} runtime - Runtime in minutes for movies, null for TV shows
 */
export interface MediaDetails {
  belongs_to_collection: MediaCollection | null;
  contentRating: string;
  genres: Genre[];
  mediaTitleType: string | undefined;
  mediaType: 'movie' | 'tv';
  number_of_episodes: number | null;
  number_of_seasons: number | null;
  runtime: number | null;
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
