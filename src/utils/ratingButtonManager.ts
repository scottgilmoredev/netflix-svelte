/**
 * Rating Button Position Management System
 *
 * @module
 * @description Provides comprehensive utilities for tracking and managing button positions
 * in the rating overlay component throughout the application. Handles button position
 * tracking, coordinate management, and state synchronization for coordinated animations
 * and interactive behaviors. Essential for maintaining button state during overlay
 * transitions and ensuring smooth animation sequences.
 *
 * The module includes utilities for:
 * - Button position tracking and state management
 * - Position-based filtering and retrieval operations
 * - Button collection management with add/remove operations
 * - State clearing and reset functionality for cleanup
 * - Coordinated animation support through position data
 *
 * @requires ../types/modal
 */

import type { RatingButtonPosition, RatingButtonTracker } from '@types';

/**
 * Creates a tracker for rating button positions
 *
 * @function createRatingButtonPositionTracker
 * @description Creates a comprehensive utility for tracking and managing rating button positions
 * within the overlay system. Provides a complete API for adding, retrieving, filtering, and
 * clearing button position data. Essential for coordinating button animations and maintaining
 * state consistency during overlay transitions and user interactions.
 *
 * The tracker maintains an internal collection of button position objects and provides
 * methods for efficient manipulation and retrieval. Supports position-based filtering
 * for targeted operations and bulk operations for state management.
 *
 * @returns {RatingButtonTracker} Object with comprehensive methods for managing button positions
 *
 * @example
 * // Creating and using a button tracker
 * const buttonTracker = createRatingButtonPositionTracker();
 * buttonTracker.addButton(leftButtonElement, 'left');
 * buttonTracker.addButton(rightButtonElement, 'right');
 * const allButtons = buttonTracker.getAllButtons();
 *
 * @example
 * // Using tracker for animation coordination
 * const tracker = createRatingButtonPositionTracker();
 * tracker.addButton(thumbsUpButton, 'left');
 * tracker.addButton(thumbsDownButton, 'right');
 *
 * // Animate all buttons
 * const buttons = tracker.getAllButtons();
 * animateButtons(buttons);
 *
 * @example
 * // Position-specific operations
 * const tracker = createRatingButtonPositionTracker();
 * tracker.addButton(leftBtn, 'left');
 * tracker.addButton(rightBtn, 'right');
 *
 * const leftButtons = tracker.getButtonsByPosition('left');
 * const rightButtons = tracker.getButtonsByPosition('right');
 */
export function createRatingButtonPositionTracker(): RatingButtonTracker {
  let buttons: RatingButtonPosition[] = [];

  /**
   * Add a button to the tracker
   *
   * @function addButton
   * @description Adds a button element and its position to the tracking system.
   * Creates a button position object that associates the DOM element with its
   * logical position within the rating interface. Supports null elements for
   * cases where buttons may not be present or loaded yet.
   *
   * @param {HTMLElement | null} element - The button element to track
   * @param {'left' | 'right' | 'center'} position - The button's logical position in the interface
   *
   * @returns {RatingButtonPosition} The created button position object with element and position data
   *
   * @example
   * const tracker = createRatingButtonPositionTracker();
   * const leftButton = tracker.addButton(thumbsUpElement, 'left');
   * console.log(leftButton.position); // 'left'
   *
   * @example
   * // Adding buttons with null check
   * const leftBtn = document.querySelector('.thumbs-up');
   * const rightBtn = document.querySelector('.thumbs-down');
   *
   * tracker.addButton(leftBtn, 'left');
   * tracker.addButton(rightBtn, 'right');
   */
  function addButton(
    element: HTMLElement | null,
    position: 'left' | 'right' | 'center'
  ): RatingButtonPosition {
    const buttonPosition: RatingButtonPosition = {
      element,
      position,
    };

    buttons = [...buttons, buttonPosition];

    return buttonPosition;
  }

  /**
   * Get all tracked buttons
   *
   * @function getAllButtons
   * @description Retrieves a copy of all currently tracked button positions.
   * Returns a new array to prevent external modification of the internal state
   * while providing access to all button position data for bulk operations
   * and animation coordination.
   *
   * @returns {Array<RatingButtonPosition>} Array of all button positions with elements and position data
   *
   * @example
   * const tracker = createRatingButtonPositionTracker();
   * tracker.addButton(leftBtn, 'left');
   * tracker.addButton(rightBtn, 'right');
   *
   * const allButtons = tracker.getAllButtons();
   * console.log(allButtons.length); // 2
   *
   * @example
   * // Using all buttons for animation
   * const buttons = tracker.getAllButtons();
   * buttons.forEach(({ element, position }) => {
   *   if (element) {
   *     animateButton(element, position);
   *   }
   * });
   */
  function getAllButtons(): RatingButtonPosition[] {
    return [...buttons];
  }

  /**
   * Get buttons by position
   *
   * @function getButtonsByPosition
   * @description Retrieves all button positions that match the specified logical position.
   * Provides filtered access to button collections based on their position within
   * the rating interface. Useful for position-specific operations and targeted
   * animations or state management.
   *
   * @param {'left' | 'right' | 'center'} position - The position to filter by
   *
   * @returns {Array<RatingButtonPosition>} Array of matching button positions
   *
   * @example
   * const tracker = createRatingButtonPositionTracker();
   * tracker.addButton(leftBtn1, 'left');
   * tracker.addButton(leftBtn2, 'left');
   * tracker.addButton(rightBtn, 'right');
   *
   * const leftButtons = tracker.getButtonsByPosition('left');
   * console.log(leftButtons.length); // 2
   *
   * @example
   * // Position-specific animation
   * const leftButtons = tracker.getButtonsByPosition('left');
   * const rightButtons = tracker.getButtonsByPosition('right');
   *
   * leftButtons.forEach(({ element }) => {
   *   if (element) element.style.transform = 'translateX(10px)';
   * });
   *
   * rightButtons.forEach(({ element }) => {
   *   if (element) element.style.transform = 'translateX(-10px)';
   * });
   */
  function getButtonsByPosition(position: 'left' | 'right' | 'center'): RatingButtonPosition[] {
    return buttons.filter((btn) => btn.position === position);
  }

  /**
   * Clear all tracked buttons
   *
   * @function clearButtons
   * @description Removes all button positions from the tracker, resetting it to an empty state.
   * Essential for cleanup operations when the overlay is closed or when resetting the
   * rating interface. Ensures no stale references are maintained and prepares the
   * tracker for reuse in subsequent interactions.
   *
   * @returns {void}
   *
   * @example
   * const tracker = createRatingButtonPositionTracker();
   * tracker.addButton(leftBtn, 'left');
   * tracker.addButton(rightBtn, 'right');
   *
   * console.log(tracker.getAllButtons().length); // 2
   * tracker.clearButtons();
   * console.log(tracker.getAllButtons().length); // 0
   *
   * @example
   * // Cleanup after overlay close
   * function closeOverlay() {
   *   animateOverlayClose();
   *   buttonTracker.clearButtons();
   *   resetOverlayState();
   * }
   */
  function clearButtons(): void {
    buttons = [];
  }

  return {
    addButton,
    getAllButtons,
    getButtonsByPosition,
    clearButtons,
  };
}
