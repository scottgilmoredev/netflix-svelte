/**
 * Overlay Animation System Utilities
 *
 * @module
 * @description Provides comprehensive animation functions specifically for the overlay
 * component throughout the application. Handles opening and closing animations with coordinated
 * button movements, custom easing implementations, and both CSS and JavaScript-based animation
 * strategies. Ensures smooth, performant animations with consistent timing and visual effects.
 *
 * The module includes utilities for:
 * - Custom cubic-bezier easing function implementations
 * - Frame-by-frame animation control with requestAnimationFrame
 * - CSS transition-based animations with custom easing
 * - Coordinated button movement animations during overlay transitions
 * - Animation sequence scheduling and timing management
 *
 * @requires ./animations
 * @requires ../types/thumbsOverlay
 * @requires ../constants/thumbsOverlay
 */

// Constants
import {
  RATING_ANIMATION_BEZIER_PARAMS,
  RATING_ANIMATION_EASING_CSS,
  RATING_ANIMATION_DURATION,
  RATING_BUTTON_SPACING,
} from '@constants';

// Types
import type { RatingButtonPosition, AnimationFrameCallback } from '@types';

// Utils
import {
  forceReflow,
  createTransformTransition,
  createPropertyTransition,
  scheduleAnimationSequence,
} from './animations';

/**
 * Custom cubic-bezier easing function
 *
 * @function customEasing
 * @description Implements the mathematical equivalent of cubic-bezier(0.5, 0, 0.1, 1) in JavaScript.
 * Used for frame-by-frame animations to ensure smooth motion with the same easing as CSS transitions.
 * Provides precise control over animation timing curves for consistent visual effects across
 * different animation implementations.
 *
 * @param {number} t - Input value between 0 and 1 representing linear animation progress
 *
 * @returns {number} Eased value between 0 and 1 representing adjusted animation progress
 *
 * @example
 * // Calculate eased progress at 50% of the animation
 * const easedValue = customEasing(0.5); // Returns approximately 0.78
 *
 * @example
 * // Use in animation loop
 * const progress = elapsed / duration;
 * const easedProgress = customEasing(progress);
 * element.style.opacity = String(easedProgress);
 */
function customEasing(t: number): number {
  const { x1, y1, x2, y2 } = RATING_ANIMATION_BEZIER_PARAMS;

  const t2 = t * t;
  const t3 = t2 * t;

  // Specialized implementation of cubic Bezier for this specific curve
  return 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t2 * x2 + t3 * y2;
}

/**
 * Runs an animation with custom easing
 *
 * @function runAnimation
 * @description Executes an animation using requestAnimationFrame with custom easing.
 * Handles the animation loop, timing calculations, and easing applications. Provides
 * precise frame-by-frame control over animation progress with smooth timing curves
 * and optional completion callbacks.
 *
 * @param {AnimationFrameCallback} frameCallback - Function to call on each animation frame with eased progress
 * @param {number} duration - Animation duration in milliseconds
 * @param {Function} [onComplete] - Optional callback to execute when animation completes
 *
 * @returns {void}
 *
 * @example
 * // Running a simple opacity animation
 * runAnimation(
 *   (eased) => {
 *     element.style.opacity = String(eased);
 *   },
 *   300,
 *   () => console.log('Animation complete')
 * );
 *
 * @example
 * // Running a complex transform animation
 * runAnimation(
 *   (eased) => {
 *     const scale = 0.8 + 0.2 * eased;
 *     element.style.transform = `scale(${scale})`;
 *   },
 *   500
 * );
 */
function runAnimation(
  frameCallback: AnimationFrameCallback,
  duration: number,
  onComplete?: () => void
): void {
  const startTime = performance.now();

  function step(currentTime: number): void {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = customEasing(progress);

    // Execute the frame callback with the eased progress
    frameCallback(eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else if (onComplete) {
      onComplete();
    }
  }

  requestAnimationFrame(step);
}

/**
 * Animate the overlay opening with CSS transitions
 *
 * @function animateThumbsOverlayOpenCSS
 * @description Animates the overlay using CSS transitions with custom easing.
 * Scales and fades in the overlay from a smaller size to full size with smooth
 * visual transitions. Uses CSS transitions for optimal performance and hardware
 * acceleration when available.
 *
 * @param {HTMLElement} element - The overlay element to animate
 * @param {number} [duration=RATING_ANIMATION_DURATION] - Animation duration in milliseconds
 *
 * @returns {void}
 *
 * @example
 * // Animate overlay opening with default duration
 * animateThumbsOverlayOpenCSS(overlayElement);
 *
 * @example
 * // Animate overlay opening with custom duration
 * animateThumbsOverlayOpenCSS(overlayElement, 500);
 */
export function animateThumbsOverlayOpenCSS(
  element: HTMLElement,
  duration: number = RATING_ANIMATION_DURATION
): void {
  // Reset to initial state
  element.style.opacity = '0';
  element.style.transform = 'translateX(-50%) translateY(-50%) scale(0.8)';

  // Clear any existing transitions
  element.style.transition = '';

  // Force a reflow to ensure the initial state is applied
  forceReflow(element);

  // Apply the transition with custom easing
  element.style.transition = createTransformTransition(duration, RATING_ANIMATION_EASING_CSS);
  element.style.opacity = '1';
  element.style.transform = 'translateX(-50%) translateY(-50%) scale(1)';
}

/**
 * Animate the overlay opening with JavaScript
 *
 * @function animateThumbsOverlayOpen
 * @description Animates the overlay using JavaScript with custom easing.
 * Provides frame-by-frame control over the animation for more complex scenarios
 * where CSS transitions may not provide sufficient control. Uses requestAnimationFrame
 * for smooth 60fps animations with custom timing curves.
 *
 * @param {HTMLElement} element - The overlay element to animate
 * @param {number} [duration=RATING_ANIMATION_DURATION] - Animation duration in milliseconds
 *
 * @returns {void}
 *
 * @example
 * // Animate overlay opening with JavaScript control
 * animateThumbsOverlayOpen(overlayElement);
 *
 * @example
 * // Animate overlay opening with custom duration
 * animateThumbsOverlayOpen(overlayElement, 400);
 */
export function animateThumbsOverlayOpen(
  element: HTMLElement,
  duration: number = RATING_ANIMATION_DURATION
): void {
  // Reset to initial state
  element.style.opacity = '0';
  element.style.transform = 'translateX(-50%) translateY(-50%) scale(0.8)';

  // Clear any existing transitions
  element.style.transition = '';

  // Force a reflow to ensure the initial state is applied
  forceReflow(element);

  // Run the animation
  runAnimation((eased) => {
    // Scale from 0.8 to 1
    const scale = 0.8 + 0.2 * eased;

    // Opacity from 0 to 1
    element.style.opacity = String(eased);
    element.style.transform = `translateX(-50%) translateY(-50%) scale(${scale})`;
  }, duration);
}

/**
 * Animate the overlay closing
 *
 * @function animateThumbsOverlayClose
 * @description Animates the overlay from visible to hidden with coordinated button movements.
 * Scales down and fades out the overlay while moving buttons toward the center in a
 * synchronized animation. Provides precise control over the closing sequence with
 * completion callbacks for cleanup operations.
 *
 * @param {HTMLElement} element - The overlay element to animate
 * @param {Array<RatingButtonPosition>} buttonPositions - Array of button position objects with elements and positions
 * @param {Function} onComplete - Callback function to execute when animation completes
 * @param {number} [duration=RATING_ANIMATION_DURATION] - Animation duration in milliseconds
 *
 * @returns {void}
 *
 * @example
 * // Animate overlay closing with button coordination
 * animateThumbsOverlayClose(
 *   overlayElement,
 *   buttonTracker.getAllButtons(),
 *   () => console.log('Overlay closed'),
 *   300
 * );
 *
 * @example
 * // Animate overlay closing with custom cleanup
 * animateThumbsOverlayClose(
 *   overlayElement,
 *   buttonPositions,
 *   () => {
 *     overlayElement.remove();
 *     resetButtonStates();
 *   }
 * );
 */
export function animateThumbsOverlayClose(
  element: HTMLElement,
  buttonPositions: Array<RatingButtonPosition>,
  onComplete: () => void,
  duration: number = RATING_ANIMATION_DURATION
): void {
  const transformMatrix = getComputedStyle(element).transform.split(',');
  const initialScale = transformMatrix.length > 3 ? Number.parseFloat(transformMatrix[3]) || 1 : 1;
  const initialOpacity = Number.parseFloat(getComputedStyle(element).opacity) || 1;

  // Get button elements
  const leftButton = buttonPositions.find((b) => b.position === 'left')?.element;
  const rightButton = buttonPositions.find((b) => b.position === 'right')?.element;

  // Calculate the distance to move (based on button width and gap)
  const buttonWidth = leftButton ? leftButton.offsetWidth : RATING_BUTTON_SPACING.defaultWidth;
  const gap = RATING_BUTTON_SPACING.gap;
  const moveDistance = buttonWidth + gap;

  // Run the animation
  runAnimation(
    (eased) => {
      // Scale from initialScale to 0.8
      const scale = initialScale - (initialScale - 0.8) * eased;

      // Opacity from initialOpacity to 0
      const opacity = initialOpacity - initialOpacity * eased;

      element.style.opacity = String(opacity);
      element.style.transform = `translateX(-50%) translateY(-50%) scale(${scale})`;

      // Move buttons toward center - only inward movement
      if (leftButton) {
        // Left button moves right (positive X)
        leftButton.style.transform = `translateX(${eased * moveDistance}px)`;
      }

      if (rightButton) {
        // Right button moves left (negative X)
        rightButton.style.transform = `translateX(${-eased * moveDistance}px)`;
      }
    },
    duration,
    onComplete
  );
}

/**
 * Animate the overlay closing with animation sequence
 *
 * @function animateThumbsOverlayCloseSequence
 * @description Animates the overlay using scheduleAnimationSequence for coordinated timing.
 * Provides an alternative implementation using CSS transitions and scheduled callbacks
 * for scenarios where precise timing control is needed. Uses CSS transitions for
 * performance while maintaining coordination between overlay and button animations.
 *
 * @param {HTMLElement} element - The overlay element to animate
 * @param {Array<RatingButtonPosition>} buttonPositions - Array of button position objects with elements and positions
 * @param {Function} onComplete - Callback function to execute when animation completes
 * @param {number} [duration=RATING_ANIMATION_DURATION] - Animation duration in milliseconds
 *
 * @returns {void}
 *
 * @example
 * // Animate overlay closing with sequence timing
 * animateThumbsOverlayCloseSequence(
 *   overlayElement,
 *   buttonTracker.getAllButtons(),
 *   () => console.log('Overlay closed'),
 *   300
 * );
 *
 * @example
 * // Animate overlay closing with custom sequence
 * animateThumbsOverlayCloseSequence(
 *   overlayElement,
 *   buttonPositions,
 *   () => {
 *     // Cleanup after animation
 *     resetOverlayState();
 *     updateUIState();
 *   },
 *   400
 * );
 */
export function animateThumbsOverlayCloseSequence(
  element: HTMLElement,
  buttonPositions: Array<RatingButtonPosition>,
  onComplete: () => void,
  duration: number = RATING_ANIMATION_DURATION
): void {
  // Get button elements
  const leftButton = buttonPositions.find((b) => b.position === 'left')?.element;
  const rightButton = buttonPositions.find((b) => b.position === 'right')?.element;

  // Calculate the distance to move (based on button width and gap)
  const buttonWidth = leftButton ? leftButton.offsetWidth : RATING_BUTTON_SPACING.defaultWidth;
  const gap = RATING_BUTTON_SPACING.gap;
  const moveDistance = buttonWidth + gap;

  // Apply transitions with custom easing
  element.style.transition = createTransformTransition(duration, RATING_ANIMATION_EASING_CSS);
  if (leftButton) {
    leftButton.style.transition = createPropertyTransition(
      'transform',
      duration,
      RATING_ANIMATION_EASING_CSS
    );
  }
  if (rightButton) {
    rightButton.style.transition = createPropertyTransition(
      'transform',
      duration,
      RATING_ANIMATION_EASING_CSS
    );
  }

  // Schedule the animation sequence
  scheduleAnimationSequence([
    {
      callback: () => {
        // Start animations
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50%) translateY(-50%) scale(0.8)';

        if (leftButton) {
          leftButton.style.transform = `translateX(${moveDistance}px)`;
        }
        if (rightButton) {
          rightButton.style.transform = `translateX(-${moveDistance}px)`;
        }
      },
      delay: 0,
    },
    {
      callback: onComplete,
      delay: duration,
    },
  ]);
}
