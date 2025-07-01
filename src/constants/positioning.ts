/**
 * Positioning System Constants Module
 *
 * @module
 * @description Contains constants and default configurations for the positioning system.
 * Provides default values for animations, offsets, padding, strategies, and performance settings.
 * This module centralizes all positioning-related constants to ensure consistency across
 * positioning components and utilities throughout the application.
 *
 * The positioning system uses these constants to provide sensible defaults for element
 * positioning, constraint handling, and animation behaviors while allowing for customization
 * when specific requirements differ from the defaults.
 *
 * @requires ./modal
 * @requires ../types/positioning
 */

// Constants
import { POSITION_CONSTANTS } from './modal';

// Types
import type {
  DefaultAnimationConfig,
  DefaultOffsetConfig,
  DefaultPaddingConfig,
  FallbackElementConfig,
  FallbackViewportConfig,
  PositioningStrategy,
} from '@types';

/**
 * Default Animation Configuration
 *
 * @constant
 * @type {DefaultAnimationConfig}
 * @description Default animation settings for position changes and transitions.
 * Provides smooth, consistent animations across all positioned elements unless
 * specifically overridden. Uses standard web animation timing for optimal user experience.
 */
export const DEFAULT_ANIMATION: DefaultAnimationConfig = {
  duration: 200,
  easing: 'ease',
  enabled: true,
};

/**
 * Default Position Offset
 *
 * @constant
 * @type {DefaultOffsetConfig}
 * @description Default offset values for element positioning in pixels.
 * Used when no specific offset is provided, ensuring elements are positioned
 * exactly at their calculated coordinates without additional displacement.
 */
export const DEFAULT_OFFSET: DefaultOffsetConfig = {
  x: 0,
  y: 0,
};

/**
 * Default Viewport Padding
 *
 * @constant
 * @type {DefaultPaddingConfig}
 * @description Default padding values for viewport constraints in pixels.
 * Ensures positioned elements maintain appropriate distance from viewport edges
 * while using responsive horizontal padding based on viewport width ratio.
 */
export const DEFAULT_PADDING: DefaultPaddingConfig = {
  top: 10,
  right: POSITION_CONSTANTS.DEFAULT_PADDING_RATIO,
  bottom: 10,
  left: POSITION_CONSTANTS.DEFAULT_PADDING_RATIO,
};

/**
 * Default Positioning Strategy
 *
 * @constant
 * @type {PositioningStrategy}
 * @description Default strategy for element positioning.
 * The 'follow-trigger' strategy positions elements relative to their trigger element,
 * providing intuitive positioning for tooltips, modals, and contextual overlays.
 */
export const DEFAULT_STRATEGY: PositioningStrategy = 'follow-trigger';

/**
 * Default Z-Index
 *
 * @constant
 * @type {number}
 * @description Default z-index value for positioned elements.
 * Ensures positioned elements appear above most content while allowing for
 * higher z-index values when specific layering requirements exist.
 */
export const DEFAULT_Z_INDEX: number = 1000;

/**
 * Fallback Element Dimensions Configuration
 *
 * @constant
 * @type {FallbackElementConfig}
 * @description Default element dimensions used when actual element measurements fail.
 * Zero dimensions prevent positioning errors while indicating measurement failure
 * through console warnings.
 *
 * @property {number} HEIGHT - Fallback element height in pixels (0px - indicates measurement failure)
 * @property {number} WIDTH - Fallback element width in pixels (0px - indicates measurement failure)
 */
export const FALLBACK_ELEMENT: FallbackElementConfig = {
  HEIGHT: 0,
  WIDTH: 0,
};

/**
 * Fallback Viewport Dimensions Configuration
 *
 * @constant
 * @type {FallbackViewportConfig}
 * @description Default viewport dimensions used when actual viewport measurements fail.
 * These values represent common desktop screen resolutions and provide reasonable
 * fallbacks for positioning calculations in error scenarios.
 *
 * @property {number} HEIGHT - Fallback viewport height in pixels (768px - common desktop height)
 * @property {number} WIDTH - Fallback viewport width in pixels (1024px - common desktop width)
 */
export const FALLBACK_VIEWPORT: FallbackViewportConfig = {
  HEIGHT: 768,
  WIDTH: 1024,
};

/**
 * Navigation Bar Height
 *
 * @constant
 * @type {number}
 * @description Height of the fixed navigation bar in pixels.
 * Used for positioning calculations to account for the nav bar offset when
 * centering modals relative to content elements that are pushed down by the nav.
 */
export const NAV_HEIGHT: number = 70;

/**
 * Update Throttle Interval
 *
 * @constant
 * @type {number}
 * @description Throttle time in milliseconds for position updates.
 * Limits the frequency of position recalculations during scroll and resize events
 * to approximately 60fps, balancing responsiveness with performance.
 */
export const UPDATE_THROTTLE: number = 16;
