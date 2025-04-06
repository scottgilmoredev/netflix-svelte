<script lang="ts">
  /**
   * Base Media Item Component
   *
   * @component
   * @description Core component for all media item displays. Handles common functionality
   * like image loading, error handling, and basic styling. Provides slots for specialized
   * content to be added by child components.
   *
   * @prop {string} className - Additional CSS class names to apply to the component
   * @prop {AnyMedia | null} data - The media data to display
   * @prop {number} width - The width of the component as a percentage
   * @prop {string} imageType - Type of image to display ('backdrop' or 'poster')
   *
   * @requires ../constants
   * @requires ../types
   * @requires ../utils/errorUtils
   */

  // Constants
  import { IMAGE_BASE_URL, MEDIA_ITEM_DEFAULTS, PLACEHOLDER_URL } from '../constants';

  // Types
  import type { BaseMediaItemProps } from '../types';

  // Utils
  import { handleImageError } from '../utils/errorUtils';

  export let className: BaseMediaItemProps['className'] = MEDIA_ITEM_DEFAULTS.className;
  export let data: BaseMediaItemProps['data'] = MEDIA_ITEM_DEFAULTS.data;
  export let imageType: BaseMediaItemProps['imageType'] = MEDIA_ITEM_DEFAULTS.imageType;
  export let width: BaseMediaItemProps['width'] = MEDIA_ITEM_DEFAULTS.width;

  // Determine image path based on imageType
  $: imagePath = imageType === 'backdrop' ? data?.backdrop_path : data?.poster_path;
  $: imageUrl = imagePath ? `${IMAGE_BASE_URL}${imagePath}` : null;
  $: title = data?.name || data?.original_name || '';
</script>

<div class={`media-item ${className}`} style={`width: ${width}%;`}>
  <!-- Slot for content before the image (e.g., rank number) -->
  <slot name="before-image" />

  <img
    alt={title}
    class="media-item__image"
    src={imageUrl || PLACEHOLDER_URL}
    on:error={handleImageError}
  />

  <!-- Default slot for any additional content -->
  <slot />
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
