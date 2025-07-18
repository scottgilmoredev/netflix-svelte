/**
 * Types Barrel Module
 *
 * @module
 * @description A barrel file that re-exports all TypeScript types and interfaces from the various type modules.
 * This provides a centralized import point for all application types, allowing consumers
 * to import from a single location rather than from individual files.
 *
 * The types exported from this module are used throughout the application to ensure
 * type safety and provide better developer experience with autocompletion and documentation.
 *
 * @example
 * // Instead of multiple imports:
 * // import type { Movie } from '@types/media';
 * // import type { Breakpoint } from '@types/responsive';
 *
 * // Use a single import:
 * import type { Movie, Breakpoint } from '@types';
 */

export * from './animations';
export * from './api';
export * from './coordinates';
export * from './icons';
export * from './intersectionObserver';
export * from './media';
export * from './modal';
export * from './nav';
export * from './portal';
export * from './positioning';
export * from './responsive';
export * from './slider';
export * from './timeout';
export * from './touch';
