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
 * @property {PortalPosition} [position] - Optional: Position configuration for the portal
 * @property {HTMLElement} [target] - Optional: Target element for portal attachment
 * @property {number | 'none'} [verticalPadding] - Optional: Controls vertical clamping for the portaled element.
 *   If a number, it sets the padding from top/bottom viewport edges. If 'none',
 *   vertical clamping is disabled, allowing the element to exceed vertical boundaries.
 * @property {number} [zIndex] - Optional: Z-index value for portal stacking
 */
export interface PortalOptions {
  position?: PortalPosition;
  target?: HTMLElement;
  verticalPadding?: number | 'none';
  zIndex?: number;
}

/**
 * Portal Position Configuration
 *
 * @interface PortalPosition
 * @description Position configuration object for portal positioning
 *
 * @property {number} [bottom] - Optional: Bottom position in pixels
 * @property {number | string} [height] - Optional: Height value in pixels or CSS string
 * @property {number} [left] - Optional: Left position in pixels
 * @property {number} [right] - Optional: Right position in pixels
 * @property {number} [top] - Optional: Top position in pixels
 * @property {string} [transformOrigin] - Optional: Transform origin string for animations
 * @property {number | string} [width] - Optional: Width value in pixels or CSS string
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
 * @description Options for position calculation within the portal system.
 * Provides configurable parameters for offsets, padding, positioning strategy,
 * and specific control over vertical viewport constraints.
 *
 * @property {number} [offsetY] - Optional: Vertical offset value in pixels.
 * @property {number} [padding] - Optional: Padding value for position constraints.
 * @property {PositioningStrategy} [strategy] - Optional: Positioning strategy to use.
 * @property {number | 'none'} [verticalPadding] - Optional: Controls vertical clamping.
 *   If a number, it sets the padding from top/bottom viewport edges. If 'none',
 *   vertical clamping is disabled, allowing the element to exceed vertical boundaries.
 */
export interface PositionCalculationOptions {
  offsetY?: number;
  padding?: number;
  strategy?: PositioningStrategy;
  verticalPadding?: number | 'none';
}
