/**
 * Responsive Store Module
 *
 * @module
 * @description Provides responsive functionality for adapting UI to different screen sizes.
 * Creates a store that updates based on window resize events to adjust the number of
 * items displayed in rows based on screen width.
 *
 * @requires svelte
 * @requires ../constants
 * @requires ../types
 */

import { onMount } from 'svelte';
import { writable } from 'svelte/store';

// Constants
import { DEFAULT_BREAKPOINTS } from '../constants';

// Types
import type { Breakpoint, ResponsiveItemsStore } from '../types';

/**
 * Store for responsive item count based on screen width
 *
 * @function createResponsiveItems
 * @description Creates a store that updates when window size changes
 *
 * @param {Breakpoint[]} [breakpoints=DEFAULT_BREAKPOINTS] - Array of breakpoints
 * @param {number} [defaultItems=5] - Default number of items
 * @returns {ResponsiveItemsStore} Svelte store with current item count
 *
 * @example
 * const itemsToDisplay = createResponsiveItems();
 *
 * // Use the store value
 * $: itemCount = $itemsToDisplay;
 */
export function createResponsiveItems(
  breakpoints: Breakpoint[] = DEFAULT_BREAKPOINTS,
  defaultItems: number = 5
): ResponsiveItemsStore {
  // Create a writable store with default value
  const itemsToDisplay = writable(defaultItems);

  // Function to calculate items based on window width
  const calculateItems = () => {
    const width = window.innerWidth;
    const breakpoint = breakpoints.find((breakpoint) => width <= breakpoint.maxWidth);

    if (breakpoint) {
      itemsToDisplay.set(breakpoint.items);
    }
  };

  // Set up event listener when component mounts
  onMount(() => {
    // Calculate initial value
    calculateItems();

    // Add resize listener if in browser environment
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', calculateItems);
    }

    // Return cleanup function
    return () => {
      window.removeEventListener('resize', calculateItems);
    };
  });

  // Return the store with added destroy method
  return {
    ...itemsToDisplay,

    // Add a custom method to the store to clean up event listeners
    destroy: () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', calculateItems);
      }
    },
  };
}
