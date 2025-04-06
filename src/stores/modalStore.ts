/**
 * Modal Store Module
 *
 * @module
 * @description Provides a store and utilities for managing the global modal state.
 * Handles opening and closing the modal with the appropriate content.
 */

import { writable } from 'svelte/store';

// Registry of media stores
import { findStoreByTitle } from './mediaStoreRegistry';

// Types
import type { MediaStore } from '../types';

/**
 * Closes the modal
 *
 * @function closeModal
 * @description Updates the modal state to hide the modal.
 * Sets isOpen to false while preserving the current store reference.
 *
 * @example
 * // Close the modal when a button is clicked
 * import { closeModal } from './modalStore';
 *
 * <button on:click={closeModal}>Close</button>
 */
export function closeModal() {
  modalStore.update((state) => ({
    ...state,
    isOpen: false,
  }));
}

/**
 * Initial state for the modal
 *
 * @constant {ModalState}
 * @description Default state used when initializing the modal store.
 * Modal starts closed with no associated store.
 */
const initialState: ModalState = {
  isOpen: false,
  store: null,
};

/**
 * Interface for the modal state
 *
 * @interface ModalState
 * @description Defines the structure of the modal state store.
 * Tracks whether the modal is open and which media store's content to display.
 *
 * @property {boolean} isOpen - Whether the modal is currently visible
 * @property {MediaStore | null} store - The media store whose content is displayed in the modal
 */
interface ModalState {
  isOpen: boolean;
  store: MediaStore | null;
}

/**
 * Store for modal state
 *
 * @constant {Writable<ModalState>}
 * @description Svelte writable store that manages the modal's state.
 * Components can subscribe to this store to react to modal state changes.
 *
 * @example
 * // In a Svelte component
 * import { modalStore } from '../stores/modalStore';
 *
 * // Subscribe to modal state changes
 * $: isModalOpen = $modalStore.isOpen;
 */
export const modalStore = writable<ModalState>(initialState);

/**
 * Opens the modal with the specified store
 *
 * @function openModal
 * @description Updates the modal state to display content from the provided media store.
 * Sets isOpen to true and assigns the store to the modal state.
 *
 * @param {MediaStore} store - The media store to display in the modal
 *
 * @example
 * // Open modal with trending movies
 * import { trending } from './mediaStore';
 * import { openModal } from './modalStore';
 *
 * openModal(trending);
 */
export function openModal(store: MediaStore) {
  modalStore.update((state) => ({
    ...state,
    isOpen: true,
    store,
  }));
}

/**
 * Opens the modal using a display title to find the store
 *
 * @function openModalByTitle
 * @description Looks up a media store by its display title and opens the modal with its content.
 * Provides a convenient way to open the modal without directly referencing store objects.
 *
 * @param {string} title - The display title of the store to show in the modal
 * @returns {boolean} True if the store was found and modal opened, false otherwise
 *
 * @example
 * // Open modal with trending movies by title
 * import { openModalByTitle } from './modalStore';
 *
 * const success = openModalByTitle('Trending Now');
 * if (!success) {
 *   console.error('Failed to open modal');
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
