/**
 * Responsive Constants Module
 *
 * @module
 * @description Contains constants related to responsive design and layout.
 * Defines breakpoints and responsive behavior configurations used throughout the application.
 *
 * @requires ../types
 */

import type { Breakpoint } from '../types';

/**
 * Responsive breakpoints configuration
 *
 * @constant
 * @type {Breakpoint[]}
 * @description Defines how many items to show at different screen widths
 */
export const DEFAULT_BREAKPOINTS: Breakpoint[] = [
  { maxWidth: 500, items: 2 },
  { maxWidth: 800, items: 3 },
  { maxWidth: 1100, items: 4 },
  { maxWidth: 1400, items: 5 },
  { maxWidth: Number.POSITIVE_INFINITY, items: 6 },
];
