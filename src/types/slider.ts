import type { Writable, Readable } from 'svelte/store';

// Types
import type { MediaContent, Movie } from './media';

/**
 * Represents actions that can be performed on a slider
 *
 * @typedef {Object} SliderActions
 * @property {function} moveNext - Moves the slider to the next set of items
 * @property {function} movePrev - Moves the slider to the previous set of items
 * @property {function} updateItemsToDisplay - Updates the number of items displayed in a row
 */
export interface SliderActions {
  moveNext: () => void;
  movePrev: () => void;
  updateItemsToDisplay: (count: number) => void;
}

/**
 * Represents derived values calculated from slider state
 *
 * @typedef {Object} SliderDerived
 * @property {number} itemWidth - Width of each item as a percentage
 * @property {MediaContent[]} rowContent - Array of content items to display
 * @property {boolean} showControls - Whether to show navigation controls
 * @property {number} totalItems - Total number of items in the slider
 */
export interface SliderDerived {
  itemWidth: number;
  rowContent: MediaContent[];
  showControls: boolean;
  totalItems: number;
}

/**
 * Represents the core state of a slider component
 *
 * @typedef {Object} SliderState
 * @property {'prev'|'next'} direction - Direction of current or last movement
 * @property {boolean} hasRowMoved - Whether the row has been moved at least once
 * @property {boolean} isInitialNext - Whether this is the first 'next' movement
 * @property {boolean} isRowMoving - Whether the slider is currently animating
 * @property {number} itemsToDisplayInRow - Number of items to display in a single row
 * @property {number} lowestVisibleIndex - Index of the first visible item
 * @property {number} movePercentage - Percentage of movement during animation
 * @property {Movie[]} movies - Array of movies to display in the slider
 */
export interface SliderState {
  contentIndex?: number;
  direction: 'prev' | 'next';
  hasRowMoved: boolean;
  isInitialNext: boolean;
  isRowMoving: boolean;
  itemsToDisplayInRow: number;
  lowestVisibleIndex: number;
  movePercentage: number;
  movies: Movie[];
}

/**
 * Represents a complete slider store with state, derived values, and actions
 *
 * @typedef {Object} SliderStore
 * @property {SliderActions} actions - Collection of methods that can be called to control the slider
 * @property {Readable<SliderDerived>} derived - Readable store containing calculated values derived from the state
 * @property {Writable<SliderState>} state - Writable store containing the core state of the slider
 */
export interface SliderStore {
  actions: SliderActions;
  derived: Readable<SliderDerived>;
  state: Writable<SliderState>;
}
