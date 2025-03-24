<script lang="ts">
  /**
   * Banner Component
   *
   * @component
   * @description Displays a featured movie or TV show at the top of the page with
   * a background image, title, description, and action buttons. The component
   * automatically selects a random Netflix original from the store.
   *
   * @requires ../stores/movieStore
   * @requires ../constants/tmdb
   * @requires ../helpers
   */

  // Stores
  import type { Readable } from 'svelte/store';
  import { bannerMovie } from '../stores/movieStore';

  // Types
  import type { Movie } from '../types';

  // Utils
  import { IMAGE_BASE_URL } from '../constants/tmdb';
  import { truncate } from '../utils/helperUtils';

  /**
   * The current banner movie from the store
   * @type {Readable<Movie | null>}
   */
  const bannerMovieStore: Readable<Movie | null> = bannerMovie;

  /**
   * Reactive declaration for the banner background style
   *
   * @description Dynamically computes the CSS background-image style based on the
   * current banner movie. If no backdrop path is available, an empty string is used.
   */
  $: bannerStyle = $bannerMovieStore?.backdrop_path
    ? `background-image: url("${IMAGE_BASE_URL}${$bannerMovieStore.backdrop_path}");`
    : '';

  /**
   * Computes the title to display for the banner
   *
   * @description Returns the title of the movie, falling back to original_title if title is not available.
   *
   * @type {string}
   */
  $: bannerTitle = $bannerMovieStore?.name || $bannerMovieStore?.original_name || '';

  /**
   * Truncates and prepares the overview text for display
   *
   * @description Truncates the overview to 150 characters using the truncate helper function.
   *
   * @type {string}
   */
  $: bannerDescription = truncate($bannerMovieStore?.overview || '', 150);
</script>

<header
  class="banner"
  style="{bannerStyle} background-size: cover; background-position: center center;"
>
  <div class="banner__contents">
    <!-- Title of the movie or TV show. Fallbacks to name or original_name -->
    <h1 class="banner__title">
      {bannerTitle}
    </h1>

    <!-- Action buttons for the banner -->
    <div class="banner__buttons">
      <button class="banner__button">Play</button>
      <button class="banner__button">My List</button>
    </div>

    <!-- Description of the movie or TV show, truncated to 150 characters -->
    <h1 class="banner__description">
      {bannerDescription}
    </h1>
  </div>

  <!-- Gradient fade effect at the bottom of the banner -->
  <div class="banner--fadeBottom"></div>
</header>

<style>
  .banner {
    color: white;
    object-fit: contain;
    height: 448px;
    position: relative;
  }

  .banner__contents {
    margin-left: 30px;
    padding-top: 140px;
    height: 190px;
  }

  .banner__title {
    font-size: 3rem;
    font-weight: 800;
    padding-bottom: 0.3rem;
  }

  .banner__description {
    width: 45rem;
    line-height: 1.3;
    padding-top: 1rem;
    font-size: 0.8rem;
    max-width: 360px;
    height: 80px;
  }

  .banner__button {
    cursor: pointer;
    color: #fff;
    outline: none;
    border: none;
    font-weight: 700;
    border-radius: 0.2vw;
    padding-left: 2rem;
    padding-right: 2rem;
    margin-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    background-color: rgba(51, 51, 51, 0.5);
  }

  .banner__button:hover {
    color: #000;
    background-color: #e6e6e6;
    transition: all 0.2s;
  }

  .banner--fadeBottom {
    height: 7.4rem;
    background-image: linear-gradient(180deg, transparent, rgba(37, 37, 37, 0.61), #111);
    position: absolute;
    bottom: 0;
    width: 100%;
  }
</style>
