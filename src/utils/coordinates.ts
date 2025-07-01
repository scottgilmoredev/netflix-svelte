/**
 * Coordinate System Utilities
 *
 * @module
 * @description Provides utilities for handling different coordinate systems in the positioning system.
 * Manages conversions between document coordinates (absolute positioning) and viewport coordinates
 * (relative to visible area). Ensures consistent coordinate handling across all positioning operations.
 *
 * The module distinguishes between:
 * - Document coordinates: Absolute position relative to the entire document
 * - Viewport coordinates: Position relative to the visible viewport area
 * - Element coordinates: Position relative to a specific element
 *
 * @requires ../constants/positioning
 * @requires ../types/positioning
 */

// Constants
import { NAV_HEIGHT } from '@constants';

// Types
import type { DocumentPosition, ElementPosition, Measurements, ViewportPosition } from '@types';

/**
 * Validates coordinate values
 *
 * @function validateCoordinates
 * @description Ensures coordinate values are valid numbers
 *
 * @param {number} left - Left coordinate value
 * @param {number} top - Top coordinate value
 * @param {string} context - Context for error messages
 *
 * @throws {Error} When coordinates are invalid
 *
 * @example
 * validateCoordinates(100, 200, 'element position');
 */
export function validateCoordinates(left: number, top: number, context: string): void {
  if (!Number.isFinite(left) || !Number.isFinite(top)) {
    throw new Error(`Invalid coordinates in ${context}: left=${left}, top=${top}`);
  }
}

/**
 * Creates a document position
 *
 * @function createDocumentPosition
 * @description Creates a validated document coordinate position
 *
 * @param {number} left - Left position in document coordinates
 * @param {number} top - Top position in document coordinates
 *
 * @returns {DocumentPosition} Validated document position
 *
 * @throws {Error} When coordinates are invalid
 *
 * @example
 * const docPos = createDocumentPosition(100, 200);
 */
export function createDocumentPosition(left: number, top: number): DocumentPosition {
  validateCoordinates(left, top, 'document position');

  return { left, top };
}

/**
 * Creates a viewport position
 *
 * @function createViewportPosition
 * @description Creates a validated viewport coordinate position
 *
 * @param {number} left - Left position in viewport coordinates
 * @param {number} top - Top position in viewport coordinates
 *
 * @returns {ViewportPosition} Validated viewport position
 *
 * @throws {Error} When coordinates are invalid
 *
 * @example
 * const viewportPos = createViewportPosition(50, 100);
 */
export function createViewportPosition(left: number, top: number): ViewportPosition {
  validateCoordinates(left, top, 'viewport position');

  return { left, top };
}

/**
 * Creates an element position
 *
 * @function createElementPosition
 * @description Creates a validated element coordinate position
 *
 * @param {number} left - Left position in element coordinates
 * @param {number} top - Top position in element coordinates
 *
 * @returns {ElementPosition} Validated element position
 *
 * @throws {Error} When coordinates are invalid
 *
 * @example
 * const elemPos = createElementPosition(25, 50);
 */
export function createElementPosition(left: number, top: number): ElementPosition {
  validateCoordinates(left, top, 'element position');

  return { left, top };
}

/**
 * Converts document coordinates to viewport coordinates
 *
 * @function documentToViewport
 * @description Converts position from document space to viewport space
 *
 * @param {DocumentPosition} documentPos - Position in document coordinates
 * @param {number} scrollX - Horizontal scroll offset
 * @param {number} scrollY - Vertical scroll offset
 *
 * @returns {ViewportPosition} Position in viewport coordinates
 *
 * @example
 * const docPos = createDocumentPosition(1000, 500);
 * const viewportPos = documentToViewport(docPos, 200, 100);
 */
export function documentToViewport(
  documentPos: DocumentPosition,
  scrollX: number,
  scrollY: number
): ViewportPosition {
  return createViewportPosition(documentPos.left - scrollX, documentPos.top - scrollY);
}

/**
 * Converts viewport coordinates to document coordinates
 *
 * @function viewportToDocument
 * @description Converts position from viewport space to document space
 *
 * @param {ViewportPosition} viewportPos - Position in viewport coordinates
 * @param {number} scrollX - Horizontal scroll offset
 * @param {number} scrollY - Vertical scroll offset
 *
 * @returns {DocumentPosition} Position in document coordinates
 *
 * @example
 * const viewportPos = createViewportPosition(100, 200);
 * const docPos = viewportToDocument(viewportPos, 50, 75);
 */
export function viewportToDocument(
  viewportPos: ViewportPosition,
  scrollX: number,
  scrollY: number
): DocumentPosition {
  return createDocumentPosition(viewportPos.left + scrollX, viewportPos.top + scrollY);
}

/**
 * Converts element coordinates to document coordinates
 *
 * @function elementToDocument
 * @description Converts position from element space to document space
 *
 * @param {ElementPosition} elementPos - Position in element coordinates
 * @param {DOMRect} elementRect - Element's bounding rectangle
 *
 * @returns {DocumentPosition} Position in document coordinates
 *
 * @example
 * const elemPos = createElementPosition(10, 20);
 * const rect = element.getBoundingClientRect();
 * const docPos = elementToDocument(elemPos, rect);
 */
export function elementToDocument(
  elementPos: ElementPosition,
  elementRect: DOMRect
): DocumentPosition {
  return createDocumentPosition(
    elementPos.left + elementRect.left + window.pageXOffset,
    elementPos.top + elementRect.top + window.pageYOffset
  );
}

/**
 * Converts document coordinates to element coordinates
 *
 * @function documentToElement
 * @description Converts position from document space to element space
 *
 * @param {DocumentPosition} documentPos - Position in document coordinates
 * @param {DOMRect} elementRect - Element's bounding rectangle
 *
 * @returns {ElementPosition} Position in element coordinates
 *
 * @example
 * const docPos = createDocumentPosition(500, 300);
 * const rect = element.getBoundingClientRect();
 * const elemPos = documentToElement(docPos, rect);
 */
export function documentToElement(
  documentPos: DocumentPosition,
  elementRect: DOMRect
): ElementPosition {
  return createElementPosition(
    documentPos.left - elementRect.left - window.pageXOffset,
    documentPos.top - elementRect.top - window.pageYOffset
  );
}

/**
 * Calculates center position of an element in document coordinates
 *
 * @function getElementCenterInDocument
 * @description Calculates the center point of an element in document coordinate system
 *
 * @param {DOMRect} elementRect - Element's bounding rectangle
 *
 * @returns {DocumentPosition} Center position in document coordinates
 *
 * @example
 * const rect = element.getBoundingClientRect();
 * const center = getElementCenterInDocument(rect);
 */
export function getElementCenterInDocument(elementRect: DOMRect): DocumentPosition {
  return createDocumentPosition(
    elementRect.left + elementRect.width / 2 + window.pageXOffset,
    elementRect.top + elementRect.height / 2 + window.pageYOffset
  );
}

/**
 * Calculates center position of an element in viewport coordinates
 *
 * @function getElementCenterInViewport
 * @description Calculates the center point of an element in viewport coordinate system
 *
 * @param {DOMRect} elementRect - Element's bounding rectangle
 *
 * @returns {ViewportPosition} Center position in viewport coordinates
 *
 * @example
 * const rect = element.getBoundingClientRect();
 * const center = getElementCenterInViewport(rect);
 */
export function getElementCenterInViewport(elementRect: DOMRect): ViewportPosition {
  return createViewportPosition(
    elementRect.left + elementRect.width / 2,
    elementRect.top + elementRect.height / 2
  );
}

/**
 * Adjusts Y coordinate for navigation bar offset
 *
 * @function adjustForNavigation
 * @description Adjusts a Y coordinate to account for the fixed navigation bar
 *
 * @param {number} y - Original Y coordinate
 *
 * @returns {number} Adjusted Y coordinate accounting for navigation bar
 *
 * @example
 * const adjustedY = adjustForNavigation(200);
 */
export function adjustForNavigation(y: number): number {
  return y - NAV_HEIGHT / 2;
}

/**
 * Calculates viewport center position in document coordinates
 *
 * @function getViewportCenterInDocument
 * @description Calculates the center of the viewport in document coordinate system
 *
 * @param {Measurements} measurements - System measurements
 *
 * @returns {DocumentPosition} Viewport center in document coordinates
 *
 * @example
 * const measurements = getMeasurements(element);
 * const center = getViewportCenterInDocument(measurements);
 */
export function getViewportCenterInDocument(measurements: Measurements): DocumentPosition {
  const { viewport } = measurements;

  return createDocumentPosition(
    viewport.width / 2 + viewport.scrollX,
    viewport.height / 2 + viewport.scrollY
  );
}

/**
 * Calculates element center position with navigation adjustment
 *
 * @function getElementCenterWithNavAdjustment
 * @description Gets element center in document coordinates with navigation bar adjustment
 *
 * @param {DOMRect} elementRect - Element's bounding rectangle
 *
 * @returns {DocumentPosition} Adjusted center position in document coordinates
 *
 * @example
 * const rect = element.getBoundingClientRect();
 * const center = getElementCenterWithNavAdjustment(rect);
 */
export function getElementCenterWithNavAdjustment(elementRect: DOMRect): DocumentPosition {
  const center = getElementCenterInDocument(elementRect);

  return createDocumentPosition(center.left, adjustForNavigation(center.top));
}

/**
 * Calculates position for centering an element on another element
 *
 * @function calculateCenteredPosition
 * @description Calculates the position needed to center one element on another
 *
 * @param {DOMRect} targetRect - Rectangle of element to center on
 * @param {number} elementWidth - Width of element to position
 * @param {number} elementHeight - Height of element to position
 * @param {boolean} [adjustForNav=false] - Whether to adjust for navigation bar
 *
 * @returns {DocumentPosition} Position to center the element
 *
 * @example
 * const targetRect = targetElement.getBoundingClientRect();
 * const position = calculateCenteredPosition(targetRect, 200, 100, true);
 */
export function calculateCenteredPosition(
  targetRect: DOMRect,
  elementWidth: number,
  elementHeight: number,
  adjustForNav = false
): DocumentPosition {
  const center = adjustForNav
    ? getElementCenterWithNavAdjustment(targetRect)
    : getElementCenterInDocument(targetRect);

  return createDocumentPosition(center.left - elementWidth / 2, center.top - elementHeight / 2);
}

/**
 * Applies offset to a position
 *
 * @function applyOffset
 * @description Applies horizontal and vertical offset to a position
 *
 * @param {DocumentPosition | ViewportPosition} position - Original position
 * @param {number} offsetX - Horizontal offset
 * @param {number} offsetY - Vertical offset
 *
 * @returns {DocumentPosition | ViewportPosition} Position with offset applied
 *
 * @example
 * const pos = createDocumentPosition(100, 200);
 * const offsetPos = applyOffset(pos, 10, -5);
 */
export function applyOffset<T extends DocumentPosition | ViewportPosition>(
  position: T,
  offsetX: number,
  offsetY: number
): T {
  return {
    ...position,
    left: position.left + offsetX,
    top: position.top + offsetY,
  };
}

/**
 * Constrains position within boundaries
 *
 * @function constrainPosition
 * @description Constrains a position within specified boundaries
 *
 * @param {ViewportPosition} position - Position to constrain
 * @param {Object} boundaries - Constraint boundaries
 * @param {number} boundaries.minLeft - Minimum left position
 * @param {number} boundaries.maxLeft - Maximum left position
 * @param {number} boundaries.minTop - Minimum top position
 * @param {number} boundaries.maxTop - Maximum top position
 *
 * @returns {ViewportPosition} Constrained position
 *
 * @example
 * const pos = createViewportPosition(1000, 500);
 * const constrained = constrainPosition(pos, {
 *   minLeft: 0, maxLeft: 800,
 *   minTop: 0, maxTop: 600
 * });
 */
export function constrainPosition(
  position: ViewportPosition,
  boundaries: {
    minLeft: number;
    maxLeft: number;
    minTop: number;
    maxTop: number;
  }
): ViewportPosition {
  return createViewportPosition(
    Math.max(boundaries.minLeft, Math.min(boundaries.maxLeft, position.left)),
    Math.max(boundaries.minTop, Math.min(boundaries.maxTop, position.top))
  );
}
