/**
 * Positioning System Types Module
 *
 * @module
 * @description Type definitions for the positioning system throughout the application.
 * Provides interfaces and types for positioning strategies, measurements, constraints,
 * and configuration objects. This module centralizes all positioning-related type
 * definitions to ensure consistency across positioning components and utilities.
 *
 * The module includes types for element positioning, viewport calculations, animation
 * configurations, and constraint handling used by the positioning system.
 *
 * @requires ./portal
 */

import type { PortalPosition } from './portal';

/**
 * Computed Position Data
 *
 * @interface ComputedPosition
 * @description Position data calculated by the positioning system
 *
 * @property {number} left - Left position in pixels
 * @property {number} top - Top position in pixels
 * @property {string} transformOrigin - Transform origin string
 */
export interface ComputedPosition {
  readonly left: number;
  readonly top: number;
  readonly transformOrigin: string;
}

/**
 * Default Animation Configuration
 *
 * @interface DefaultAnimationConfig
 * @description Configuration object for default positioning animations
 *
 * @property {number} duration - Animation duration in milliseconds
 * @property {string} easing - CSS easing function for smooth transitions
 * @property {boolean} enabled - Whether animations are enabled by default
 */
export interface DefaultAnimationConfig {
  readonly duration: number;
  readonly easing: string;
  readonly enabled: boolean;
}

/**
 * Default Offset Configuration
 *
 * @interface DefaultOffsetConfig
 * @description Configuration object for default position offsets
 *
 * @property {number} x - Horizontal offset in pixels
 * @property {number} y - Vertical offset in pixels
 */
export interface DefaultOffsetConfig {
  readonly x: number;
  readonly y: number;
}

/**
 * Default Padding Configuration
 *
 * @interface DefaultPaddingConfig
 * @description Configuration object for default viewport padding
 *
 * @property {number} top - Top padding in pixels
 * @property {number} right - Right padding using responsive ratio
 * @property {number} bottom - Bottom padding in pixels
 * @property {number} left - Left padding using responsive ratio
 */
export interface DefaultPaddingConfig {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

/**
 * Fallback element dimensions configuration interface
 *
 * @interface FallbackElementConfig
 * @description Configuration object for fallback element dimensions
 *
 * @property {number} HEIGHT - Fallback element height in pixels
 * @property {number} WIDTH - Fallback element width in pixels
 */
export interface FallbackElementConfig {
  readonly HEIGHT: number;
  readonly WIDTH: number;
}

/**
 * Fallback viewport dimensions configuration interface
 *
 * @interface FallbackViewportConfig
 * @description Configuration object for fallback viewport dimensions
 *
 * @property {number} HEIGHT - Fallback viewport height in pixels
 * @property {number} WIDTH - Fallback viewport width in pixels
 */
export interface FallbackViewportConfig {
  readonly HEIGHT: number;
  readonly WIDTH: number;
}

/**
 * Positioning Measurements
 *
 * @interface Measurements
 * @description Measurements used for positioning calculations
 *
 * @property {Object} viewport - Viewport dimensions and scroll position
 * @property {Object} element - Target element dimensions
 * @property {Object} reference - Reference element dimensions and position (optional)
 */
export interface Measurements {
  viewport: {
    width: number;
    height: number;
    scrollX: number;
    scrollY: number;
  };
  element: {
    width: number;
    height: number;
  };
  reference?: {
    width: number;
    height: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
    centerX: number;
    centerY: number;
  };
}

/**
 * Svelte action return type for positioning
 *
 * @interface PositionAction
 * @description Return type for the position Svelte action, providing update and destroy methods
 * for managing element positioning lifecycle.
 *
 * @property {Function} update - Updates the position configuration
 * @property {Function} destroy - Cleans up positioning resources
 */
export interface PositionAction {
  update(newConfig: Partial<PositionConfig>): void;
  destroy(): void;
}

/**
 * Position Animation Configuration
 *
 * @interface PositionAnimation
 * @description Animation configuration for position changes
 *
 * @property {number} duration - Animation duration in milliseconds
 * @property {string} easing - CSS easing function
 * @property {boolean} enabled - Whether animation is enabled
 */
export interface PositionAnimation {
  duration: number;
  easing: string;
  enabled: boolean;
}

/**
 * Position Configuration
 *
 * @interface PositionConfig
 * @description Configuration for the position manager
 *
 * @property {PositioningStrategy} strategy - Core positioning strategy
 * @property {PositionOffset} offset - Position offset values
 * @property {HTMLElement} reference - Reference element for strategies that need it
 * @property {boolean} matchReferenceSize - Whether to match reference element size and position
 * @property {PositionConstraint[]} constraints - Positioning constraints
 * @property {PositionPadding | number} padding - Padding configuration
 * @property {Partial<PositionAnimation>} animation - Animation configuration
 * @property {boolean} transformOrigin - Whether to calculate transform origin
 * @property {Function} customPosition - Custom positioning function for "custom" strategy
 * @property {number} zIndex - Z-index value
 */
export interface PositionConfig {
  strategy: PositioningStrategy;
  offset?: PositionOffset;
  reference?: HTMLElement;
  matchReferenceSize?: boolean;
  constraints?: PositionConstraint[];
  padding?: PositionPadding | number;
  animation?: Partial<PositionAnimation>;
  transformOrigin?: boolean;
  customPosition?: (measurements: Measurements) => PortalPosition;
  zIndex?: number;
}

/**
 * Position Constraint Function
 *
 * @type {PositionConstraint}
 * @description Function type for position constraints
 */
export type PositionConstraint = (
  position: PortalPosition,
  measurements: Measurements,
  config: PositionConfig
) => PortalPosition;

/**
 * Position Manager Configuration
 *
 * @interface PositionManagerConfig
 * @description Configuration object for creating a position manager
 *
 * @property {Array<any>} constraints - Positioning constraints
 * @property {Object} offset - Position offset values
 * @property {HTMLElement} reference - Reference element for positioning
 * @property {PositioningStrategy} strategy - Positioning strategy to use
 * @property {boolean} transformOrigin - Whether to calculate transform origin
 */
export interface PositionManagerConfig {
  readonly constraints: Array<any>;
  readonly offset: { x: number; y: number };
  readonly reference: HTMLElement;
  readonly strategy: PositioningStrategy;
  readonly transformOrigin: boolean;
}

/**
 * Position Offset Configuration
 *
 * @interface PositionOffset
 * @description Offset configuration for positioning
 *
 * @property {number} x - Horizontal offset value
 * @property {number} y - Vertical offset value
 */
export interface PositionOffset {
  x: number;
  y: number;
}

/**
 * Position Padding Configuration
 *
 * @interface PositionPadding
 * @description Padding configuration for constraints
 *
 * @property {number | null} top - Top padding value
 * @property {number | null} right - Right padding value
 * @property {number | null} bottom - Bottom padding value
 * @property {number | null} left - Left padding value
 */
export interface PositionPadding {
  top?: number | null;
  right?: number | null;
  bottom?: number | null;
  left?: number | null;
}

/**
 * Position Calculation Result
 *
 * @interface PositionResult
 * @description Result of position calculation
 *
 * @property {PortalPosition} position - Calculated position
 * @property {Measurements} measurements - Measurements used in calculation
 */
export interface PositionResult {
  position: PortalPosition;
  measurements: Measurements;
}

/**
 * Positioning Strategy Options
 *
 * @type {PositioningStrategy}
 * @description Available positioning strategy options
 */
export type PositioningStrategy = 'center' | 'top' | 'bottom' | 'follow-trigger' | 'custom';
