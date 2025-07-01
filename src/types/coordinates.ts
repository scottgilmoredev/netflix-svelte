/**
 * Coordinate System Utilities Module
 *
 * @module
 * @description Provides utilities for handling different coordinate systems in the positioning system.
 * Manages conversions between document coordinates (absolute positioning) and viewport coordinates
 * (relative to visible area). Ensures consistent coordinate handling across all positioning operations.
 *
 * The module distinguishes between three coordinate systems:
 * - Document coordinates: Absolute position relative to the entire document including scrolled areas
 * - Viewport coordinates: Position relative to the currently visible viewport area
 * - Element coordinates: Position relative to a specific element's bounding rectangle
 *
 * All coordinate conversions maintain precision and provide validation to prevent positioning errors.
 * The utilities support bidirectional conversions and include helper functions for common positioning
 * calculations such as centering elements and applying navigation bar adjustments.
 */

/**
 * Coordinate conversion result
 *
 * @interface CoordinateConversion
 * @description Result of coordinate system conversion
 *
 * @property {DocumentPosition | ViewportPosition | ElementPosition} position - Converted position
 * @property {CoordinateSystem} from - Source coordinate system
 * @property {CoordinateSystem} to - Target coordinate system
 */
export interface CoordinateConversion {
  readonly position: DocumentPosition | ViewportPosition | ElementPosition;
  readonly from: CoordinateSystem;
  readonly to: CoordinateSystem;
}

/**
 * Coordinate system type
 *
 * @type {CoordinateSystem}
 * @description Available coordinate systems for position calculations
 */
export type CoordinateSystem = 'document' | 'viewport' | 'element';

/**
 * Document coordinate position
 *
 * @interface DocumentPosition
 * @description Position in document coordinate system (absolute positioning)
 *
 * @property {number} left - Left position relative to document
 * @property {number} top - Top position relative to document
 */
export interface DocumentPosition {
  readonly left: number;
  readonly top: number;
}

/**
 * Element coordinate position
 *
 * @interface ElementPosition
 * @description Position relative to a specific element
 *
 * @property {number} left - Left position relative to element
 * @property {number} top - Top position relative to element
 */
export interface ElementPosition {
  readonly left: number;
  readonly top: number;
}

/**
 * Viewport coordinate position
 *
 * @interface ViewportPosition
 * @description Position in viewport coordinate system (relative to visible area)
 *
 * @property {number} left - Left position relative to viewport
 * @property {number} top - Top position relative to viewport
 */
export interface ViewportPosition {
  readonly left: number;
  readonly top: number;
}
