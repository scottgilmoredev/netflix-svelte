<script lang="ts">
  /**
   * MediaItemBase Component
   *
   * @component
   * @description Core foundation component for all media item displays that provides essential
   * functionality including image loading with error handling, preview modal integration, and
   * accessibility support. Features responsive sizing, keyboard navigation, and slot-based
   * content composition for specialized media item variants. Handles both backdrop and poster
   * image types with automatic fallback to placeholder images when content is unavailable.
   * Integrates with the preview modal system to provide hover-based content previews with
   * proper positioning and state management.
   *
   * @prop {string} [className=""] - Additional CSS class names for custom styling and theme integration
   * @prop {AnyMedia | null} [data=null] - Media data object containing image paths, titles, and metadata
   * @prop {number} [width=100] - Component width as a percentage for responsive grid layouts
   * @prop {string} [imageType="poster"] - Image type to display, either "backdrop" or "poster"
   *
   * @slot before-image - Content to display before the image (e.g., rank numbers, badges)
   * @slot default - Additional content to overlay or append to the media item
   *
   * @requires svelte/store
   * @requires ../../ui/Image.svelte
   * @requires @constants
   * @requires @stores
   * @requires @utils
   */

  import { onDestroy } from 'svelte';
  import type { Unsubscriber } from 'svelte/store';

  // Components
  import Image from '@components/ui/Image.svelte';

  // Constants
  import { IMAGE_BASE_URL, MEDIA_ITEM_DEFAULTS } from '@constants';

  // Stores
  import { openPreviewModal, previewModalStore } from '@stores';

  // Utils
  import { createTimeoutManager } from '@utils';

  /**
   * Props for the MediaItemBase component
   *
   * @interface {Object} MediaItemBaseProps
   * @property {string} [className] - CSS class names for styling customization
   * @property {AnyMedia | null} [data] - Media object with image paths and metadata
   * @property {string} [imageType] - Type of image to display from the media data
   * @property {number} [width] - Width percentage for responsive layout positioning
   */
  interface MediaItemBaseProps {
    className?: string;
    data?: any | null;
    imageType?: 'backdrop' | 'poster';
    width?: number;
  }

  export let className: MediaItemBaseProps['className'] = MEDIA_ITEM_DEFAULTS.className;
  export let data: MediaItemBaseProps['data'] = MEDIA_ITEM_DEFAULTS.data;
  export let imageType: MediaItemBaseProps['imageType'] = MEDIA_ITEM_DEFAULTS.imageType;
  export let width: MediaItemBaseProps['width'] = MEDIA_ITEM_DEFAULTS.width;

  let imagePath: string | null;
  let imageUrl: string | null;
  let preventReopenAfterKeyboardClose = false;
  let mediaItemElement: HTMLDivElement;
  let title: string;

  $: imagePath = imageType === 'backdrop' ? data?.backdrop_path : data?.poster_path;
  $: imageUrl = `${IMAGE_BASE_URL}${imagePath}`;
  $: title = data?.name || data?.original_name || '';

  /**
   * Subscription to preview modal store for keyboard close detection
   *
   * @description Monitors preview modal state changes to detect when the modal
   * is closed via keyboard while the mouse is still hovering over this specific
   * trigger element. Only sets the prevention flag if this MediaItem was the
   * source of the modal that was closed via keyboard, preventing the modal from
   * immediately reopening until the mouse leaves and re-enters the element.
   * Provides better user experience for keyboard navigation by avoiding conflicts
   * between keyboard and mouse interactions.
   *
   * @type {Unsubscriber}
   */
  const unsubscribe: Unsubscriber = previewModalStore.subscribe((state) => {
    // Detect keyboard close for this specific MediaItem only
    if (!state.isOpen && state.closedViaKeyboard && state.sourceElement === mediaItemElement) {
      preventReopenAfterKeyboardClose = true;
    }
  });

  /**
   * Component-specific timeout manager for modal animations
   * Provides isolated timeout management with automatic cleanup on component destruction
   */
  const timeoutManager = createTimeoutManager();

  /**
   * Handles mouse enter events to trigger preview modal
   *
   * @function handleMouseEnter
   * @description Initiates the preview modal display when the user hovers over the media
   * item. Tracks hover state and prevents modal from opening if it was previously closed
   * via keyboard while hovering. Passes the media data and the DOM element reference to
   * the modal system for proper positioning and content display. Only triggers if valid
   * media data is available and the modal wasn't keyboard-closed during the current hover.
   *
   * @returns {void}
   *
   * @example
   * // User hovers over media item
   * <div onmouseenter={handleMouseEnter}>
   *   <!-- Media content -->
   * </div>
   */
  function handleMouseEnter(): void {
    timeoutManager.setTimeout(() => {
      if (data && !preventReopenAfterKeyboardClose) {
        openPreviewModal(data, mediaItemElement);
      }
    }, 100);
  }

  /**
   * Handles mouse leave events to close preview modal
   *
   * @function handleMouseLeave
   * @description Closes the preview modal when the user moves the mouse away from the
   * media item. Provides clean interaction behavior by ensuring modals don't remain
   * open when the user is no longer hovering over the triggering element.
   *
   * @returns {void}
   *
   * @example
   * // User moves mouse away from media item
   * <div onmouseleave={handleMouseLeave}>
   *   <!-- Media content -->
   * </div>
   */
  function handleMouseLeave(): void {
    // Clear the pending open timeout
    timeoutManager.clearPendingTimeouts();
    preventReopenAfterKeyboardClose = false;
  }

  /**
   * Handles keyboard interactions for accessibility
   *
   * @function handleKeyDown
   * @description Processes keyboard events to provide accessible interaction with the
   * media item. Supports Enter and Space keys for triggering the preview modal,
   * ensuring the component is fully keyboard navigable for users who cannot use a mouse.
   * Prevents default Space key behavior to avoid page scrolling.
   *
   * @param {KeyboardEvent} event - The keyboard event object containing key information
   *
   * @returns {void}
   *
   * @example
   * // User presses Enter key
   * function handleEnterKey() {
   *   handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
   * }
   *
   * @example
   * // User presses Space key
   * function handleSpaceKey() {
   *   handleKeyDown(new KeyboardEvent('keydown', { key: ' ' }));
   * }
   */
  function handleKeyDown(event: KeyboardEvent): void {
    // Trigger the same action as mouseenter when user presses Enter or Space
    if (event.key === 'Enter' || event.key === ' ') {
      // Prevent page scroll on Space
      event.preventDefault();

      if (data) {
        openPreviewModal(data, mediaItemElement, true);
      }
    }
  }

  /**
   * Component cleanup on destruction
   *
   * @function onDestroy
   * @description Unsubscribes from the preview modal store when the component
   * is destroyed to prevent memory leaks and avoid callback execution on
   * unmounted components. Essential for proper resource management in
   * single-page applications.
   *
   * @returns {void}
   */
  onDestroy(() => {
    unsubscribe();
    timeoutManager.destroy();
  });
</script>

<!-- 
  Base media item with responsive sizing and accessibility support
  
  @example
  // Basic media item with poster image
  <MediaItemBase {data} />
  
  @example
  // Custom width with backdrop image
  <MediaItemBase {data} width={25} imageType="backdrop" />
  
  @example
  // With rank number slot
  <MediaItemBase {data}>
    <div slot="before-image" class="rank-number">1</div>
  </MediaItemBase>
-->
<div
  aria-label={`Preview details for ${title}`}
  class="media-item {className}"
  style="width: {width}%;"
  role="button"
  tabindex="0"
  bind:this={mediaItemElement}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  on:keydown={handleKeyDown}
>
  <!-- Slot for content before the image (e.g., rank number) -->
  <slot name="before-image" />

  <!-- Main media image, either backdrop or poster based on imageType prop -->
  <Image alt={title} className="media-item__image" responsive src={imageUrl} />

  <!-- Default slot for any additional content -->
  <slot />
</div>

<style>
  /* Block: Main media item container with responsive layout */
  .media-item {
    flex-shrink: 0;
    box-sizing: border-box;
    display: inline-block;
    padding: 0 var(--item-gap);
    position: relative;
    vertical-align: top;
  }

  /* Modifier: First child removes left padding for proper alignment */
  .media-item:first-child {
    padding-left: 0;
  }

  /* Only show focus styles when using keyboard navigation */
  .media-item:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  /* Fallback for browsers that don't support :focus-visible */
  .media-item:focus:not(:focus-visible) {
    outline: none;
  }

  /* Element: Media image with responsive sizing and styling */
  :global(.media-item__image) {
    border-radius: var(--item-gap);
    object-fit: cover;
  }
</style>
