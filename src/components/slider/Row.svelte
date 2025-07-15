<script lang="ts">
  /**
   * Row Component
   *
   * @component
   * @description A sophisticated horizontal scrollable row component that displays media items
   * in a Netflix-style interface with advanced features including lazy loading, responsive
   * behavior, and optimized performance. Manages complex state through multiple stores for
   * slider positioning, responsive item calculations, and media data handling. Features
   * intersection observer-based lazy loading for improved performance, automatic media detail
   * fetching for visible content, and dynamic component selection based on row type. Supports
   * both standard media items and ranked media items with progress indicators, providing
   * flexible content presentation options.
   *
   * @prop {boolean} [isTopMedia=false] - Whether this row displays top-ranked movies with rank numbers
   * @prop {MediaStore} mediaStore - Store containing the media data and management functions
   * @prop {boolean} [priority=false] - Whether to fetch media details immediately without waiting for visibility
   * @prop {boolean} [showProgress=false] - Whether to display progress indicators on media items
   *
   * @requires svelte
   * @requires svelte/store
   * @requires ../../actions/intersectionObserver
   * @requires ../media/registry/mediaComponentRegistry
   * @requires ./RowHeader.svelte
   * @requires ./Slider.svelte
   * @requires ../../services/mediaDetailsService
   * @requires @stores
   * @requires @types
   * @requires @utils
   */

  import { onDestroy } from 'svelte';
  import type { Unsubscriber } from 'svelte/store';

  // Actions
  import { intersectionObserver } from '../../actions/intersectionObserver';

  // Component Registry
  import { getComponentForRow } from '../media/registry/mediaComponentRegistry';

  // Components
  import RowHeader from './RowHeader.svelte';
  import Slider from './Slider.svelte';

  // Services
  import { fetchMediaDetailsBatch } from '../../services/mediaDetailsService';

  // Stores
  import { createResponsiveItems } from '@stores';

  // Types
  import type {
    AnyMedia,
    MediaContent,
    MediaStore,
    ResponsiveItemsStore,
    SliderDerived,
    SliderState,
  } from '@types';
  import '@types/intersectionObserver';

  // Utils
  import { setupRowStores } from '../../utils';

  /**
   * Props for the Row component
   *
   * @interface {Object} RowProps
   * @property {boolean} [isTopMedia] - Enables ranked display mode with numbered items
   * @property {MediaStore} mediaStore - Store managing media data and state
   * @property {boolean} [priority] - Forces immediate detail fetching without visibility checks
   * @property {boolean} [showProgress] - Enables progress indicators on media items
   */
  interface RowProps {
    isTopMedia?: boolean;
    mediaStore: MediaStore;
    priority?: boolean;
    showProgress?: boolean;
  }

  export let isTopMedia: RowProps['isTopMedia'] = false;
  export let mediaStore: RowProps['mediaStore'];
  export let priority: RowProps['priority'] = false;
  export let showProgress: RowProps['showProgress'] = false;

  // Create responsive items hook for dynamic sizing
  const itemsToDisplay: ResponsiveItemsStore = createResponsiveItems();

  // Create and initialize slider store with cleanup function
  const { sliderStore, cleanup } = setupRowStores(mediaStore, itemsToDisplay);
  const { state, derived, actions } = sliderStore;

  // Store the full slider derived values object for component communication
  let derivedValues: SliderDerived;

  // Destructured values for template usage
  let itemWidth: number;
  let sliderContent: MediaContent[];
  let totalItems: number;

  // Track if details have been fetched for this row to prevent duplicate requests
  let detailsFetched = false;

  // Reference to the row element for initial visibility check
  let rowElement: HTMLDivElement;

  /**
   * Media item component determined by row configuration
   *
   * @type {any}
   * @description Reactive variable that selects the appropriate media item component
   * based on the row's configuration (top media, progress display).
   */
  let MediaItemComponent: any;

  /**
   * Reactive statement for component selection
   *
   * @description Determines which media item component to use based on the row's
   * configuration. Uses the component registry to select between standard media
   * items, ranked media items, and progress-enabled variants.
   *
   * @example
   * // Standard media row
   * isTopMedia = false, showProgress = false;
   * // Result: MediaItemComponent = StandardMediaItem
   *
   * @example
   * // Top media row with rankings
   * isTopMedia = true, showProgress = false;
   * // Result: MediaItemComponent = RankedMediaItem
   *
   * @example
   * // Progress-enabled media row
   * isTopMedia = false, showProgress = true;
   * // Result: MediaItemComponent = ProgressMediaItem
   */
  $: MediaItemComponent = getComponentForRow(isTopMedia ?? false, showProgress ?? false);

  /**
   * Reactive statement for slider state updates
   *
   * @description Updates the slider store when the responsive items count changes.
   * Ensures the slider maintains proper positioning and behavior when the number
   * of visible items changes due to screen size adjustments.
   */
  $: {
    state.update((s: SliderState) => ({
      ...s,
      itemsToDisplayInRow: $itemsToDisplay,
    }));
  }

  /**
   * Subscribe to the derived slider store to get updated values
   *
   * @constant {Unsubscriber} derivedUnsubscribe
   * @description Subscribes to the derived slider store to receive updated values for
   * slider positioning, content filtering, and responsive calculations. Filters out
   * any slider content items with null data to ensure clean rendering. Triggers
   * media detail fetching for priority rows or visible content.
   *
   * @example
   * // When slider content updates
   * derived.subscribe((values) => {
   *   // Updates itemWidth, totalItems, sliderContent
   *   // Triggers detail fetching if conditions are met
   * });
   */
  const derivedUnsubscriber: Unsubscriber = derived.subscribe((values) => {
    // Store the full object for component communication
    derivedValues = values;

    // Destructure specific values for template usage
    ({ itemWidth, totalItems } = values);

    // Filter content to ensure we only have valid items
    sliderContent = values.sliderContent.filter((item) => item.data !== null) as MediaContent[];

    // If we have new content and this is a priority row, fetch details
    if (sliderContent && !detailsFetched) {
      // If this is a priority row or it's visible, fetch details immediately
      if (priority || (rowElement && isElementInViewport(rowElement))) {
        fetchDetailsForRow();
      }
    }
  });

  /**
   * Fetches detailed media information for all items in the row
   *
   * @function fetchDetailsForRow
   * @description Initiates batch fetching of detailed media information for all items
   * currently displayed in the row. Prevents duplicate requests through the detailsFetched
   * flag and handles errors gracefully. Essential for providing rich content information
   * in preview modals and detailed displays.
   *
   * @returns {Promise<void>} Promise that resolves when detail fetching is complete
   *
   * @example
   * // Automatic fetching for priority rows
   * if (priority) {
   *   await fetchDetailsForRow();
   * }
   *
   * @example
   * // Lazy fetching when row becomes visible
   * function handleIntersection() {
   *   if (isIntersecting) {
   *     fetchDetailsForRow();
   *   }
   * }
   */
  async function fetchDetailsForRow(): Promise<void> {
    if (detailsFetched || !sliderContent || sliderContent.length === 0) return;

    detailsFetched = true;

    // Extract the media items from the slider content and filter out null values
    const mediaItems = sliderContent
      .map((item) => item.data)
      .filter((data): data is AnyMedia => data !== null);

    // Fetch details for all media items in this row
    try {
      await fetchMediaDetailsBatch(mediaItems);
    } catch (err) {
      console.error('Error fetching media details for row:', err);
    }
  }

  /**
   * Handles intersection observer events for lazy loading
   *
   * @function handleIntersection
   * @description Processes intersection observer events to trigger media detail fetching
   * when the row becomes visible in the viewport. Implements lazy loading strategy to
   * improve initial page load performance by only fetching detailed information for
   * visible content.
   *
   * @param {CustomEvent} event - Intersection event containing visibility information
   *
   * @returns {void}
   *
   * @example
   * // Row becomes visible
   * function handleIntersection(event) {
   *   const { isIntersecting } = event.detail;
   *   if (isIntersecting) {
   *     // Triggers detail fetching
   *   }
   * }
   */
  function handleIntersection(detail: {
    isIntersecting: boolean;
    entry: IntersectionObserverEntry;
  }): void {
    const { isIntersecting } = detail;

    if (isIntersecting && !detailsFetched) {
      fetchDetailsForRow();
    }
  }

  /**
   * Checks if an element is initially visible in the viewport
   *
   * @function isElementInViewport
   * @description Determines whether an element is currently visible within the browser
   * viewport using getBoundingClientRect(). Used for initial visibility checks to
   * decide whether to fetch media details immediately for above-the-fold content.
   *
   * @param {HTMLElement} el - The DOM element to check for visibility
   *
   * @returns {boolean} True if the element is fully visible in the viewport
   *
   * @example
   * // Check if row is initially visible
   * if (isElementInViewport(rowElement)) {
   *   fetchDetailsForRow();
   * }
   *
   * @example
   * // Element below the fold
   * const belowFold = !isElementInViewport(element);
   * // Result: true (element not visible)
   */
  function isElementInViewport(el: HTMLElement): boolean {
    if (!el) return false;

    const rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Component destruction cleanup
   *
   * @function onDestroy
   * @description Cleans up all subscriptions and resources when the component is
   * destroyed to prevent memory leaks. Unsubscribes from store subscriptions,
   * cleans up slider resources, and destroys responsive items store.
   *
   * @returns {void}
   */
  onDestroy(() => {
    cleanup();
    derivedUnsubscriber();
    itemsToDisplay.destroy();
  });
</script>

<!-- Listen for window resize events - handled by createResponsiveItems -->
<svelte:window />

<!-- 
  Media row with lazy loading and responsive behavior
  
  @example
  // Standard media row
  <Row {mediaStore} />
  
  @example
  // Top media row with rankings
  <Row {mediaStore} isTopMedia={true} />
  
  @example
  // Priority row with immediate loading
  <Row {mediaStore} priority={true} showProgress={true} />
-->
<div
  class="media-row"
  bind:this={rowElement}
  use:intersectionObserver={{
    threshold: 0.1,
    once: true,
    callback: handleIntersection,
  }}
>
  <RowHeader {isTopMedia} {mediaStore} />

  <div class="media-row__container">
    {#if totalItems === 0}
      <!-- Empty state when no movies are available -->
      <div class="media-row__empty-state">No movies available</div>
    {:else}
      <!-- Slider component for horizontal scrolling -->
      <Slider
        derived={derivedValues}
        state={$state}
        on:next={actions.moveNext}
        on:prev={actions.movePrev}
      >
        {#if sliderContent && sliderContent.length > 0}
          {#each sliderContent as item}
            <svelte:component this={MediaItemComponent} data={item.data} width={itemWidth} />
          {/each}
        {/if}
      </Slider>
    {/if}
  </div>
</div>

<style>
  /* Block: Main media row container with smooth transitions */
  .media-row {
    box-sizing: border-box;
    margin: 3vw 0;
    outline: 0;
    padding: 0;
    position: relative;
    transition: transform 0.54s cubic-bezier(0.5, 0, 0.1, 1) 0s;
    z-index: 10;
  }

  /* Element: Container for the slider and controls */
  .media-row__container {
    position: relative;
  }

  /* Element: Empty state styling for when no content is available */
  .media-row__empty-state {
    width: 100%;
    text-align: center;
    padding: 2rem;
    color: #999;
  }
</style>
