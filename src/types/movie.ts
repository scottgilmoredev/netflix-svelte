/**
 * Represents a movie object from the TMDB API
 *
 * @typedef {Object} Movie
 * @property {boolean} adult - Indicates if the movie is for adults
 * @property {string|null} backdrop_path - Path to the backdrop image
 * @property {number[]} genre_ids - Array of genre IDs associated with the movie
 * @property {number} id - Unique identifier for the movie
 * @property {string} original_language - Original language of the movie
 * @property {string} original_title - Original title of the movie
 * @property {string} overview - Brief description of the movie
 * @property {number} popularity - Popularity score of the movie
 * @property {string|null} poster_path - Path to the movie poster image
 * @property {string} release_date - Release date of the movie
 * @property {string} title - Title of the movie
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
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
