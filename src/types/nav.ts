/**
 * Navigation Types Module
 *
 * @module
 * @description Contains type definitions related to navigation components.
 * Provides interfaces for navigation items and navigation state management.
 */

/**
 * Type representing the possible hover targets in the navigation
 *
 * @typedef {'trigger'|'dropdown'} HoverTarget
 * @description Identifies which part of the navigation is being hovered
 */
export type HoverTarget = 'trigger' | 'dropdown';

/**
 * IconName Type
 *
 * @typedef {string} IconName
 * @description Represents the available icon names that can be used throughout the application.
 * These values correspond to specific icon assets or components that will be rendered.
 *
 * @property {'help'} help - Help/question mark icon
 * @property {'pencil'} pencil - Pencil/edit icon
 * @property {'transfer'} transfer - Transfer/move icon
 * @property {'user'} user - User/profile icon
 */
export type IconName = 'help' | 'pencil' | 'transfer' | 'user';

/**
 * Navigation item interface
 *
 * @interface NavItem
 * @description Defines the structure of a navigation menu item.
 * Used throughout the application to represent items in the navigation bar.
 *
 * @property {boolean} [isCurrent=false] - Whether this is the current/active item
 * @property {string} label - Display text for the navigation item
 *
 * @example
 * // Creating a navigation item
 * const homeItem: NavItem = { label: 'Home', isCurrent: true };
 */
export interface NavItem {
  avatarSrc?: string;
  icon?: IconName;
  isCurrent?: boolean;
  label: string;
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
  currentItem: string;
  items: NavItem[];
  hoverStates: {
    [key: string]: {
      trigger: boolean;
      dropdown: boolean;
    };
  };
  openDropdowns: {
    [key: string]: boolean;
  };
}
