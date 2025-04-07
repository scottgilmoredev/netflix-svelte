/**
 * Navigation Constants Module
 *
 * @module
 * @description Contains constants related to the navigation components.
 * Provides navigation items, URLs, and timing values used throughout
 * the navigation system.
 *
 * @requires ../types
 */

// Types
import type { NavItem } from '../types';

/**
 * Primary navigation items for the navigation bar
 *
 * @constant {Array<NavItem>}
 * @description Defines the main navigation menu items displayed in the navigation bar.
 * Each item has a label and can optionally be marked as the current/active item.
 *
 * @example
 * // Using NAV_ITEMS in a component
 * <NavPrimary items={NAV_ITEMS} />
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', isCurrent: true },
  { label: 'TV Shows' },
  { label: 'Movies' },
  { label: 'New & Popular' },
  { label: 'My List' },
  { label: 'Browse by Language' },
];

/**
 * URL for the Netflix logo image
 *
 * @constant {string}
 * @description Official Netflix logo SVG from Wikimedia Commons
 *
 * @example
 * // Using the logo URL in an image element
 * <img src={NETFLIX_LOGO_URL || "/placeholder.svg"} alt="Netflix Logo" />
 */
export const NETFLIX_LOGO_URL: string =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/250px-Netflix_2015_logo.svg.png';

/**
 * Transition duration in milliseconds
 *
 * @constant {number}
 * @description Defines the duration for fade transitions in the navigation components.
 * Used for smooth appearance and disappearance of dropdown menus.
 *
 * @example
 * // Using transition duration with Svelte transitions
 * <div transition:fade={{ duration: TRANSITION_DURATION }}>
 *   Content
 * </div>
 */
export const TRANSITION_DURATION = 150;

/**
 * Delay before closing dropdown when mouse leaves trigger
 *
 * @constant {number}
 * @description Short delay in milliseconds before closing the dropdown menu
 * when the mouse leaves the dropdown area. Prevents accidental closing
 * when the user briefly moves the mouse outside the dropdown.
 *
 * @example
 * // Using in a timeout function
 * setTimeout(closeDropdown, DROPDOWN_TIMEOUT_DELAY);
 */
export const DROPDOWN_TIMEOUT_DELAY = 50;

/**
 * Delay before closing dropdown when mouse leaves trigger
 *
 * @constant {number}
 * @description Longer delay in milliseconds before closing the dropdown menu
 * when the mouse leaves the trigger button. Gives the user time to move
 * the mouse from the trigger to the dropdown content.
 *
 * @example
 * // Using in a timeout function
 * setTimeout(updateDropdownState, TRIGGER_TIMEOUT_DELAY);
 */
export const TRIGGER_TIMEOUT_DELAY = 350;

/**
 * URL for the user avatar image
 *
 * @constant {string}
 * @description Default user avatar image from Behance CDN.
 * Used in the navigation bar to represent the current user.
 *
 * @example
 * // Using the avatar URL in a component
 * <UserAvatar src={USER_AVATAR_URL} alt="User Avatar" />
 */
export const USER_AVATAR_URL: string =
  'https://mir-s3-cdn-cf.behance.net/project_modules/disp/366be133850498.56ba69ac36858.png';
