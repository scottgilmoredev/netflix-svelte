/**
 * Utilities Barrel Module
 *
 * @module
 * @description A barrel file that re-exports all utility functions from the various utility modules.
 * This provides a centralized import point for all application utilities, allowing consumers
 * to import from a single location rather than from individual files.
 *
 * The utilities exported from this module include error handling, general helpers, slider functionality,
 * and touch interaction utilities that are used throughout the application to provide
 * consistent behavior and reduce code duplication.
 *
 * @example
 * // Instead of multiple imports:
 * // import { handleError } from '../utils/errorUtils';
 * // import { formatDate } from '../utils/helperUtils';
 * // import { calculateStyleString } from '../utils/sliderUtils';
 *
 * // Use a single import:
 * import { handleError, formatDate, calculateStyleString } from '../utils';
 */

export * from './errorUtils';
export * from './helperUtils';
export * from './sliderUtils';
export * from './touchUtils';
