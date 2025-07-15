<script lang="ts">
  /**
   * ModalPreviewInfo Component
   *
   * @component
   * @description Displays detailed metadata information about media content in the preview modal
   * including content rating, formatted duration, and quality badge. Provides a clean, horizontal
   * layout of essential media information with consistent styling and proper accessibility support.
   * The component automatically formats duration data using external services and handles missing
   * or incomplete data gracefully with fallback values.
   *
   * @prop {Object | null} [details=null] - Media details object containing content rating and duration information
   * @prop {string} [qualityBadge="HD"] - Quality indicator badge text (e.g., "HD", "4K", "UHD")
   *
   * @requires ../../services/mediaDetailsService
   * @requires ../../types/media
   */

  // Services
  import { getFormattedDuration } from '@services';

  // Types
  import type { MediaDetails } from '@types';

  /**
   * Props for the ModalPreviewInfo component
   *
   * @interface {Object} ModalPreviewInfoProps
   * @property {MediaDetails | null} [details] - Media metadata object with rating and duration
   * @property {string} [qualityBadge] - Quality indicator text for the media
   */
  interface ModalPreviewInfoProps {
    details?: MediaDetails | null;
    qualityBadge?: string;
  }

  export let details: ModalPreviewInfoProps['details'] = null;
  export let qualityBadge: ModalPreviewInfoProps['qualityBadge'] = 'HD';

  // Content rating extracted from media details
  let contentRating: string;

  // Formatted duration information
  let durationInfo: string;

  $: contentRating = details?.contentRating || 'N/A';
  $: durationInfo = getFormattedDuration(details);
</script>

<div class="preview-info">
  <span class="preview-info__content-rating">{contentRating}</span>
  <span>{durationInfo}</span>
  <span class="preview-info__quality-badge">{qualityBadge}</span>
</div>

<style>
  /* Block: Main preview info container */
  .preview-info {
    align-items: center;
    display: flex;
    gap: 0.5em;
    margin: 0.8em 0;
    opacity: 0;
  }

  /* Element: Content rating badge */
  .preview-info__content-rating {
    border: 1px solid hsla(0, 0%, 100%, 0.4);
    overflow: hidden;
    padding: 0 0.4em;
  }

  /* Element: Quality indicator badge */
  .preview-info__quality-badge {
    border: 1px solid hsla(0, 0%, 100%, 0.4);
    border-radius: 3px;
    color: hsla(0, 0%, 100%, 0.9);
    font-size: 0.7em;
    padding: 0 0.5em;
  }
</style>
