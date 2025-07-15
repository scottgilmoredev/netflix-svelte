/**
 * Intersection Observer Action Module
 *
 * @module
 * @description Provides a comprehensive Svelte action that leverages the Intersection Observer API
 * to detect when elements enter or exit the viewport.
 * Designed for lazy loading, animation triggers, and visibility tracking.
 *
 * The module includes:
 * - Flexible intersection detection with customizable thresholds
 * - Root element and margin configuration for precise control
 * - Custom event dispatching with detailed intersection data
 * - Automatic cleanup and memory management
 * - Dynamic option updates without recreation
 * - Type-safe configuration interface
 *
 * @requires IntersectionObserver API
 * @requires ./intersectionObserver
 */

import type {
  IntersectionOptions,
  IntersectionEventDetail,
  IntersectionObserverAction,
  IntersectionCallback,
} from '@types';

// Constants
const DEFAULT_THRESHOLD = 0;
const DEFAULT_ROOT_MARGIN = '0px';
const LOG_PREFIX = '[IntersectionObserver]';

/**
 * Creates a callback function for intersection observer
 *
 * @param {HTMLElement} node - The DOM element being observed
 * @param {function} [customCallback] - Optional custom callback function
 * @param {boolean} [once] - Whether to disconnect after first intersection
 * @returns {function} Function that accepts observer and returns the callback
 */
function createIntersectionCallback(
  node: HTMLElement,
  customCallback?: (detail: IntersectionEventDetail) => void,
  once?: boolean
): (observer: IntersectionObserver) => IntersectionCallback {
  return (observer: IntersectionObserver): IntersectionCallback => {
    return (entries) => {
      const isIntersecting = entries[0].isIntersecting;
      const detail = { isIntersecting, entry: entries[0] };

      // Dispatch event for backward compatibility
      node.dispatchEvent(new CustomEvent<IntersectionEventDetail>('intersection', { detail }));

      // Call callback if provided
      if (customCallback) {
        customCallback(detail);
      }

      if (once && isIntersecting) {
        observer.disconnect();
      }
    };
  };
}

/**
 * Validates that a threshold value or array contains valid intersection ratios
 *
 * @param {number | number[]} threshold - Threshold value(s) to validate
 * @returns {boolean} Whether all threshold values are valid (0-1 range)
 */
function isValidThreshold(threshold: number | number[]): boolean {
  if (Array.isArray(threshold)) {
    return threshold.every((t) => typeof t === 'number' && t >= 0 && t <= 1);
  }
  return typeof threshold === 'number' && threshold >= 0 && threshold <= 1;
}

/**
 * Normalizes options with defaults
 *
 * @param {IntersectionOptions} options - Raw options
 * @returns {IntersectionOptions} Normalized options
 */
function normalizeOptions(options: IntersectionOptions): IntersectionOptions {
  return {
    threshold: options.threshold ?? DEFAULT_THRESHOLD,
    rootMargin: options.rootMargin ?? DEFAULT_ROOT_MARGIN,
    root: options.root ?? null,
    once: options.once ?? false,
    callback: options.callback,
  };
}

/**
 * Deep comparison of intersection observer options
 *
 * @param {IntersectionOptions} a - First options object
 * @param {IntersectionOptions} b - Second options object
 * @returns {boolean} Whether options are equal
 */
function optionsEqual(a: IntersectionOptions, b: IntersectionOptions): boolean {
  if (a === b) return true;
  if (!a || !b) return false;

  // Compare primitive values
  if (a.once !== b.once || a.rootMargin !== b.rootMargin || a.root !== b.root) {
    return false;
  }

  // Compare threshold arrays/values
  const aThreshold = a.threshold ?? DEFAULT_THRESHOLD;
  const bThreshold = b.threshold ?? DEFAULT_THRESHOLD;

  if (Array.isArray(aThreshold) && Array.isArray(bThreshold)) {
    return (
      aThreshold.length === bThreshold.length &&
      aThreshold.every((val, idx) => val === bThreshold[idx])
    );
  }

  return aThreshold === bThreshold;
}

/**
 * Validates intersection observer options
 *
 * @param {IntersectionOptions} options - Options to validate
 * @returns {boolean} Whether options are valid
 */
function validateOptions(options: IntersectionOptions): boolean {
  if (!options || typeof options !== 'object') {
    console.warn('IntersectionObserver: Invalid options provided, using defaults');
    return false;
  }

  if (options.threshold !== undefined && !isValidThreshold(options.threshold)) {
    console.warn('IntersectionObserver: Invalid threshold value(s), using default');
    return false;
  }

  return true;
}

/**
 * Svelte action for intersection observation
 *
 * @function intersectionObserver
 * @description Creates and manages an Intersection Observer for a DOM element with comprehensive
 * configuration options and automatic lifecycle management. Dispatches custom events when
 * intersection state changes and optionally executes a callback function with detailed information
 * about visibility and intersection ratios. Handles cleanup automatically and supports dynamic
 * option updates.
 *
 * @param {HTMLElement} node - The DOM element to observe for intersection changes
 * @param {IntersectionOptions} [options] - Configuration options for the intersection observer
 * @param {function} [options.callback] - Optional callback function to execute on intersection changes
 * @param {boolean} [options.once] - Whether to disconnect after first intersection
 * @param {Element | null} [options.root] - The element used as the viewport for checking visibility
 * @param {string} [options.rootMargin] - Margin around the root element
 * @param {number | number[]} [options.threshold] - Visibility percentage required to trigger
 *
 * @returns {IntersectionObserverAction} Action object with destroy and update methods for Svelte lifecycle management
 *
 * @example
 * // Basic usage in Svelte component
 * <div use:intersectionObserver on:intersection={handleIntersection}>
 *   Content to observe
 * </div>
 *
 * <script>
 *   import { intersectionObserver } from './actions/intersectionObserver';
 *
 *   function handleIntersection(event) {
 *     const { isIntersecting, entry } = event.detail;
 *     if (isIntersecting) {
 *       console.log('Element is visible');
 *     }
 *   }
 * </script>
 *
 *  * @example
 * // Using callback instead of event handler
 * <div
 *   use:intersectionObserver={{
 *     threshold: 0.1,
 *     once: true,
 *     callback: (detail) => {
 *       if (detail.isIntersecting) {
 *         console.log('Element is visible');
 *       }
 *     }
 *   }}
 * >
 *   Content to observe
 * </div>
 *
 * @example
 * // Lazy loading images
 * <img
 *   use:intersectionObserver={{ rootMargin: '50px', once: true }}
 *   on:intersection={loadImage}
 *   data-src="/path/to/image.jpg"
 *   alt="Lazy loaded image"
 * />
 *
 * @example
 * // Infinite scrolling implementation
 * <div
 *   use:intersectionObserver={{
 *     rootMargin: '200px 0px',
 *     threshold: 0
 *   }}
 *   on:intersection={loadMoreContent}
 *   class="load-more-trigger"
 * >
 *   Loading more...
 * </div>
 */
export function intersectionObserver(
  node: HTMLElement,
  options: IntersectionOptions = {}
): IntersectionObserverAction {
  // Check for IntersectionObserver API support
  if (typeof IntersectionObserver === 'undefined') {
    console.warn('IntersectionObserver API is not supported in this environment');
    return {
      update: () => {},
      destroy: () => {},
    };
  }

  // Validate input
  if (!node || !(node instanceof HTMLElement)) {
    console.warn('IntersectionObserver: Invalid node provided');
    return {
      update: () => {},
      destroy: () => {},
    };
  }

  validateOptions(options);

  let observer: IntersectionObserver | null = null;
  let currentOptions = normalizeOptions(options);
  let isDestroyed = false;

  /**
   * Validates internal state consistency
   *
   * @returns {boolean} Whether internal state is valid
   */
  function validateInternalState(): boolean {
    if (isDestroyed) {
      console.warn(`${LOG_PREFIX} Action has been destroyed`);
      return false;
    }

    if (!node || !node.isConnected) {
      console.warn(`${LOG_PREFIX} Node is no longer connected to DOM`);
      return false;
    }

    return true;
  }

  /**
   * Creates and initializes the intersection observer
   *
   * @returns {IntersectionObserver | null} Created observer or null if failed
   */
  function createObserver(): IntersectionObserver | null {
    if (!validateInternalState()) {
      return null;
    }

    try {
      const { callback: customCallback, once, root, rootMargin, threshold } = currentOptions;

      // Create the callback factory
      const callbackFactory = createIntersectionCallback(node, customCallback, once);

      // Create observer with a callback that gets the observer lazily
      const newObserver = new IntersectionObserver(
        (entries) => {
          // The callback factory returns a function that needs the observer
          // We call it here where newObserver is available
          const actualCallback = callbackFactory(newObserver);
          return actualCallback(entries);
        },
        { root, rootMargin, threshold }
      );

      newObserver.observe(node);

      return newObserver;
    } catch (error) {
      console.warn(`${LOG_PREFIX} Failed to create observer`, error);
      return null;
    }
  }

  /**
   * Updates observer configuration when options change
   *
   * @description Recreates the intersection observer with new configuration options
   * when the action parameters change. Uses change detection to avoid unnecessary
   * recreation and implements atomic updates to prevent inconsistent state.
   *
   * @param {IntersectionOptions} newOptions - New configuration options for the observer
   * @returns {void}
   */
  function updateObserver(newOptions: IntersectionOptions = {}): void {
    if (!validateInternalState()) {
      return;
    }

    validateOptions(newOptions);

    const normalizedNewOptions = normalizeOptions(newOptions);

    // Change detection - avoid unnecessary recreation
    if (optionsEqual(currentOptions, normalizedNewOptions)) {
      return;
    }

    // Store previous state for rollback
    const previousObserver = observer;
    const previousOptions = currentOptions;

    try {
      // Atomic update: create new observer first
      currentOptions = normalizedNewOptions;
      const newObserver = createObserver();

      if (newObserver) {
        // Success: cleanup old observer
        if (previousObserver) {
          try {
            previousObserver.disconnect();
          } catch (error) {
            console.warn(`${LOG_PREFIX} Error disconnecting previous observer`, error);
          }
        }

        observer = newObserver;
      } else {
        // Rollback on failure
        console.warn(`${LOG_PREFIX} Failed to create new observer, rolling back`);
        currentOptions = previousOptions;
        observer = previousObserver;
      }
    } catch (error) {
      // Rollback on error
      console.warn(`${LOG_PREFIX} Error during update, rolling back`, error);
      currentOptions = previousOptions;
      observer = previousObserver;
    }
  }

  /**
   * Cleanup function called when element is removed from DOM
   *
   * @description Disconnects the intersection observer to prevent memory leaks
   * and ensure proper cleanup when the element is removed from the DOM.
   * Automatically called by Svelte when the action is no longer needed.
   * Includes comprehensive error handling and state cleanup.
   *
   * @returns {void}
   */
  function destroyObserver(): void {
    if (isDestroyed) {
      return;
    }

    try {
      if (observer) {
        observer.disconnect();
      }
    } catch (error) {
      console.warn(`${LOG_PREFIX} Error during observer cleanup`, error);
    } finally {
      // Ensure cleanup regardless of errors
      observer = null;
      currentOptions = {};
      isDestroyed = true;
    }
  }

  // Initialize the observer
  observer = createObserver();

  return {
    update: updateObserver,
    destroy: destroyObserver,
  };
}
