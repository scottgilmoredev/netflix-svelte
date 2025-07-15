<script lang="ts">
  /**
   * ModalPreview Component
   *
   * @component
   * @description A Netflix-style preview modal that appears when hovering over a media item.
   * Displays additional information about the media including backdrop image, title, ratings,
   * duration, genres, and quick action buttons. Features smooth animations for opening/closing
   * with proper timeout management and cleanup. Supports keyboard navigation and accessibility
   * features for screen readers.
   *
   * @requires module:svelte
   * @requires module:@actions/portal
   * @requires module:@components/icons/Icon
   * @requires module:@components/ModalPreviewActions
   * @requires module:@components/ModalPreviewEvidenceTags
   * @requires module:@components/ModalPreviewInfo
   * @requires module:@constants
   * @requires module:@stores
   * @requires module:@types
   * @requires module:@utils
   * @requires module:@utils/modalPositioning
   * @requires module:@utils/modalAnimations
   *
   * @example
   * <!-- Modal preview is controlled by the previewModalStore -->
   * <ModalPreview />
   *
   * @example
   * <!-- Store usage to trigger the modal -->
   * import { previewModalStore } from '@stores';
   *
   * function showPreview(media, position, sourceElement) {
   *   previewModalStore.open(media, position, sourceElement);
   * }
   */

  import { onDestroy } from 'svelte';

  // Actions
  import { portal } from '@actions/portal';

  // Components
  import ButtonModalClose from './ButtonModalClose.svelte';
  import Image from '@components/ui/Image.svelte';
  import ModalPreviewActions from './ModalPreviewActions.svelte';
  import ModalPreviewEvidenceTags from './ModalPreviewEvidenceTags.svelte';
  import ModalPreviewInfo from './ModalPreviewInfo.svelte';

  // Constants
  import { IMAGE_BASE_URL } from '@constants';

  // Stores
  import {
    cancelClosePreviewModal,
    closePreviewModal,
    closePreviewModalViaKeyboard,
    previewModalStore,
  } from '@stores';

  // Types
  import type { AnimationPhase, AnyMedia, MediaDetails, PortalPosition } from '@types';

  // Utils
  import { calculateExpandedPosition } from '@utils/modalPositioning';
  import {
    applyAnimationStyles,
    startAnimation,
    startExitAnimation,
    createTimeoutManager,
  } from '@utils';

  /**
   * Local state variables for modal management
   */
  let currentMediaId: number | null = null;
  let expandedPosition: PortalPosition | null = null;
  let media: AnyMedia | null = null;
  let mediaDetails: MediaDetails | null = null;
  let modalElement: HTMLElement | null = null;
  let openedViaKeyboard: boolean = false;
  let position: PortalPosition | null = null;
  let sourceElement: HTMLElement | null = null;

  /**
   * Animation state management
   */
  let animationPhase: AnimationPhase = 'initial';
  let isOpen = false;

  /**
   * Subscription to the preview modal store for state management
   * Handles modal opening/closing, media changes, and position calculations
   */
  const unsubscribe = previewModalStore.subscribe((state) => {
    const wasOpen = isOpen;
    const previousMediaId = currentMediaId;

    // Destructure and update component state from store
    ({ isOpen, media, mediaDetails, position, sourceElement, openedViaKeyboard } = state);

    // Track current media for change detection
    currentMediaId = media?.id || null;

    // Calculate expanded position when state changes
    if (position && sourceElement) {
      expandedPosition = calculateExpandedPosition(position, sourceElement);
    }

    // Handle animation state changes
    if (isOpen) {
      // Reset animation when opening or when media changes
      if (!wasOpen || (previousMediaId !== null && previousMediaId !== currentMediaId)) {
        setAnimationPhase('initial');
      }
    } else {
      // Reset state when modal is fully closed
      setAnimationPhase('initial');
    }
  });

  /**
   * Component-specific timeout manager for modal animations
   * Provides isolated timeout management with automatic cleanup on component destruction
   */
  const timeoutManager = createTimeoutManager();

  /**
   * Handles keyboard events for the modal container
   *
   * @function handleModalKeydown
   * @description Processes keyboard events on the modal container, specifically
   * handling Escape key to close the modal and return focus to the source element.
   *
   * @param {KeyboardEvent} event - The keyboard event object
   *
   * @returns {void}
   */
  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      closePreviewModalViaKeyboard();

      if (sourceElement) {
        sourceElement.focus();
      }
    }
  }

  /**
   * Handles close button activation
   *
   * @function handleCloseButton
   * @description Handles the close button event by closing the preview modal via keyboard
   * close function and returning focus to the source element that originally triggered
   * the modal. Ensures proper focus management for keyboard accessibility and prevents
   * modal from reopening while mouse is still hovering.
   *
   * @returns {void}
   */
  function handleCloseButton(): void {
    closePreviewModalViaKeyboard();

    if (sourceElement) {
      sourceElement.focus();
    }
  }

  /**
   * Handles mouse enter events on the modal
   *
   * @function handleMouseEnter
   * @description Cancels any pending close operations and handles animation state
   * when the user hovers over the modal. If the modal was in the process of closing,
   * it restarts the expanding animation to provide smooth user interaction.
   *
   * @returns {void}
   *
   * @example
   * // Used in template mouse event handler
   * onclick={handleMouseEnter}
   */
  function handleMouseEnter(): void {
    cancelClosePreviewModal();

    if (animationPhase === 'closing') {
      // If we were closing, restart the animation from where we are
      setAnimationPhase('expanding');
    }
  }

  /**
   * Handles mouse leave events on the modal
   *
   * @function handleMouseLeave
   * @description Initiates the modal closing sequence when the user stops hovering.
   * Triggers the close preview modal action and starts the exit animation sequence
   * for smooth visual feedback.
   *
   * @returns {void}
   *
   * @example
   * // Used in template mouse event handler
   * onclick={handleMouseLeave}
   */
  function handleMouseLeave(): void {
    closePreviewModal();

    if (modalElement) {
      startExitAnimation(modalElement, setAnimationPhase);
    }
  }

  /**
   * Updates the animation phase and applies corresponding styles to the modal element
   *
   * @function setAnimationPhase
   * @description Centralized function for managing animation phase transitions.
   * Updates the component's animation state and applies the corresponding CSS styles
   * to the modal element through the animation utilities system.
   *
   * @param {AnimationPhase} phase - The target animation phase to transition to
   *
   * @returns {void}
   *
   * @example
   * // Transition to expanding phase
   * setAnimationPhase('expanding');
   *
   * @example
   * // Start closing animation
   * setAnimationPhase('closing');
   */
  function setAnimationPhase(phase: AnimationPhase): void {
    animationPhase = phase;

    if (modalElement) {
      applyAnimationStyles(modalElement, phase);
    }
  }

  /**
   * Sets initial focus on the modal when it opens
   *
   * @function setInitialFocus
   * @description Moves focus to the modal container when the modal opens,
   * providing keyboard users with immediate access to modal functionality.
   *
   * @returns {void}
   */
  function setInitialFocus(): void {
    if (modalElement && openedViaKeyboard) {
      modalElement.focus();
    }
  }

  // Derived values
  let imagePath: string | null;
  let imageUrl: string | null;
  let title: string;

  $: imagePath = media?.backdrop_path ?? null;
  $: imageUrl = `${IMAGE_BASE_URL}${imagePath}`;
  $: title = media?.name || media?.original_name || '';

  // Watch for changes to trigger animations
  $: if (isOpen && modalElement && animationPhase === 'initial') {
    // Small delay to ensure DOM is ready using managed timeout
    timeoutManager.setTimeout(() => {
      if (modalElement) {
        startAnimation(modalElement, isOpen, setAnimationPhase);
        setInitialFocus();
      }
    }, 10);
  }

  /**
   * Cleanup function for component destruction
   * Unsubscribes from store and clears all managed timeouts to prevent memory leaks
   */
  onDestroy(() => {
    unsubscribe();
    timeoutManager.clearPendingTimeouts();
  });
</script>

<!-- 
  Modal preview container with portal positioning and accessibility attributes
  Only renders when modal is open and has valid media and position data
-->
{#if isOpen && media && expandedPosition}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <dialog
    aria-labelledby="preview-title"
    class="preview-modal"
    bind:this={modalElement}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    on:keydown={handleKeydown}
    use:portal={{ position: expandedPosition ?? undefined, zIndex: 1000 }}
    open={isOpen}
  >
    <div class="preview-modal__content">
      <!-- Image -->
      <div class="preview-modal__image-container">
        <Image alt={title} className="preview-modal__image" responsive src={imageUrl} />
      </div>

      <!-- Close button (hidden) -->
      <ButtonModalClose
        ariaLabel="Close preview modal"
        className="preview-modal__close"
        on:close={handleCloseButton}
      />

      <!-- Info -->
      <div class="preview-modal__info-container">
        <!-- Actions -->
        <ModalPreviewActions type={mediaDetails?.mediaType} />

        <!-- Title -->
        <h3 class="preview-modal__title" id="preview-title">{title}</h3>

        <!-- Detailed information -->
        {#if mediaDetails}
          <!-- Title info (rating, duration, quality) -->
          <ModalPreviewInfo details={mediaDetails} />

          <!-- Evidence tags (genres) -->
          <ModalPreviewEvidenceTags genres={mediaDetails.genres} />
        {/if}
      </div>
    </div>
  </dialog>
{/if}

<style>
  /* Main modal container with Netflix-style appearance */
  .preview-modal {
    background-color: #181818;
    border: none;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 10px;
    box-sizing: border-box;
    color: white;
    opacity: 0;
    outline: none;
    overflow: hidden;
    padding: 0;
    position: absolute;
    transform: scale(0.666667);
    transition:
      transform 240ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
      opacity 240ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform, opacity;
    z-index: 1000;
  }

  /* Only show focus styles when using keyboard navigation */
  .preview-modal:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  /* Fallback for browsers that don't support :focus-visible */
  .preview-modal:focus:not(:focus-visible) {
    outline: none;
  }

  /* Content wrapper for modal layout */
  .preview-modal__content {
    display: flex;
    flex-direction: column;
  }

  /* Backdrop image container with fixed aspect ratio */
  .preview-modal__image-container {
    position: relative;
    width: 100%;
    height: 170px;
  }

  /* Backdrop image with cover fit for consistent display */
  :global(.preview-modal__image) {
    object-fit: cover;
  }

  /* Information content container with padding */
  .preview-modal__info-container {
    padding: 1rem;
  }

  /* Modal title styling with proper hierarchy */
  .preview-modal__title {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: bold;
  }

  /* Global styles for action button icons */
  :global(.preview-modal__action-btn > svg) {
    height: 1.25rem;
    width: 1.25rem;
  }
</style>
