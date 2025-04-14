/**
 * Icon Types and Paths Module
 *
 * @module
 * @description Centralizes icon path data and type definitions for the icon system.
 * This module provides the SVG path data for all standard icons, as well as type
 * definitions to ensure type safety when working with icons throughout the application.
 *
 * @requires @constants
 */

import { ICON_PATHS, SPECIAL_ICONS } from '@constants';

/**
 * Type for all possible icon names
 *
 * @type {string}
 * @description Union type combining both standard icon names from the path registry
 * and specialized icon names that have custom component implementations.
 */
export type AnyIconName = IconName | SpecialIconName;

/**
 * Type for valid icon names
 *
 * @type {string}
 * @description Union type of all available icon names in the registry.
 * This is derived from the keys of the iconPaths object, ensuring that
 * only icons with defined path data can be referenced.
 */
export type IconName = keyof typeof ICON_PATHS;

/**
 * Icon path data structure
 *
 * @interface IconPathData
 * @description Defines the structure for SVG icon path data, including
 * the viewBox dimensions and the actual path data string.
 *
 * @property {string} viewBox - The SVG viewBox attribute value
 * @property {string} path - The SVG path data
 */
export interface IconPathData {
  viewBox: string;
  path: string;
}

/**
 * Type for specialized icon names
 *
 * @type {string}
 * @description Union type of all specialized icon names derived from the SPECIAL_ICONS array.
 * This provides type safety when referencing specialized icons that have custom component
 * implementations rather than using the standard path-based rendering.
 */
export type SpecialIconName = (typeof SPECIAL_ICONS)[number];
