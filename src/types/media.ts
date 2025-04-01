/**
 * Represents a media content item in the carousel
 *
 * @interface MediaContent
 * @property {Movie|null} data - The movie data for this content item
 * @property {number} width - Width of the content item as a percentage
 */
export interface MediaContent {
  data: Movie | null;
  width: number;
}

/**
 * Generic props interface for all media item components
 *
 * @interface MediaItemProps
 * @property {string} [className] - Additional CSS class names to apply to the component
 * @property {T|null} data - The data to display
 * @property {number} [width] - Width of the component as a percentage
 */
export interface MediaItemProps<T> {
  className?: string;
  data: T | null;
  width?: number;
}

/**
 * Represents a movie object from the TMDB API
 *
 * @interface Movie
 * @property {boolean} adult - Indicates if the movie is for adults
 * @property {string|null} backdrop_path - Path to the backdrop image
 * @property {number[]} genre_ids - Array of genre IDs associated with the movie
 * @property {number} id - Unique identifier for the movie
 * @property {string} original_language - Original language of the movie
 * @property {string} original_name - Original name of the movie
 * @property {string} overview - Brief description of the movie
 * @property {number} popularity - Popularity score of the movie
 * @property {string|null} poster_path - Path to the movie poster image
 * @property {string} release_date - Release date of the movie
 * @property {string} name - name of the movie
 * @property {boolean} video - Indicates if it's a video
 * @property {number} vote_average - Average vote rating
 * @property {number} vote_count - Number of votes
 */
export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  rank?: number;
  name: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
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

/**
 * Represents a movie with watch progress information
 *
 * @interface WatchedMediaItem
 * @extends Movie
 * @property {number} progress - Percentage of the movie that has been watched (0-80)
 */
export interface WatchedMediaItem extends Movie {
  progress: number;
}

// Type aliases for specific component props
export type StandardMediaItemProps = MediaItemProps<Movie>;
export type WatchedMediaItemProps = MediaItemProps<WatchedMediaItem>;
