/**
 * Preview Modal Store
 *
 * @module
 * @description Svelte store for managing preview modal state throughout the
 * application. Provides reactive state management for preview modals that appear on hover
 * over media items, including position calculation, media details fetching, and intelligent
 * timing controls. Built on top of the base modal store with enhanced preview-specific
 * functionality.
 *
 * The store manages:
 * - Preview modal visibility and state
 * - Media content and detailed information
 * - Modal positioning relative to trigger elements
 * - Delayed opening and closing with timeout management
 * - Transform origin calculation for smooth animations
 * - Race condition prevention through coordinated timeouts
 *
 * @requires ./modalBaseStore
 * @requires @types
 * @requires @services
 * @requires @constants
 * @requires @utils/timeout
 */

// Base store
import { createBaseModalStore, type BaseModalState } from './modalBaseStore';

// Types
import type { AnyMedia, MediaDetails } from '@types';
import type { PortalPosition } from '@types';

// Services
import { getMediaDetails, fetchMediaDetailsBatch } from '@services';

// Constants
import { PREVIEW_TIMING } from '@constants';

// Utils
import { createTimeoutManager } from '@utils/timeout';

/**
 * Interface for the preview modal state
 *
 * @interface PreviewModalState
 * @description Extends the base modal state with preview modal specific properties
 * for managing media content display, positioning, source element tracking, and
 * interaction method tracking. Provides comprehensive state management for preview
 * modals that appear on hover with detailed media information, precise positioning,
 * and keyboard interaction prevention logic.
 *
 * @extends BaseModalState
 * @property {boolean} isOpen - Whether the preview modal is currently visible and interactive
 * @property {AnyMedia | null} media - The media item to display in the preview modal
 * @property {MediaDetails | null} mediaDetails - Detailed information about the media item from API
 * @property {PortalPosition | null} position - Position and transform information for the preview modal
 * @property {HTMLElement | null} sourceElement - The element that triggered the preview modal
 * @property {boolean} [openedViaKeyboard] - Whether the modal was opened via keyboard interaction
 * @property {boolean} [closedViaKeyboard] - Whether the modal was closed via keyboard interaction
 *
 * @example
 * // Example preview modal state when open via mouse hover
 * const openState: PreviewModalState = {
 *   isOpen: true,
 *   media: movieData,
 *   mediaDetails: detailedMovieInfo,
 *   position: { top: 100, left: 200, width: 300, height: 200 },
 *   sourceElement: hoveredElement,
 *   openedViaKeyboard: false,
 *   closedViaKeyboard: false
 * };
 *
 * @example
 * // Closed preview modal state after keyboard close
 * const closedState: PreviewModalState = {
 *   isOpen: false,
 *   media: null,
 *   mediaDetails: null,
 *   position: null,
 *   sourceElement: null,
 *   openedViaKeyboard: false,
 *   closedViaKeyboard: true
 * };
 */
export interface PreviewModalState extends BaseModalState {
  closedViaKeyboard?: boolean;
  isOpen: boolean;
  media: AnyMedia | null;
  mediaDetails: MediaDetails | null;
  openedViaKeyboard: boolean;
  position: PortalPosition | null;
  sourceElement: HTMLElement | null;
}

/**
 * Initial state for the preview modal
 *
 * @constant {PreviewModalState}
 * @description Default state configuration used when initializing the preview modal store.
 * Preview modal starts in a closed state with no associated media, position, source
 * element, or interaction tracking flags, providing a clean initial state for the
 * application startup. Ensures consistent initialization across all application instances
 * with proper defaults for keyboard interaction tracking.
 */
const initialState: PreviewModalState = {
  closedViaKeyboard: false,
  isOpen: false,
  media: null,
  mediaDetails: null,
  openedViaKeyboard: false,
  position: null,
  sourceElement: null,
};

/**
 * Store for preview modal state
 *
 * @constant {BaseModalStore<PreviewModalState>}
 * @description Enhanced store that manages the preview modal's state throughout the application.
 * Provides reactive state management with automatic updates to all subscribers when preview
 * modal state changes. Includes enhanced methods for opening, closing, and updating modal
 * properties with type safety and consistent API patterns.
 *
 * @example
 * // Subscribe to preview modal state changes
 * previewModalStore.subscribe((state) => {
 *   console.log('Preview modal is open:', state.isOpen);
 *   console.log('Current media:', state.media?.name);
 *   console.log('Position:', state.position);
 * });
 *
 * @example
 * // Get current preview modal state
 * const currentState = previewModalStore.getState();
 * if (currentState.isOpen && currentState.media) {
 *   // Handle open preview modal with media
 * }
 */
export const previewModalStore = createBaseModalStore<PreviewModalState>(initialState);

// Create timeout manager for handling delayed opening/closing
const timeoutManager = createTimeoutManager();

/**
 * Opens the preview modal with the specified media and position
 *
 * @function openPreviewModal
 * @description Schedules the preview modal to open after a configurable delay with intelligent
 * position calculation and media details fetching. Calculates the optimal position based on
 * the source element's geometry, sets up transform origin for smooth animations, and initiates
 * background fetching of media details. Includes race condition prevention through timeout
 * management and error handling for failed API requests.
 *
 * @param {AnyMedia} media - The media item to display in the preview modal
 * @param {HTMLElement} sourceElement - The element that triggered the preview modal
 * @param {number} [delay=PREVIEW_TIMING.OPEN_DELAY] - Delay in milliseconds before opening the modal
 *
 * @returns {void}
 *
 * @example
 * // Open preview modal on hover
 * function handleMediaHover(event: MouseEvent, media: AnyMedia) {
 *   const element = event.currentTarget as HTMLElement;
 *   openPreviewModal(media, element);
 * }
 *
 * @example
 * // Open preview modal with custom delay
 * function handleQuickPreview(media: AnyMedia, element: HTMLElement) {
 *   openPreviewModal(media, element, 100); // Faster opening
 * }
 *
 * @example
 * // Open preview modal with error handling
 * async function showMediaPreview(media: AnyMedia, sourceEl: HTMLElement) {
 *   try {
 *     openPreviewModal(media, sourceEl);
 *   } catch (error) {
 *     console.error('Failed to open preview modal:', error);
 *   }
 * }
 */
export function openPreviewModal(
  media: AnyMedia,
  sourceElement: HTMLElement,
  openedViaKeyboard = false,
  delay: number = PREVIEW_TIMING.OPEN_DELAY
): void {
  // Clear any pending timeouts to prevent race conditions
  timeoutManager.clearPendingTimeouts();

  // Calculate position based on the source element
  const rect = sourceElement.getBoundingClientRect();

  // Calculate the center of the source element
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Position the modal to expand from the source element
  const position: PortalPosition = {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
    transformOrigin: `${centerX}px ${centerY}px`,
  };

  // Schedule opening after delay
  timeoutManager.setTimeout(async () => {
    // First open the modal with loading state
    previewModalStore.open({
      closedViaKeyboard: false,
      media,
      mediaDetails: null,
      openedViaKeyboard,
      position,
      sourceElement,
    });

    try {
      // Pre-fetch details for this media and others in the same row
      await fetchMediaDetailsBatch([media]);

      // Get the details for this specific media
      const details = getMediaDetails(media);

      // Update the store with the fetched details
      previewModalStore.update((state) => ({
        ...state,
        mediaDetails: details,
      }));
    } catch (error) {
      console.error('Error fetching media details:', error);
    }
  }, delay);
}

/**
 * Closes the preview modal
 *
 * @function closePreviewModal
 * @description Schedules the preview modal to close after a configurable delay to provide
 * smooth user interactions when moving between elements. Includes timeout management to
 * prevent race conditions with opening operations and ensures clean state transitions.
 * The delay allows users to move from the trigger element to the modal without it closing.
 *
 * @param {number} [delay=PREVIEW_TIMING.CLOSE_DELAY] - Delay in milliseconds before closing the modal
 *
 * @returns {void}
 *
 * @example
 * // Close preview modal on mouse leave
 * function handleMediaLeave() {
 *   closePreviewModal();
 * }
 *
 * @example
 * // Close preview modal immediately
 * function handleEscapeKey() {
 *   closePreviewModal(0); // No delay
 * }
 *
 * @example
 * // Close preview modal with custom delay
 * function handleSlowClose() {
 *   closePreviewModal(1000); // Longer delay
 * }
 */
export function closePreviewModal(delay: number = PREVIEW_TIMING.CLOSE_DELAY): void {
  // Clear any pending timeouts to prevent race conditions
  timeoutManager.clearPendingTimeouts();

  // Schedule closing after delay
  timeoutManager.setTimeout(() => {
    previewModalStore.close();
  }, delay);
}

/**
 * Cancels closing the preview modal
 *
 * @function cancelClosePreviewModal
 * @description Cancels any pending close operation to prevent the modal from closing
 * when the user moves back to the trigger element or modal content. Essential for
 * providing smooth hover interactions where users can move between related elements
 * without the modal disappearing unexpectedly.
 *
 * @returns {void}
 *
 * @example
 * // Cancel close when hovering back over trigger element
 * function handleMediaHoverBack() {
 *   cancelClosePreviewModal();
 * }
 *
 * @example
 * // Cancel close when entering modal content
 * function handleModalEnter() {
 *   cancelClosePreviewModal();
 * }
 *
 * @example
 * // Cancel close in component cleanup
 * function handleComponentUnmount() {
 *   cancelClosePreviewModal();
 *   // Additional cleanup
 * }
 */
export function cancelClosePreviewModal(): void {
  timeoutManager.clearPendingTimeouts();
}

/**
 * Closes the preview modal via keyboard interaction
 *
 * @function closePreviewModalViaKeyboard
 * @description Closes the preview modal and marks it as closed via keyboard interaction.
 * This flag is used to prevent the modal from immediately reopening when the user
 * closes it with the keyboard but the mouse is still hovering over the trigger element.
 * Ensures better user experience by requiring the mouse to leave and re-enter the
 * trigger element before the modal can reopen.
 *
 * @returns {void}
 *
 * @example
 * // Close modal via Escape key
 * function handleEscapeKey() {
 *   closePreviewModalViaKeyboard();
 * }
 *
 * @example
 * // Close modal via close button keyboard activation
 * function handleCloseButtonKeydown(event: KeyboardEvent) {
 *   if (event.key === 'Enter' || event.key === ' ') {
 *     closePreviewModalViaKeyboard();
 *   }
 * }
 */
export function closePreviewModalViaKeyboard(): void {
  previewModalStore.update((state) => ({ ...state, closedViaKeyboard: true }));
  closePreviewModal();
}

/**
 * Clears all preview modal timeouts
 *
 * @function clearPreviewModalTimeouts
 * @description Cancels all pending timeout operations for the preview modal system.
 * Essential for cleanup operations when components unmount or when the preview modal
 * system needs to be reset. Prevents memory leaks and unwanted callback executions
 * in preview modal operations.
 *
 * @returns {void}
 *
 * @example
 * // Clear timeouts on component unmount
 * useEffect(() => {
 *   return () => {
 *     clearPreviewModalTimeouts();
 *   };
 * }, []);
 *
 * @example
 * // Clear timeouts when navigating away
 * function handlePageNavigation() {
 *   clearPreviewModalTimeouts();
 *   // Navigate to new page
 * }
 */
export function clearPreviewModalTimeouts(): void {
  timeoutManager.clearPendingTimeouts();
}
