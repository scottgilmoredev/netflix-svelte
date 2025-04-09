/**
 * Slider Utilities Module
 *
 * @module
 * @description Provides utility functions for calculating slider positions and transformations.
 * These functions handle the complex math needed for smooth slider animations, padding adjustments,
 * and position calculations used by the slider components.
 *
 * @requires ../types
 */

import type { SliderState } from '../types';

/**
 * Gets the slider padding value from CSS custom properties
 *
 * @function getPaddingOffset
 * @description Retrieves padding values from CSS custom properties
 *
 * @param {HTMLDivElement} element - The row element
 * @returns {number} The total padding value in percentage
 *
 * @example
 * // Get the padding value from an element
 * const padding = getPaddingOffset(rowElement);
 */
export function getPaddingOffset(element: HTMLDivElement): number {
  const style = getComputedStyle(element);
  const sliderPaddingLeft =
    Number.parseFloat(style.getPropertyValue('--slider-padding-left-right')) || 4;
  const sliderPaddingRight =
    Number.parseFloat(style.getPropertyValue('--slider-padding-left-right')) || 4;

  return sliderPaddingLeft + sliderPaddingRight;
}

/**
 * Calculates the base position for the slider
 *
 * @function calculateBasePosition
 * @description Determines the starting position for the slider
 *
 * @param {number} itemWidth - Width of each item as percentage
 * @param {number} itemsToDisplayInRow - Number of items to display
 * @param {number} paddingOffset - Padding offset value
 * @returns {number} The base position percentage
 *
 * @example
 * // Calculate the base position
 * const position = calculateBasePosition(20, 5, 8);
 */
export function calculateBasePosition(
  itemWidth: number,
  itemsToDisplayInRow: number,
  paddingOffset: number
): number {
  return itemWidth * (itemsToDisplayInRow + 1) - paddingOffset;
}

/**
 * Calculates the content ratio based on padding
 *
 * @function calculateContentRatio
 * @description Adjusts calculations to account for padding
 *
 * @param {number} paddingOffset - Padding offset value
 * @returns {number} The content ratio
 *
 * @example
 * // Calculate the content ratio with 8% padding
 * const ratio = calculateContentRatio(8);
 */
export function calculateContentRatio(paddingOffset: number): number {
  return (100 - paddingOffset) / 100;
}

/**
 * Calculates the padding adjustment needed for accurate positioning
 *
 * @function calculatePaddingAdjustment
 * @description Computes adjustment needed to account for padding
 *
 * @param {number} paddingOffset - Padding offset value
 * @param {number} itemsToDisplayInRow - Number of items to display
 * @returns {number} The padding adjustment value
 *
 * @example
 * // Calculate padding adjustment
 * const adjustment = calculatePaddingAdjustment(8, 5);
 */
export function calculatePaddingAdjustment(
  paddingOffset: number,
  itemsToDisplayInRow: number
): number {
  // Full width in percentage
  const containerWidth = 100;
  const visibleWidth = containerWidth - paddingOffset;
  const singleItemWidth = visibleWidth / itemsToDisplayInRow;

  return (paddingOffset / containerWidth) * singleItemWidth;
}

/**
 * Calculates the position offset based on the percentage
 *
 * @function calculatePositionOffset
 * @description Determines how far to move based on direction and percentage
 *
 * @param {string} direction - Direction of movement ('next' or 'prev')
 * @param {number} percentage - Movement percentage
 * @param {number} contentRatio - Content ratio adjustment
 * @returns {number} The position offset value
 *
 * @example
 * // Calculate position offset for next movement
 * const offset = calculatePositionOffset('next', 100, 0.92);
 */
export function calculatePositionOffset(
  direction: string,
  percentage: number,
  contentRatio: number
): number {
  if (direction === 'prev') {
    return (100 - percentage) * contentRatio;
  }

  // direction === 'next'
  return percentage * contentRatio;
}

/**
 * Creates the transform CSS string based on calculated position
 *
 * @function createTransformString
 * @description Generates the CSS transform property for slider movement
 *
 * @param {number} position - Position percentage
 * @returns {string} CSS transform string
 *
 * @example
 * // Create a transform string for position 120
 * const transform = createTransformString(120);
 * // Result: "transform: translate3d(calc(-120%), 0, 0)"
 */
export function createTransformString(position: number): string {
  return `transform: translate3d(calc(-${position}%), 0, 0)`;
}

/**
 * Generates sequential indices
 *
 * @function generateSequentialIndices
 * @description Creates an array of sequential indices
 *
 * @param {number} count - Number of indices to generate
 * @returns {number[]} Array of sequential indices
 */
export function generateSequentialIndices(count: number): number[] {
  return [...Array(count)].map((_, index) => index);
}

/**
 * Determines if this is an initial next movement that requires special handling
 *
 * @function isInitialNextMovement
 * @description Checks for the special case of first-time next movement
 *
 * @param {SliderState} state - Current slider state
 * @returns {boolean} True if this is the initial next movement
 *
 * @example
 * // Check if this is the initial next movement
 * if (isInitialNextMovement()) {
 *   // Handle special case
 * }
 */
export function isInitialNextMovement(state: SliderState): boolean {
  const { direction, isInitialNext, isSliderMoving } = state;

  return isSliderMoving && direction === 'next' && isInitialNext;
}

/**
 * Checks if all content fits on a single page
 *
 * @function isOnlyOnePage
 * @description Determines if we have a single-page scenario
 *
 * @param {number} itemsPerPage - Number of items that fit on one page
 * @param {number} totalItems - Total number of items
 * @returns {boolean} True if all content fits on a single page
 */
export function isOnlyOnePage(itemsPerPage: number, totalItems: number): boolean {
  return totalItems <= itemsPerPage;
}

/**
 * Calculates the final position for the slider
 *
 * @function calculateFinalPosition
 * @description Computes the final position based on all factors
 *
 * @param {number} basePosition - Base position percentage
 * @param {string} direction - Direction of movement ('next' or 'prev')
 * @param {number} dragOffset - Drag offset value
 * @param {number} paddingAdjustment - Padding adjustment value
 * @returns {number} The final position percentage
 *
 * @example
 * // Calculate final position for next movement
 * const position = calculateFinalPosition(120, 'next', 20, 4);
 */
export function calculateFinalPosition(
  basePosition: number,
  direction: string,
  dragOffset: number,
  paddingAdjustment: number
): number {
  if (direction === 'prev') {
    return basePosition - dragOffset - paddingAdjustment;
  }

  // direction === 'next'
  return basePosition + dragOffset - paddingAdjustment;
}

/**
 * Calculates the appropriate transform style string for slider movement
 *
 * @function calculateStyleString
 * @description Main function that orchestrates all position calculations
 *
 * @param {SliderState} state - Current slider state
 * @param {HTMLDivElement} element - The row element
 * @param {number} itemWidth - Width of each item
 * @returns {string} CSS transform string
 *
 * @example
 * // Calculate style string for a moving slider
 * const style = calculateStyleString(true, 'next', 100, rowElement);
 */
export function calculateStyleString(
  state: SliderState,
  element: HTMLDivElement,
  itemWidth: number,
  paddingOffset: number = 8,
  contentRatio: number = 92
): string {
  const {
    direction,
    hasMovedFromStart,
    isSliderMoving,
    itemsToDisplayInRow,
    movePercentage,
    media,
  } = state;

  // Element doesn't exist in the DOM
  if (!element) return createTransformString(0);

  // Slider hasn't been scrolled yet
  if (!hasMovedFromStart) return createTransformString(0);

  // Not enough items to require scrolling
  if (media.length <= itemsToDisplayInRow) return createTransformString(0);

  const basePosition = calculateBasePosition(itemWidth, itemsToDisplayInRow, paddingOffset);

  // Handle initial next movement
  if (isInitialNextMovement(state)) {
    const totalItems = media.length;

    // Check if we have fewer items than would fill two rows
    if (totalItems < itemsToDisplayInRow * 2) {
      // For the initial next click with fewer remaining items,
      // we need to calculate the exact position that will show just the remaining items
      const singleItemWidth = 100 / itemsToDisplayInRow;

      // This is how many items we need to slide by
      const remainingItems = totalItems - itemsToDisplayInRow;

      // Calculate the exact position - this is the percentage of the container width
      // that we need to translate by
      const exactPosition = remainingItems * singleItemWidth;

      // Apply any necessary adjustments for padding
      const adjustedPosition = exactPosition * contentRatio;

      return createTransformString(adjustedPosition);
    }

    return createTransformString(basePosition - itemWidth);
  }

  const paddingAdjustment = calculatePaddingAdjustment(paddingOffset, itemsToDisplayInRow);

  // Calculate final position
  if (isSliderMoving) {
    const positionOffset = calculatePositionOffset(direction, movePercentage, contentRatio);
    const finalPosition = calculateFinalPosition(
      basePosition,
      direction,
      positionOffset,
      paddingAdjustment
    );

    return createTransformString(finalPosition);
  }

  // Default case - not moving
  return createTransformString(basePosition - paddingAdjustment);
}
