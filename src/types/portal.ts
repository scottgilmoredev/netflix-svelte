/**
 * Portal System Types Module
 *
 * @module
 * @description Type definitions for the portal system throughout the application.
 * Provides interfaces and types for portal positioning, element dimensions, modal
 * configurations, and portal options. This module centralizes all portal-related
 * type definitions to ensure consistency across portal components and utilities.
 *
 * The module includes types for element positioning, dimension calculations, portal
 * configuration, and position data used by the portal system.
 *
 * @requires ./positioning
 */

import type { PositioningStrategy } from './positioning';

/**
 * Element Dimensions and Position Interface
 *
 * @interface ElementDimensions
 * @description Interface for element dimensions and calculated center position
 *
 * @property {number} centerX - Calculated horizontal center position in pixels
 * @property {number} centerY - Calculated vertical center position in pixels
 * @property {number} height - Element height in pixels
 * @property {number} width - Element width in pixels
 */
export interface ElementDimensions {
  centerX: number;
  centerY: number;
  height: number;
  width: number;
}

/**
 * Modal Dimensions Interface
 *
 * @interface ModalDimensions
 * @description Interface for modal element dimensions
 *
 * @property {number} height - Modal height in pixels
 * @property {number} width - Modal width in pixels
 */
export interface ModalDimensions {
  height: number;
  width: number;
}

/**
 * Portal Configuration Options
 *
 * @interface PortalOptions
 * @description Configuration options for portal creation and management
 *
 * @property {PortalPosition} position - Position configuration for the portal (optional)
 * @property {HTMLElement} target - Target element for portal attachment (optional)
 * @property {number} zIndex - Z-index value for portal stacking (optional)
 */
export interface PortalOptions {
  position?: PortalPosition;
  target?: HTMLElement;
  zIndex?: number;
}

/**
 * Portal Position Configuration
 *
 * @interface PortalPosition
 * @description Position configuration object for portal positioning
 *
 * @property {number} bottom - Bottom position in pixels (optional)
 * @property {number | string} height - Height value in pixels or CSS string (optional)
 * @property {number} left - Left position in pixels (optional)
 * @property {number} right - Right position in pixels (optional)
 * @property {number} top - Top position in pixels (optional)
 * @property {string} transformOrigin - Transform origin string for animations (optional)
 * @property {number | string} width - Width value in pixels or CSS string (optional)
 */
export interface PortalPosition {
  bottom?: number;
  height?: number | string;
  left?: number;
  right?: number;
  top?: number;
  transformOrigin?: string;
  width?: number | string;
}

/**
 * Position Calculation Options
 *
 * @interface PositionCalculationOptions
 * @description Options for position calculation within the portal system
 *
 * @property {number} offsetY - Vertical offset value in pixels (optional)
 * @property {number} padding - Padding value for position constraints (optional)
 * @property {PositioningStrategy} strategy - Positioning strategy to use (optional)
 */
export interface PositionCalculationOptions {
  offsetY?: number;
  padding?: number;
  strategy?: PositioningStrategy;
}
