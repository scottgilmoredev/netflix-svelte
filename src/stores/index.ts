/**
 * Stores Barrel Module
 *
 * @module
 * @description A barrel file that re-exports all Svelte stores from the various store modules.
 * This provides a centralized import point for all application stores, allowing consumers
 * to import from a single location rather than from individual files.
 *
 * The stores exported from this module are used throughout the application to manage state
 * in a reactive way, leveraging Svelte's store pattern for predictable state management.
 *
 * @example
 * // Instead of multiple imports:
 * // import { mediaStore } from '../stores/mediaStore';
 * // import { modalStore } from '../stores/modalStore';
 *
 * // Use a single import:
 * import { mediaStore, modalStore } from '@stores';
 *
 * // Subscribe to store changes
 * $: media = $mediaStore;
 *
 * // Or use the store directly in a component
 * <MediaItem media={$mediaStore.featured} />
 */

export * from './continueWatchingStore';
export * from './mediaStore';
export * from './mediaStoreRegistry';
export * from './modalBaseStore';
export * from './modalGlobalStore';
export * from './navStore';
export * from './responsiveStore';
export * from './sliderStore';
