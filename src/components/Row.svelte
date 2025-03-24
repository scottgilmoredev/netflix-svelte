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
   * @requires ./SliderControl.svelte
   * @requires ../stores/responsiveStore
   * @requires ../stores/sliderStore
   * @requires ../types
   * @requires ../utils/sliderUtils
   * @requires ../utils/touchUtils
   */

  import { onDestroy, onMount } from 'svelte';

  // Components
  import MediaItem from './MediaItem.svelte';
  import MediaItemRanked from './MediaItemRanked.svelte';
  import RowSliderControl from './SliderControl.svelte';

  // Stores
  import { createResponsiveItems } from '../stores/responsiveStore';
  import { createSliderStore } from '../stores/sliderStore';

  // Types
  import type { MediaContent, Movie, ResponsiveItemsStore, SliderState } from '../types';

  // Utils
  import {
    calculateContentRatio,
    calculateStyleString,
    getPaddingOffset,
  } from '../utils/sliderUtils';
  import { createTouchHandlers } from '../utils/touchUtils';

  // Component props
  export let movies: Movie[] = [];
  export let title: string = '';
  export let isTopMovies: boolean = false;

  // DOM reference
  let rowElement: HTMLDivElement | null = null;

  // Store static values
  let paddingOffset: number | undefined = undefined;
  let contentRatio: number | undefined = undefined;

  // Create responsive items hook
  const itemsToDisplay: ResponsiveItemsStore = createResponsiveItems();

  // Create and initialize carousel store
  const { state, derived, actions } = createSliderStore(movies, $itemsToDisplay);

  // Update store when props change
  $: {
    state.update((s: SliderState) => ({
      ...s,
      movies,
      itemsToDisplayInRow: $itemsToDisplay,
    }));
  }

  // Extract derived values from store
  let itemWidth: number;
  let rowContent: MediaContent[];
  let showControls: boolean;
  let totalItems: number;

  // Subscribe to derived store to get values
  const unsubscribe = derived.subscribe((values) => {
    itemWidth = values.itemWidth;
    rowContent = values.rowContent;
    showControls = values.showControls;
    totalItems = values.totalItems;
  });

  // Create touch swipe handlers
  const touchHandlers = createTouchHandlers(
    () => actions.moveNext(),
    () => actions.movePrev()
  );

  // Calculate the transform style string for slider movement
  $: styleString = rowElement
    ? calculateStyleString($state, rowElement, itemWidth, paddingOffset, contentRatio)
    : '';

  /**
   * Lifecycle hook that runs when component is mounted to the DOM
   *
   * @function onMount
   * @description Initializes the component, sets up resize handlers, and returns cleanup function
   *
   * @example
   * // This is called automatically by Svelte when the component is mounted
   * // No manual invocation is needed
   */
  onMount(() => {
    if (rowElement) {
      paddingOffset = rowElement ? getPaddingOffset(rowElement) : undefined;
      contentRatio = paddingOffset !== undefined ? calculateContentRatio(paddingOffset) : undefined;
    }
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
    <!-- Previous button - only show if we have enough items and the row has moved -->
    {#if showControls && $state.hasRowMoved}
      <RowSliderControl direction="prev" onClick={actions.movePrev} />
    {/if}

    <!-- Main slider container -->
    <div
      class="row__content"
      bind:this={rowElement}
      on:touchstart={touchHandlers.handleTouchStart}
      on:touchmove={touchHandlers.handleTouchMove}
      on:touchend={touchHandlers.handleTouchEnd}
    >
      <!-- Sliding content container with dynamic transform -->
      <div class="row__slider" style={styleString} class:row__content--moving={$state.isRowMoving}>
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
          {#if rowContent && rowContent.length > 0}
            {#each rowContent as item}
              {#if isTopMovies}
                <!-- Ensure the movie has a rank -->
                <MediaItemRanked data={item.data} width={itemWidth} />
              {:else}
                <!-- Render standard items for regular movies -->
                <MediaItem data={item.data} width={itemWidth} />
              {/if}
            {/each}
          {/if}
        {/if}
      </div>
    </div>

    <!-- Next button - always show if we have enough items -->
    {#if showControls}
      <RowSliderControl direction="next" onClick={actions.moveNext} />
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

  /* Content area that holds the sliding items */
  .row__content {
    box-sizing: border-box;
    padding: 0;
  }

  /* Slider that moves horizontally */
  .row__slider {
    margin: 0;
    padding: 0 var(--slider-padding-left-right);
    position: relative;
    touch-action: pan-y;
    display: flex;
    will-change: transform;
  }

  /* Animation class applied during transitions */
  .row__content--moving {
    transition: transform 750ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Empty state styling */
  .row--empty {
    width: 100%;
    text-align: center;
    padding: 2rem;
    color: #999;
  }
</style>
