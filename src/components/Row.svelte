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
  import MediaItemWithProgress from './MediaItemWithProgress.svelte';
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
    WatchedMediaItem,
  } from '../types';

  // Component props
  export let movies: Movie[] = [];
  export let title: string = '';
  export let isTopMovies: boolean = false;
  export let showProgress: boolean = false;

  // Create responsive items hook
  const itemsToDisplay: ResponsiveItemsStore = createResponsiveItems();

  // Create and initialize carousel store
  const { state, derived, actions } = createSliderStore(movies, $itemsToDisplay);

  // Determine which media item component to use
  $: MediaItemComponent = getMediaItemComponent();

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
  let sliderContent: (MediaContent & { data: WatchedMediaItem })[];
  let totalItems: number;

  /**
   * Determines which media item component to use based on row configuration
   *
   * @function getMediaItemComponent
   * @description Returns the appropriate component based on whether this is a top movies row,
   * a continue watching row with progress bars, or a standard row
   *
   * @returns {typeof MediaItem | typeof MediaItemRanked | typeof MediaItemWithProgress} The component to use
   */
  function getMediaItemComponent():
    | typeof MediaItem
    | typeof MediaItemRanked
    | typeof MediaItemWithProgress {
    if (isTopMovies) {
      return MediaItemRanked;
    }

    if (showProgress) {
      return MediaItemWithProgress;
    }

    return MediaItem;
  }

  // Subscribe to derived store to get values
  const unsubscribe = derived.subscribe((values) => {
    // Store the full object
    derivedValues = values;

    // Also destructure for template use
    ({ itemWidth, totalItems } = values);
    sliderContent = values.sliderContent.filter((item) => item.data !== null) as (MediaContent & {
      data: WatchedMediaItem;
    })[];
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
  <h2 class="row__header">
    <div class="row__title">{title}</div>
  </h2>

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
    color: white;
    margin: 3vw 0;
    position: relative;
    z-index: 10;
  }

  .row__header {
    font-size: 12px;
    color: #e5e5e5;
    display: inline-block;
    font-weight: 500;
    margin: 0 4% 0.5em;
    min-width: 6em;
  }

  .row__title {
    display: table-cell;
    line-height: 1.25vw;
    vertical-align: bottom;
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

  @media screen and (min-width: 800px) {
    .row__header {
      font-size: 1.4vw;
    }
  }
</style>
