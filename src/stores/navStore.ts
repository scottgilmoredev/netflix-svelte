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
import type { HoverTarget, NavItem, NavState } from '../types';

/**
 * Initial navigation state
 *
 * @constant {NavState}
 * @description Default state used when initializing the navigation store.
 * Sets the Home item as current, dropdown closed, and no hover states.
 */
const initialState: NavState = {
  currentItem: 'Home',
  items: NAV_ITEMS,
  hoverStates: {
    primaryNav: {
      trigger: false,
      dropdown: false,
    },
    accountNav: {
      trigger: false,
      dropdown: false,
    },
  },
  openDropdowns: {
    primaryNav: false,
    accountNav: false,
  },
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
  const timeouts: { [key: string]: { trigger: number | null; dropdown: number | null } } = {
    primaryNav: { trigger: null, dropdown: null },
    accountNav: { trigger: null, dropdown: null },
  };

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

  /**
   * Handles mouse hover state for navigation elements
   *
   * @function setHoverState
   * @description Updates hover state for the specified target and manages visibility
   * with a timeout when the mouse leaves. Used internally by setDropdownHover and setTriggerHover.
   *
   * @param {boolean} isHovering - Whether the mouse is currently over the element
   * @param {HoverTarget} target - Which part of the navigation is being hovered ('trigger' or 'dropdown')
   * @param {string} [dropdownId='main'] - Identifier for the dropdown
   */
  function setHoverState(
    isHovering: boolean,
    target: HoverTarget,
    dropdownId: string = 'primaryNav'
  ) {
    // Determine the opposite target (if we're hovering trigger, the opposite is dropdown and vice versa)
    const oppositeTarget = target === 'trigger' ? 'dropdown' : 'trigger';

    // Get the appropriate timeout delay based on the target
    const timeoutDelay = target === 'trigger' ? TRIGGER_TIMEOUT_DELAY : DROPDOWN_TIMEOUT_DELAY;

    // Clear the existing timeout for this target
    clearTimeouts(timeouts[dropdownId][target]);

    if (isHovering) {
      // Mouse entered: Update state immediately
      updateHoverStateEnter(target, dropdownId);
      return;
    }

    // Mouse left: Set timeout to update state
    timeouts[dropdownId][target] = window.setTimeout(() => {
      update((state) => {
        const isOppositeTargetHovered = !!state.hoverStates[dropdownId]?.[oppositeTarget];

        if (isOppositeTargetHovered) {
          // If opposite target is hovered, only update hover state
          return updateTargetHoverState(state, target, dropdownId, false);
        }

        // If nothing else is hovered, update hover state and close dropdown
        return {
          ...updateTargetHoverState(state, target, dropdownId, false),
          openDropdowns: {
            ...state.openDropdowns,
            [dropdownId]: false,
          },
        };
      });
    }, timeoutDelay) as unknown as number;
  }

  /**
   * Updates the hover state when mouse enters a target
   *
   * @function updateHoverStateEnter
   * @param {HoverTarget} target - The target being hovered
   * @param {string} dropdownId - Identifier for the dropdown
   */
  function updateHoverStateEnter(target: HoverTarget, dropdownId: string): void {
    update((state) => ({
      ...state,
      hoverStates: {
        ...state.hoverStates,
        [dropdownId]: {
          ...state.hoverStates[dropdownId],
          [target]: true,
        },
      },
      openDropdowns: {
        ...state.openDropdowns,
        [dropdownId]: true,
      },
    }));
  }

  /**
   * Creates a new state object with updated hover state for a target
   *
   * @function updateTargetHoverState
   * @param {NavState} state - Current navigation state
   * @param {HoverTarget} target - The target to update
   * @param {string} dropdownId - Identifier for the dropdown
   * @param {boolean} isHovering - New hover state
   * @returns {NavState} Updated state object
   */
  function updateTargetHoverState(
    state: NavState,
    target: HoverTarget,
    dropdownId: string,
    isHovering: boolean
  ): NavState {
    return {
      ...state,
      hoverStates: {
        ...state.hoverStates,
        [dropdownId]: {
          ...state.hoverStates[dropdownId],
          [target]: isHovering,
        },
      },
    };
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
      Object.values(timeouts).forEach((item) => {
        clearTimeouts(item.trigger, item.dropdown);
      });
    },

    /**
     * Closes the dropdown menu
     *
     * @function closeDropdown
     * @description Sets isDropdownOpen to false
     */
    closeDropdown: (dropdownId: string = 'main') =>
      update((state) => ({
        ...state,
        openDropdowns: {
          ...state.openDropdowns,
          [dropdownId]: false,
        },
      })),

    /**
     * Opens the dropdown menu
     *
     * @function openDropdown
     * @description Sets isDropdownOpen to true
     */
    openDropdown: (dropdownId: string = 'main') =>
      update((state) => ({
        ...state,
        openDropdowns: {
          ...state.openDropdowns,
          [dropdownId]: true,
        },
      })),

    /**
     * Resets the navigation state to its initial values
     *
     * @function reset
     * @description Clears timeouts and resets the store to initialState
     */
    reset: () => {
      Object.values(timeouts).forEach((item) => {
        clearTimeouts(item.trigger, item.dropdown);
      });
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
     * @param {string} [dropdownId='main'] - Identifier for the dropdown
     */
    setDropdownHover: (isHovering: boolean, dropdownId: string = 'main') => {
      setHoverState(isHovering, 'dropdown', dropdownId);
    },

    /**
     * Handles mouse hover state for the trigger button
     *
     * @function setTriggerHover
     * @description Updates hover state for the trigger and manages dropdown visibility
     * with a timeout when the mouse leaves
     *
     * @param {boolean} isHovering - Whether the mouse is currently over the trigger
     * @param {string} [dropdownId='main'] - Identifier for the dropdown
     */
    setTriggerHover: (isHovering: boolean, dropdownId: string = 'main') => {
      setHoverState(isHovering, 'trigger', dropdownId);
    },

    /**
     * Toggles the dropdown menu
     *
     * @function toggleDropdown
     * @description Inverts the current isDropdownOpen state
     */
    toggleDropdown: (dropdownId: string = 'main') =>
      update((state) => ({
        ...state,
        openDropdowns: {
          ...state.openDropdowns,
          [dropdownId]: !state.openDropdowns[dropdownId],
        },
      })),

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
