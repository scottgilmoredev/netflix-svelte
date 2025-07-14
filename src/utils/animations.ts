/**
 * Animation System Utilities
 *
 * @module
 * @description Provides comprehensive utilities for creating and managing animations throughout
 * the positioning system. Handles CSS transitions, animation sequencing, DOM reflow management,
 * and consistent animation timing. Ensures smooth and performant animations across all
 * positioning components and modal interactions.
 *
 * The module includes utilities for:
 * - CSS transition string generation with consistent easing
 * - DOM reflow management for animation preparation
 * - Animation sequence scheduling and timing
 * - Property-specific transition configurations
 * - Timeout management for animation cleanup
 *
 * @requires ../types/positioning
 * @requires ./timeout
 */

// Types
import type { AnimatableProperty, AnimationStep, CSSEasing, TimeoutManager } from '@types';

// Utils
import { createTimeoutManager } from '@utils';

// Global timeout manager for animation sequences
const animationTimeoutManager: TimeoutManager = createTimeoutManager();

/**
 * Creates a CSS transition string for transform and opacity
 *
 * @function createTransformTransition
 * @description Generates a consistent CSS transition string for transform and opacity properties.
 * Uses optimized easing curves for smooth visual transitions commonly used in modal and
 * positioning animations.
 *
 * @param {number} duration - The transition duration in milliseconds
 * @param {CSSEasing} [easing="cubic-bezier(0.25, 0.46, 0.45, 0.94)"] - The easing function for smooth transitions
 *
 * @returns {string} The formatted CSS transition string for transform and opacity
 *
 * @example
 * const transition = createTransformTransition(300);
 * element.style.transition = transition;
 *
 * @example
 * const customTransition = createTransformTransition(500, 'ease-out');
 * element.style.transition = customTransition;
 */
export function createTransformTransition(
  duration: number,
  easing: CSSEasing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
): string {
  return `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
}

/**
 * Creates a CSS transition string for a single property
 *
 * @function createPropertyTransition
 * @description Generates a CSS transition string for a specified property with customizable
 * duration and easing. Useful for animating individual CSS properties with precise control
 * over timing and easing curves.
 *
 * @param {AnimatableProperty} property - The CSS property to transition
 * @param {number} duration - The transition duration in milliseconds
 * @param {CSSEasing} [easing="ease-in"] - The easing function for the transition
 *
 * @returns {string} The formatted CSS transition string for the specified property
 *
 * @example
 * const widthTransition = createPropertyTransition('width', 200, 'ease-out');
 * element.style.transition = widthTransition;
 *
 * @example
 * const backgroundTransition = createPropertyTransition('background-color', 150);
 * element.style.transition = backgroundTransition;
 */
export function createPropertyTransition(
  property: AnimatableProperty,
  duration: number,
  easing: CSSEasing = 'ease-in'
): string {
  return `${property} ${duration}ms ${easing}`;
}

/**
 * Forces a browser reflow
 *
 * @function forceReflow
 * @description Triggers a DOM reflow to ensure style changes are applied before animations.
 * Essential for ensuring that initial styles are computed before starting transitions,
 * preventing animation glitches and ensuring smooth visual effects.
 *
 * @param {HTMLElement} element - The element to force a reflow on
 *
 * @returns {void}
 *
 * @example
 * element.style.opacity = '0';
 * forceReflow(element);
 * element.style.transition = createTransformTransition(300);
 * element.style.opacity = '1';
 */
export function forceReflow(element: HTMLElement): void {
  void element.offsetHeight;
}

/**
 * Schedules a sequence of animation steps with timeout management
 *
 * @function scheduleAnimationSequence
 * @description Executes a series of animation steps with specified delays in sequence.
 * Provides precise control over complex animation timing and allows for conditional
 * execution based on application state. Uses the timeout manager for automatic cleanup
 * and memory leak prevention. Useful for orchestrating multi-step animations.
 *
 * @param {readonly AnimationStep[]} steps - Array of animation steps with callbacks and delays
 * @param {boolean} [shouldContinue=true] - Condition to continue the sequence execution
 *
 * @returns {void}
 *
 * @example
 * const animationSteps: AnimationStep[] = [
 *   { callback: () => element.style.opacity = '0.5', delay: 100 },
 *   { callback: () => element.style.transform = 'scale(1.1)', delay: 200 },
 *   { callback: () => element.style.opacity = '1', delay: 150 }
 * ];
 * scheduleAnimationSequence(animationSteps);
 *
 * @example
 * const conditionalSteps: AnimationStep[] = [
 *   { callback: () => showModal(), delay: 0 },
 *   { callback: () => animateIn(), delay: 50 }
 * ];
 * scheduleAnimationSequence(conditionalSteps, isVisible);
 */
export function scheduleAnimationSequence(
  steps: readonly AnimationStep[],
  shouldContinue: boolean = true
): void {
  if (!steps.length || !shouldContinue) return;

  const [currentStep, ...remainingSteps] = steps;

  animationTimeoutManager.setTimeout(() => {
    currentStep.callback();
    scheduleAnimationSequence(remainingSteps, shouldContinue);
  }, currentStep.delay);
}
