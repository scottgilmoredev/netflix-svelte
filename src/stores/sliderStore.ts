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
 * $: ({ totalItems, showControls, itemWidth, rowContent } = $derived);
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
    movies: initialMovies,
    itemsToDisplayInRow: initialItemsToDisplay,
    lowestVisibleIndex: 0,
    movePercentage: 0,
    hasRowMoved: false,
    direction: 'next',
    isRowMoving: false,
    isInitialNext: true,
  });

  // Store for cached content - this is the key to fixing the issue
  const cachedContent = writable<MediaContent[]>([]);

  // Create derived values from the state
  const derivedValues: Readable<SliderDerived> = derived(state, ($state) => {
    const { isRowMoving, itemsToDisplayInRow, movies } = $state;
    const totalItems = movies.length;
    const showControls = totalItems > itemsToDisplayInRow;
    const itemWidth = 100 / itemsToDisplayInRow;

    let rowContent: MediaContent[];

    // If we're in the middle of an animation, use the cached content
    // Otherwise, calculate new content and update the cache
    if (isRowMoving) {
      // Use cached content during animation
      rowContent = get(cachedContent);
    } else {
      // Calculate new content and update cache
      rowContent = calculateRowContent($state, itemWidth);
      cachedContent.set(rowContent);
    }

    return {
      totalItems,
      showControls,
      itemWidth,
      rowContent,
    };
  });

  /**
   * Calculates the new index position based on navigation direction
   *
   * @function calculateNewIndex
   * @description Determines the next lowest visible index when navigating
   *
   * @param {SliderState} state - Current slider state
   * @param {('next'|'prev')} direction - Direction of movement
   * @returns {number} The new index position
   *
   * @example
   * // Calculate new index when moving forward
   * const newIndex = calculateNewIndex(currentState, 'next');
   */
  function calculateNewIndex(state: SliderState, direction: 'next' | 'prev'): number {
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
   * Calculate the move percentage based on the new index and direction
   *
   * @function calculateMovePercentage
   * @description Determines the percentage to move the slider during animation
   *
   * @param {SliderState} state - Current slider state
   * @param {('next'|'prev')} direction - Direction of movement
   * @param {number} newIndex - Target index position
   * @returns {number} Percentage value for animation (0-100)
   *
   * @example
   * // Calculate percentage for next movement
   * const percentage = calculateMovePercentage(currentState, 'next', 5);
   */
  function calculateMovePercentage(
    state: SliderState,
    direction: 'next' | 'prev',
    newIndex: number
  ): number {
    const { lowestVisibleIndex, itemsToDisplayInRow } = state;

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
   * Creates the initial row content for the first render
   *
   * @function createInitialRowContent
   * @description Prepares a simplified content array for the first render
   *
   * @param {SliderState} state - Current slider state
   * @param {number} itemWidth - Width of each item as percentage
   * @returns {MediaContent[]} Array of content items
   *
   * @example
   * // Create initial content for the slider
   * const content = createInitialRowContent(currentState, 20);
   */
  function createInitialRowContent(state: SliderState, itemWidth: number): MediaContent[] {
    const { movies, itemsToDisplayInRow } = state;

    // Take enough items to handle next click plus a peek item
    const initialItems = [...movies].slice(0, itemsToDisplayInRow * 2 + 1);

    // Map to required format
    return initialItems.map((movie) => ({
      data: movie,
      width: itemWidth,
    }));
  }

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
    const { lowestVisibleIndex, itemsToDisplayInRow, movies, hasRowMoved } = state;
    const totalItems = movies.length;

    // Items visible when user clicks "prev"
    const left: number[] = [];
    // Display items
    const middle: number[] = [];
    // Items visible when user clicks "next"
    const right: number[] = [];

    // Calculate indices based on lowest visible index
    [...Array(itemsToDisplayInRow)].forEach((_, index) => {
      if (hasRowMoved) {
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
   * @param {number} totalItems - Total number of items
   * @returns {number[]} Extended array with peek indices
   *
   * @example
   * // Add peek indices to an existing array of indices
   * const extendedIndices = addPeekIndices([0, 1, 2, 3, 4], 17);
   */
  function addPeekIndices(indices: number[], totalItems: number): number[] {
    const result = [...indices];

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
   * Creates row content from calculated indices
   *
   * @function createRowContentFromIndices
   * @description Maps indices to content items
   *
   * @param {SliderState} state - Current slider state
   * @param {number[]} indices - Array of indices to render
   * @param {number} itemWidth - Width of each item
   * @returns {MediaContent[]} Array of content items
   *
   * @example
   * // Create content items from an array of indices
   * const content = createRowContentFromIndices(currentState, [0, 1, 2, 3, 4], 20);
   */
  function createRowContentFromIndices(
    state: SliderState,
    indices: number[],
    itemWidth: number
  ): MediaContent[] {
    const { movies } = state;
    const rowContents: MediaContent[] = [];

    indices.forEach((index) => {
      const movie = movies[index];
      rowContents.push({
        data: movie,
        width: itemWidth,
      });
    });

    return rowContents;
  }

  /**
   * Main function to calculate row content
   *
   * @function calculateRowContent
   * @description Orchestrates content creation based on state
   *
   * @param {SliderState} state - Current slider state
   * @param {number} itemWidth - Width of each item
   * @returns {MediaContent[]} Array of content items
   *
   * @example
   * // Generate the current content for the slider
   * const rowContent = renderRowContent(currentState, 20);
   */
  function calculateRowContent(state: SliderState, itemWidth: number): MediaContent[] {
    const { movies, hasRowMoved } = state;
    const totalItems = movies.length;

    // If no movies, return empty array
    if (totalItems < 1) return [];

    // For initial render, use simplified content
    if (!hasRowMoved) {
      return createInitialRowContent(state, itemWidth);
    }

    // Calculate all needed indices
    let allIndices = calculateSliderIndices(state);

    // Add peek indices if row has moved
    allIndices = addPeekIndices(allIndices, totalItems);

    // Create content from indices
    return createRowContentFromIndices(state, allIndices, itemWidth);
  }

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
        cachedContent.set(calculateRowContent(currentState, itemWidth));
      }

      // Update state for animation
      state.update((s) => ({
        ...s,
        isRowMoving: true,
        direction: 'next',
        movePercentage: newMovePercentage,
        hasRowMoved: true,
      }));

      // Schedule state update after animation completes
      setTimeout(() => {
        state.update((s) => ({
          ...s,
          lowestVisibleIndex: newIndex,
          isRowMoving: false,
          isInitialNext: false,
        }));
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
        cachedContent.set(calculateRowContent(currentState, itemWidth));
      }

      // Update state for animation
      state.update((s) => ({
        ...s,
        isRowMoving: true,
        direction: 'prev',
        movePercentage: newMovePercentage,
        shouldUpdateContent: true,
      }));

      // Schedule state update after animation completes
      setTimeout(() => {
        state.update((s) => ({
          ...s,
          lowestVisibleIndex: newIndex,
          isRowMoving: false,
        }));
      }, 750);
    },

    /**
     * Updates the number of items to display
     *
     * @function updateItemsToDisplay
     * @description Updates itemsToDisplayInRow based on screen size
     *
     * @param {number} count - New number of items to display
     */
    updateItemsToDisplay: (count: number) => {
      state.update((s) => ({
        ...s,
        itemsToDisplayInRow: count,
      }));
    },
  };

  // Return the state, derived values, and actions
  return {
    state,
    derived: derivedValues,
    actions,
  };
}
