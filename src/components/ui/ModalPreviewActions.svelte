<script lang="ts">
  /**
   * ModalPreviewActions Component
   *
   * @component
   * @description Action buttons container for the preview modal featuring play, add to list,
   * thumbs up/down rating, and more info buttons. Implements Netflix-style circular action
   * buttons with hover states and tooltip integration. Provides primary and secondary button
   * styling variants with proper accessibility support and responsive design.
   *
   * @requires module:@actions/tooltip
   * @requires module:@components/icons/ChevronIcon
   * @requires module:@components/icons/Icon
   * @requires module:@components/ModalPreviewActionThumbs
   *
   * @example
   * <!-- Basic usage within a modal preview -->
   * <ModalPreviewActions />
   *
   * @example
   * <!-- Used within ModalPreview component -->
   * <div class="preview-modal__info-container">
   *   <ModalPreviewActions />
   *   <!-- Other modal content -->
   * </div>
   */

  // Actions
  import { tooltip } from '@actions/tooltip';

  // Components
  import ChevronIcon from '@components/icons/ChevronIcon.svelte';
  import Icon from '@components/icons/Icon.svelte';
  import ModalPreviewActionThumbs from './ModalPreviewActionsRating.svelte';

  // Types
  import type { MediaDetails } from '@types';

  /**
   * Props for the ModalPreviewActions component
   *
   * @interface ModalPreviewActionsProps
   * @property {"movie"|"tv"} [type] - Type of media content to determine action display
   */
  interface ModalPreviewActionsProps {
    type?: MediaDetails['mediaType'];
  }

  export let type: ModalPreviewActionsProps['type'] = 'movie';
</script>

<div class="preview-modal__actions">
  <!-- Play button - Primary action for media playback -->
  <button class="preview-modal__action-btn preview-modal__action-btn--primary">
    <Icon name="play" />
  </button>

  <!-- Add to my list - Secondary action for list management -->
  <button
    class="preview-modal__action-btn preview-modal__action-btn--secondary"
    use:tooltip={'Add to My List'}
  >
    <Icon name="plus" />
  </button>

  <!-- Thumbs up/down rating component with overlay functionality -->
  <ModalPreviewActionThumbs
    className="preview-modal__action-btn preview-modal__action-btn--secondary"
  />

  <!-- Expand to detail view - Secondary action positioned at far right -->
  <button
    class="preview-modal__action-btn preview-modal__action-btn--secondary"
    use:tooltip={type === 'movie' ? 'More Info' : 'Episodes & info'}
  >
    <ChevronIcon direction="down" style="--override-height: 1.25rem; --override-width: 1.25rem;" />
  </button>
</div>

<style>
  /* Actions container with flexbox layout for button arrangement */
  .preview-modal__actions {
    align-items: center;
    display: flex;
    margin-bottom: 0.5em;
    width: 100%;
  }

  /* Spacing for all action elements */
  :global(.preview-modal__actions > *) {
    margin: 0.25em;
  }

  /* Base action button styling with circular design */
  :global(.preview-modal__action-btn) {
    align-items: center;
    appearance: none;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    opacity: 1;
    padding: 0.5rem;
    position: relative;
    will-change: background-color, color;
  }

  /* Primary button modifier - Play button with dark text */
  .preview-modal__action-btn--primary {
    color: black;
  }

  /* Secondary button modifier - Standard action buttons with translucent background */
  :global(.preview-modal__action-btn--secondary) {
    background-color: rgba(42, 42, 42, 0.6);
    border-color: hsla(0, 0%, 100%, 0.5);
    border-width: 2px;
    color: #fff;
  }

  /* First button positioning - Remove left margin */
  .preview-modal__action-btn:first-child {
    margin-left: 0;
  }

  /* Last button positioning - Auto margin left for right alignment */
  .preview-modal__action-btn:last-child {
    margin-left: auto;
  }

  /* Secondary button hover state for enhanced interactivity */
  .preview-modal__action-btn--secondary:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: #fff;
  }
</style>
