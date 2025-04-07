/**
 * Navigation Types Module
 *
 * @module
 * @description Contains type definitions related to navigation components.
 * Provides interfaces for navigation items and navigation state management.
 */

/**
 * Navigation item interface
 *
 * @interface NavItem
 * @description Defines the structure of a navigation menu item.
 * Used throughout the application to represent items in the navigation bar.
 *
 * @property {string} label - Display text for the navigation item
 * @property {boolean} [isCurrent=false] - Whether this is the current/active item
 *
 * @example
 * // Creating a navigation item
 * const homeItem: NavItem = { label: 'Home', isCurrent: true };
 */
export interface NavItem {
  label: string;
  isCurrent?: boolean;
}

/**
 * Navigation state interface
 *
 * @interface NavState
 * @description Defines the structure of the navigation store state.
 * Contains all state needed to manage the navigation system, including
 * dropdown visibility, hover states, and the current navigation item.
 *
 * @property {boolean} isDropdownOpen - Whether the dropdown menu is currently open
 * @property {string} currentItem - Label of the currently selected navigation item
 * @property {boolean} isMouseOverTrigger - Whether the mouse is over the dropdown trigger
 * @property {boolean} isMouseOverDropdown - Whether the mouse is over the dropdown menu
 * @property {NavItem[]} items - Array of navigation items to display
 *
 * @example
 * // Initial navigation state
 * const initialState: NavState = {
 *   isDropdownOpen: false,
 *   currentItem: 'Home',
 *   isMouseOverTrigger: false,
 *   isMouseOverDropdown: false,
 *   items: NAV_ITEMS,
 * };
 */
export interface NavState {
  isDropdownOpen: boolean;
  currentItem: string;
  isMouseOverTrigger: boolean;
  isMouseOverDropdown: boolean;
  items: NavItem[];
}
