/**
 * Positioning System
 *
 * @module
 * @description A declarative, composable system for positioning elements relative to others
 * or within the viewport. Handles strategies, constraints, and animations.
 *
 * @requires ../constants/modal
 * @requires ../constants/positioning
 * @requires ../types/positioning
 * @requires ../types/portal
 * @requires ./coordinates
 */

// Constants
import {
  DEFAULT_ANIMATION,
  DEFAULT_OFFSET,
  DEFAULT_PADDING,
  DEFAULT_STRATEGY,
  DEFAULT_Z_INDEX,
  NAV_HEIGHT,
  UPDATE_THROTTLE,
} from '@constants';

// Types
import type {
  Measurements,
  PortalPosition,
  PositionAction,
  PositionAnimation,
  PositionConfig,
  PositionConstraint,
  PositionPadding,
  PositioningStrategy,
} from '@types';

// Coordinate utilities
import {
  applyOffset,
  calculateCenteredPosition,
  constrainPosition,
  createDocumentPosition,
  documentToViewport,
  getElementCenterInDocument,
  getViewportCenterInDocument,
  viewportToDocument,
} from './coordinates';

/**
 * Safely extracts offset values with default fallbacks
 *
 * @function getOffsetValues
 * @description Normalizes offset configuration by providing default values for missing
 * x and y coordinates. Ensures consistent offset handling across all positioning strategies
 * and prevents undefined access errors.
 *
 * @param {Object} [offset] - Optional offset configuration
 * @param {number} [offset.x] - Horizontal offset in pixels
 * @param {number} [offset.y] - Vertical offset in pixels
 * @returns {Object} Normalized offset object with guaranteed x and y values
 *
 * @example
 * ```typescript
 * const userOffset = { x: 10 }; // y is missing
 * const { x, y } = getOffsetValues(userOffset);
 * ```
 */
function getOffsetValues(offset?: { x?: number; y?: number }): { x: number; y: number } {
  return {
    x: offset?.x ?? 0,
    y: offset?.y ?? 0,
  };
}

/**
 * Validates that an element is a valid HTML element
 *
 * @function validateElement
 * @description Checks if the provided element is a valid HTML element that can be measured and positioned
 *
 * @param {unknown} element - Element to validate
 * @param {string} elementName - Name of the element for error messages
 * @throws {Error} When element is invalid
 */
function validateElement(element: unknown, elementName: string): asserts element is HTMLElement {
  if (!element || !(element instanceof HTMLElement)) {
    throw new Error(`Invalid ${elementName}: must be a valid HTMLElement`);
  }

  if (!element.isConnected) {
    throw new Error(`Invalid ${elementName}: element must be connected to the DOM`);
  }
}

/**
 * Validates measurements object
 *
 * @function validateMeasurements
 * @description Ensures measurements object contains valid numeric values
 *
 * @param {Measurements} measurements - Measurements to validate
 * @throws {Error} When measurements are invalid
 */
function validateMeasurements(measurements: Measurements): void {
  const { viewport, element } = measurements;

  if (!viewport || typeof viewport.width !== 'number' || typeof viewport.height !== 'number') {
    throw new Error('Invalid measurements: viewport dimensions must be numeric');
  }

  if (!element || typeof element.width !== 'number' || typeof element.height !== 'number') {
    throw new Error('Invalid measurements: element dimensions must be numeric');
  }

  if (viewport.width <= 0 || viewport.height <= 0) {
    throw new Error('Invalid measurements: viewport dimensions must be positive');
  }

  if (element.width < 0 || element.height < 0) {
    throw new Error('Invalid measurements: element dimensions cannot be negative');
  }
}

/**
 * Safely gets element dimensions with error handling
 *
 * @function safeGetElementDimensions
 * @description Safely retrieves element dimensions with fallback values
 *
 * @param {HTMLElement} element - Element to measure
 * @returns {Object} Element dimensions with width and height
 */
function safeGetElementDimensions(element: HTMLElement): { width: number; height: number } {
  try {
    const width = element.offsetWidth || 0;
    const height = element.offsetHeight || 0;
    return { width, height };
  } catch (error) {
    console.warn('Failed to get element dimensions, using fallback values:', error);
    return { width: 0, height: 0 };
  }
}

/**
 * Safely gets element bounding rectangle with error handling
 *
 * @function safeGetBoundingRect
 * @description Safely retrieves element bounding rectangle with fallback values
 *
 * @param {HTMLElement} element - Element to measure
 * @returns {DOMRect | null} Bounding rectangle or null if measurement fails
 */
export function safeGetBoundingRect(element: HTMLElement): DOMRect | null {
  try {
    return element.getBoundingClientRect();
  } catch (error) {
    console.warn('Failed to get element bounding rectangle:', error);
    return null;
  }
}

/**
 * Safely gets viewport dimensions with error handling
 *
 * @function safeGetViewportDimensions
 * @description Safely retrieves viewport dimensions and scroll position with fallback values
 *
 * @returns {Object} Viewport dimensions and scroll position
 */
function safeGetViewportDimensions(): {
  width: number;
  height: number;
  scrollX: number;
  scrollY: number;
} {
  try {
    const { innerWidth, innerHeight, pageXOffset, pageYOffset } = window;

    return {
      width: innerWidth || document.documentElement.clientWidth || 1024,
      height: innerHeight || document.documentElement.clientHeight || 768,
      scrollX: pageXOffset || document.documentElement.scrollLeft || 0,
      scrollY: pageYOffset || document.documentElement.scrollTop || 0,
    };
  } catch (error) {
    console.warn('Failed to get viewport dimensions, using fallback values:', error);
    return {
      width: 1024,
      height: 768,
      scrollX: 0,
      scrollY: 0,
    };
  }
}

/**
 * Normalizes padding configuration
 *
 * @function normalizePadding
 * @description Converts padding input to a standardized padding object.
 * This function now correctly propagates `null` values for individual padding
 * properties, allowing specific edges to have their clamping disabled.
 * If a padding value is `undefined`, it falls back to the `DEFAULT_PADDING`.
 *
 * @param {PositionPadding | number | undefined} padding - Padding configuration.
 *   Can be a number (applies to all sides), an object with specific padding values,
 *   or `undefined`. Individual properties in `PositionPadding` can be `null`
 *   to disable clamping for that side.
 * @returns {PositionPadding} Normalized padding object.
 */
function normalizePadding(padding?: PositionPadding | number): PositionPadding {
  if (padding === undefined) {
    return { ...DEFAULT_PADDING };
  }

  if (typeof padding === 'number') {
    return {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding,
    };
  }

  return {
    top: getOrDefault(padding.top, DEFAULT_PADDING.top),
    right: getOrDefault(padding.right, DEFAULT_PADDING.right),
    bottom: getOrDefault(padding.bottom, DEFAULT_PADDING.bottom),
    left: getOrDefault(padding.left, DEFAULT_PADDING.left),
  };
}

/**
 * Retrieves a value or its default if the value is undefined.
 *
 * @function getOrDefault
 * @description A utility function that returns the provided `value` if it is not `undefined`.
 * If `value` is strictly `undefined`, it returns the `defaultValue` instead.
 * This is particularly useful for handling optional parameters or object properties
 * where `null` is a valid and intentional input that should be preserved,
 * while `undefined` indicates a missing value that should fall back to a default.
 *
 * @template T - The type of the value and default value.
 * @param {T | undefined} value - The value to check. Can be of type T, or `undefined`.
 * @param {T} defaultValue - The default value to return if `value` is `undefined`.
 *
 * @returns {T} The `value` if it's not `undefined`, otherwise the `defaultValue`.
 *
 * @example
 * // Example 1: Value is a number
 * const result1 = getOrDefault(10, 0); // result1 will be 10
 *
 * @example
 * // Example 2: Value is undefined
 * const result2 = getOrDefault(undefined, 0); // result2 will be 0
 *
 * @example
 * // Example 3: Value is null (should be preserved)
 * const result3 = getOrDefault(null, 0); // result3 will be null
 *
 * @example
 * // Example 4: With a string type
 * const result4 = getOrDefault("hello", "world"); // result4 will be "hello"
 *
 * @example
 * // Example 5: With an undefined string
 * const result5 = getOrDefault(undefined, "world"); // result5 will be "world"
 */
function getOrDefault<T>(value: T | undefined, defaultValue: T): T {
  return value !== undefined ? value : defaultValue;
}

/**
 * Normalizes animation configuration
 *
 * @function normalizeAnimation
 * @description Converts animation input to a standardized animation object
 *
 * @param {Partial<PositionAnimation> | boolean | undefined} animation - Animation configuration
 * @returns {PositionAnimation} Normalized animation object
 */
function normalizeAnimation(animation?: Partial<PositionAnimation> | boolean): PositionAnimation {
  if (animation === undefined || animation === true) {
    return { ...DEFAULT_ANIMATION };
  }

  if (animation === false) {
    return { ...DEFAULT_ANIMATION, enabled: false };
  }

  return {
    duration: animation.duration ?? DEFAULT_ANIMATION.duration,
    easing: animation.easing ?? DEFAULT_ANIMATION.easing,
    enabled: animation.enabled ?? DEFAULT_ANIMATION.enabled,
  };
}

/**
 * Normalizes position configuration
 *
 * @function normalizeConfig
 * @description Converts position config input to a standardized config object
 *
 * @param {Partial<PositionConfig>} config - Position configuration
 * @returns {PositionConfig} Normalized config object
 */
function normalizeConfig(config: Partial<PositionConfig>): PositionConfig {
  return {
    strategy: config.strategy ?? DEFAULT_STRATEGY,
    offset: config.offset ?? { ...DEFAULT_OFFSET },
    padding: normalizePadding(config.padding),
    animation: normalizeAnimation(config.animation),
    transformOrigin: config.transformOrigin ?? false,
    constraints: config.constraints ?? [viewportConstraint()],
    zIndex: config.zIndex ?? DEFAULT_Z_INDEX,
    reference: config.reference,
    customPosition: config.customPosition,
  };
}

/**
 * Validates inputs for measurement collection
 *
 * @function validateMeasurementInputs
 * @description Validates that required elements are valid before attempting measurements
 *
 * @param {HTMLElement} element - The element to position
 * @param {HTMLElement} [reference] - Optional reference element
 * @throws {Error} When required elements are invalid
 */
function validateMeasurementInputs(element: HTMLElement, reference?: HTMLElement): void {
  validateElement(element, 'target element');
  if (reference) {
    validateElement(reference, 'reference element');
  }
}

/**
 * Collects viewport measurements safely
 *
 * @function collectViewportMeasurements
 * @description Safely retrieves viewport dimensions and scroll position
 *
 * @returns {Object} Viewport measurements with width, height, and scroll position
 */
function collectViewportMeasurements(): {
  width: number;
  height: number;
  scrollX: number;
  scrollY: number;
} {
  return safeGetViewportDimensions();
}

/**
 * Collects element measurements safely
 *
 * @function collectElementMeasurements
 * @description Safely retrieves element dimensions
 *
 * @param {HTMLElement} element - Element to measure
 * @returns {Object} Element measurements with width and height
 */
function collectElementMeasurements(element: HTMLElement): { width: number; height: number } {
  return safeGetElementDimensions(element);
}

/**
 * Collects reference element measurements safely
 *
 * @function collectReferenceMeasurements
 * @description Safely retrieves reference element measurements if available
 *
 * @param {HTMLElement} [reference] - Optional reference element
 * @returns {Object | undefined} Reference measurements or undefined if not available
 */
function collectReferenceMeasurements(reference?: HTMLElement):
  | {
      width: number;
      height: number;
      left: number;
      top: number;
      right: number;
      bottom: number;
      centerX: number;
      centerY: number;
    }
  | undefined {
  if (!reference) {
    return undefined;
  }

  const rect = safeGetBoundingRect(reference);
  if (!rect) {
    console.warn('Failed to get reference element measurements, positioning may be inaccurate');
    return undefined;
  }

  return {
    width: rect.width,
    height: rect.height,
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
  };
}

/**
 * Builds the complete measurements object
 *
 * @function buildMeasurementsObject
 * @description Assembles all measurements into a single object and validates the result
 *
 * @param {Object} viewport - Viewport measurements
 * @param {Object} element - Element measurements
 * @param {Object} [reference] - Optional reference measurements
 * @returns {Measurements} Complete measurements object
 * @throws {Error} When measurements are invalid
 */
function buildMeasurementsObject(
  viewport: { width: number; height: number; scrollX: number; scrollY: number },
  element: { width: number; height: number },
  reference?: {
    width: number;
    height: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
    centerX: number;
    centerY: number;
  }
): Measurements {
  const measurements: Measurements = {
    viewport,
    element,
  };

  if (reference) {
    measurements.reference = reference;
  }

  validateMeasurements(measurements);
  return measurements;
}

/**
 * Gets all measurements needed for positioning
 *
 * @function getMeasurements
 * @description Collects viewport, element, and reference measurements.
 * All measurements are in document coordinates for consistent positioning.
 *
 * @param {HTMLElement} element - The element to position
 * @param {HTMLElement} [reference] - Optional reference element
 * @returns {Measurements} All measurements needed for positioning
 * @throws {Error} When required elements are invalid
 */
function getMeasurements(element: HTMLElement, reference?: HTMLElement): Measurements {
  validateMeasurementInputs(element, reference);
  const viewport = collectViewportMeasurements();
  const elementMeasurements = collectElementMeasurements(element);
  const referenceMeasurements = collectReferenceMeasurements(reference);

  return buildMeasurementsObject(viewport, elementMeasurements, referenceMeasurements);
}

/**
 * Calculates viewport constraint boundaries
 *
 * @function calculateConstraintBoundaries
 * @description Determines the min/max positions for element placement within the viewport.
 * This function now supports `null` values for individual padding properties,
 * which effectively disables clamping for that specific edge by setting the
 * corresponding boundary to `Infinity` or `-Infinity`.
 *
 * @param {number} viewportWidth - Viewport width in pixels.
 * @param {number} viewportHeight - Viewport height in pixels.
 * @param {number} elementWidth - Element width in pixels.
 * @param {number} elementHeight - Element height in pixels.
 * @param {PositionPadding} padding - Normalized padding configuration. Can include `null`
 *   for `top`, `right`, `bottom`, or `left` to disable clamping on that side.
 *
 * @returns {Object} Constraint boundaries with `minLeft`, `maxLeft`, `minTop`, and `maxTop`.
 *   These values can be `Infinity` or `-Infinity` if clamping is disabled for an edge.
 */
function calculateConstraintBoundaries(
  viewportWidth: number,
  viewportHeight: number,
  elementWidth: number,
  elementHeight: number,
  padding: PositionPadding
): {
  minLeft: number;
  maxLeft: number;
  minTop: number;
  maxTop: number;
} {
  // If padding.left is null, set minLeft to -Infinity. Otherwise, use padding.left or default.
  const minLeft = padding.left === null ? -Infinity : padding.left ?? DEFAULT_PADDING.left;
  // If padding.right is null, set maxLeft to Infinity. Otherwise, use calculated value.
  const maxLeft =
    padding.right === null
      ? Infinity
      : viewportWidth - elementWidth - (padding.right ?? DEFAULT_PADDING.right);

  // If padding.top is null, set minTop to -Infinity. Otherwise, use padding.top or default.
  const minTop = padding.top === null ? -Infinity : padding.top ?? DEFAULT_PADDING.top;
  // If padding.bottom is null, set maxTop to Infinity. Otherwise, use calculated value.
  const maxTop =
    padding.bottom === null
      ? Infinity
      : viewportHeight - elementHeight - (padding.bottom ?? DEFAULT_PADDING.bottom);

  return {
    minLeft,
    maxLeft,
    minTop,
    maxTop,
  };
}

/**
 * Creates a viewport constraint function
 *
 * @function viewportConstraint
 * @description Creates a constraint function that keeps elements within the viewport.
 * Uses coordinate utilities for clean separation of coordinate system concerns.
 *
 * @param {Object} [options] - Constraint options
 * @param {PositionPadding | number} [options.padding] - Padding configuration
 * @returns {PositionConstraint} Constraint function
 */
export function viewportConstraint(
  options: { padding?: PositionPadding | number } = {}
): PositionConstraint {
  return (
    position: PortalPosition,
    measurements: Measurements,
    config: PositionConfig
  ): PortalPosition => {
    try {
      const padding = normalizePadding(options.padding ?? config.padding);
      const { viewport, element } = measurements;

      // Convert to document coordinates for processing
      const documentPos = createDocumentPosition(position.left ?? 0, position.top ?? 0);

      // Convert to viewport coordinates for constraint checking
      const viewportPos = documentToViewport(documentPos, viewport.scrollX, viewport.scrollY);

      // Calculate constraint boundaries
      const boundaries = calculateConstraintBoundaries(
        viewport.width,
        viewport.height,
        element.width,
        element.height,
        padding
      );

      // Apply constraints in viewport space
      const constrainedViewportPos = constrainPosition(viewportPos, boundaries);

      // Convert back to document coordinates
      const constrainedDocumentPos = viewportToDocument(
        constrainedViewportPos,
        viewport.scrollX,
        viewport.scrollY
      );

      return {
        ...position,
        left: constrainedDocumentPos.left,
        top: constrainedDocumentPos.top,
      };
    } catch (error) {
      console.warn('Viewport constraint failed, returning original position:', error);
      return position;
    }
  };
}

/**
 * Handles fallback positioning when reference element is missing
 *
 * @function handleMissingReference
 * @description Provides consistent fallback behavior when a positioning strategy requires a reference element but none is provided
 *
 * @param {Measurements} measurements - System measurements
 * @param {PositionConfig} config - Position configuration
 * @returns {PortalPosition} Fallback position (center strategy)
 */
function handleMissingReference(
  measurements: Measurements,
  config: PositionConfig
): PortalPosition {
  return centerStrategy(measurements, config);
}

/**
 * Bottom positioning strategy
 *
 * @function bottomStrategy
 * @description Positions element at the bottom of the viewport, horizontally centered on reference element.
 * Uses coordinate utilities for clean coordinate handling.
 *
 * @param {Measurements} measurements - System measurements including viewport, element, and reference dimensions
 * @param {PositionConfig} config - Position configuration including offset values
 * @returns {PortalPosition} Calculated position in document coordinates
 */
function bottomStrategy(measurements: Measurements, config: PositionConfig): PortalPosition {
  const { viewport, element, reference } = measurements;
  const { x: offsetX, y: offsetY } = getOffsetValues(config.offset);

  if (!reference) {
    return handleMissingReference(measurements, config);
  }

  // Calculate position at bottom of viewport, centered on reference
  const position = createDocumentPosition(
    reference.centerX - element.width / 2,
    viewport.height - element.height + viewport.scrollY
  );

  // Apply offset
  const finalPosition = applyOffset(position, offsetX, -offsetY);

  return {
    left: finalPosition.left,
    top: finalPosition.top,
  };
}

/**
 * Center positioning strategy
 *
 * @function centerStrategy
 * @description Positions element at the center of the viewport with optional offset.
 * Uses coordinate utilities for clean coordinate handling.
 *
 * @param {Measurements} measurements - System measurements including viewport and element dimensions
 * @param {PositionConfig} config - Position configuration including offset values
 * @returns {PortalPosition} Calculated position in document coordinates
 */
function centerStrategy(measurements: Measurements, config: PositionConfig): PortalPosition {
  const { viewport, element } = measurements;
  const { x: offsetX, y: offsetY } = getOffsetValues(config.offset);

  // Get viewport center in document coordinates
  const center = getViewportCenterInDocument(measurements);

  // Calculate centered position
  const position = createDocumentPosition(
    center.left - element.width / 2,
    center.top - element.height / 2
  );

  // Apply offset
  const finalPosition = applyOffset(position, offsetX, offsetY);

  return {
    left: finalPosition.left,
    top: finalPosition.top,
  };
}

/**
 * Custom positioning strategy
 *
 * @function customStrategy
 * @description Uses a custom positioning function provided in the configuration.
 * Falls back to center positioning if no custom function is provided.
 *
 * @param {Measurements} measurements - System measurements
 * @param {PositionConfig} config - Position configuration including custom positioning function
 * @returns {PortalPosition} Calculated position from custom function or center fallback
 */
function customStrategy(measurements: Measurements, config: PositionConfig): PortalPosition {
  if (config.customPosition) {
    try {
      return config.customPosition(measurements);
    } catch (error) {
      console.warn('Custom positioning function failed, falling back to center:', error);
      return handleMissingReference(measurements, config);
    }
  }

  return handleMissingReference(measurements, config);
}

/**
 * Follow-trigger positioning strategy
 *
 * @function followTriggerStrategy
 * @description Positions element centered on the reference element (trigger), accounting for navigation bar offset.
 * Uses coordinate utilities for clean coordinate handling.
 *
 * @param {Measurements} measurements - System measurements including viewport, element, and reference dimensions
 * @param {PositionConfig} config - Position configuration including offset values
 * @returns {PortalPosition} Calculated position in document coordinates
 */
function followTriggerStrategy(measurements: Measurements, config: PositionConfig): PortalPosition {
  const { element, reference } = measurements;
  const { x: offsetX, y: offsetY } = getOffsetValues(config.offset);

  if (!reference) {
    return handleMissingReference(measurements, config);
  }

  // Get reference element rectangle for coordinate calculations
  const referenceRect = new DOMRect(
    reference.left,
    reference.top,
    reference.width,
    reference.height
  );

  // Calculate centered position with navigation adjustment
  const position = calculateCenteredPosition(referenceRect, element.width, element.height, true);

  // Apply offset
  const finalPosition = applyOffset(position, offsetX, offsetY);

  return {
    left: finalPosition.left,
    top: finalPosition.top,
  };
}

/**
 * Top positioning strategy
 *
 * @function topStrategy
 * @description Positions element at the top of the viewport below the navigation bar, horizontally centered on reference element.
 * Uses coordinate utilities for clean coordinate handling.
 *
 * @param {Measurements} measurements - System measurements including viewport, element, and reference dimensions
 * @param {PositionConfig} config - Position configuration including offset values
 * @returns {PortalPosition} Calculated position in document coordinates
 */
function topStrategy(measurements: Measurements, config: PositionConfig): PortalPosition {
  const { viewport, element, reference } = measurements;
  const { x: offsetX, y: offsetY } = getOffsetValues(config.offset);

  if (!reference) {
    return handleMissingReference(measurements, config);
  }

  // Calculate position at top of viewport, centered on reference
  const position = createDocumentPosition(
    reference.centerX - element.width / 2,
    NAV_HEIGHT + viewport.scrollY
  );

  // Apply offset
  const finalPosition = applyOffset(position, offsetX, offsetY);

  return {
    left: finalPosition.left,
    top: finalPosition.top,
  };
}

/**
 * Positioning Strategies Map
 *
 * @constant
 * @type {Record<PositioningStrategy, Function>}
 * @description Maps positioning strategy names to their corresponding implementation functions.
 * All strategies work in document coordinates for consistent positioning across the system.
 *
 * Available strategies:
 * - bottom: Positions at bottom of viewport, centered on reference
 * - center: Centers element in viewport
 * - custom: Uses provided custom positioning function
 * - follow-trigger: Centers on reference element with nav bar adjustment
 * - top: Positions at top of viewport, centered on reference
 */
const POSITIONING_STRATEGIES: Record<
  PositioningStrategy,
  (measurements: Measurements, config: PositionConfig) => PortalPosition
> = {
  bottom: bottomStrategy,
  center: centerStrategy,
  custom: customStrategy,
  'follow-trigger': followTriggerStrategy,
  top: topStrategy,
};

/**
 * Calculates transform origin based on reference element
 *
 * @function calculateTransformOrigin
 * @description Determines the transform origin for animations relative to a reference element.
 * Uses coordinate utilities for clean coordinate handling.
 *
 * @param {Measurements} measurements - System measurements
 * @param {PortalPosition} position - Calculated position (in document coordinates)
 * @returns {string} CSS transform-origin value
 */
function calculateTransformOrigin(measurements: Measurements, position: PortalPosition): string {
  if (!measurements.reference) {
    return 'center';
  }

  const { reference, viewport } = measurements;
  const elementPos = createDocumentPosition(position.left ?? 0, position.top ?? 0);

  // Get reference center with navigation adjustment
  const referenceRect = new DOMRect(
    reference.left,
    reference.top,
    reference.width,
    reference.height
  );
  const referenceCenter = getElementCenterInDocument(referenceRect);

  // Calculate transform origin relative to the element position
  const transformOriginX = referenceCenter.left - elementPos.left;
  const transformOriginY = referenceCenter.top - elementPos.top + viewport.scrollY;

  return `${transformOriginX}px ${transformOriginY}px`;
}

/**
 * Safely applies a single CSS property to an element
 *
 * @function safeSetStyle
 * @description Safely sets a CSS property on an element with error handling
 *
 * @param {HTMLElement} element - Element to style
 * @param {string} property - CSS property name
 * @param {string} value - CSS property value
 */
function safeSetStyle(element: HTMLElement, property: string, value: string): void {
  try {
    element.style.setProperty(property, value);
  } catch (error) {
    console.warn(`Failed to set CSS property ${property}:`, error);
  }
}

/**
 * Applies basic positioning styles to an element
 *
 * @function applyPositionStyles
 * @description Sets position, coordinates, and z-index on an element
 *
 * @param {HTMLElement} element - Element to style
 * @param {PortalPosition} position - Position values to apply
 * @param {number} [zIndex] - Optional z-index value
 */
function applyPositionStyles(
  element: HTMLElement,
  position: PortalPosition,
  zIndex?: number
): void {
  // Set position to absolute
  safeSetStyle(element, 'position', 'absolute');

  // Apply z-index if provided
  if (zIndex !== undefined) {
    safeSetStyle(element, 'z-index', zIndex.toString());
  }

  // Apply coordinate properties
  if (position.top !== undefined) {
    safeSetStyle(element, 'top', `${position.top}px`);
  }
  if (position.left !== undefined) {
    safeSetStyle(element, 'left', `${position.left}px`);
  }
  if (position.right !== undefined) {
    safeSetStyle(element, 'right', `${position.right}px`);
  }
  if (position.bottom !== undefined) {
    safeSetStyle(element, 'bottom', `${position.bottom}px`);
  }
}

/**
 * Applies dimension styles to an element
 *
 * @function applyDimensionStyles
 * @description Sets width and height on an element
 *
 * @param {HTMLElement} element - Element to style
 * @param {PortalPosition} position - Position values containing dimensions
 */
function applyDimensionStyles(element: HTMLElement, position: PortalPosition): void {
  if (position.width !== undefined) {
    const width = typeof position.width === 'number' ? `${position.width}px` : position.width;
    safeSetStyle(element, 'width', width);
  }
  if (position.height !== undefined) {
    const height = typeof position.height === 'number' ? `${position.height}px` : position.height;
    safeSetStyle(element, 'height', height);
  }
}

/**
 * Applies animation styles to an element
 *
 * @function applyAnimationStyles
 * @description Sets transition properties for animations
 *
 * @param {HTMLElement} element - Element to style
 * @param {PositionAnimation} animation - Animation configuration
 */
function applyAnimationStyles(element: HTMLElement, animation: PositionAnimation): void {
  if (animation.enabled) {
    safeSetStyle(element, 'transition', `all ${animation.duration}ms ${animation.easing}`);
  } else {
    safeSetStyle(element, 'transition', '');
  }
}

/**
 * Applies transform styles to an element
 *
 * @function applyTransformStyles
 * @description Sets transform-origin and other transform-related properties
 *
 * @param {HTMLElement} element - Element to style
 * @param {PortalPosition} position - Position values containing transform properties
 */
function applyTransformStyles(element: HTMLElement, position: PortalPosition): void {
  if (position.transformOrigin !== undefined) {
    safeSetStyle(element, 'transform-origin', position.transformOrigin);
  }
}

/**
 * Applies position to an element
 *
 * @function applyElementPosition
 * @description Applies position styles to an element with optional animation
 *
 * @param {HTMLElement} element - Element to position
 * @param {PortalPosition} position - Position to apply (in document coordinates)
 * @param {PositionAnimation} animation - Animation configuration
 * @param {number} [zIndex] - Optional z-index
 * @throws {Error} When element is invalid
 */
function applyElementPosition(
  element: HTMLElement,
  position: PortalPosition,
  animation: PositionAnimation,
  zIndex?: number
): void {
  validateElement(element, 'target element');

  try {
    applyPositionStyles(element, position, zIndex);
    applyDimensionStyles(element, position);
    applyAnimationStyles(element, animation);
    applyTransformStyles(element, position);
  } catch (error) {
    console.error('Failed to apply element position:', error);

    throw new Error(
      `Failed to apply position to element: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Creates a debounced function
 *
 * @function debounce
 * @description Creates a function that delays invoking the provided function
 *
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;

  return (...args: Parameters<T>): void => {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = window.setTimeout(later, wait) as unknown as number;
  };
}

export class PositionManager {
  private config: PositionConfig;
  private element: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private scrollHandler: (() => void) | null = null;
  private lastMeasurements: Measurements | null = null;

  /**
   * Creates a new position manager
   *
   * @constructor
   * @param {Partial<PositionConfig>} config - Position configuration
   */
  constructor(config: Partial<PositionConfig>) {
    this.config = normalizeConfig(config);
  }

  /**
   * Validates elements for attachment
   *
   * @private
   * @method validateAttachmentInputs
   * @param {HTMLElement} element - Element to position
   * @param {HTMLElement} [reference] - Optional reference element
   * @throws {Error} When elements are invalid
   */
  private validateAttachmentInputs(element: HTMLElement, reference?: HTMLElement): void {
    validateElement(element, 'target element');

    if (reference) {
      validateElement(reference, 'reference element');
    }
  }

  /**
   * Initializes the position manager state
   *
   * @private
   * @method initializeManagerState
   * @param {HTMLElement} element - Element to position
   * @param {HTMLElement} [reference] - Optional reference element
   */
  private initializeManagerState(element: HTMLElement, reference?: HTMLElement): void {
    this.element = element;

    if (reference) {
      this.config.reference = reference;
    }
  }

  /**
   * Performs initial setup after attachment
   *
   * @private
   * @method performInitialSetup
   * @throws {Error} When setup fails
   */
  private performInitialSetup(): void {
    try {
      this.setupListeners();
      this.update();
    } catch (error) {
      this.detach();
      throw error;
    }
  }

  /**
   * Attaches the manager to an element
   *
   * @method attach
   * @param {HTMLElement} element - Element to position
   * @param {HTMLElement} [reference] - Optional reference element
   * @throws {Error} When element is invalid
   */
  public attach(element: HTMLElement, reference?: HTMLElement): void {
    this.validateAttachmentInputs(element, reference);
    this.initializeManagerState(element, reference);
    this.performInitialSetup();
  }

  /**
   * Calculates base position using strategy
   *
   * @private
   * @method calculateBasePosition
   * @param {Measurements} measurements - System measurements
   * @returns {PortalPosition} Base position from strategy
   */
  private calculateBasePosition(measurements: Measurements): PortalPosition {
    const strategyFn = POSITIONING_STRATEGIES[this.config.strategy];
    return strategyFn(measurements, this.config);
  }

  /**
   * Applies constraints to a position
   *
   * @private
   * @method applyPositionConstraints
   * @param {PortalPosition} position - Position to constrain
   * @param {Measurements} measurements - System measurements
   * @returns {PortalPosition} Constrained position
   */
  private applyPositionConstraints(
    position: PortalPosition,
    measurements: Measurements
  ): PortalPosition {
    if (!this.config.constraints) {
      return position;
    }

    let constrainedPosition = position;
    for (const constraint of this.config.constraints) {
      constrainedPosition = constraint(constrainedPosition, measurements, this.config);
    }

    return constrainedPosition;
  }

  /**
   * Adds transform origin to position if needed
   *
   * @private
   * @method addTransformOrigin
   * @param {PortalPosition} position - Position to enhance
   * @param {Measurements} measurements - System measurements
   * @returns {PortalPosition} Position with transform origin
   */
  private addTransformOrigin(position: PortalPosition, measurements: Measurements): PortalPosition {
    if (this.config.transformOrigin && measurements.reference) {
      return {
        ...position,
        transformOrigin: calculateTransformOrigin(measurements, position),
      };
    }

    return position;
  }

  /**
   * Updates the position
   *
   * @method update
   * @description Recalculates and applies the position
   */
  public update(): void {
    if (!this.element) {
      console.debug('Cannot update position: no element attached');
      return;
    }

    try {
      // Get measurements
      this.lastMeasurements = getMeasurements(this.element, this.config.reference);

      // Calculate position
      const position = this.calculatePosition(this.lastMeasurements);

      // Apply position
      applyElementPosition(
        this.element,
        position,
        this.config.animation as PositionAnimation,
        this.config.zIndex
      );
    } catch (error) {
      console.error('Failed to update position:', error);
    }
  }

  /**
   * Updates the configuration
   *
   * @method updateConfig
   * @param {Partial<PositionConfig>} config - New configuration
   */
  public updateConfig(config: Partial<PositionConfig>): void {
    try {
      this.config = normalizeConfig({ ...this.config, ...config });
      this.update();
    } catch (error) {
      console.error('Failed to update configuration:', error);
    }
  }

  /**
   * Detaches the manager and cleans up
   *
   * @method detach
   * @description Removes all listeners and references
   */
  public detach(): void {
    try {
      this.teardownListeners();
      this.element = null;
      this.lastMeasurements = null;
    } catch (error) {
      console.error('Failed to detach position manager:', error);
    }
  }

  /**
   * Calculates the position
   *
   * @private
   * @method calculatePosition
   * @param {Measurements} measurements - System measurements
   * @returns {PortalPosition} Calculated position
   */
  private calculatePosition(measurements: Measurements): PortalPosition {
    try {
      let position = this.calculateBasePosition(measurements);
      position = this.applyPositionConstraints(position, measurements);
      position = this.addTransformOrigin(position, measurements);
      return position;
    } catch (error) {
      console.error('Failed to calculate position, using fallback:', error);
      return centerStrategy(measurements, this.config);
    }
  }

  /**
   * Sets up resize observer
   *
   * @private
   * @method setupResizeObserver
   */
  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(
      debounce(() => {
        this.update();
      }, UPDATE_THROTTLE)
    );
    this.resizeObserver.observe(document.documentElement);
  }

  /**
   * Sets up scroll listener
   *
   * @private
   * @method setupScrollListener
   */
  private setupScrollListener(): void {
    this.scrollHandler = debounce(() => {
      this.update();
    }, UPDATE_THROTTLE);
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  /**
   * Sets up event listeners
   *
   * @private
   * @method setupListeners
   */
  private setupListeners(): void {
    try {
      this.setupResizeObserver();
      this.setupScrollListener();
    } catch (error) {
      console.error('Failed to setup listeners:', error);
      throw error;
    }
  }

  /**
   * Tears down resize observer
   *
   * @private
   * @method teardownResizeObserver
   */
  private teardownResizeObserver(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  /**
   * Tears down scroll listener
   *
   * @private
   * @method teardownScrollListener
   */
  private teardownScrollListener(): void {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = null;
    }
  }

  /**
   * Tears down event listeners
   *
   * @private
   * @method teardownListeners
   */
  private teardownListeners(): void {
    try {
      this.teardownResizeObserver();
      this.teardownScrollListener();
    } catch (error) {
      console.error('Failed to teardown listeners:', error);
    }
  }
}

/**
 * Creates a position manager
 *
 * @function createPositionManager
 * @description Factory function to create a position manager
 *
 * @param {Partial<PositionConfig>} config - Position configuration
 * @returns {PositionManager} New position manager
 */
export function createPositionManager(config: Partial<PositionConfig> = {}): PositionManager {
  return new PositionManager(config);
}

/**
 * Svelte action for positioning
 *
 * @function position
 * @description Svelte action that positions an element
 *
 * @param {HTMLElement} node - Element to position
 * @param {Partial<PositionConfig>} config - Position configuration
 * @returns {PositionAction} Action object with update and destroy methods
 */
export function position(node: HTMLElement, config: Partial<PositionConfig> = {}): PositionAction {
  const manager = createPositionManager(config);

  try {
    manager.attach(node, config.reference);
  } catch (error) {
    console.error('Failed to initialize position action:', error);
  }

  return {
    update(newConfig: Partial<PositionConfig>) {
      try {
        manager.updateConfig(newConfig);
      } catch (error) {
        console.error('Failed to update position action:', error);
      }
    },
    destroy() {
      manager.detach();
    },
  };
}
