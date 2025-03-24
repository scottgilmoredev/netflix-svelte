import type { Writable } from 'svelte/store';

/**
 * Represents a responsive breakpoint for the slider
 *
 * @typedef {Object} Breakpoint
 * @property {number} maxWidth - Maximum viewport width in pixels for this breakpoint
 * @property {number} items - Number of items to display at this breakpoint
 */
export interface Breakpoint {
  maxWidth: number;
  items: number;
}

/**
 * Represents a responsive items store that tracks the number of items to display
 *
 * @typedef {Object} ResponsiveItemsStore
 * @extends {Writable<number>} - Extends the Svelte writable store with a number value
 * @property {function} destroy - Cleans up resources and removes event listeners when the store is no longer needed
 */
export interface ResponsiveItemsStore extends Writable<number> {
  destroy: () => void;
}
