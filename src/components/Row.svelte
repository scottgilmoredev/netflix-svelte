<script lang="ts">
  /**
   * Row Component
   *
   * @component
   * @description A horizontal scrollable row of media items, similar to Netflix's UI.
   * Displays a collection of movies with a title and navigation controls. Supports
   * both standard media items and ranked media items for top movies. Features touch
   * navigation for mobile devices, responsive behavior based on screen size, and
   * optimized rendering for different dataset sizes. Handles all slider animation
   * and state management internally.
   *
   * @prop {Media[]} movies - Array of movie objects to display in the row
   * @prop {string} title - Title text to display above the row
   * @prop {boolean} isTopMedia - Whether this row displays top-ranked movies with rank numbers
   *
   * @requires svelte
   * @requires svelte/store
   * @requires .media/registry/mediaComponentRegistry
   * @requires ./RowHeader.svelte
   * @requires ./Slider.svelte
   * @requires module:@stores
   * @requires module:@types
   * @requires module:@utils
   */

  import { onDestroy } from 'svelte';
  import type { Unsubscriber } from 'svelte/store';

  // Component Registry
  import { getComponentForRow } from './media/registry/mediaComponentRegistry';

  // Components
  import RowHeader from './RowHeader.svelte';
  import Slider from './Slider.svelte';

  // Stores
  import { createResponsiveItems } from '@stores';

  // Types
  import type {
    MediaStore,
    MediaContent,
    ResponsiveItemsStore,
    SliderDerived,
    SliderState,
  } from '@types';

  // Utils
  import { setupRowStores } from '../utils';

  // Component props
  export let mediaStore: MediaStore;
  export let isTopMedia: boolean = false;
  export let showProgress: boolean = false;

  // Create responsive items hook
  const itemsToDisplay: ResponsiveItemsStore = createResponsiveItems();

  // Create and initialize slider store
  const { sliderStore, cleanup } = setupRowStores(mediaStore, itemsToDisplay);
  const { state, derived, actions } = sliderStore;

  // Store the full slider derived values object
  let derivedValues: SliderDerived;

  // Also destructure for use in the template
  let itemWidth: number;
  let sliderContent: MediaContent[];
  let totalItems: number;

  /**
   * Subscribe to the derived slider store to get updated values
   *
   * @description Subscribes to the derived slider store to get updated values for the slider.
   * Stores the full derived values object and destructures specific values for use in the template.
   * Filters out any slider content items that have null data.
   *
   * @type {Unsubscriber}
   */
  const derivedUnsubscribe: Unsubscriber = derived.subscribe((values) => {
    // Store the full object
    derivedValues = values;

    // Also destructure for template use
    ({ itemWidth, totalItems } = values);

    // Filter content to ensure we only have valid items
    sliderContent = values.sliderContent.filter((item) => item.data !== null) as MediaContent[];
  });

  // Determine which media item component to use
  $: MediaItemComponent = getComponentForRow(isTopMedia, showProgress);

  // Update slider store when props change
  $: {
    state.update((s: SliderState) => ({
      ...s,
      itemsToDisplayInRow: $itemsToDisplay,
    }));
  }

  /**
   * Clean up subscriptions and resources when component is destroyed
   *
   * @function
   * @description Unsubscribes from all store subscriptions and cleans up resources
   * to prevent memory leaks when the component is unmounted.
   */
  onDestroy(() => {
    cleanup();
    derivedUnsubscribe();
    itemsToDisplay.destroy();
  });
</script>

<!-- Listen for window resize events - handled by createResponsiveItems -->
<svelte:window />

<div class="row">
  <RowHeader {isTopMedia} {mediaStore} />

  <div class="row__container">
    {#if totalItems === 0}
      <!-- Empty state when no movies are available -->
      <div class="row--empty">No movies available</div>
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
  /* Main row container */
  .row {
    box-sizing: border-box;
    margin: 3vw 0;
    outline: 0;
    padding: 0;
    position: relative;
    transition: transform 0.54s cubic-bezier(0.5, 0, 0.1, 1) 0s;
    z-index: 10;
  }

  /* Container for the slider and controls */
  .row__container {
    position: relative;
  }

  /* Empty state styling */
  .row--empty {
    width: 100%;
    text-align: center;
    padding: 2rem;
    color: #999;
  }
</style>
