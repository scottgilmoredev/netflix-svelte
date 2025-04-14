/**
 * Icon Registry Module
 *
 * @module
 * @description Provides a registry of specialized icon components and utility functions
 * for selecting the appropriate component based on icon name. This allows for a unified
 * API while supporting specialized icon behavior.
 *
 * @requires ../BaseIcon.svelte
 * @requires @/constants/icons
 * @requires svelte
 * @requires @types
 */

// Components
import BaseIcon from '../BaseIcon.svelte';

// Constants
import { SPECIAL_ICONS, SPECIAL_ICON_REGISTRY } from '@/constants/icons';

// Types
import type { ComponentType, SvelteComponent } from 'svelte';
import type { IconName, SpecialIconName } from '@types';

/**
 * Checks if an icon name refers to a specialized icon
 *
 * @function isSpecialIcon
 * @description Determines if the provided icon name is in the list of specialized icons
 * that have custom component implementations. Used to decide whether to use a specialized
 * component or the base icon component.
 *
 * @param {string} name - The icon name to check
 * @returns {boolean} True if the icon has a specialized component, false otherwise
 *
 * @example
 * // Check if 'chevron' is a specialized icon
 * if (isSpecialIcon('chevron')) {
 *   // Use specialized component
 * }
 */
export function isSpecialIcon(name: string): name is SpecialIconName {
  return SPECIAL_ICONS.includes(name as SpecialIconName);
}

/**
 * Gets the corresponding icon component for a given icon name
 *
 * @function getIconComponent
 * @description Retrieves the appropriate Svelte component for the given icon name.
 * If the icon has a specialized component in the registry, that component is returned.
 * Otherwise, the base icon component is returned.
 *
 * @param {IconName} name - The name of the icon to retrieve
 * @returns {ComponentType<SvelteComponent>} The Svelte component for the icon
 *
 * @example
 * // Get the component for the 'search' icon
 * const SearchIcon = getIconComponent('search');
 *
 * @example
 * // Use with dynamic component rendering
 * const IconComponent = getIconComponent(iconName);
 * <svelte:component this={IconComponent} {...props} />
 */
export function getIconComponent(name: IconName): ComponentType<SvelteComponent> {
  if (isSpecialIcon(name)) {
    return SPECIAL_ICON_REGISTRY[name as SpecialIconName];
  }

  return BaseIcon;
}
