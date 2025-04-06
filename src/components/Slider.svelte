<script lang="ts">
  /**
   * Slider Component
   *
   * @component
   * @description A reusable horizontal slider component with touch navigation and animation.
   * Provides a Netflix-style sliding experience for displaying content that exceeds the
   * viewport width. Features include touch/swipe support for mobile devices, pagination
   * indicators, animated transitions, and responsive behavior. This component handles the
   * sliding mechanics while allowing content to be provided via slots for maximum flexibility.
   *
   * @prop {SliderState} state - State object containing slider position and animation state
   * @prop {number} itemWidth - Width of each item in the slider (as a percentage)
   * @prop {MediaContent[]} sliderContent - Array of content items to display in the slider
   * @prop {boolean} showControls - Whether to show navigation controls
   * @prop {boolean} [showPagination=false] - Whether to show pagination indicators
   *
   * @event {void} next - Fired when the next button is clicked or swiped right
   * @event {void} prev - Fired when the previous button is clicked or swiped left
   *
   * @requires svelte
   * @requires ./SliderControl.svelte
   * @requires ./SliderPagination.svelte
   * @requires ../types
   * @requires ../utils/sliderUtils
   * @requires ../utils/touchUtils
   *
   * @example
   * <Slider
   *   state={$state}
   *   itemWidth={itemWidth}
   *   sliderContent={rowContent}
   *   showControls={showControls}
   *   on:next={actions.moveNext}
   *   on:prev={actions.movePrev}
   * >
   *   {#each rowContent as item}
   *     <MediaItemBase data={item.data} width={itemWidth} />
   *   {/each}
   * </Slider>
   */

  import { onMount, createEventDispatcher } from 'svelte';

  // Components
  import SliderControl from './SliderControl.svelte';
  import SliderPaginationIndicators from './SliderPaginationIndicators.svelte';

  // Types
  import type { SliderDerived, SliderState } from '../types';

  // Utils
  import {
    calculateContentRatio,
    calculateStyleString,
    getPaddingOffset,
    isOnlyOnePage,
  } from '../utils/sliderUtils';
  import { createTouchHandlers } from '../utils/touchUtils';

  /**
   * Props for the Slider component
   *
   * @interface SliderProps
   * @description Defines the properties required by the Slider component.
   * The Slider component requires both the state object containing position and animation
   * information, and the derived object containing calculated values based on that state.
   *
   * @property {SliderState} state - State object containing slider position and animation state.
   *   Contains properties like isSliderMoving, hasMovedFromStart, lowestVisibleIndex, etc.
   *   This state is typically managed by the sliderStore.
   *
   * @property {SliderDerived} derived - Derived values calculated from the slider state.
   *   Contains properties like itemWidth, showControls, sliderContent, and totalItems.
   *   These values are computed based on the current state and viewport.
   */
  interface SliderProps {
    state: SliderState;
    derived: SliderDerived;
  }

  // Component props
  export let state: SliderProps['state'];
  export let derived: SliderProps['derived'];

  // Add default values to prevent NaN during initialization
  $: ({
    currentPaginationIndex = 0,
    isSliderMoving = false,
    itemsToDisplayInRow = 5,
    showPrev = false,
  } = state || {});
  $: ({
    itemWidth = 0,
    showControls = false,
    sliderContent = [],
    paginationIndicators = [],
  } = derived || {});

  // DOM reference
  let sliderElement: HTMLDivElement | null = null;

  // Store static values
  let paddingOffset: number | undefined = undefined;
  let contentRatio: number | undefined = undefined;

  // Create event dispatcher
  const dispatch = createEventDispatcher<{
    next: void;
    prev: void;
  }>();

  // Calculate the transform style string for slider movement
  $: styleString = sliderElement
    ? calculateStyleString(state, sliderElement, itemWidth, paddingOffset, contentRatio)
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
    if (sliderElement) {
      paddingOffset = getPaddingOffset(sliderElement);
      contentRatio = paddingOffset !== undefined ? calculateContentRatio(paddingOffset) : undefined;
    }
  });

  // Create touch swipe handlers
  const touchHandlers = createTouchHandlers(
    () => dispatch('next'),
    () => dispatch('prev')
  );

  /**
   * Handles the next button click or right swipe action
   *
   * @function handleNext
   * @description Dispatches the 'next' event to the parent component.
   * This function is called when the user clicks the next button or performs
   * a left-to-right swipe gesture on the slider. The parent component
   * is responsible for handling this event and updating the slider state.
   *
   * @example
   * <SliderControl direction="next" onClick={handleNext} />
   */
  function handleNext() {
    dispatch('next');
  }

  /**
   * Handles the previous button click or left swipe action
   *
   * @function handlePrev
   * @description Dispatches the 'prev' event to the parent component.
   * This function is called when the user clicks the previous button or performs
   * a right-to-left swipe gesture on the slider. The parent component
   * is responsible for handling this event and updating the slider state.
   *
   * @example
   * <SliderControl direction="prev" onClick={handlePrev} />
   */
  function handlePrev() {
    dispatch('prev');
  }
</script>

<!-- Previous button - only show if we have enough items and the slider has moved -->
{#if showControls && showPrev}
  <SliderControl direction="prev" onClick={handlePrev} />
{/if}

<!-- Main slider container -->
<div
  class="slider__content"
  bind:this={sliderElement}
  on:touchstart={touchHandlers.handleTouchStart}
  on:touchmove={touchHandlers.handleTouchMove}
  on:touchend={touchHandlers.handleTouchEnd}
>
  <!-- Pagination indicators -->
  {#if !isOnlyOnePage(itemsToDisplayInRow, sliderContent.length)}
    <SliderPaginationIndicators
      indicators={paginationIndicators}
      currentIndex={currentPaginationIndex}
    />
  {/if}

  <!-- Sliding content container with dynamic transform -->
  <div class="slider__track" style={styleString} class:slider__track--moving={isSliderMoving}>
    <!-- Slider media items -->
    <slot />
  </div>
</div>

<!-- Next button - always show if we have enough items -->
{#if showControls}
  <SliderControl direction="next" onClick={handleNext} />
{/if}

<style>
  /* Content area that holds the sliding items */
  .slider__content {
    box-sizing: border-box;
    padding: 0;
  }

  /* Track that moves horizontally */
  .slider__track {
    margin: 0;
    padding: 0 var(--slider-padding-left-right);
    position: relative;
    touch-action: pan-y;
    display: flex;
    will-change: transform;
  }

  /* Animation class applied during transitions */
  .slider__track--moving {
    transition: transform 750ms cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
