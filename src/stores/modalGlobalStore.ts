/**
 * Global Modal Store System
 *
 * @module
 * @description Svelte store for managing global modal state throughout the
 * application. Provides centralized modal control for displaying media store content
 * with consistent behavior across all components and pages. Built on top of the base
 * modal store with global-specific functionality.
 *
 * The system includes:
 * - Global modal state management with media store integration
 * - Centralized modal control across all application components
 * - Media store registry integration for title-based lookups
 * - Enhanced opening methods with store association
 * - Consistent modal behavior and state management
 * - Error handling for missing store references
 * - Reactive updates for modal state changes
 * - Type-safe operations with GlobalModalState interface
 */

// Base store
import { createBaseModalStore, type BaseModalState } from './modalBaseStore';

// Registry of media stores
import { findStoreByTitle } from './mediaStoreRegistry';

// Types
import type { MediaStore } from '../types';

/**
 * Interface for the global modal state
 *
 * @interface GlobalModalState
 * @description Extends the base modal state with global modal specific properties
 * for managing media store content display. Defines the structure for the global
 * modal that can display content from any registered media store throughout the
 * application with consistent state management.
 *
 * @extends BaseModalState
 * @property {boolean} isOpen - Whether the modal is currently visible and interactive
 * @property {MediaStore | null} store - The media store whose content is displayed in the modal
 *
 * @example
 * // Example global modal state
 * const modalState: GlobalModalState = {
 *   isOpen: true,
 *   store: trendingMoviesStore
 * };
 *
 * @example
 * // Closed modal state
 * const closedState: GlobalModalState = {
 *   isOpen: false,
 *   store: null
 * };
 */
export interface GlobalModalState extends BaseModalState {
  store: MediaStore | null;
}

/**
 * Initial state for the global modal
 *
 * @constant {GlobalModalState}
 * @description Default state configuration used when initializing the global modal store.
 * Modal starts in a closed state with no associated media store, providing a clean
 * initial state for the application startup. Ensures consistent initialization
 * across all application instances.
 *
 * @example
 * // The modal starts closed with no content
 * console.log(initialState.isOpen); // false
 * console.log(initialState.store); // null
 */
const initialState: GlobalModalState = {
  isOpen: false,
  store: null,
};

/**
 * Store for global modal state
 *
 * @constant {BaseModalStore<GlobalModalState>}
 * @description Enhanced store that manages the global modal's state throughout the application.
 * Provides reactive state management with automatic updates to all subscribers when modal
 * state changes. Includes enhanced methods for opening, closing, and updating modal
 * properties with type safety and consistent API patterns.
 *
 * @example
 * // Subscribe to modal state changes
 * modalStore.subscribe((state) => {
 *   console.log('Modal is open:', state.isOpen);
 *   console.log('Current store:', state.store?.displayTitle);
 * });
 *
 * @example
 * // Get current modal state
 * const currentState = modalStore.getState();
 * if (currentState.isOpen) {
 *   // Handle open modal
 * }
 */
export const modalStore = createBaseModalStore<GlobalModalState>(initialState);

/**
 * Opens the modal with the specified store
 *
 * @function openModal
 * @description Updates the modal state to display content from the provided media store.
 * Sets the modal to open and associates it with the specified store for content display.
 * Triggers reactive updates for all subscribers to handle modal opening animations
 * and content rendering with the new store data.
 *
 * @param {MediaStore} store - The media store to display in the modal
 *
 * @returns {void}
 *
 * @example
 * // Open modal with trending movies
 * import { trendingMoviesStore } from './stores/trendingMovies';
 * openModal(trendingMoviesStore);
 *
 * @example
 * // Open modal from component event handler
 * function handleShowMore(store: MediaStore) {
 *   openModal(store);
 * }
 */
export function openModal(store: MediaStore): void {
  modalStore.open({ store });
}

/**
 * Closes the modal
 *
 * @function closeModal
 * @description Updates the modal state to hide the modal while preserving the associated
 * store reference. Triggers reactive updates for all subscribers to handle modal closing
 * animations and cleanup operations. The store reference is maintained to allow for
 * quick reopening with the same content if needed.
 *
 * @returns {void}
 *
 * @example
 * // Simple modal close
 * closeModal();
 *
 * @example
 * // Close modal with cleanup
 * function handleModalClose() {
 *   closeModal();
 *   // Additional cleanup operations
 *   clearSearchState();
 *   resetScrollPosition();
 * }
 *
 * @example
 * // Close modal on escape key
 * function handleKeyDown(event: KeyboardEvent) {
 *   if (event.key === 'Escape') {
 *     closeModal();
 *   }
 * }
 */
export function closeModal(): void {
  modalStore.close();
}

/**
 * Opens the modal using a display title to find the store
 *
 * @function openModalByTitle
 * @description Looks up a media store by its display title from the media store registry
 * and opens the modal with its content if found. Provides a convenient way to open
 * modals using string identifiers instead of direct store references. Includes error
 * handling for cases where the specified store title is not found in the registry.
 *
 * @param {string} title - The display title of the store to show in the modal
 *
 * @returns {boolean} True if the store was found and modal opened successfully, false otherwise
 *
 * @example
 * // Open modal by store title
 * const success = openModalByTitle('Trending Movies');
 * if (success) {
 *   console.log('Modal opened successfully');
 * } else {
 *   console.log('Store not found');
 * }
 *
 * @example
 * // Open modal with error handling
 * function showStoreModal(title: string) {
 *   if (!openModalByTitle(title)) {
 *     showErrorNotification(`Cannot find content: ${title}`);
 *   }
 * }
 *
 * @example
 * // Open modal from navigation
 * function handleNavigationClick(storeTitle: string) {
 *   const opened = openModalByTitle(storeTitle);
 *   if (opened) {
 *     trackModalOpen(storeTitle);
 *   }
 * }
 */
export function openModalByTitle(title: string): boolean {
  const store = findStoreByTitle(title);

  if (store) {
    openModal(store);
    return true;
  }

  console.error(`No store found with title: "${title}"`);
  return false;
}
