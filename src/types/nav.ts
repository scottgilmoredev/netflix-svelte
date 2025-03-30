/**
 * Navigation item interface
 *
 * @typedef {Object} NavItem
 * @property {string} label - Display text for the navigation item
 * @property {boolean} [isCurrent=false] - Whether this is the current/active item
 */
export interface NavItem {
  label: string;
  isCurrent?: boolean;
}
