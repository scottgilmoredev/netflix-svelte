/**
 * Navigation Store Module
 *
 * @module
 * @description Provides a centralized store for managing navigation state.
 * This allows components to share navigation state without prop drilling.
 * Handles dropdown visibility, hover states, and current item selection.
 *
 * @requires svelte/store
 * @requires ../constants
 * @requires ../types
 */

import { writable, derived } from 'svelte/store';

// Constants
import { DROPDOWN_TIMEOUT_DELAY, NAV_ITEMS, TRIGGER_TIMEOUT_DELAY } from '../constants';

// Types
import type { NavItem, NavState } from '../types';

/**
 * Initial navigation state
 *
 * @constant {NavState}
 * @description Default state used when initializing the navigation store.
 * Sets the Home item as current, dropdown closed, and no hover states.
 */
const initialState: NavState = {
  isDropdownOpen: false,
  currentItem: 'Home',
  isMouseOverTrigger: false,
  isMouseOverDropdown: false,
  items: NAV_ITEMS,
};

/**
 * Creates the navigation store
 *
 * @function createNavStore
 * @description Factory function that creates a writable store with additional
 * methods for managing navigation state, including dropdown visibility,
 * hover states, and current item selection.
 *
 * @returns {Object} Enhanced store with navigation-specific methods
 */
function createNavStore() {
  const { subscribe, update, set } = writable<NavState>(initialState);

  // Track timeouts to clear them when needed
  let triggerTimeout: number | null = null;
  let dropdownTimeout: number | null = null;

  /**
   * Helper to clear timeouts
   *
   * @function clearTimeouts
   * @description Safely clears one or more timeout IDs
   *
   * @param {...(number|null)} timeoutIds - Timeout IDs to clear
   */
  function clearTimeouts(...timeoutIds: (number | null)[]) {
    timeoutIds.forEach((id) => {
      if (id !== null) window.clearTimeout(id);
    });
  }

  return {
    subscribe,

    /**
     * Cleans up resources used by the store
     *
     * @function cleanup
     * @description Clears any active timeouts to prevent memory leaks
     * when components using the store are destroyed
     */
    cleanup: () => {
      clearTimeouts(triggerTimeout, dropdownTimeout);
    },

    /**
     * Closes the dropdown menu
     *
     * @function closeDropdown
     * @description Sets isDropdownOpen to false
     */
    closeDropdown: () => update((state) => ({ ...state, isDropdownOpen: false })),

    /**
     * Opens the dropdown menu
     *
     * @function openDropdown
     * @description Sets isDropdownOpen to true
     */
    openDropdown: () => update((state) => ({ ...state, isDropdownOpen: true })),

    /**
     * Resets the navigation state to its initial values
     *
     * @function reset
     * @description Clears timeouts and resets the store to initialState
     */
    reset: () => {
      clearTimeouts(triggerTimeout, dropdownTimeout);
      set(initialState);
    },

    /**
     * Sets the current navigation item
     *
     * @function setCurrentItem
     * @description Updates the currentItem in the store
     *
     * @param {string} item - The label of the current item
     */
    setCurrentItem: (item: string) => update((state) => ({ ...state, currentItem: item })),

    /**
     * Handles mouse hover state for the dropdown menu
     *
     * @function setDropdownHover
     * @description Updates hover state for the dropdown and manages visibility
     * with a timeout when the mouse leaves
     *
     * @param {boolean} isHovering - Whether the mouse is currently over the dropdown
     */
    setDropdownHover: (isHovering: boolean) => {
      clearTimeouts(dropdownTimeout);

      if (!isHovering) {
        dropdownTimeout = window.setTimeout(() => {
          update((state) => {
            // Only close if mouse is not over trigger
            if (!state.isMouseOverTrigger) {
              return { ...state, isMouseOverDropdown: false, isDropdownOpen: false };
            }

            // If mouse is over trigger, just update the state
            return { ...state, isMouseOverDropdown: false };
          });
        }, DROPDOWN_TIMEOUT_DELAY) as unknown as number;
      } else {
        update((state) => ({
          ...state,
          isMouseOverDropdown: true,
          isDropdownOpen: true,
        }));
      }
    },

    /**
     * Handles mouse hover state for the trigger button
     *
     * @function setTriggerHover
     * @description Updates hover state for the trigger and manages dropdown visibility
     * with a timeout when the mouse leaves
     *
     * @param {boolean} isHovering - Whether the mouse is currently over the trigger
     */
    setTriggerHover: (isHovering: boolean) => {
      clearTimeouts(triggerTimeout);

      if (!isHovering) {
        triggerTimeout = window.setTimeout(() => {
          update((state) => {
            // Only close if mouse is not over dropdown
            if (!state.isMouseOverDropdown) {
              return { ...state, isMouseOverTrigger: false, isDropdownOpen: false };
            }

            // If mouse is over dropdown, just update the state
            return { ...state, isMouseOverTrigger: false };
          });
        }, TRIGGER_TIMEOUT_DELAY) as unknown as number;
      } else {
        update((state) => ({
          ...state,
          isMouseOverTrigger: true,
          isDropdownOpen: true,
        }));
      }
    },

    /**
     * Toggles the dropdown menu
     *
     * @function toggleDropdown
     * @description Inverts the current isDropdownOpen state
     */
    toggleDropdown: () => update((state) => ({ ...state, isDropdownOpen: !state.isDropdownOpen })),

    /**
     * Updates the navigation items array
     *
     * @function updateItems
     * @description Replaces the items array in the store
     *
     * @param {NavItem[]} items - New navigation items array
     */
    updateItems: (items: NavItem[]) => update((state) => ({ ...state, items })),
  };
}

/**
 * The navigation store instance
 *
 * @constant {Object}
 * @description Singleton instance of the navigation store that can be imported
 * and used throughout the application
 */
export const navStore = createNavStore();

/**
 * Derived store for navigation items with current item marked
 *
 * @constant {Readable<NavItem[]>}
 * @description A derived store that automatically updates the isCurrent
 * property of navigation items based on the current item in the navStore
 */
export const navItems = derived(navStore, ($navStore) =>
  updateCurrentNavItem($navStore.items, $navStore.currentItem)
);

/**
 * Updates the current item in the navigation items array
 *
 * @function updateCurrentNavItem
 * @description Creates a new array of navigation items with the isCurrent
 * property set based on whether the item's label matches the currentItem
 *
 * @param {NavItem[]} items - The navigation items array
 * @param {string} currentItem - The label of the current item
 * @returns {NavItem[]} The updated navigation items array
 */
export function updateCurrentNavItem(items: NavItem[], currentItem: string): NavItem[] {
  return items.map((item) => ({
    ...item,
    isCurrent: item.label === currentItem,
  }));
}
