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
 * // import { handleError } from '@utils/error';
 * // import { truncate } from '@utils/helper';
 * // import { calculateStyleString } from '@utils/slider';
 *
 * // Use a single import:
 * import { handleError, truncate, calculateStyleString } from '@utils';
 */

export * from './animations';
export * from './coordinates';
export * from './error';
export * from './helper';
export * from './positioning';
export * from './row';
export * from './slider';
export * from './timeout';
export * from './touch';
export * from './typeGuards';
