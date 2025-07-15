/**
 * Modal Types Module
 *
 * @module
 * @description Type definitions for modal components throughout the application.
 * Provides interfaces and types for animation phases, button tracking, viewport boundaries,
 * configuration objects, and state management. This module centralizes all modal-related
 * type definitions to ensure consistency across modal components including preview modals,
 * rating overlays, and thumbs animations.
 *
 * The module includes types for animation configurations, edge detection, overlay states,
 * and button positioning used by various modal and overlay components.
 */

/**
 * Animation Phase Type
 *
 * @type {AnimationPhase}
 * @description Defines the possible phases of modal animations.
 * Used to track and control the sequential display of modal elements during opening animations.
 */
export type AnimationPhase =
  | 'closing'
  | 'complete'
  | 'expanding'
  | 'initial'
  | 'showing-info'
  | 'showing-tags';

/**
 * Animation frame callback type
 *
 * @typedef {Function} AnimationFrameCallback
 * @description Function signature for animation frame callbacks
 * that receive the eased progress value.
 *
 * @param {number} eased - The eased progress value between 0 and 1
 */
export type AnimationFrameCallback = (eased: number) => void;

/**
 * Animation timing configuration interface
 *
 * @interface AnimationTimingConfig
 * @description Configuration object for modal animation timing values
 *
 * @property {number} EXIT_DELAY - Delay before exit animation starts
 * @property {number} EXIT_DURATION - Duration of exit animation
 * @property {number} EXPAND_DURATION - Duration of modal expand animation
 * @property {number} FADE_DELAY - Delay before fade animation starts
 * @property {number} FADE_DURATION - Duration of fade animation
 * @property {number} INFO_DELAY - Delay before info content appears
 * @property {number} TAGS_DELAY - Delay before tags content appears
 */
export interface AnimationTimingConfig {
  readonly EXIT_DELAY: number;
  readonly EXIT_DURATION: number;
  readonly EXPAND_DURATION: number;
  readonly FADE_DELAY: number;
  readonly FADE_DURATION: number;
  readonly INFO_DELAY: number;
  readonly TAGS_DELAY: number;
}

/**
 * Edge detection configuration interface
 *
 * @interface EdgeDetectionConfig
 * @description Configuration object for edge detection thresholds
 *
 * @property {number} THRESHOLD - Distance from viewport edge to consider an element "near" the edge
 */
export interface EdgeDetectionConfig {
  readonly THRESHOLD: number;
}

/**
 * Edge proximity detection results
 *
 * @interface EdgeProximityResult
 * @description Results of checking if an element is near viewport edges
 *
 * @property {boolean} isNearLeftEdge - True if element is near left edge
 * @property {boolean} isNearRightEdge - True if element is near right edge
 */
export interface EdgeProximityResult {
  isNearLeftEdge: boolean;
  isNearRightEdge: boolean;
}

/**
 * Modal dimensions configuration interface
 *
 * @interface ModalDimensionsConfig
 * @description Configuration object for modal dimensions
 *
 * @property {number} WIDTH - Modal width in pixels
 * @property {number} HEIGHT - Modal height in pixels
 */
export interface ModalDimensionsConfig {
  readonly WIDTH: number;
  readonly HEIGHT: number;
}

/**
 * Overlay state type
 *
 * @type {OverlayState}
 * @description Defines the possible states of the rating overlay.
 */
export type OverlayState = 'CLOSED' | 'OPENING' | 'OPEN' | 'CLOSING';

/**
 * Overlay state transitions configuration interface
 *
 * @interface OverlayTransitionsConfig
 * @description Configuration object for overlay state transitions
 *
 * @property {string[]} CLOSED - Closed state can only transition to opening
 * @property {string[]} OPENING - Opening state can transition to open or closing
 * @property {string[]} OPEN - Open state can only transition to closing
 * @property {string[]} CLOSING - Closing state can transition to closed or opening
 */
export interface OverlayTransitionsConfig {
  readonly CLOSED: readonly string[];
  readonly OPENING: readonly string[];
  readonly OPEN: readonly string[];
  readonly CLOSING: readonly string[];
}

/**
 * Position constants configuration interface
 *
 * @interface PositionConstantsConfig
 * @description Configuration object for positioning constants
 *
 * @property {number} DEFAULT_PADDING_RATIO - Default padding as a ratio of viewport width (4%)
 * @property {number} VERTICAL_EDGE_PADDING - Vertical padding from viewport edges in pixels
 */
export interface PositionConstantsConfig {
  readonly DEFAULT_PADDING_RATIO: number;
  readonly VERTICAL_EDGE_PADDING: number;
}

/**
 * Preview timing configuration interface
 *
 * @interface PreviewTimingConfig
 * @description Configuration object for preview modal timing
 *
 * @property {number} OPEN_DELAY - Delay before opening modal on hover
 * @property {number} CLOSE_DELAY - Delay before closing modal after mouse leave
 */
export interface PreviewTimingConfig {
  readonly OPEN_DELAY: number;
  readonly CLOSE_DELAY: number;
}

/**
 * Rating animation bezier parameters interface
 *
 * @interface RatingAnimationBezierParams
 * @description Configuration object for rating animation bezier curve parameters
 *
 * @property {number} x1 - First control point x-coordinate
 * @property {number} y1 - First control point y-coordinate
 * @property {number} x2 - Second control point x-coordinate
 * @property {number} y2 - Second control point y-coordinate
 */
export interface RatingAnimationBezierParams {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}

/**
 * Button position for thumbs overlay animations
 *
 * @interface RatingButtonPosition
 * @description Defines the structure for tracking button elements and their positions
 * within the thumbs overlay component. Used for coordinated animations.
 *
 * @property {HTMLElement | null} element - The button DOM element
 * @property {'left' | 'right' | 'center'} position - The button's position in the overlay
 *
 * @example
 * // Creating a button position object
 * const leftButton: RatingButtonPosition = {
 *   element: document.querySelector('.thumb-button-left'),
 *   position: 'left'
 * };
 */
export interface RatingButtonPosition {
  element: HTMLElement | null;
  position: 'left' | 'right' | 'center';
}

/**
 * Rating button spacing configuration interface
 *
 * @interface RatingButtonSpacingConfig
 * @description Configuration object for rating button spacing
 *
 * @property {number} gap - Gap between buttons in pixels
 * @property {number} defaultWidth - Default button width in pixels when actual width cannot be determined
 */
export interface RatingButtonSpacingConfig {
  readonly gap: number;
  readonly defaultWidth: number;
}

/**
 * Rating Button Tracker Interface
 *
 * @interface RatingButtonTracker
 * @description Interface for tracking and managing rating button elements and their positions.
 * Provides methods for adding, retrieving, and clearing button references used in overlay animations.
 *
 * @property {Function} addButton - Adds a button element with its position to the tracker
 * @property {Function} getAllButtons - Returns all tracked button positions
 * @property {Function} getButtonsByPosition - Returns buttons filtered by position
 * @property {Function} clearButtons - Removes all tracked buttons
 */
export interface RatingButtonTracker {
  addButton: (
    element: HTMLElement | null,
    position: 'left' | 'right' | 'center'
  ) => RatingButtonPosition;
  getAllButtons: () => RatingButtonPosition[];
  getButtonsByPosition: (position: 'left' | 'right' | 'center') => RatingButtonPosition[];
  clearButtons: () => void;
}

/**
 * Viewport boundaries for content positioning
 *
 * @interface ViewportBoundaries
 * @description Defines the safe content area within the viewport
 *
 * @property {number} horizontalPadding - Horizontal padding applied to viewport
 * @property {number} leftEdge - Left edge of content area
 * @property {number} rightEdge - Right edge of content area
 */
export interface ViewportBoundaries {
  readonly horizontalPadding: number;
  readonly leftEdge: number;
  readonly rightEdge: number;
}
