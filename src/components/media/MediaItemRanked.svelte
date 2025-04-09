<script lang="ts">
  /**
   * Ranked Media Item Component
   *
   * @component
   * @description Displays a ranked media item with its rank number and poster image.
   * The component is designed to show movies or TV shows in a ranked list format,
   * with the rank number prominently displayed alongside the poster image.
   *
   * @prop {string} className - Additional CSS class names to apply to the component
   * @prop {AnyMedia | null} data - The movie or TV show data to display, including rank information
   * @prop {number} width - The width of the component as a percentage
   *
   * @requires ./MediaItemBase.svelte
   * @requires ./MediaItemRankNumber.svelte
   * @requires module:@constants
   * @requires module:@types
   */

  // Components
  import MediaItemBase from './MediaItemBase.svelte';
  import MediaItemRankNumber from './MediaItemRankNumber.svelte';

  // Constants
  import { MEDIA_ITEM_DEFAULTS } from '@constants';

  // Types
  import type { BaseMediaItemProps } from '@types';

  export let className: BaseMediaItemProps['className'] = MEDIA_ITEM_DEFAULTS.className;
  export let data: BaseMediaItemProps['data'] = MEDIA_ITEM_DEFAULTS.data;
  export let width: BaseMediaItemProps['width'] = MEDIA_ITEM_DEFAULTS.width;

  $: rank = data && 'rank' in data ? data.rank : undefined;
</script>

<MediaItemBase className={`ranked-media-item ${className}`} {data} imageType="poster" {width}>
  <div slot="before-image" class="ranked-media-item__rank">
    <MediaItemRankNumber {rank} />
  </div>
</MediaItemBase>

<style>
  /* These styles apply to the slot content we're providing */
  .ranked-media-item__rank {
    bottom: 0;
    left: 0;
    position: absolute;
    right: auto;
    top: 0;
    width: 50%;
  }

  /* Use :global for styles that need to affect the MediaItemBase component */
  :global(.ranked-media-item) {
    aspect-ratio: 10 / 7;
    position: relative;
    overflow: hidden;
    border-radius: var(--item-gap);
  }

  :global(.ranked-media-item .media-item__image) {
    bottom: 0;
    height: 100%;
    left: auto;
    object-fit: cover;
    position: absolute;
    right: 0;
    top: 0;
    width: 50%;
  }
</style>
