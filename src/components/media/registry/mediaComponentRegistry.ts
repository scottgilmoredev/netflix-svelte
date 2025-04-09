/**
 * Component Registry Module
 *
 * @module
 * @description Provides a registry for media components and utility functions
 * for selecting the appropriate component based on row properties.
 *
 * @requires ../MediaItemBase.svelte
 * @requires ../MediaItemRanked.svelte
 * @requires ../MediaItemWithProgress.svelte
 */

// Components
import MediaItemBase from '../MediaItemBase.svelte';
import MediaItemRanked from '../MediaItemBase.svelte';
import MediaItemWithProgress from '../MediaItemWithProgress.svelte';

/**
 * Gets the appropriate component based on row properties
 *
 * @param {boolean} isTopMedia - Whether this is a top media row
 * @param {boolean} showProgress - Whether to show progress bars
 * @returns The appropriate Svelte component
 */
export function getComponentForRow(isTopMedia: boolean, showProgress: boolean): MediaComponentType {
  if (isTopMedia) return MEDIA_COMPONENTS.ranked;
  if (showProgress) return MEDIA_COMPONENTS.progress;

  return MEDIA_COMPONENTS.default;
}

/**
 * Type for media component constructors
 *
 * @typedef {Object} MediaComponentType
 * @description Represents the union type of all possible media item component constructors.
 * Used for component registry and dynamic component selection based on media type.
 * This type ensures type safety when working with component references in the registry
 * and component selection functions.
 *
 * @example
 * // Using in the component registry
 * const MEDIA_COMPONENTS: Record<string, MediaComponentType> = {
 *   default: MediaItem,
 *   ranked: MediaItemRanked,
 *   progress: MediaItemWithProgress
 * };
 *
 * @example
 * // Using in Row.svelte to determine which component to use
 * $: MediaItemComponent = getComponentForRow(isTopMedia, showProgress);
 *
 * // Later in the template
 * <svelte:component this={MediaItemComponent} data={item.data} width={itemWidth} />
 */
export type MediaComponentType =
  | typeof MediaItemBase
  | typeof MediaItemRanked
  | typeof MediaItemWithProgress;

/**
 * Registry of media components
 *
 * @constant {Record<string, MediaComponentType>}
 * @description Maps component type identifiers to their corresponding Svelte component constructors.
 * This registry centralizes all media component references and is used by the component
 * selection functions to dynamically determine which component to render based on
 * row properties or media type.
 *
 * The keys represent logical component types:
 * - 'default': Standard media items (backdrop image)
 * - 'ranked': Ranked media items (poster image) with rank number display
 * - 'progress': Media items with watch progress indicator
 *
 * @example
 * // Using in getComponentForRow
 * function getComponentForRow(isTopMedia: boolean, showProgress: boolean): MediaComponentType {
 *   if (isTopMedia) return MEDIA_COMPONENTS.ranked;
 *   if (showProgress) return MEDIA_COMPONENTS.progress;
 *   return MEDIA_COMPONENTS.default;
 * }
 */
export const MEDIA_COMPONENTS: Record<string, MediaComponentType> = {
  default: MediaItemBase,
  ranked: MediaItemRanked,
  progress: MediaItemWithProgress,
};
