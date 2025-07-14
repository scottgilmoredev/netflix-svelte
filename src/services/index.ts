/**
 * Services Barrel Module
 *
 * @module
 * @description A barrel file that re-exports all services from the various service modules.
 * This provides a centralized import point for all application services, allowing consumers
 * to import from a single location rather than from individual files.
 *
 * @example
 * // Instead of multiple imports:
 * // import { fetchMediaDetailsBatch } from '@services/mediaDetailsService';
 * // import { fetchMediaByCategory } from '@services/mediasService';
 *
 * // Use a single import:
 * import { fetchMediaDetailsBatch, fetchMediaByCategory } from '@services';
 */

export * from './apiService';
export * from './mediaDetailsService';
export * from './mediaService';
