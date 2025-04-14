/**
 * Icons Constants Module
 *
 * @module
 * @description Centralizes constants and configuration for the icon system.
 * Provides the registry of specialized icon components, the list of special icons,
 * and default values for icon rendering.
 *
 * @requires @components/icons/ChevronIcon.svelte
 * @requires svelte
 * @requires @/types
 */

// Components
import ChevronIcon from '@components/icons/ChevronIcon.svelte';

// Types
import type { ComponentType, SvelteComponent } from 'svelte';
import type { SpecialIconName } from '@/types';

/**
 * Names of icons that have specialized components
 *
 * @constant
 * @type {readonly string[]}
 * @description Array of icon names that have specialized component implementations.
 * Used to determine if an icon should use a specialized component or the base component.
 * The 'as const' assertion ensures type safety when referencing these values.
 */
export const SPECIAL_ICONS: readonly string[] = ['chevron'] as const;

/**
 * Registry of specialized icon components
 *
 * @constant
 * @type {Record<SpecialIconName, ComponentType<SvelteComponent>>}
 * @description Maps specialized icon names to their corresponding Svelte component constructors.
 * This registry is used by the getIconComponent function to determine which component to use
 * for a given icon name.
 */
export const SPECIAL_ICON_REGISTRY: Record<SpecialIconName, ComponentType<SvelteComponent>> = {
  chevron: ChevronIcon,
};

/**
 * Default SVG viewBox value
 *
 * @constant
 * @type {string}
 * @description The default viewBox attribute value for SVG icons.
 * This ensures consistent sizing and proportions across all icons.
 */
export const VIEW_BOX: string = '0 0 24 24';
