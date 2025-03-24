<script lang="ts">
  /**
   * Ranked Media Item Component
   *
   * @component
   * @description Displays a ranked media item with its rank number and poster image.
   * The component is designed to show movies or TV shows in a ranked list format,
   * with the rank number prominently displayed alongside the poster image. Handles
   * image loading errors and supports customizable width.
   *
   * @prop {Movie|null} data - The movie or TV show data to display, including rank information
   * @prop {number} width - The width of the component as a percentage
   *
   * @requires ./MediaItemRankNumber.svelte
   * @requires ../constants
   * @requires ../types
   * @requires ../utils/errorUtils
   */

  // Components
  import MediaItemRankNumber from './MediaItemRankNumber.svelte';

  // Constants
  import { IMAGE_BASE_URL, PLACEHOLDER_URL } from '../constants';

  // Types
  import type { Movie } from '../types';

  // Utils
  import { handleImageError } from '../utils/errorUtils';

  export let data: Movie | null = null;
  export let width: number = 20;

  $: imagePath = data?.poster_path;
  $: imageUrl = imagePath ? `${IMAGE_BASE_URL}${imagePath}` : null;
  $: title = data?.name || data?.original_name || '';
</script>

<div class="ranked-media-item" style={`width: ${width}%;`}>
  <!-- Rank number SVG -->
  <div class="ranked-media-item__rank">
    <MediaItemRankNumber rank={data?.rank} />
  </div>

  <!-- Movie Poster Image -->
  <img
    alt={title}
    class="ranked-media-item__image"
    src={imageUrl || PLACEHOLDER_URL}
    on:error={handleImageError}
  />
</div>

<style>
  .ranked-media-item {
    aspect-ratio: 10 / 7;
    position: relative;
    flex-shrink: 0;
    overflow: hidden;
    padding: 0 var(--item-gap);
    box-sizing: border-box;
    border-radius: var(--item-gap);
  }

  .ranked-media-item__rank {
    bottom: 0;
    left: 0;
    position: absolute;
    right: auto;
    top: 0;
    width: 50%;
  }

  .ranked-media-item__image {
    bottom: 0;
    height: 100%;
    left: auto;
    -o-object-fit: cover;
    object-fit: cover;
    position: absolute;
    right: 0;
    top: 0;
    width: 50%;
  }
</style>
