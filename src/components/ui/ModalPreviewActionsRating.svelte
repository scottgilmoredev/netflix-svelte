<script lang="ts">
  /**
   * ModalPreviewActionsRating Component
   *
   * @component
   * @description A thumbs up button with a hover overlay that reveals additional rating options.
   * Features a sophisticated state machine for overlay management with debounced hover interactions
   * and smooth animation transitions. Implements Netflix-style hover behavior with 300ms debounce
   * timing and automatic cleanup of timeouts to prevent memory leaks. The component manages
   * complex interaction states including opening, open, closing, and closed phases with proper
   * race condition handling.
   *
   * @prop {string} [className=""] - CSS class name to apply to the main button element
   *
   * @requires ../icons/Icon.svelte
   * @requires ../ui/ModalPreviewActionThumbsOverlay.svelte
   * @requires module:@utils/timeout
   * @requires module:@types/modal
   */

  // Actions
  import { onMount, onDestroy } from 'svelte';

  // Components
  import Icon from '@components/icons/Icon.svelte';
  import ModalPreviewActionThumbsOverlay from '@components/ui/ModalPreviewActionsRatingOverlay.svelte';

  // Types
  import type { OverlayState } from '@/types';

  // Utilities
  import { createTimeoutManager } from '@utils';

  /**
   * Props for the ModalPreviewActionsRating component
   *
   * @interface {Object} ModalPreviewActionThumbsProps
   * @property {string} [className] - CSS class name to apply to the main button element
   */
  interface ModalPreviewActionThumbsProps {
    className?: string;
  }

  export let className: ModalPreviewActionThumbsProps['className'] = '';

  // State machine
  let overlayState: OverlayState = 'CLOSED';
  let thumbButton: HTMLButtonElement | null = null;
  let thumbIcon: HTMLElement | null = null;

  // Track if component is mounted
  let isMounted = false;

  // Timeout manager instance
  const timeoutManager = createTimeoutManager();

  // Timeout IDs for individual clearing
  let hoverTimeoutId: number | null = null;
  let animationTimeoutId: number | null = null;

  /**
   * Component mount handler with timeout cleanup
   *
   * @function onMount
   * @description Sets the mounted flag to true to enable timeout operations and returns
   * a cleanup function that will execute when the component unmounts. The cleanup function
   * sets the mounted flag to false and clears all active timeouts managed by the timeout
   * manager to prevent memory leaks and callback execution on unmounted components.
   *
   * @returns {() => void} Cleanup function that sets isMounted to false and calls timeoutManager.clearPendingTimeouts()
   */
  onMount(() => {
    isMounted = true;

    return () => {
      isMounted = false;
      timeoutManager.clearPendingTimeouts();
    };
  });

  /**
   * Handles keyboard interactions for accessibility
   *
   * @function handleKeyDown
   * @description Processes keyboard events to provide accessible interaction with the component.
   * Supports Enter and Space keys for showing the overlay and Escape key for hiding it.
   * Ensures the component is fully keyboard navigable for users who cannot use a mouse.
   *
   * @param {KeyboardEvent} e - The keyboard event object
   *
   * @returns {void}
   *
   * @example
   * // Attached to keydown event
   * <div onkeydown={handleKeyDown} tabindex="0">Interactive element</div>
   */
  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      showOverlay();
    }

    if (e.key === 'Escape') {
      hideOverlay();
    }
  }

  /**
   * Handles overlay state change events from child component
   *
   * @function handleOverlayStateChange
   * @description Processes state change events dispatched by the overlay component to maintain
   * synchronization between parent and child component states. Ensures the overlay state
   * machine remains consistent across component boundaries.
   *
   * @param {CustomEvent<{ state: 'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING' }>} event - Custom event containing the new state
   *
   * @returns {void}
   *
   * @example
   * // Overlay component dispatches state changes
   * <ModalPreviewActionThumbsOverlay onstateChange={handleOverlayStateChange} />
   */
  function handleOverlayStateChange(
    event: CustomEvent<{ state: 'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING' }>
  ): void {
    overlayState = event.detail.state;
  }

  /**
   * Hides the overlay with proper cleanup and animation timing
   *
   * @function hideOverlay
   * @description Initiates the overlay hiding sequence with careful state management to avoid
   * race conditions. Handles cleanup of visual effects, manages the closing animation timing,
   * and ensures proper state transitions. Prevents interruption of opening animations while
   * allowing immediate reversal of closing animations.
   *
   * @returns {void}
   *
   * @example
   * // Triggered on mouse leave
   * <div onmouseleave={hideOverlay}>Hover me</div>
   *
   * @example
   * // Programmatic overlay hiding
   * function handleEscapeKey() {
   *   hideOverlay();
   * }
   */
  function hideOverlay(): void {
    // Don't clear animation timeout here to avoid race conditions
    if (hoverTimeoutId) {
      timeoutManager.clearTimeout(hoverTimeoutId);
      hoverTimeoutId = null;
    }

    // Remove the "active" class from the thumb icon
    if (thumbIcon) {
      thumbIcon.classList.remove('active');
    }

    // Don't proceed if already closed
    if (overlayState === 'CLOSED') return;

    // Don't interrupt opening animation
    if (overlayState === 'OPENING') return;

    // Set state to CLOSING if not already
    if (overlayState !== 'CLOSING') {
      overlayState = 'CLOSING';
    }

    // Clear any existing close timeout
    if (animationTimeoutId) {
      timeoutManager.clearTimeout(animationTimeoutId);
    }

    // After animation duration, fully close
    animationTimeoutId = timeoutManager.setTimeout(() => {
      if (!isMounted) return;

      // Set to CLOSED regardless of current state
      overlayState = 'CLOSED';
    }, 300);
  }

  /**
   * Shows the overlay with debounced timing and state management
   *
   * @function showOverlay
   * @description Initiates the overlay display sequence with Netflix-style 300ms debounce timing.
   * Handles complex state transitions including interrupting closing animations and preventing
   * duplicate operations. Applies visual feedback to the thumb icon and manages the opening
   * animation sequence with proper race condition handling.
   *
   * @returns {void}
   *
   * @example
   * // Triggered on mouse enter
   * <div onmouseenter={showOverlay}>Hover me</div>
   *
   * @example
   * // Programmatic overlay display
   * function handleButtonClick() {
   *   showOverlay();
   * }
   */
  function showOverlay(): void {
    // Clear existing timeouts
    if (hoverTimeoutId) timeoutManager.clearTimeout(hoverTimeoutId);
    if (animationTimeoutId) timeoutManager.clearTimeout(animationTimeoutId);

    hoverTimeoutId = null;
    animationTimeoutId = null;

    // If already open or opening, don't restart
    if (overlayState === 'OPEN' || overlayState === 'OPENING') return;

    // If closing, immediately reverse to open
    if (overlayState === 'CLOSING') {
      overlayState = 'OPEN';
      return;
    }

    // Apply the "active" class to the thumb icon for the snap effect
    if (thumbIcon) {
      thumbIcon.classList.add('active');
    }

    // Set debounce timeout (Netflix uses 300ms)
    hoverTimeoutId = timeoutManager.setTimeout(() => {
      if (!isMounted) return;

      overlayState = 'OPENING';

      // After a short delay, transition to fully open
      animationTimeoutId = timeoutManager.setTimeout(() => {
        if (!isMounted) return;

        if (overlayState === 'OPENING') {
          overlayState = 'OPEN';
        }
      }, 50);
    }, 300);
  }

  /**
   * Component destruction cleanup
   *
   * @function onDestroy
   * @description Clears all active timeouts managed by the timeout manager when the component
   * is destroyed. Provides a final safety net for timeout cleanup in addition to the onMount
   * cleanup function to ensure no timeouts remain active after component destruction.
   *
   * @returns {void}
   */
  onDestroy(() => {
    timeoutManager.clearPendingTimeouts();
  });
</script>

<div
  class="thumbs-button"
  role="button"
  tabindex="0"
  on:mouseenter={showOverlay}
  on:mouseleave={hideOverlay}
  on:keydown={handleKeyDown}
>
  <!-- Main Thumbs Up Button - always visible -->
  <button class={`${className}`} bind:this={thumbButton}>
    <div class="thumbs-button__icon" bind:this={thumbIcon}>
      <Icon name="thumbsUp" />
    </div>
  </button>

  <!-- Overlay component -->
  {#if overlayState !== 'CLOSED'}
    <ModalPreviewActionThumbsOverlay
      {overlayState}
      {thumbButton}
      on:close={hideOverlay}
      on:stateChange={handleOverlayStateChange}
    />
  {/if}
</div>

<style>
  /* Main thumbs button container with relative positioning for overlay placement */
  .thumbs-button {
    display: inline-block;
    position: relative;
  }

  /* Centers the thumbs icon with smooth transform transitions */
  .thumbs-button__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.1s ease-out;
  }
</style>
