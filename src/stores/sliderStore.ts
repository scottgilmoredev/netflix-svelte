/**
 * Slider Store Module
 *
 * @module
 * @description Provides a specialized store for managing Netflix-style content sliders.
 * Handles complex slider state management, animations, content rendering, and navigation.
 * This module is the core of the slider functionality used in the Row component.
 *
 * @requires svelte/store
 * @requires ../types
 */

import { writable, derived, get } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';

// Types
import type {
  Movie,
  MediaContent,
  SliderActions,
  SliderDerived,
  SliderState,
  SliderStore,
} from '../types';

// Utils
import { generateSequentialIndices, isOnlyOnePage } from '../utils/sliderUtils';

/**
 * Creates a slider store with state management and actions
 *
 * @function createSliderStore
 * @description Factory function that creates a complete slider store with state, derived values, and actions
 *
 * @param {Movie[]} initialMovies - Initial array of movies
 * @param {number} initialItemsToDisplay - Initial number of items to display in a row
 * @returns {Object} Object containing state stores, derived stores, and action methods
 *
 * @example
 * // Create a slider store with initial movies and 5 items per row
 * const { state, derived, actions } = createSliderStore(movieList, 5);
 *
 * // Use the store in a component
 * $: ({ totalItems, showControls, itemWidth, sliderContent } = $derived);
 *
 * // Trigger actions
 * function handleNextClick() {
 *   actions.moveNext();
 * }
 */
export function createSliderStore(
  initialMovies: Movie[] = [],
  initialItemsToDisplay: number = 5
): SliderStore {
  // Create the core state store
  const state: Writable<SliderState> = writable({
    currentPaginationIndex: 0,
    direction: 'next',
    hasMovedFromStart: false,
    isInitialNext: true,
    isSliderMoving: false,
    itemsToDisplayInRow: initialItemsToDisplay,
    lowestVisibleIndex: 0,
    movePercentage: 0,
    movies: initialMovies,
    showPrev: false,
  });

  // Store for cached content - this is the key to fixing the issue
  const cachedContent = writable<MediaContent[]>([]);

  // Create derived values from the state
  const derivedValues: Readable<SliderDerived> = derived(state, ($state) => {
    const { isSliderMoving, itemsToDisplayInRow, movies } = $state;
    const itemWidth = 100 / itemsToDisplayInRow;
    const totalItems = movies.length;
    const showControls = totalItems > itemsToDisplayInRow;

    // Calculate pagination indicators
    const paginationIndicators = calculatePaginationIndicators(totalItems, itemsToDisplayInRow);

    let sliderContent: MediaContent[];

    // If we're in the middle of an animation, use the cached content
    // Otherwise, calculate new content and update the cache
    if (isSliderMoving) {
      // Use cached content during animation
      sliderContent = get(cachedContent);
    } else {
      // Calculate new content and update cache
      sliderContent = determineVisibleContent($state, itemWidth);
      cachedContent.set(sliderContent);
    }

    return {
      itemWidth,
      paginationIndicators,
      showControls,
      sliderContent,
      totalItems,
    };
  });

  // -------------------------------------------------------------------------
  // NAVIGATION FUNCTIONS
  // -------------------------------------------------------------------------

  /**
   * Calculate and update the active slider pagination indicator index
   *
   * @function calculateActivePaginationIndex
   * @description Determines the next or previous pagination index with circular navigation
   * (wraps to first page from last, and to last page from first)
   *
   * @param {SliderState['direction']} direction - Direction to move in pagination
   * @returns {void} Updates state internally
   *
   * @example
   * // Move to the next page in pagination
   * calculateActivePaginationIndex('next');
   *
   * // Move to the previous page in pagination
   * calculateActivePaginationIndex('prev');
   */
  function calculateActivePaginationIndex(direction: SliderState['direction']): void {
    const { totalItems } = get(derivedValues);
    let { currentPaginationIndex, itemsToDisplayInRow } = get(state);

    // Calculate the last page index once
    const lastPageIndex = Math.ceil(totalItems / itemsToDisplayInRow) - 1;

    if (direction === 'next') {
      // If we're on the last page, wrap to the first
      currentPaginationIndex === lastPageIndex
        ? (currentPaginationIndex = 0)
        : // Otherwise, move to the next page
          currentPaginationIndex++;
    }

    if (direction === 'prev') {
      // If we're on the first page, wrap to the last
      currentPaginationIndex === 0
        ? (currentPaginationIndex = lastPageIndex)
        : // Otherwise, move to the previous page
          currentPaginationIndex--;
    }

    state.update((s: SliderState) => ({ ...s, currentPaginationIndex }));
  }

  /**
   * Calculate the move percentage based on the new index and direction
   *
   * @function calculateMovePercentage
   * @description Determines the percentage to move the slider during animation
   *
   * @param {SliderState} state - Current slider state
   * @param {SliderState['direction']} direction - Direction of movement
   * @param {number} newIndex - Target index position
   * @returns {number} Percentage value for animation (0-100)
   *
   * @example
   * // Calculate percentage for next movement
   * const percentage = calculateMovePercentage(currentState, 'next', 5);
   */
  function calculateMovePercentage(
    state: SliderState,
    direction: SliderState['direction'],
    newIndex: number
  ): number {
    const { itemsToDisplayInRow, lowestVisibleIndex } = state;

    switch (direction) {
      case 'next':
        // Special case: If wrapping around to the beginning, return 100%
        if (newIndex === 0) {
          return 100;
        }

        // Regular case: Calculate percentage based on distance moved
        return ((newIndex - lowestVisibleIndex) / itemsToDisplayInRow) * 100;

      case 'prev':
        // Calculate the distance between current and new index
        const distance = lowestVisibleIndex - newIndex;

        // Only calculate percentage if not at beginning and distance is less than a full row
        if (lowestVisibleIndex !== 0 && distance < itemsToDisplayInRow) {
          return ((itemsToDisplayInRow - distance) / itemsToDisplayInRow) * 100;
        }

        return 0;

      default:
        return 0;
    }
  }

  /**
   * Calculates the new index position based on navigation direction
   *
   * @function calculateNewIndex
   * @description Determines the next lowest visible index when navigating
   *
   * @param {SliderState} state - Current slider state
   * @param {SliderState['direction']} direction - Direction of movement
   * @returns {number} The new index position
   *
   * @example
   * // Calculate new index when moving forward
   * const newIndex = calculateNewIndex(currentState, 'next');
   */
  function calculateNewIndex(state: SliderState, direction: SliderState['direction']): number {
    const { lowestVisibleIndex, itemsToDisplayInRow, movies } = state;
    const totalItems = movies.length;
    const firstIndex = 0;
    const lastValidIndex = totalItems - itemsToDisplayInRow;
    const stepSize = itemsToDisplayInRow;

    switch (direction) {
      case 'next':
        // At the end, wrap to beginning
        if (lowestVisibleIndex === lastValidIndex) {
          return firstIndex;
        }

        // Move forward by step size, but don't exceed last valid index
        return Math.min(lowestVisibleIndex + stepSize, lastValidIndex);

      case 'prev':
        // At the beginning, wrap to end
        if (lowestVisibleIndex === firstIndex) {
          return lastValidIndex;
        }

        // Move backward by step size, but don't go below first valid index
        return Math.max(lowestVisibleIndex - stepSize, firstIndex);

      default:
        return lowestVisibleIndex;
    }
  }

  /**
   * Calculates pagination indicators based on content and viewport
   *
   * @function calculatePaginationIndicators
   * @description Creates an array representing the pagination indicators.
   * The length of the array corresponds to the number of pages in the slider,
   * calculated by dividing the total number of items by the number of items
   * that can be displayed in a single view.
   *
   * @returns {Array} An array with length equal to the number of pages
   *
   * @example
   * {#each calculatePaginationIndicators() as _, index}
   *   <li
   *     class="slider__pagination-item"
   *     class:slider__pagination-item--active={currentPage === index}
   *   ></li>
   * {/each}
   */
  function calculatePaginationIndicators(
    totalItems: SliderDerived['totalItems'],
    itemsToDisplayInRow: SliderState['itemsToDisplayInRow']
  ): Array<undefined> {
    const pageCount = Math.ceil(totalItems / itemsToDisplayInRow);

    // Creates a "dense" array with actual elements instead of a sparse array,
    // ensuring compatibility with all array methods beyond just iteration
    return [...Array(pageCount)];
  }

  // -------------------------------------------------------------------------
  // CONTENT CALCULATION FUNCTIONS
  // -------------------------------------------------------------------------

  /**
   * Calculates all indices needed for the slider
   *
   * @function calculateSliderIndices
   * @description Determines which items should be rendered in the DOM
   *
   * @param {SliderState} state - Current slider state
   * @returns {number[]} Array of indices for all needed items
   *
   * @example
   * // Calculate indices for a slider that has been moved
   * const indices = calculateCarouselIndices(currentState);
   */
  function calculateSliderIndices(state: SliderState): number[] {
    const { lowestVisibleIndex, itemsToDisplayInRow, movies, hasMovedFromStart } = state;
    const totalItems = movies.length;

    // Edge case: We only have one page of items. use all available items in order
    if (isOnlyOnePage(itemsToDisplayInRow, totalItems)) {
      return generateSequentialIndices(itemsToDisplayInRow);
    }

    // Items visible when user clicks "prev"
    const left: number[] = [];
    // Display items
    const middle: number[] = [];
    // Items visible when user clicks "next"
    const right: number[] = [];

    // Calculate indices based on lowest visible index
    [...Array(itemsToDisplayInRow)].forEach((_, index) => {
      if (hasMovedFromStart) {
        // Items visible when clicking "prev"
        left.push((lowestVisibleIndex + index - itemsToDisplayInRow + totalItems) % totalItems);
      }

      // Currently visible items
      middle.push((lowestVisibleIndex + index) % totalItems);

      // Items visible when clicking "next"
      right.push((lowestVisibleIndex + index + itemsToDisplayInRow) % totalItems);
    });

    return [...left, ...middle, ...right];
  }

  /**
   * Adds leading and trailing indices for peek effect
   *
   * @function addPeekIndices
   * @description Adds indices for items that peek from the edges for smooth transitions, preventing a flash of new content
   *
   * @param {number[]} indices - Calculated indices
   * @param {SliderDerived['totalItems']} totalItems - Total number of items
   * @returns {number[]} Extended array with peek indices
   *
   * @example
   * // Add peek indices to an existing array of indices
   * const extendedIndices = addPeekIndices([0, 1, 2, 3, 4], 17);
   */
  function addPeekIndices(indices: number[], totalItems: SliderDerived['totalItems']): number[] {
    const result = [...indices];

    // Edge case: We only have one page of items, do not add peek items
    if (indices.length <= totalItems) return result;

    // Add trailing peek item
    const trailingIndex =
      indices[indices.length - 1] === totalItems - 1 ? 0 : indices[indices.length - 1] + 1;
    result.push(trailingIndex);

    // Add leading peek item
    const leadingIndex = indices[0] === 0 ? totalItems - 1 : indices[0] - 1;
    result.unshift(leadingIndex);

    return result;
  }

  /**
   * Creates the initial row content for the first render
   *
   * @function createInitialSliderContent
   * @description Prepares a simplified content array for the first render
   *
   * @param {SliderState} state - Current slider state
   * @param {SliderDerived['itemWidth']} itemWidth - Width of each item as percentage
   * @returns {MediaContent[]} Array of content items
   *
   * @example
   * // Create initial content for the slider
   * const content = createInitialSliderContent(currentState, 20);
   */
  function createInitialSliderContent(
    state: SliderState,
    itemWidth: SliderDerived['itemWidth']
  ): MediaContent[] {
    const { movies, itemsToDisplayInRow } = state;
    const totalItems = movies.length;

    // Calculate how many items we need for initial content
    const neededItems = itemsToDisplayInRow * 2 + 1;
    let initialItems: Movie[] = [];

    if (totalItems >= neededItems) {
      // Normal case: We have enough items
      initialItems = [...movies].slice(0, neededItems);
    } else if (totalItems < neededItems && totalItems > itemsToDisplayInRow) {
      // Special case: We have more than one page of items, but not enough for two full pages, add the first item as a peek
      initialItems = [...movies, movies[0]];
    } else if (isOnlyOnePage(itemsToDisplayInRow, totalItems)) {
      // Edge case: We only have one page of items. use all available items
      initialItems = [...movies];
    }

    // Map to required format
    return initialItems.map((movie) => ({
      data: movie,
      width: itemWidth,
    }));
  }

  /**
   * Maps movie indices to renderable content items
   *
   * @function mapIndicesToContentItems
   * @description Transforms array indices into renderable media content items with proper width
   *
   * @param {SliderState} state - Current slider state
   * @param {number[]} indices - Array of indices to render
   * @param {SliderDerived['itemWidth']} itemWidth - Width of each item
   * @returns {MediaContent[]} Array of content items ready for rendering
   *
   * @example
   * // Transform indices into renderable content items
   * const renderableItems = mapIndicesToContentItems(currentState, [0, 1, 2, 3, 4], 20);
   */
  function mapIndicesToContentItems(
    state: SliderState,
    indices: number[],
    itemWidth: SliderDerived['itemWidth']
  ): MediaContent[] {
    const { movies } = state;
    const sliderContents: MediaContent[] = [];

    indices.forEach((index) => {
      const movie = movies[index];

      sliderContents.push({
        data: movie,
        width: itemWidth,
      });
    });

    return sliderContents;
  }

  /**
   * Determines which items should be visible in the slider
   *
   * @function determineVisibleContent
   * @description Orchestrates the entire content calculation process based on slider state
   *
   * @param {SliderState} state - Current slider state
   * @param {SliderDerived['itemWidth']} itemWidth - Width of each item
   * @returns {MediaContent[]} Array of content items ready for rendering
   *
   * @example
   * // Generate the current visible content for the slider
   * sliderContent = determineVisibleContent($state, itemWidth);
   */
  function determineVisibleContent(
    state: SliderState,
    itemWidth: SliderDerived['itemWidth']
  ): MediaContent[] {
    const { movies, hasMovedFromStart } = state;
    const totalItems = movies.length;

    // If no movies, return empty array
    if (totalItems < 1) return [];

    // For initial render, use simplified content
    if (!hasMovedFromStart) {
      return createInitialSliderContent(state, itemWidth);
    }

    // Get indices for visible items and their neighbors
    let allIndices = calculateSliderIndices(state);

    // Add peek items for smoother transitions
    allIndices = addPeekIndices(allIndices, totalItems);

    // Convert indices to renderable content
    return mapIndicesToContentItems(state, allIndices, itemWidth);
  }

  // -------------------------------------------------------------------------
  // PUBLIC ACTIONS
  // -------------------------------------------------------------------------

  // Define actions that can be performed on the slider
  const actions: SliderActions = {
    /**
     * Moves the slider to the next position
     *
     * @function moveNext
     * @description Handles next button click or right swipe
     *
     * @example
     * // Attach to next button click
     * <button on:click={handleNext}>Next</button>
     */
    moveNext: () => {
      const currentState = get(state);
      const newIndex = calculateNewIndex(currentState, 'next');
      const newMovePercentage = calculateMovePercentage(currentState, 'next', newIndex);

      // Make sure we have cached content before starting animation
      if (get(cachedContent).length === 0) {
        const itemWidth = 100 / currentState.itemsToDisplayInRow;
        cachedContent.set(determineVisibleContent(currentState, itemWidth));
      }

      // Update state for animation
      state.update((s) => ({
        ...s,
        direction: 'next',
        hasMovedFromStart: true,
        isSliderMoving: true,
        movePercentage: newMovePercentage,
      }));

      // Schedule state update after animation completes
      setTimeout(() => {
        state.update((s) => ({
          ...s,
          lowestVisibleIndex: newIndex,
          isInitialNext: false,
          isSliderMoving: false,
        }));

        if (!currentState.showPrev) {
          state.update((s) => ({ ...s, showPrev: true }));
        }

        // Update pagination indicator
        calculateActivePaginationIndex('next');
      }, 750);
    },

    /**
     * Moves the slider to the previous position
     *
     * @function movePrev
     * @description Handles prev button click or left swipe
     *
     * @example
     * // Attach to previous button click
     * <button on:click={handlePrev}>Previous</button>
     */
    movePrev: () => {
      const currentState = get(state);
      const newIndex = calculateNewIndex(currentState, 'prev');
      const newMovePercentage = calculateMovePercentage(currentState, 'prev', newIndex);

      // Make sure we have cached content before starting animation
      if (get(cachedContent).length === 0) {
        const itemWidth = 100 / currentState.itemsToDisplayInRow;
        cachedContent.set(determineVisibleContent(currentState, itemWidth));
      }

      // Update state for animation
      state.update((s) => ({
        ...s,
        direction: 'prev',
        isSliderMoving: true,
        movePercentage: newMovePercentage,
        shouldUpdateContent: true,
      }));

      // Schedule state update after animation completes
      setTimeout(() => {
        state.update((s) => ({
          ...s,
          isSliderMoving: false,
          lowestVisibleIndex: newIndex,
        }));

        // Update pagination indicator
        calculateActivePaginationIndex('prev');
      }, 750);
    },

    /**
     * Updates the number of items to display
     *
     * @function updateItemsToDisplay
     * @description Updates itemsToDisplayInRow based on screen size
     *
     * @param {SliderState['itemsToDisplayInRow']} count - New number of items to display
     */
    updateItemsToDisplay: (count: SliderState['itemsToDisplayInRow']) => {
      const { movies, currentPaginationIndex } = get(state);
      const totalItems = movies.length;

      state.update((s) => ({
        ...s,
        itemsToDisplayInRow: count,
      }));

      // Calculate the new maximum pagination index
      const newMaxIndex = Math.max(0, Math.ceil(totalItems / count) - 1);

      // If current index is now out of bounds, adjust it
      if (currentPaginationIndex > newMaxIndex) {
        state.update((s) => ({
          ...s,
          currentPaginationIndex: newMaxIndex,
        }));
      }
    },
  };

  // Return the state, derived values, and actions
  return {
    state,
    derived: derivedValues,
    actions,
  };
}
