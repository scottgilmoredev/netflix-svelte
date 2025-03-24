<script lang="ts">
  /**
   * Media Item Component
   *
   * @component
   * @description Displays a single media item (movie or TV show) with its backdrop image.
   * Features a hover effect that scales the item for emphasis when the user interacts
   * with it. Handles image loading errors gracefully by falling back to a placeholder.
   * Supports customizable width and additional class names for styling flexibility.
   *
   * @prop {string} className - Additional CSS class names to apply to the component
   * @prop {Movie|null} data - The movie or TV show data to display
   * @prop {number} width - The width of the component as a percentage
   *
   * @requires ../constants
   * @requires ../types
   * @requires ../utils/errorUtils
   */

  // Constants
  import { IMAGE_BASE_URL, PLACEHOLDER_URL } from '../constants';

  // Types
  import type { Movie } from '../types';

  // Utils
  import { handleImageError } from '../utils/errorUtils';

  export let className: string = '';
  export let data: Movie | null = null;
  export let width: number = 20;

  $: imagePath = data?.backdrop_path;
  $: imageUrl = imagePath ? `${IMAGE_BASE_URL}${imagePath}` : null;
  $: name = data?.name || data?.original_name || '';
</script>

<div class={`media-item ${className}`} style={`width: ${width}%;`}>
  <img
    alt={name}
    class="media-item__image"
    src={imageUrl || PLACEHOLDER_URL}
    on:error={handleImageError}
  />
</div>

<style>
  .media-item {
    flex-shrink: 0;
    box-sizing: border-box;
    display: inline-block;
    padding: 0 var(--item-gap);
    position: relative;
    vertical-align: top;

    &:first-child {
      padding-left: 0;
    }
  }

  .media-item:hover {
    transform: scale(1.08);
    z-index: 2;
  }

  .media-item__image {
    border-radius: var(--item-gap);
    height: 100%;
    object-fit: cover;
    width: 100%;
  }
</style>
