/**
 * Base Modal Store System
 *
 * @module
 * @description Base Svelte store factory and utilities for creating modal stores throughout
 * the application. Provides common modal functionality including opening, closing, and
 * state management that can be extended by specific modal implementations. Serves as
 * the foundation for all modal stores in the application.
 *
 * The system includes:
 * - Base modal state interface with extensible structure
 * - Factory function for creating enhanced modal stores
 * - Common modal lifecycle methods (open, close, update)
 * - Type-safe state management with reactive updates
 * - Consistent API patterns for all modal implementations
 * - Synchronous state access for event handlers
 * - Property update methods with type safety
 * - Enhanced store interface extending Svelte's Writable
 */

import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';

/**
 * Base interface for all modal states
 *
 * @interface BaseModalState
 * @description Defines the common structure for all modal state stores throughout
 * the application. Provides the fundamental `isOpen` property that all modal
 * implementations must include, while allowing for extension with additional
 * modal-specific properties through inheritance.
 *
 * @property {boolean} isOpen - Whether the modal is currently visible and interactive
 *
 * @example
 * // Extending base modal state for specific modals
 * interface PreviewModalState extends BaseModalState {
 *   mediaId: number | null;
 *   position: { x: number; y: number } | null;
 * }
 *
 * @example
 * // Simple modal state implementation
 * interface ConfirmModalState extends BaseModalState {
 *   title: string;
 *   message: string;
 *   onConfirm: () => void;
 * }
 */
export interface BaseModalState {
  isOpen: boolean;
}

/**
 * Creates a base modal store with common functionality
 *
 * @function createBaseModalStore
 * @description Factory function that creates a base modal store with enhanced methods
 * for modal lifecycle management. Provides a consistent API for opening, closing,
 * and updating modal state while maintaining type safety. Returns a store with
 * additional methods beyond the standard Svelte store interface.
 *
 * @template T - The specific modal state type that extends BaseModalState
 * @param {T} initialState - Initial state configuration for the modal
 *
 * @returns {BaseModalStore<T>} Enhanced store with modal-specific methods and type safety
 *
 * @example
 * // Creating a preview modal store
 * interface PreviewModalState extends BaseModalState {
 *   mediaId: number | null;
 *   position: { x: number; y: number } | null;
 * }
 *
 * const previewModalStore = createBaseModalStore<PreviewModalState>({
 *   isOpen: false,
 *   mediaId: null,
 *   position: null
 * });
 *
 * @example
 * // Creating a confirmation modal store
 * interface ConfirmModalState extends BaseModalState {
 *   title: string;
 *   message: string;
 *   onConfirm: (() => void) | null;
 * }
 *
 * const confirmModalStore = createBaseModalStore<ConfirmModalState>({
 *   isOpen: false,
 *   title: '',
 *   message: '',
 *   onConfirm: null
 * });
 */
export function createBaseModalStore<T extends BaseModalState>(initialState: T): BaseModalStore<T> {
  const store = writable<T>(initialState);

  return {
    subscribe: store.subscribe,
    set: store.set,
    update: store.update,

    /**
     * Gets the current state of the modal
     *
     * @function getState
     * @description Returns the current state of the modal store without subscribing
     * to changes. Useful for accessing modal state in event handlers or functions
     * where reactive updates are not needed. Provides synchronous access to the
     * current modal configuration and properties.
     *
     * @returns {T} Current modal state with all properties and values
     *
     * @example
     * // Getting current modal state
     * const currentState = previewModalStore.getState();
     * console.log('Modal is open:', currentState.isOpen);
     * console.log('Media ID:', currentState.mediaId);
     *
     * @example
     * // Conditional logic based on current state
     * function handleKeyPress(event: KeyboardEvent) {
     *   const state = modalStore.getState();
     *   if (state.isOpen && event.key === 'Escape') {
     *     modalStore.close();
     *   }
     * }
     */
    getState: (): T => get(store),

    /**
     * Closes the modal
     *
     * @function close
     * @description Updates the modal state to hide the modal by setting isOpen to false.
     * Preserves all other modal properties while closing the modal, allowing for
     * quick reopening with the same configuration. Triggers reactive updates for
     * all subscribers to handle modal close animations and cleanup.
     *
     * @returns {void}
     *
     * @example
     * // Simple modal close
     * modalStore.close();
     *
     * @example
     * // Close modal with cleanup
     * function closeModalWithCleanup() {
     *   modalStore.close();
     *   // Additional cleanup operations
     *   clearAnimationTimeouts();
     *   resetFocusState();
     * }
     *
     * @example
     * // Close on escape key
     * function handleEscapeKey(event: KeyboardEvent) {
     *   if (event.key === 'Escape') {
     *     modalStore.close();
     *   }
     * }
     */
    close: (): void => {
      store.update((state) => ({
        ...state,
        isOpen: false,
      }));
    },

    /**
     * Opens the modal
     *
     * @function open
     * @description Updates the modal state to show the modal by setting isOpen to true.
     * Optionally accepts additional properties to update when opening the modal,
     * allowing for dynamic configuration of modal content and behavior. Triggers
     * reactive updates for all subscribers to handle modal open animations.
     *
     * @param {Partial<Omit<T, 'isOpen'>>} [props] - Optional properties to update when opening
     *
     * @returns {void}
     *
     * @example
     * // Simple modal open
     * modalStore.open();
     *
     * @example
     * // Open modal with specific content
     * previewModalStore.open({
     *   mediaId: 12345,
     *   position: { x: 100, y: 200 }
     * });
     *
     * @example
     * // Open confirmation modal with dynamic content
     * confirmModalStore.open({
     *   title: 'Delete Item',
     *   message: 'Are you sure you want to delete this item?',
     *   onConfirm: () => deleteItem(itemId)
     * });
     */
    open: (props?: Partial<Omit<T, 'isOpen'>>): void => {
      store.update((state) => ({
        ...state,
        ...(props || {}),
        isOpen: true,
      }));
    },

    /**
     * Updates specific properties of the modal state
     *
     * @function updateProps
     * @description Updates specific properties of the modal state without changing
     * the isOpen status. Useful for updating modal content or configuration while
     * the modal is already open, or for preparing modal state before opening.
     * Maintains type safety by excluding the isOpen property from updates.
     *
     * @param {Partial<Omit<T, "isOpen">>} props - Properties to update in the modal state
     *
     * @returns {void}
     *
     * @example
     * // Update modal content while open
     * previewModalStore.updateProps({
     *   mediaId: 67890,
     *   position: { x: 150, y: 250 }
     * });
     *
     * @example
     * // Prepare modal state before opening
     * confirmModalStore.updateProps({
     *   title: 'Save Changes',
     *   message: 'Do you want to save your changes before leaving?'
     * });
     * // Later...
     * confirmModalStore.open();
     *
     * @example
     * // Update single property
     * previewModalStore.updateProps({
     *   mediaId: newMediaId
     * });
     */
    updateProps: (props: Partial<Omit<T, 'isOpen'>>): void => {
      store.update((state) => ({
        ...state,
        ...props,
      }));
    },
  };
}

/**
 * Type definition for a base modal store
 *
 * @interface BaseModalStore
 * @description Defines the complete structure of a base modal store with enhanced methods
 * beyond the standard Svelte store interface. Provides type safety for modal operations
 * and ensures consistent API patterns across all modal implementations. Extends the
 * Writable interface with modal-specific functionality.
 *
 * @template T - The specific modal state type that extends BaseModalState
 *
 * @property {() => T} getState - Function to get current modal state synchronously
 * @property {() => void} close - Function to close the modal
 * @property {(props?: Partial<Omit<T, 'isOpen'>>) => void} open - Function to open the modal with optional props
 * @property {(props: Partial<Omit<T, 'isOpen'>>) => void} updateProps - Function to update modal properties
 *
 * @example
 * // Using the base modal store type
 * let modalStore: BaseModalStore<PreviewModalState>;
 *
 * function initializeModal() {
 *   modalStore = createBaseModalStore({
 *     isOpen: false,
 *     mediaId: null,
 *     position: null
 *   });
 * }
 *
 * @example
 * // Type-safe modal operations
 * function openPreviewModal(mediaId: number, position: { x: number; y: number }) {
 *   modalStore.open({ mediaId, position });
 * }
 *
 * function updateModalPosition(newPosition: { x: number; y: number }) {
 *   modalStore.updateProps({ position: newPosition });
 * }
 */
export interface BaseModalStore<T extends BaseModalState> extends Writable<T> {
  getState: () => T;
  close: () => void;
  open: (props?: Partial<Omit<T, 'isOpen'>>) => void;
  updateProps: (props: Partial<Omit<T, 'isOpen'>>) => void;
}
