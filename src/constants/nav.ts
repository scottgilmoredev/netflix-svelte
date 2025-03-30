// Types
import type { NavItem } from '../types';

/**
 * Primary navigation items for the Netflix-style navigation bar
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
 */
export const NETFLIX_LOGO_URL: string =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/250px-Netflix_2015_logo.svg.png';

/**
 * URL for the user avatar image
 *
 * @constant {string}
 * @description Default user avatar image from Behance CDN
 */
export const USER_AVATAR_URL: string =
  'https://mir-s3-cdn-cf.behance.net/project_modules/disp/366be133850498.56ba69ac36858.png';
