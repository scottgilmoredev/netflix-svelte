/**
 * Modal Constants Module
 *
 * @module
 * @description Contains constants and configuration data for modal components throughout the application.
 * Provides animation timing, dimensions, positioning constraints, and overlay state management.
 * This module centralizes all modal-related constants to ensure consistency across modal components
 * including preview modals, rating overlays, and thumbs animations.
 *
 * The module includes timing configurations for smooth animations, dimensional constraints for
 * proper positioning, and state transition mappings for overlay components.
 *
 * @requires ../types/modal
 */

// Types
import type {
  AnimationPhase,
  AnimationTimingConfig,
  CSSEasing,
  EdgeDetectionConfig,
  ModalDimensionsConfig,
  OverlayTransitionsConfig,
  PositionConstantsConfig,
  PreviewTimingConfig,
  RatingAnimationBezierParams,
  RatingButtonSpacingConfig,
} from '@types';

/**
 * Animation Timing Configuration
 *
 * @constant
 * @type {AnimationTimingConfig}
 * @description Defines timing values in milliseconds for various modal animation phases.
 * Used throughout modal components to ensure consistent animation durations and delays.
 * Controls the pacing of expand, fade, info display, and exit animations.
 */
export const ANIMATION_TIMING: AnimationTimingConfig = {
  EXIT_DELAY: 67,
  EXIT_DURATION: 300,
  EXPAND_DURATION: 300,
  FADE_DELAY: 50,
  FADE_DURATION: 117,
  INFO_DELAY: 67,
  TAGS_DELAY: 67,
};

/**
 * Edge Detection Configuration
 *
 * @constant
 * @type {EdgeDetectionConfig}
 * @description Thresholds for determining when elements are near viewport edges.
 * Used by modal positioning logic to adjust placement when source elements are
 * close to screen boundaries, ensuring modals remain visible and properly positioned.
 */
export const EDGE_DETECTION: EdgeDetectionConfig = {
  THRESHOLD: 100,
} as const;

/**
 * Modal Dimensions
 *
 * @constant
 * @type {ModalDimensionsConfig}
 * @description Standard dimensions for modal components in pixels.
 * Defines the width and height used for preview modals and positioning calculations.
 * These dimensions ensure consistent modal sizing across the application.
 */
export const MODAL_DIMENSIONS: ModalDimensionsConfig = {
  WIDTH: 304,
  HEIGHT: 200,
};

/**
 * Overlay State Transitions
 *
 * @constant
 * @type {OverlayTransitionsConfig}
 * @description Defines valid state transitions for the rating overlay component.
 * Each state maps to an array of states that it can transition to, ensuring
 * proper state management and preventing invalid transitions in overlay animations.
 */
export const OVERLAY_TRANSITIONS: OverlayTransitionsConfig = {
  CLOSED: ['OPENING'],
  OPENING: ['OPEN', 'CLOSING'],
  OPEN: ['CLOSING'],
  CLOSING: ['CLOSED', 'OPENING'],
};

/**
 * Animation Phase Sequence
 *
 * @constant
 * @type {readonly AnimationPhase[]}
 * @description Defines the order of phases for a complete modal animation cycle.
 * Used to orchestrate the sequential display of modal elements during opening animations.
 */
export const PHASE_SEQUENCE: readonly AnimationPhase[] = [
  'initial',
  'expanding',
  'showing-info',
  'showing-tags',
  'complete',
];

/**
 * Phase Timing Map
 *
 * @constant
 * @type {Record<AnimationPhase, number>}
 * @description Maps each animation phase to its delay timing in milliseconds.
 * Controls when each phase of the modal animation sequence begins relative to the previous phase.
 */
export const PHASE_TIMING: Record<AnimationPhase, number> = {
  initial: 0,
  expanding: ANIMATION_TIMING.FADE_DELAY,
  'showing-info': ANIMATION_TIMING.TAGS_DELAY,
  'showing-tags': ANIMATION_TIMING.FADE_DURATION,
  complete: 0,
  closing: ANIMATION_TIMING.EXIT_DELAY,
};

/**
 * Position Constants
 *
 * @constant
 * @type {PositionConstantsConfig}
 * @description Configuration values for modal positioning calculations.
 * Defines padding ratios and edge constraints used by the positioning system
 * to ensure modals are placed appropriately within the viewport.
 */
export const POSITION_CONSTANTS: PositionConstantsConfig = {
  DEFAULT_PADDING_RATIO: 0.04,
  VERTICAL_EDGE_PADDING: 10,
};

/**
 * Preview Modal Timing
 *
 * @constant
 * @type {PreviewTimingConfig}
 * @description Timeout durations for preview modal hover interactions.
 * Controls how long users must hover before a modal opens and how long
 * after mouse leave before it closes, providing smooth user experience.
 */
export const PREVIEW_TIMING: PreviewTimingConfig = {
  OPEN_DELAY: 500,
  CLOSE_DELAY: 300,
};

/**
 * Rating Animation Bezier Parameters
 *
 * @constant
 * @type {RatingAnimationBezierParams}
 * @description Parameters for the cubic bezier curve used in rating overlay animations.
 * Equivalent to CSS cubic-bezier(0.5, 0, 0.1, 1) providing smooth, natural motion
 * for thumbs overlay animations with proper easing curves.
 */
export const RATING_ANIMATION_BEZIER_PARAMS: RatingAnimationBezierParams = {
  x1: 0.5,
  y1: 0,
  x2: 0.1,
  y2: 1,
};

/**
 * Rating Animation CSS Easing
 *
 * @constant
 * @type {CSSEasing}
 * @description CSS-compatible string representation of the cubic bezier curve.
 * Used for CSS transitions in the thumbs overlay animations, ensuring consistent
 * easing between JavaScript and CSS-based animations.
 */
export const RATING_ANIMATION_EASING_CSS: CSSEasing = `cubic-bezier(${RATING_ANIMATION_BEZIER_PARAMS.x1}, ${RATING_ANIMATION_BEZIER_PARAMS.y1}, ${RATING_ANIMATION_BEZIER_PARAMS.x2}, ${RATING_ANIMATION_BEZIER_PARAMS.y2})`;

/**
 * Rating Animation Duration
 *
 * @constant
 * @type {number}
 * @description Default duration for thumbs overlay animations in milliseconds.
 * Provides consistent timing for rating button animations and overlay transitions.
 */
export const RATING_ANIMATION_DURATION: number = 300;

/**
 * Rating Button Spacing Configuration
 *
 * @constant
 * @type {RatingButtonSpacingConfig}
 * @description Defines spacing values for buttons in the thumbs overlay.
 * Controls the gap between buttons and provides fallback dimensions when
 * actual button measurements cannot be determined dynamically.
 */
export const RATING_BUTTON_SPACING: RatingButtonSpacingConfig = {
  gap: 8,
  defaultWidth: 44,
};
