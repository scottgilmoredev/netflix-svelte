<script lang="ts">
  /**
   * ModalPreviewActionsRatingOverlay Component
   *
   * @component
   * @description An animated overlay component that reveals rating options with smooth transitions
   * and sophisticated state management. Features Netflix-style hover behavior with proper focus
   * management, keyboard navigation, and accessibility support. The overlay positions itself
   * relative to the triggering thumbs button and provides three rating options: thumbs down,
   * thumbs up, and double thumbs up. Implements complex animation sequences for opening and
   * closing states with proper cleanup and race condition handling.
   *
   * @prop {OverlayState} overlayState - Current state of the overlay ('CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING')
   * @prop {HTMLButtonElement | null} [thumbButton=null] - Reference to the button that triggered the overlay for focus management
   *
   * @fires {CustomEvent<{ state: OverlayState }>} stateChange - Dispatched when the overlay state changes
   * @fires {CustomEvent<void>} close - Dispatched when the overlay should close
   *
   * @requires ../icons/DoubleThumbsUp.svelte
   * @requires ../icons/Icon.svelte
   * @requires ./RatingButton.svelte
   * @requires module:@constants
   * @requires module:@types
   * @requires module:@utils
   */

  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  // Components
  import ButtonModalClose from './ButtonModalClose.svelte';
  import DoubleThumbsUp from '@components/icons/DoubleThumbsUp.svelte';
  import Icon from '@components/icons/Icon.svelte';
  import RatingButton from './ButtonRating.svelte';

  // Constants
  import { OVERLAY_TRANSITIONS } from '@constants';

  // Types
  import type { OverlayState, RatingButtonPosition, RatingButtonTracker } from '@types';

  // Utils
  import {
    animateThumbsOverlayOpen,
    animateThumbsOverlayClose,
    createRatingButtonPositionTracker,
  } from '@utils';

  /**
   * Props for the ModalPreviewActionsRatingOverlay component
   *
   * @interface {Object} ModalPreviewActionsRatingOverlayProps
   * @property {OverlayState} overlayState - Current state of the overlay animation and visibility
   * @property {HTMLButtonElement | null} [thumbButton] - Reference to the triggering button for focus management
   */
  interface ModalPreviewActionsRatingOverlayProps {
    overlayState: OverlayState;
    thumbButton?: HTMLButtonElement | null;
  }

  export let overlayState: ModalPreviewActionsRatingOverlayProps['overlayState'];
  export let thumbButton: ModalPreviewActionsRatingOverlayProps['thumbButton'] = null;

  // DOM references
  let overlayElement: HTMLElement | null = null;

  // Button tracking state
  let buttonsInitialized = false;
  let buttonPositions: Array<RatingButtonPosition> = [];
  const buttonTracker: RatingButtonTracker = createRatingButtonPositionTracker();

  // Event dispatcher for parent communication
  const dispatch = createEventDispatcher<{
    stateChange: { state: OverlayState };
    close: void;
  }>();

  /**
   * Component mount handler with opening state check
   *
   * @function onMount
   * @description Initializes the overlay component when it mounts, checking if the overlay
   * is in the OPENING state and delegating to the appropriate handler function. The mount
   * handler ensures that overlays already in the opening state when the component mounts
   * are properly initialized.
   *
   * @returns {void}
   */
  onMount(() => {
    if (overlayState === 'OPENING') {
      handleOverlayOpening();
    }
  });

  /**
   * Handles close functionality for both escape key and close button
   *
   * @function handleClose
   * @description Centralized close logic that dispatches close event and manages
   * focus return to the triggering button. Used by both escape key handler and
   * close button keyboard handler.
   *
   * @returns {void}
   */
  function handleClose(): void {
    dispatch('close');

    if (thumbButton) {
      thumbButton.focus();
    }
  }

  /**
   * Handles keyboard interactions for accessibility and navigation
   *
   * @function handleKeyDown
   * @description Processes keyboard events to provide comprehensive keyboard navigation support.
   * Handles Escape key for closing the overlay and returning focus to the triggering button,
   * and arrow keys for navigating between rating options. Implements circular navigation
   * where arrow keys wrap around from the last to first option and vice versa.
   *
   * @param {KeyboardEvent} event - The keyboard event object containing key information
   *
   * @returns {void}
   *
   * @example
   * // Escape key closes overlay and returns focus
   * function handleEscape() {
   *   handleKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));
   * }
   *
   * @example
   * // Arrow keys navigate between rating buttons
   * function navigateRight() {
   *   handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
   * }
   */
  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      handleClose();
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      if (!overlayElement) return;

      const buttons = Array.from(
        overlayElement.querySelectorAll('.rating-overlay__options > button')
      );
      const currentIndex = buttons.findIndex((btn) => document.activeElement === btn);

      if (currentIndex >= 0) {
        let nextIndex;

        if (event.key === 'ArrowLeft') {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
        } else {
          nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
        }

        (buttons[nextIndex] as HTMLElement).focus();
        event.preventDefault();
      }
    }
  }

  /**
   * Handles mouse enter events to prevent premature overlay closing
   *
   * @function handleMouseEnter
   * @description Intercepts mouse enter events when the overlay is in a closing state and
   * reverses the closing animation to keep the overlay open. Provides smooth user experience
   * by allowing users to re-enter the overlay area during the closing animation without
   * having to wait for a complete close/reopen cycle.
   *
   * @returns {void}
   *
   * @example
   * // User moves mouse back into overlay while it's closing
   * <div onmouseenter={handleMouseEnter}>
   *   <!-- Overlay content -->
   * </div>
   */
  function handleMouseEnter(): void {
    if (overlayState === 'CLOSING') {
      transitionState('CLOSING', 'OPEN');

      if (overlayElement) {
        animateThumbsOverlayOpen(overlayElement, 150);
      }
    }
  }

  /**
   * Handles overlay closing state logic
   *
   * @function handleOverlayClosing
   * @description Manages the closing animation sequence with proper callback handling
   * for state transitions when the overlay transitions to the CLOSING state.
   *
   * @returns {void}
   */
  function handleOverlayClosing(): void {
    if (!overlayElement) return;

    animateThumbsOverlayClose(
      overlayElement,
      buttonPositions,
      () => dispatch('stateChange', { state: 'CLOSED' }),
      300
    );
  }

  /**
   * Handles overlay opening state logic
   *
   * @function handleOverlayOpening
   * @description Manages the opening animation, button tracking initialization, and focus management
   * when the overlay transitions to the OPENING state. Sets up button position tracking for
   * animation purposes and ensures proper focus management.
   *
   * @returns {void}
   */
  function handleOverlayOpening(): void {
    if (!overlayElement) return;

    animateThumbsOverlayOpen(overlayElement);

    if (!buttonsInitialized) {
      const buttons = overlayElement.querySelectorAll('.rating-overlay__options > button');

      if (buttons.length === 3) {
        buttonTracker.addButton(buttons[0] as HTMLElement, 'left');
        buttonTracker.addButton(buttons[1] as HTMLElement, 'center');
        buttonTracker.addButton(buttons[2] as HTMLElement, 'right');

        buttonPositions = buttonTracker.getAllButtons();
        buttonsInitialized = true;
      }
    }

    manageFocus();
  }

  /**
   * Manages state transitions with validation and event dispatching
   *
   * @function transitionState
   * @description Validates and executes state transitions according to the defined state machine
   * rules in OVERLAY_TRANSITIONS. Ensures only valid state transitions are allowed and dispatches
   * state change events to the parent component for synchronization. Prevents invalid state
   * transitions that could cause animation conflicts or inconsistent UI behavior.
   *
   * @param {OverlayState} currentState - The current state of the overlay
   * @param {OverlayState} newState - The desired new state to transition to
   *
   * @returns {boolean} True if the transition was successful, false if invalid
   *
   * @example
   * // Valid transition from OPENING to OPEN
   * const success = transitionState('OPENING', 'OPEN');
   * console.log(success); // true
   *
   * @example
   * // Invalid transition from CLOSED to OPEN (must go through OPENING)
   * const success = transitionState('CLOSED', 'OPEN');
   * console.log(success); // false
   */
  function transitionState(currentState: OverlayState, newState: OverlayState): boolean {
    if (OVERLAY_TRANSITIONS[currentState].includes(newState)) {
      dispatch('stateChange', { state: newState });

      return true;
    }

    return false;
  }

  /**
   * Manages focus for accessibility and keyboard navigation
   *
   * @function manageFocus
   * @description Sets focus to the first rating button in the overlay when it becomes visible.
   * Ensures proper keyboard navigation flow and accessibility compliance by providing a clear
   * focus target when the overlay opens. Essential for users navigating with keyboard or
   * assistive technologies.
   *
   * @returns {void}
   *
   * @example
   * // Called automatically when overlay opens
   * if (overlayState === 'OPENING') {
   *   manageFocus(); // Focus moves to first rating button
   * }
   */
  function manageFocus(): void {
    if (!overlayElement) return;

    const buttons = overlayElement.querySelectorAll('button');

    if (buttons.length > 0) {
      (buttons[0] as HTMLElement).focus();
    }
  }

  /**
   * Reactive statement for state-driven animation management
   *
   * @description Watches for changes in overlayState and overlayElement to trigger appropriate
   * animations and setup procedures based on the current overlay state.
   */
  $: if (overlayElement) {
    if (overlayState === 'OPENING') {
      handleOverlayOpening();
    } else if (overlayState === 'CLOSING') {
      handleOverlayClosing();
    }
  }

  /**
   * Component destruction cleanup
   *
   * @function onDestroy
   * @description Cleans up button tracking resources when the component is destroyed.
   * Prevents memory leaks by clearing all button references and position data stored
   * in the button tracker. Essential for proper resource management in single-page
   * applications where components are frequently mounted and unmounted.
   *
   * @returns {void}
   */
  onDestroy(() => {
    buttonTracker.clearButtons();
  });
</script>

<div
  aria-label="Rating options"
  class="rating-overlay"
  role="menu"
  tabindex="0"
  bind:this={overlayElement}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={() => dispatch('close')}
  on:keydown={handleKeyDown}
>
  <!-- Close button (hidden) -->
  <ButtonModalClose
    ariaLabel="Close rating overlay"
    className="rating-overlay__close-btn"
    on:close={handleClose}
  />

  <div class="rating-overlay__options">
    <!-- Thumb down -->
    <RatingButton label="Not for me" tooltipText="Not for me">
      <Icon name="thumbsUp" style="transform: rotate(180deg);" />
    </RatingButton>

    <!-- Thumb up -->
    <RatingButton label="I like this" tooltipText="I like this">
      <Icon name="thumbsUp" />
    </RatingButton>

    <!-- 2 thumbs up -->
    <RatingButton label="Love this!" tooltipText="Love this!">
      <DoubleThumbsUp />
    </RatingButton>
  </div>
</div>

<style>
  /* Main overlay container with Netflix-style dark theme and positioning */
  .rating-overlay {
    background-color: rgb(35, 35, 35);
    border-radius: 3em;
    box-shadow:
      0px 0px 2px 0px rgba(0, 0, 0, 0.6),
      0px 8px 16px 0px rgba(0, 0, 0, 0.5);
    left: 50%;
    top: 50%;
    padding: 6px 12px;
    position: absolute;
    transform: translateX(-50%) translateY(-50%) scale(0.8);
    transform-origin: center center;
    width: auto;
    z-index: 10;
    opacity: 0;
  }

  /* Rating options container with flexbox layout for button arrangement */
  .rating-overlay__options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }
</style>
