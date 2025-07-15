/**
 * Modal Animation System Utilities
 *
 * @module
 * @description Provides comprehensive utility functions for animating modal components through
 * various animation phases throughout the application. Handles the application of CSS transitions
 * and transforms to create smooth opening and closing animations with proper timeout management
 * for cleanup and memory leak prevention. Ensures consistent modal animation behavior across
 * all modal implementations.
 *
 * The module includes utilities for:
 * - Phase-based animation style application for modal elements
 * - Multi-element animation coordination (modal, info, tags)
 * - Animation sequence scheduling and timing management
 * - Timeout management for animation cleanup and resource management
 * - Component-specific animation managers for isolated control
 *
 * @requires ../constants/modal
 * @requires ../types/modal
 * @requires ./animations
 * @requires ./timeout
 */

// Constants
import { ANIMATION_TIMING, PHASE_SEQUENCE, PHASE_TIMING } from '@constants';

// Types
import type { AnimationPhase, TimeoutManager } from '@types';

// Generic animation utilities
import {
  createTransformTransition,
  createPropertyTransition,
  scheduleAnimationSequence,
  forceReflow,
} from './animations';

// Timeout management
import { createTimeoutManager } from './timeout';

// Global timeout manager for modal animations
const modalAnimationTimeoutManager: TimeoutManager = createTimeoutManager();

/**
 * Applies styles to the main modal element based on animation phase
 *
 * @function applyModalStyles
 * @description Updates the CSS styles of the modal container element based on the current
 * animation phase. Handles initial state setup, expanding animations with scale and opacity
 * transitions, and closing animations with delayed execution. Uses timeout management for
 * proper cleanup of delayed animations.
 *
 * @param {HTMLElement} modalElement - The modal element to style
 * @param {AnimationPhase} phase - The current animation phase determining which styles to apply
 *
 * @returns {void}
 *
 * @example
 * // Apply initial styles to modal
 * applyModalStyles(modalElement, 'initial');
 *
 * @example
 * // Start expanding animation
 * applyModalStyles(modalElement, 'expanding');
 *
 * @example
 * // Begin closing animation with delay
 * applyModalStyles(modalElement, 'closing');
 */
function applyModalStyles(modalElement: HTMLElement, phase: AnimationPhase): void {
  switch (phase) {
    case 'initial':
      modalElement.style.opacity = '0';
      modalElement.style.transform = 'scale(0.666667)';
      modalElement.style.transition = '';

      break;

    case 'expanding':
      modalElement.style.transition = createTransformTransition(ANIMATION_TIMING.EXPAND_DURATION);
      modalElement.style.opacity = '1';
      modalElement.style.transform = 'scale(1)';

      break;

    case 'closing':
      modalAnimationTimeoutManager.setTimeout(() => {
        if (!modalElement) return;

        modalElement.style.transition = createTransformTransition(ANIMATION_TIMING.EXIT_DURATION);
        modalElement.style.opacity = '0';
        modalElement.style.transform = 'scale(0.666667)';
      }, ANIMATION_TIMING.EXIT_DELAY);

      break;
  }
}

/**
 * Applies styles to the info element based on animation phase
 *
 * @function applyInfoStyles
 * @description Updates the CSS styles of the modal info section based on the current
 * animation phase. Handles opacity transitions for showing and hiding the info content
 * with smooth fade animations. Safely handles null elements when info section is not present.
 *
 * @param {HTMLElement | null} infoElement - The info element to style, or null if not present
 * @param {AnimationPhase} phase - The current animation phase determining which styles to apply
 *
 * @returns {void}
 *
 * @example
 * // Apply initial hidden state to info element
 * const infoEl = modal.querySelector('.preview-modal__info');
 * applyInfoStyles(infoEl, 'initial');
 *
 * @example
 * // Show info element with fade-in animation
 * applyInfoStyles(infoElement, 'showing-info');
 *
 * @example
 * // Hide info element during modal close
 * applyInfoStyles(infoElement, 'closing');
 */
function applyInfoStyles(infoElement: HTMLElement | null, phase: AnimationPhase): void {
  if (!infoElement) return;

  switch (phase) {
    case 'initial':
      infoElement.style.opacity = '0';

      break;

    case 'showing-info':
      infoElement.style.transition = createPropertyTransition(
        'opacity',
        ANIMATION_TIMING.FADE_DURATION
      );
      infoElement.style.opacity = '1';

      break;

    case 'closing':
      infoElement.style.opacity = '0';

      break;
  }
}

/**
 * Applies styles to the tags element based on animation phase
 *
 * @function applyTagsStyles
 * @description Updates the CSS styles of the modal tags section based on the current
 * animation phase. Handles opacity transitions for showing and hiding the tags content
 * with smooth fade animations. Safely handles null elements when tags section is not present.
 *
 * @param {HTMLElement | null} tagsElement - The tags element to style, or null if not present
 * @param {AnimationPhase} phase - The current animation phase determining which styles to apply
 *
 * @returns {void}
 *
 * @example
 * // Apply initial hidden state to tags element
 * const tagsEl = modal.querySelector('.preview-modal__tags');
 * applyTagsStyles(tagsEl, 'initial');
 *
 * @example
 * // Show tags element with fade-in animation
 * applyTagsStyles(tagsElement, 'showing-tags');
 *
 * @example
 * // Hide tags element during modal close
 * applyTagsStyles(tagsElement, 'closing');
 */
function applyTagsStyles(tagsElement: HTMLElement | null, phase: AnimationPhase): void {
  if (!tagsElement) return;

  switch (phase) {
    case 'initial':
      tagsElement.style.opacity = '0';

      break;

    case 'showing-tags':
      tagsElement.style.transition = createPropertyTransition(
        'opacity',
        ANIMATION_TIMING.FADE_DURATION
      );
      tagsElement.style.opacity = '1';

      break;

    case 'closing':
      tagsElement.style.opacity = '0';

      break;
  }
}

/**
 * Applies styles to modal elements based on the current animation phase
 *
 * @function applyAnimationStyles
 * @description Updates the CSS styles of a modal element and its children based on
 * the current animation phase. Coordinates animations across multiple modal components
 * including the main modal container, info section, and tags section. Delegates to
 * specialized functions for each element type to ensure consistent styling.
 *
 * @param {HTMLElement} modalElement - The modal element to animate
 * @param {AnimationPhase} animationPhase - The current phase of the animation
 *
 * @returns {void}
 *
 * @example
 * // Apply initial styles to all modal elements
 * applyAnimationStyles(modalElement, 'initial');
 *
 * @example
 * // Start expanding animation for all elements
 * applyAnimationStyles(modalElement, 'expanding');
 *
 * @example
 * // Show info section while keeping other elements visible
 * applyAnimationStyles(modalElement, 'showing-info');
 */
export function applyAnimationStyles(
  modalElement: HTMLElement,
  animationPhase: AnimationPhase
): void {
  if (!modalElement) return;

  // Get the info and tags elements
  const infoElement = modalElement.querySelector('.preview-info') as HTMLElement | null;
  const tagsElement = modalElement.querySelector('.evidence-tags') as HTMLElement | null;

  // Apply styles to each element based on the current phase
  applyModalStyles(modalElement, animationPhase);
  applyInfoStyles(infoElement, animationPhase);
  applyTagsStyles(tagsElement, animationPhase);
}

/**
 * Starts the animation sequence for the modal
 *
 * @function startAnimation
 * @description Initiates a multi-phase animation sequence for opening a modal.
 * Applies initial styles, forces a reflow to ensure proper rendering, and schedules
 * subsequent animation phases using the configured timing sequence. Uses requestAnimationFrame
 * for smooth animation initiation and scheduleAnimationSequence for phase coordination.
 *
 * @param {HTMLElement} modalElement - The modal element to animate
 * @param {boolean} isOpen - Whether the modal is open and should continue the animation sequence
 * @param {(phase: AnimationPhase) => void} setAnimationPhase - Function to update the animation phase state
 *
 * @returns {void}
 *
 * @example
 * // Start modal opening animation
 * startAnimation(
 *   modalElement,
 *   true,
 *   (phase) => setCurrentPhase(phase)
 * );
 *
 * @example
 * // Start animation with state management
 * const [animationPhase, setAnimationPhase] = useState('initial');
 * startAnimation(modalElement, isModalOpen, setAnimationPhase);
 */
export function startAnimation(
  modalElement: HTMLElement,
  isOpen: boolean,
  setAnimationPhase: (phase: AnimationPhase) => void
): void {
  if (!modalElement) return;

  // Make sure we're in the initial phase
  setAnimationPhase('initial');

  // Apply initial styles
  applyAnimationStyles(modalElement, 'initial');

  // Force a browser reflow to ensure initial state is rendered
  forceReflow(modalElement);

  // Start the animation sequence in the next frame
  requestAnimationFrame(() => {
    // Set the expanding phase
    setAnimationPhase('expanding');

    // Create animation steps from the phase sequence
    const animationSteps = PHASE_SEQUENCE.slice(2).map((phase, index) => ({
      callback: () => setAnimationPhase(phase),
      delay: PHASE_TIMING[PHASE_SEQUENCE[index + 1]],
    }));

    // Schedule the remaining phases
    scheduleAnimationSequence(animationSteps, isOpen);
  });
}

/**
 * Starts the exit animation sequence
 *
 * @function startExitAnimation
 * @description Initiates the animation sequence for closing a modal.
 * Sets the animation phase to "closing" and applies the corresponding styles
 * to begin the modal exit animation. Coordinates the closing of all modal
 * elements including the main container, info section, and tags section.
 *
 * @param {HTMLElement} modalElement - The modal element to animate
 * @param {(phase: AnimationPhase) => void} setAnimationPhase - Function to update the animation phase state
 *
 * @returns {void}
 *
 * @example
 * // Start modal closing animation
 * startExitAnimation(
 *   modalElement,
 *   (phase) => setCurrentPhase(phase)
 * );
 *
 * @example
 * // Start exit animation with cleanup
 * startExitAnimation(modalElement, setAnimationPhase);
 * // Additional cleanup can be performed after animation completes
 */
export function startExitAnimation(
  modalElement: HTMLElement,
  setAnimationPhase: (phase: AnimationPhase) => void
): void {
  if (!modalElement) return;

  setAnimationPhase('closing');
  applyAnimationStyles(modalElement, 'closing');
}
