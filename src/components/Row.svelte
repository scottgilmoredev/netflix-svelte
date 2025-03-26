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
   * @prop {Movie[]} movies - Array of movie objects to display in the row
   * @prop {string} title - Title text to display above the row
   * @prop {boolean} isTopMovies - Whether this row displays top-ranked movies with rank numbers
   *
   * @requires svelte
   * @requires ./MediaItem.svelte
   * @requires ./MediaItemRanked.svelte
   * @requires ./Slider.svelte
   * @requires ./SliderControl.svelte
   * @requires ../stores/responsiveStore
   * @requires ../stores/sliderStore
   * @requires ../types
   * @requires ../utils/sliderUtils
   * @requires ../utils/touchUtils
   */

  import { onDestroy } from 'svelte';

  // Components
  import MediaItem from './MediaItem.svelte';
  import MediaItemRanked from './MediaItemRanked.svelte';
  import Slider from './Slider.svelte';

  // Stores
  import { createResponsiveItems } from '../stores/responsiveStore';
  import { createSliderStore } from '../stores/sliderStore';

  // Types
  import type {
    MediaContent,
    Movie,
    ResponsiveItemsStore,
    SliderDerived,
    SliderState,
  } from '../types';

  // Component props
  export let movies: Movie[] = [];
  export let title: string = '';
  export let isTopMovies: boolean = false;

  // Create responsive items hook
  const itemsToDisplay: ResponsiveItemsStore = createResponsiveItems();

  // Create and initialize carousel store
  const { state, derived, actions } = createSliderStore(movies, $itemsToDisplay);

  // Determine which media item component to use
  $: MediaItemComponent = isTopMovies ? MediaItemRanked : MediaItem;

  // Update store when props change
  $: {
    state.update((s: SliderState) => ({
      ...s,
      movies,
      itemsToDisplayInRow: $itemsToDisplay,
    }));
  }

  // Store the full derived values object
  let derivedValues: SliderDerived;

  // Also destructure for use in the template
  let itemWidth: number;
  let sliderContent: MediaContent[];
  let totalItems: number;

  // Subscribe to derived store to get values
  const unsubscribe = derived.subscribe((values) => {
    // Store the full object
    derivedValues = values;

    // Also destructure for template use
    ({ itemWidth, sliderContent, totalItems } = values);
  });

  // Clean up subscriptions
  onDestroy(() => {
    unsubscribe();
    itemsToDisplay.destroy();
  });
</script>

<!-- Listen for window resize events - handled by createResponsiveItems -->
<svelte:window />

<div class="row">
  <h2 class="row__title">{title}</h2>

  <div class="row__container">
    {#if totalItems === 0}
      <!-- Empty state when no movies are available -->
      <div class="row--empty">No movies available</div>
    {:else if totalItems <= $state.itemsToDisplayInRow}
      <!-- Simple rendering for small datasets -->
      {#each movies as item (item.id)}
        <MediaItem data={item} width={itemWidth} />
      {/each}
    {:else}
      <!-- Complex rendering for larger datasets that need slider behavior -->
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
    margin-bottom: 20px;
    color: white;
    margin-left: auto;
    margin-right: auto;
  }

  .row__title {
    margin-left: 4%;
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
