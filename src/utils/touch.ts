/**
 * Touch Utilities Module
 *
 * @module
 * @description Provides utilities for handling touch events and gestures.
 * Includes functions for detecting swipe directions and creating touch event handlers
 * that can be used in touch-enabled components.
 *
 * @requires ../types
 */

// Types
import type { SwipeHandlers } from '../types';

/**
 * Custom hook for touch swipe detection
 *
 * @function createTouchHandlers
 * @description Creates handlers and state for detecting swipe gestures
 *
 * @param {Function} onSwipeLeft - Callback for left swipe
 * @param {Function} onSwipeRight - Callback for right swipe
 * @param {number} [threshold=75] - Minimum distance to trigger swipe
 * @returns {Object} Object containing swipe state and event handlers
 *
 * @example
 * // In a Svelte component
 * const { state, handlers } = createTouchHandlers(
 *   () => actions.moveNext(),
 *   () => actions.movePrev()
 * );
 *
 * // Use in template
 * <div
 *   on:touchstart={handlers.handleTouchStart}
 *   on:touchmove={handlers.handleTouchMove}
 *   on:touchend={handlers.handleTouchEnd}
 * >
 *   <!-- Content -->
 * </div>
 */
export function createTouchHandlers(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  threshold: number = 75
): SwipeHandlers {
  let touchStart = 0;
  let touchEnd = 0;

  return {
    handleTouchStart: (e: TouchEvent) => {
      touchStart = e.targetTouches[0].clientX;
      e.preventDefault();
    },

    handleTouchMove: (e: TouchEvent) => {
      touchEnd = e.targetTouches[0].clientX;
      e.preventDefault();
    },

    handleTouchEnd: () => {
      // Swipe left (move to next)
      if (touchStart - touchEnd > threshold) {
        onSwipeLeft();
      }
      // Swipe right (move to previous)
      if (touchStart - touchEnd < -threshold) {
        onSwipeRight();
      }
    },
  };
}
