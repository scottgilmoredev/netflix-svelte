/**
 * Represents touch event handlers for swipe detection
 *
 * @typedef {Object} SwipeHandlers
 * @property {function} handleTouchStart - Handler for touchstart event
 * @property {function} handleTouchMove - Handler for touchmove event
 * @property {function} handleTouchEnd - Handler for touchend event
 */
export interface SwipeHandlers {
  handleTouchStart: (e: TouchEvent) => void;
  handleTouchMove: (e: TouchEvent) => void;
  handleTouchEnd: () => void;
}

/**
 * Represents the state for touch swipe detection
 *
 * @typedef {Object} SwipeState
 * @property {number} touchStart - X-coordinate where touch started
 * @property {number} touchEnd - X-coordinate where touch ended
 * @property {boolean} swiping - Indicates if a swipe is in progress
 * @property {'left'|'right'|null} direction - Direction of the swipe, or null if no swipe detected
 */
export interface SwipeState {
  touchStart: number;
  touchEnd: number;
  swiping: boolean;
  direction: 'left' | 'right' | null;
}
