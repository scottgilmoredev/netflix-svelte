/**
 * Modal Positioning System Utilities
 *
 * @module
 * @description Provides comprehensive utilities for calculating and managing modal positions
 * throughout the application. Handles positioning relative to trigger elements, viewport
 * constraints, edge detection, and transform origins. Ensures optimal modal placement
 * with intelligent edge case handling and responsive positioning strategies.
 *
 * The module includes utilities for:
 * - Viewport boundary calculations with responsive padding
 * - Position manager configuration and constraint handling
 * - Edge proximity detection and adjustment algorithms
 * - Temporary DOM element management for position calculation
 * - Horizontal position optimization for edge cases
 *
 * @requires ../constants/modal
 * @requires ../types/portal
 * @requires ../types/positioning
 * @requires ../types/modal
 * @requires ./positioning
 */

// Constants
import { EDGE_DETECTION, MODAL_DIMENSIONS, POSITION_CONSTANTS } from '@constants/modal';

// Types
import type {
  ComputedPosition,
  EdgeProximityResult,
  PortalPosition,
  PositionCalculationOptions,
  PositionManagerConfig,
  ViewportBoundaries,
} from '@types';

// Positioning system
import { createPositionManager, safeGetBoundingRect, viewportConstraint } from './positioning';

/**
 * Calculates viewport boundaries for content positioning
 *
 * @function calculateViewportBoundaries
 * @description Determines the safe content area within the viewport based on padding ratio.
 * Creates horizontal boundaries that ensure modal content remains within the visible area
 * while maintaining consistent spacing from viewport edges.
 *
 * @param {number} paddingRatio - Ratio of viewport width to use as padding (0-1)
 *
 * @returns {ViewportBoundaries} The calculated viewport boundaries with padding values
 *
 * @example
 * const boundaries = calculateViewportBoundaries(0.04); // 4% padding
 */
function calculateViewportBoundaries(paddingRatio: number): ViewportBoundaries {
  const viewportWidth = window.innerWidth;
  const horizontalPadding = viewportWidth * paddingRatio;

  return {
    horizontalPadding,
    leftEdge: horizontalPadding,
    rightEdge: viewportWidth - horizontalPadding,
  };
}

/**
 * Creates configuration for the position manager
 *
 * @function createPositionManagerConfig
 * @description Builds a configuration object for the position manager with appropriate
 * constraints and positioning strategy. Configures viewport constraints, offsets,
 * and transform origin calculations for optimal modal positioning. It now also
 * dynamically adjusts vertical padding based on the `verticalPadding` option,
 * allowing for disabling vertical clamping.
 *
 * @param {HTMLElement} sourceElement - The element that triggered the modal.
 * @param {PositionCalculationOptions} options - Positioning options and strategy,
 *   including `verticalPadding` to control vertical clamping.
 * @param {ViewportBoundaries} boundaries - Viewport boundaries for constraint application.
 *
 * @returns {PositionManagerConfig} Configuration object for the position manager.
 *
 * @example
 * // Example with default vertical clamping
 * const config1 = createPositionManagerConfig(
 *   triggerElement,
 *   { strategy: 'follow-trigger', offsetY: 10 },
 *   boundaries
 * );
 *
 * @example
 * // Example with no vertical clamping
 * const config2 = createPositionManagerConfig(
 *   triggerElement,
 *   { strategy: 'follow-trigger', offsetY: 10, verticalPadding: 'none' },
 *   boundaries
 * );
 *
 * @example
 * // Example with custom vertical padding
 * const config3 = createPositionManagerConfig(
 *   triggerElement,
 *   { strategy: 'follow-trigger', offsetY: 10, verticalPadding: 50 },
 *   boundaries
 * );
 */
function createPositionManagerConfig(
  sourceElement: HTMLElement,
  options: PositionCalculationOptions,
  boundaries: ViewportBoundaries
): PositionManagerConfig {
  // Determine vertical padding based on options
  let topPadding: number | null = POSITION_CONSTANTS.VERTICAL_EDGE_PADDING;
  let bottomPadding: number | null = POSITION_CONSTANTS.VERTICAL_EDGE_PADDING;

  if (options.verticalPadding === 'none') {
    topPadding = null;
    bottomPadding = null;
  }

  if (typeof options.verticalPadding === 'number') {
    topPadding = options.verticalPadding;
    bottomPadding = options.verticalPadding;
  }

  return {
    constraints: [
      viewportConstraint({
        padding: {
          left: boundaries.horizontalPadding,
          right: boundaries.horizontalPadding,
          top: topPadding,
          bottom: bottomPadding,
        },
      }),
    ],
    offset: { x: 0, y: options.offsetY || 0 },
    reference: sourceElement,
    strategy: options.strategy || 'follow-trigger',
    transformOrigin: true,
  };
}

/**
 * Creates and configures a temporary DOM element for position calculation
 *
 * @function createTemporaryElement
 * @description Creates a hidden DOM element with modal dimensions for position calculation.
 * The element is configured with exact modal dimensions and hidden visibility to enable
 * accurate position calculations without affecting the visual layout.
 *
 * @returns {HTMLElement} The configured temporary element with modal dimensions
 *
 * @example
 * const tempElement = createTemporaryElement();
 * document.body.appendChild(tempElement);
 * // Use for position calculation
 * document.body.removeChild(tempElement);
 */
function createTemporaryElement(): HTMLElement {
  const element = document.createElement('div');

  // Apply modal dimensions and positioning
  element.style.width = `${MODAL_DIMENSIONS.WIDTH}px`;
  element.style.height = `${MODAL_DIMENSIONS.HEIGHT}px`;
  element.style.position = 'absolute';
  element.style.visibility = 'hidden';

  return element;
}

/**
 * Calculates position using the positioning system
 *
 * @function calculateBasePosition
 * @description Uses the positioning system to calculate the base position for the modal.
 * Creates a temporary element, applies positioning constraints, and extracts computed
 * position values including transform origin for smooth animations.
 *
 * @param {HTMLElement} sourceElement - The element that triggered the modal
 * @param {PositionCalculationOptions} options - Positioning options and strategy
 * @param {ViewportBoundaries} boundaries - Viewport boundaries for constraints
 *
 * @returns {ComputedPosition} The calculated position data with coordinates and transform origin
 *
 * @example
 * const basePosition = calculateBasePosition(
 *   triggerElement,
 *   { strategy: 'follow-trigger' },
 *   boundaries
 * );
 */
function calculateBasePosition(
  sourceElement: HTMLElement,
  options: PositionCalculationOptions,
  boundaries: ViewportBoundaries
): ComputedPosition {
  // Create position manager configuration
  const config = createPositionManagerConfig(sourceElement, options, boundaries);
  const manager = createPositionManager(config);

  // Create temporary element for calculation
  const tempElement = createTemporaryElement();
  document.body.appendChild(tempElement);

  try {
    // Calculate position using positioning system
    manager.attach(tempElement, sourceElement);

    // Extract computed position
    const computedStyle = window.getComputedStyle(tempElement);

    return {
      left: Number.parseFloat(computedStyle.left),
      top: Number.parseFloat(computedStyle.top),
      transformOrigin: computedStyle.transformOrigin,
    };
  } finally {
    // Clean up DOM and manager
    document.body.removeChild(tempElement);
    manager.detach();
  }
}

/**
 * Determines if an element is positioned near the viewport edges
 *
 * @function detectEdgeProximity
 * @description Checks if the source element is close to the left or right viewport edges
 * based on configurable threshold values. Used to determine when special edge case
 * positioning adjustments should be applied.
 *
 * @param {DOMRect} sourceRect - Bounding rectangle of the source element
 * @param {ViewportBoundaries} boundaries - Viewport boundaries for edge detection
 *
 * @returns {EdgeProximityResult} Edge proximity detection results for left and right edges
 *
 * @example
 * const sourceRect = element.getBoundingClientRect();
 * const proximity = detectEdgeProximity(sourceRect, boundaries);
 * if (proximity.isNearLeftEdge) {
 *   // Apply left edge positioning
 * }
 */
function detectEdgeProximity(
  sourceRect: DOMRect,
  boundaries: ViewportBoundaries
): EdgeProximityResult {
  const leftThreshold = boundaries.leftEdge + EDGE_DETECTION.THRESHOLD;
  const rightThreshold = boundaries.rightEdge - EDGE_DETECTION.THRESHOLD;

  return {
    isNearLeftEdge: sourceRect.left < leftThreshold,
    isNearRightEdge: sourceRect.right > rightThreshold,
  };
}

/**
 * Adjusts horizontal position for edge cases
 *
 * @function adjustHorizontalPosition
 * @description Modifies the horizontal position when the source element is near viewport edges.
 * Applies intelligent positioning adjustments to ensure modal remains within viewport
 * boundaries while maintaining optimal alignment with the trigger element.
 *
 * @param {number} baseLeft - Base left position calculated by positioning system
 * @param {DOMRect} sourceRect - Bounding rectangle of the source element
 * @param {ViewportBoundaries} boundaries - Viewport boundaries for constraint application
 *
 * @returns {number} The adjusted left position optimized for edge cases
 *
 * @example
 * const adjustedLeft = adjustHorizontalPosition(
 *   computedPosition.left,
 *   sourceRect,
 *   boundaries
 * );
 */
function adjustHorizontalPosition(
  baseLeft: number,
  sourceRect: DOMRect,
  boundaries: ViewportBoundaries
): number {
  const { isNearLeftEdge, isNearRightEdge } = detectEdgeProximity(sourceRect, boundaries);
  const modalWidth = MODAL_DIMENSIONS.WIDTH;

  if (isNearLeftEdge) {
    // Align with left edge of the item, respecting content boundaries
    return Math.max(boundaries.leftEdge, sourceRect.left);
  }

  if (isNearRightEdge) {
    // Align with right edge of the item, respecting content boundaries
    return Math.min(boundaries.rightEdge - modalWidth, sourceRect.right - modalWidth);
  }

  // No adjustment needed for center-positioned elements
  return baseLeft;
}

/**
 * Validates input parameters for position calculation
 *
 * @function validateInputs
 * @description Ensures required parameters are valid before proceeding with calculation.
 * Performs null checks and basic validation to prevent errors during position calculation.
 *
 * @param {PortalPosition} position - The initial position information
 * @param {HTMLElement} sourceElement - The element that triggered the modal
 *
 * @returns {boolean} True if inputs are valid and calculation can proceed
 *
 * @example
 * if (validateInputs(position, sourceElement)) {
 *   // Proceed with position calculation
 * } else {
 *   // Handle invalid inputs
 *   return null;
 * }
 */
function validateInputs(position: PortalPosition, sourceElement: HTMLElement): boolean {
  return Boolean(position && sourceElement);
}

/**
 * Calculates the expanded position for the preview modal
 *
 * @function calculateExpandedPosition
 * @description Determines the optimal position for an expanded modal based on
 * the source element's position and viewport constraints. Uses a multi-step process
 * to calculate base position, apply edge-case adjustments, and ensure optimal
 * modal placement with smooth animations and responsive behavior.
 *
 * The calculation process includes:
 * - Input validation and source element measurement
 * - Viewport boundary calculation with responsive padding
 * - Base position calculation using the positioning system
 * - Edge proximity detection and horizontal adjustment
 * - Transform origin calculation for smooth animations
 *
 * @param {PortalPosition} position - The initial position information
 * @param {HTMLElement} sourceElement - The element that triggered the modal
 * @param {PositionCalculationOptions} [options={}] - Optional positioning configuration
 *
 * @returns {PortalPosition | null} The calculated position with coordinates and dimensions, or null if inputs are invalid
 *
 * @example
 * const position = calculateExpandedPosition(
 *   initialPosition,
 *   hoveredElement,
 *   { strategy: 'follow-trigger', offsetY: 10 }
 * );
 *
 * if (position) {
 *   // Apply position to modal
 *   modal.style.top = `${position.top}px`;
 *   modal.style.left = `${position.left}px`;
 *   modal.style.transformOrigin = position.transformOrigin;
 * }
 *
 * @example
 * const edgeCasePosition = calculateExpandedPosition(
 *   initialPosition,
 *   nearEdgeElement,
 *   { strategy: 'follow-trigger', padding: 0.06 }
 * );
 */
export function calculateExpandedPosition(
  position: PortalPosition,
  sourceElement: HTMLElement,
  options: PositionCalculationOptions = {}
): PortalPosition | null {
  // Validate inputs
  if (!validateInputs(position, sourceElement)) {
    return null;
  }

  // Get source element dimensions and position using the safe utility
  const sourceRect = safeGetBoundingRect(sourceElement); // MODIFIED

  if (!sourceRect) {
    console.warn('calculateExpandedPosition: Could not get bounding rect for source element.');
    return null;
  }

  // Calculate viewport boundaries
  const paddingRatio = options.padding || POSITION_CONSTANTS.DEFAULT_PADDING_RATIO;
  const boundaries = calculateViewportBoundaries(paddingRatio);

  // Calculate base position using positioning system
  const computedPosition = calculateBasePosition(sourceElement, options, boundaries);

  // Apply horizontal adjustments for edge cases
  const adjustedLeft = adjustHorizontalPosition(computedPosition.left, sourceRect, boundaries);

  // Return final position
  return {
    left: adjustedLeft,
    top: computedPosition.top,
    transformOrigin: computedPosition.transformOrigin,
    width: MODAL_DIMENSIONS.WIDTH,
  };
}
