/**
 * Timeout Management System Utilities
 *
 * @module
 * @description Provides comprehensive utilities for managing timeouts with automatic cleanup
 * throughout the application. Handles timeout creation, tracking, and cleanup operations
 * to prevent memory leaks and ensure proper resource management. Essential for managing
 * delayed operations, animation timing, and cleanup sequences in complex UI interactions.
 *
 * The module includes utilities for:
 * - Timeout creation with automatic tracking and cleanup
 * - Individual timeout management and cancellation
 * - Bulk timeout clearing for component cleanup
 * - Memory leak prevention through proper timeout tracking
 * - Resource management for delayed operations
 * - Input validation and error handling for robust operation
 * - Cross-environment compatibility (browser/Node.js)
 *
 * @requires ../types/timeout
 */

import type { ClearAllResult, TimeoutEnvironment, TimeoutId, TimeoutManager } from '@types';

// Constants
const MIN_DELAY = 0;
const INVALID_TIMEOUT_ID = -1 as unknown as TimeoutId;

/**
 * Gets the appropriate `clearTimeout` function for the current JavaScript environment.
 * It prioritizes `window.clearTimeout` for browser environments and falls back to `global.clearTimeout` for Node.js.
 *
 * @function getClearTimeout
 * @description Retrieves the native `clearTimeout` function, ensuring compatibility across different JavaScript runtimes.
 * This abstraction allows the `TimeoutManager` to function correctly whether it's used in a browser or a server-side Node.js context.
 *
 * @returns {Function} The `clearTimeout` function, bound to its respective global context.
 *
 * @throws {Error} If `clearTimeout` is not available in the current environment, indicating an unsupported runtime.
 *
 * @example
 * // In a browser environment:
 * const clearTimeoutFn = getClearTimeout(); // Will return window.clearTimeout
 *
 * @example
 * // In a Node.js environment:
 * const clearTimeoutFn = getClearTimeout(); // Will return global.clearTimeout
 */
function getClearTimeout(): typeof clearTimeout {
  return getEnvironmentFunction('clearTimeout') as typeof clearTimeout;
}

/**
 * Provides the default environment functions (`setTimeout` and `clearTimeout`) for the `TimeoutManager`.
 * This function is used when no custom environment is explicitly provided to `createTimeoutManager`.
 *
 * @function getDefaultEnvironment
 * @description A factory function that returns an object containing the standard `setTimeout` and `clearTimeout`
 * functions, dynamically retrieved based on the current execution environment (browser or Node.js).
 * This ensures the `TimeoutManager` can operate without requiring explicit environment configuration in most cases.
 *
 * @returns {TimeoutEnvironment} An object conforming to the `TimeoutEnvironment` interface,
 * containing the default `setTimeout` and `clearTimeout` functions.
 *
 * @example
 * // Using the default environment to create a manager
 * const defaultManager = createTimeoutManager(getDefaultEnvironment());
 *
 * @example
 * // Implicitly using the default environment (most common use case)
 * const manager = createTimeoutManager(); // Internally calls getDefaultEnvironment()
 */
function getDefaultEnvironment(): TimeoutEnvironment {
  return {
    clearTimeout: getClearTimeout(),
    setTimeout: getSetTimeout(),
  };
}

/**
 * Generic helper to get a global function (like `setTimeout` or `clearTimeout`) from the current environment.
 * It checks `window` (browser) first, then `global` (Node.js) to find the appropriate function.
 *
 * @function getEnvironmentFunction
 * @description A utility function designed to abstract away environment-specific global object access.
 * This ensures that core timing functions can be reliably retrieved and used, regardless of whether
 * the code is running in a browser, Node.js, or other JavaScript runtimes that expose these globals.
 *
 * @param {'setTimeout' | 'clearTimeout'} functionName - The name of the global function to retrieve ('setTimeout' or 'clearTimeout').
 * @returns {Function} The requested global function, bound to its context to prevent `this` binding issues.
 *
 * @throws {Error} If the specified function is not available in the current environment, indicating a missing global.
 *
 * @example
 * // Retrieving setTimeout for the current environment
 * const mySetTimeout = getEnvironmentFunction('setTimeout');
 * mySetTimeout(() => console.log('Hello'), 100);
 *
 * @example
 * // Retrieving clearTimeout for the current environment
 * const myClearTimeout = getEnvironmentFunction('clearTimeout');
 * const id = setTimeout(() => {}, 1000);
 * myClearTimeout(id);
 */
function getEnvironmentFunction(
  functionName: 'setTimeout' | 'clearTimeout'
): typeof setTimeout | typeof clearTimeout {
  // For browser environments, use window.functionName
  if (typeof window !== 'undefined' && typeof window[functionName] === 'function') {
    return window[functionName].bind(window);
  }

  // For Node.js or other environments, use global.functionName
  if (typeof global !== 'undefined' && typeof global[functionName] === 'function') {
    return global[functionName].bind(global);
  }

  // If neither is available, throw an error
  throw new Error(`TimeoutManager: ${functionName} is not available in this environment`);
}

/**
 * Gets the appropriate `setTimeout` function for the current JavaScript environment.
 * It prioritizes `window.setTimeout` for browser environments and falls back to `global.setTimeout` for Node.js.
 *
 * @function getSetTimeout
 * @description Retrieves the native `setTimeout` function, ensuring compatibility across different JavaScript runtimes.
 * This abstraction allows the `TimeoutManager` to function correctly whether it's used in a browser or a server-side Node.js context.
 *
 * @returns {Function} The `setTimeout` function, bound to its respective global context.
 *
 * @throws {Error} If `setTimeout` is not available in the current environment, indicating an unsupported runtime.
 *
 * @example
 * // In a browser environment:
 * const setTimeoutFn = getSetTimeout(); // Will return window.setTimeout
 *
 * @example
 * // In a Node.js environment:
 * const setTimeoutFn = getSetTimeout(); // Will return global.setTimeout
 */
function getSetTimeout(): typeof setTimeout {
  return getEnvironmentFunction('setTimeout') as typeof setTimeout;
}

/**
 * Checks if a given value is a valid `TimeoutId`.
 * A valid `TimeoutId` is a non-null, non-undefined number or object (as returned by `setTimeout` in different environments).
 * This type guard helps ensure that `clearTimeout` operations are performed only with valid identifiers.
 *
 * @function isValidTimeoutId
 * @description A type guard that validates whether an input value can be considered a legitimate `TimeoutId`.
 * This is crucial for robust error handling and preventing attempts to clear non-existent or malformed timeouts,
 * which could lead to unexpected behavior or errors.
 *
 * @param {unknown} id - The value to check for validity as a `TimeoutId`.
 * @returns {id is TimeoutId} `true` if the value is a valid `TimeoutId`, `false` otherwise.
 *
 * @example
 * // Validating a typical timeout ID
 * const id = setTimeout(() => {}, 100);
 * if (isValidTimeoutId(id)) {
 *   clearTimeout(id);
 * }
 *
 * @example
 * // Handling an invalid timeout ID
 * const invalidId = -1;
 * if (!isValidTimeoutId(invalidId)) {
 *   console.warn('Attempted to clear an invalid ID.');
 * }
 */
function isValidTimeoutId(id: unknown): id is TimeoutId {
  return id !== null && id !== undefined && (typeof id === 'number' || typeof id === 'object');
}

/**
 * Validates the input parameters for the `setTimeout` function within the `TimeoutManager`.
 * This function ensures that the callback is a function, the delay is a finite non-negative number,
 * and that the manager itself has not been destroyed.
 *
 * @function validateSetTimeoutInput
 * @description Performs a series of checks on the arguments provided to `setTimeout` to ensure
 * they meet the necessary criteria for safe and effective execution. This pre-validation step
 * helps prevent common errors, provides clear warnings, and ensures the `TimeoutManager` operates robustly.
 *
 * @param {() => void} callback - The function intended to be executed after the delay.
 * @param {number} delay - The specified delay in milliseconds.
 * @param {boolean} isDestroyed - A flag indicating whether the `TimeoutManager` instance has been marked as destroyed.
 * @returns {boolean} `true` if all inputs are valid and the manager is not destroyed, `false` otherwise.
 *
 * @example
 * // Example of valid input
 * const isValid = validateSetTimeoutInput(() => {}, 100, false); // true
 *
 * @example
 * // Example of invalid callback
 * const invalidCallback = validateSetTimeoutInput(null, 100, false); // false, warns "Invalid callback provided"
 *
 * @example
 * // Example of negative delay
 * const negativeDelay = validateSetTimeoutInput(() => {}, -50, false); // false, warns "Delay cannot be negative"
 *
 * @example
 * // Example when manager is destroyed
 * const destroyedManager = validateSetTimeoutInput(() => {}, 100, true); // false, warns "Cannot set timeout on destroyed manager"
 */
function validateSetTimeoutInput(
  callback: () => void,
  delay: number,
  isDestroyed: boolean
): boolean {
  // Check if the timeout manager instance has been destroyed
  if (isDestroyed) {
    console.warn('TimeoutManager: Cannot set timeout on destroyed manager');
    return false;
  }

  // Validate that the provided callback is a function
  if (typeof callback !== 'function') {
    console.warn('TimeoutManager: Invalid callback provided, must be a function');
    return false;
  }

  // Validate that the provided delay is a finite number
  if (typeof delay !== 'number' || !isFinite(delay)) {
    console.warn('TimeoutManager: Invalid delay provided, must be a finite number');
    return false;
  }

  // Check if the delay is negative, which is an invalid input
  if (delay < MIN_DELAY) {
    console.warn(`TimeoutManager: Delay cannot be negative, using ${MIN_DELAY}`);
    // Note: We don't modify 'delay' here, that's handled by setTimeout if validation passes.
    return false; // Indicate validation failure
  }

  return true;
}

/**
 * Creates a timeout manager that tracks and cleans up timeouts.
 *
 * @function createTimeoutManager
 * @description Creates a comprehensive manager that handles setting and clearing timeouts
 * with automatic cleanup capabilities. Maintains an internal registry of active timeouts
 * to enable bulk cleanup operations and prevent memory leaks. Essential for components
 * that use multiple timeouts and need reliable cleanup on unmount or state changes.
 *
 * The manager provides a complete API for timeout lifecycle management, including
 * creation, individual cancellation, and bulk cleanup operations. Automatically
 * tracks timeout IDs and removes them from the registry when they complete naturally
 * or are manually cleared. Includes comprehensive input validation and error handling
 * for robust operation in production environments.
 *
 * @param {TimeoutEnvironment} [env] - Optional environment object containing `setTimeout` and `clearTimeout` functions.
 *                                     Defaults to `getDefaultEnvironment()` if not provided.
 * @returns {TimeoutManager} Timeout manager instance with comprehensive timeout management methods,
 *                           including `setTimeout`, `clearTimeout`, `clearPendingTimeouts`, `destroy`,
 *                           `getActiveCount`, and `isDestroyed`.
 *
 * @throws {Error} If `setTimeout` or `clearTimeout` functions are not available in the current environment,
 *                 or if invalid environment functions are provided.
 *
 * @example
 * // Creating and using a timeout manager
 * const timeoutManager = createTimeoutManager();
 *
 * const timeoutId = timeoutManager.setTimeout(() => {
 *   console.log('Delayed operation executed');
 * }, 1000);
 *
 * @example
 * // Using timeout manager in a component's lifecycle (e.g., Svelte's onDestroy)
 * // This ensures all timeouts are cleaned up when the component is removed.
 * function MyComponent() {
 *   const manager = createTimeoutManager();
 *
 *   // Set multiple timeouts
 *   manager.setTimeout(() => showNotification(), 2000);
 *   manager.setTimeout(() => hideLoader(), 5000);
 *
 *   onDestroy(() => {
 *     manager.destroy(); // Use destroy for final cleanup
 *   });
 * }
 *
 * @example
 * // Managing animation sequences with precise timing
 * const animationManager = createTimeoutManager();
 *
 * animationManager.setTimeout(() => startFadeIn(), 100);
 * animationManager.setTimeout(() => startSlideIn(), 300);
 * animationManager.setTimeout(() => completeAnimation(), 800);
 */
export function createTimeoutManager(env?: TimeoutEnvironment): TimeoutManager {
  // Initialize native timeout functions from the provided env, or fall back to defaults
  const effectiveEnv = env || getDefaultEnvironment(); // Use provided env or default

  const nativeSetTimeout = effectiveEnv.setTimeout;
  const nativeClearTimeout = effectiveEnv.clearTimeout;

  // Validate that the obtained functions are actually functions
  if (typeof nativeSetTimeout !== 'function' || typeof nativeClearTimeout !== 'function') {
    console.error(
      'TimeoutManager: Invalid setTimeout or clearTimeout functions provided in environment.'
    );

    throw new Error('TimeoutManager: Invalid environment functions.');
  }

  // Set to track active timeout IDs
  const timeouts = new Set<TimeoutId>();
  let isDestroyed = false;

  /**
   * Gets the count of currently active timeouts being managed by this instance.
   *
   * @function getActiveCount
   * @description Returns the current number of timeouts that have been set using this `TimeoutManager`
   * instance and have not yet executed or been explicitly cleared. This method is useful for
   * debugging, testing, and monitoring timeout usage patterns within a specific part of the application.
   *
   * @returns {number} The number of active (pending) timeouts currently tracked by this manager.
   *
   * @example
   * // Check active count after setting timeouts
   * timeoutManager.setTimeout(() => {}, 100);
   * timeoutManager.setTimeout(() => {}, 200);
   * console.log('Active timeouts:', timeoutManager.getActiveCount()); // 2
   *
   * @example
   * // Check active count after clearing some timeouts
   * const id = timeoutManager.setTimeout(() => {}, 500);
   * timeoutManager.clearTimeout(id);
   * console.log('Active timeouts after clearing one:', timeoutManager.getActiveCount()); // 1 (if one was left)
   */
  function activeCount(): number {
    return timeouts.size;
  }

  /**
   * Clears all currently pending timeouts managed by this instance.
   * This method does NOT mark the manager as destroyed, allowing it to be reused for future operations.
   *
   * @function clearPendingTimeouts
   * @description Cancels all currently active timeouts managed by this instance and clears
   * the internal tracking registry. This is essential for cleanup operations when components
   * unmount, modals close, or application state changes require cancellation of all
   * pending delayed operations. It prevents memory leaks and unwanted callback executions.
   * The function includes comprehensive error handling to ensure cleanup completes even if individual
   * timeout clearing fails. Crucially, this method does NOT destroy the manager, allowing it to be reused.
   *
   * @returns {ClearAllResult} An object indicating the number of timeouts successfully cleared and any errors encountered during the process.
   *
   * @example
   * // Clearing all pending timeouts before initiating a new sequence
   * timeoutManager.setTimeout(() => console.log('Action 1'), 100);
   * timeoutManager.setTimeout(() => console.log('Action 2'), 200);
   * const result = timeoutManager.clearPendingTimeouts();
   * console.log(`Cleared ${result.cleared} timeouts with ${result.errors} errors.`); // Cleared 2 timeouts with 0 errors.
   *
   * @example
   * // Using in a component's cleanup if the manager is intended for reuse across component lifecycles
   * useEffect(() => {
   *   // Set up various timeouts for component functionality
   *   const idA = timeoutManager.setTimeout(() => {}, 500);
   *   const idB = timeoutManager.setTimeout(() => {}, 1000);
   *
   *   return () => {
   *     // Clear for next use, but don't destroy the manager instance itself
   *     timeoutManager.clearPendingTimeouts();
   *   };
   * }, []);
   */
  function clearPendingTimeouts(): ClearAllResult {
    const timeoutIds = Array.from(timeouts);
    let cleared = 0;
    let errors = 0;

    timeoutIds.forEach((id) => {
      try {
        nativeClearTimeout(id);
        cleared++;
      } catch (error) {
        errors++;
        console.warn(`TimeoutManager: Error clearing timeout ${id}`, error);
      }
    });

    // Clear the internal tracking set regardless of individual failures
    timeouts.clear();

    if (errors > 0) {
      console.warn(
        `TimeoutManager: Failed to clear ${errors} timeout(s) during clearPendingTimeouts`
      );
    }

    return { cleared, errors };
  }

  /**
   * Clears a specific timeout by its ID.
   *
   * @function clearTimeout
   * @description Cancels a specific timeout by its ID and removes it from the tracking system.
   * This function safely handles cases where the timeout ID is not found, has already been cleared,
   * or is invalid. It provides the same interface as the native `clearTimeout` while maintaining
   * internal tracking consistency and adding comprehensive error handling.
   *
   * @param {TimeoutId} id - The ID of the timeout to clear, as returned by `setTimeout`.
   *
   * @returns {boolean} `true` if the timeout was found and successfully cleared;
   *                    `false` otherwise (e.g., invalid ID, timeout not found in tracking, or an error occurred during the native clear operation).
   *
   * @example
   * // Clearing a timeout before it executes
   * const idToClear = timeoutManager.setTimeout(() => {
   *   console.log('This message will not appear.');
   * }, 2000);
   * const wasCleared = timeoutManager.clearTimeout(idToClear); // true
   * console.log('Timeout was cleared:', wasCleared);
   *
   * @example
   * // Attempting to clear an already cleared or non-existent timeout
   * const notFound = timeoutManager.clearTimeout(9999); // false
   * console.log('Timeout not found:', notFound);
   *
   * @example
   * // Handling an invalid ID
   * const invalidIdResult = timeoutManager.clearTimeout(null); // false, warns "Invalid timeout ID provided"
   */
  function clearTimeout(id: TimeoutId): boolean {
    // Input validation using type guard
    if (!isValidTimeoutId(id)) {
      console.warn('TimeoutManager: Invalid timeout ID provided');
      return false;
    }

    if (id === INVALID_TIMEOUT_ID) {
      // Silently ignore invalid timeout IDs
      return false;
    }

    if (timeouts.has(id)) {
      try {
        nativeClearTimeout(id);
        timeouts.delete(id);

        // Successfully cleared the timeout
        return true;
      } catch (error) {
        console.warn('TimeoutManager: Error clearing timeout', error);

        // Always remove from tracking, even if clearing failed
        timeouts.delete(id);

        // Return false to indicate failure
        return false;
      }
    }

    // Timeout not found in tracking
    return false;
  }

  /**
   * Destroys the timeout manager instance, clearing all pending timeouts
   * and preventing any further operations on this specific manager instance.
   *
   * @function destroy
   * @description Performs a final and irreversible cleanup of the `TimeoutManager` instance.
   * It first clears all currently pending timeouts using `clearPendingTimeouts` and then
   * permanently marks the manager as destroyed. Once destroyed, this manager instance
   * will no longer allow new `setTimeout` calls, preventing memory leaks and ensuring
   * proper resource deallocation when the manager is no longer needed (e.g., on component unmount).
   *
   * @returns {ClearAllResult} An object indicating the number of timeouts cleared and any errors encountered during the destruction process.
   *
   * @example
   * // Calling `destroy` when the component or module using the manager is permanently unmounted
   * // This is crucial for preventing memory leaks in long-running applications.
   * onDestroy(() => {
   *   timeoutManager.destroy();
   *   console.log('Timeout manager destroyed and resources released.');
   * });
   *
   * @example
   * // Attempting to use a destroyed manager will result in a warning
   * timeoutManager.destroy();
   * const newId = timeoutManager.setTimeout(() => {}, 100); // Warns "Cannot set timeout on destroyed manager"
   * console.log(newId === INVALID_TIMEOUT_ID); // true
   */
  function destroy(): ClearAllResult {
    if (isDestroyed) {
      console.warn('TimeoutManager: Manager already destroyed, skipping destruction.');
      return { cleared: 0, errors: 0 };
    }

    const result = clearPendingTimeouts(); // Clear all pending timeouts first
    isDestroyed = true; // Mark as destroyed

    console.debug('TimeoutManager: Manager destroyed.');

    // Return the result of the clear operation
    return result;
  }

  /**
   * Checks if the timeout manager instance has been destroyed.
   *
   * @function getIsDestroyed
   * @description Returns the current destruction status of the `TimeoutManager` instance.
   * A `true` value indicates that the manager has been permanently destroyed via the `destroy()` method,
   * and it will no longer allow new `setTimeout` calls. This flag is important for managing the lifecycle
   * of the manager and preventing operations on a deallocated instance.
   *
   * @returns {boolean} `true` if the manager has been destroyed, `false` otherwise.
   *
   * @example
   * // Check if manager is destroyed before setting a timeout
   * if (!timeoutManager.isDestroyed()) {
   *   timeoutManager.setTimeout(() => {}, 100);
   * }
   *
   * @example
   * // After destroying the manager
   * timeoutManager.destroy();
   * console.log('Is manager destroyed?', timeoutManager.isDestroyed()); // true
   */
  function getIsDestroyed(): boolean {
    return isDestroyed;
  }

  /**
   * Sets a timeout that will be automatically tracked and cleared on cleanup.
   *
   * @function setTimeout
   * @description Creates a new timeout with automatic tracking and cleanup capabilities.
   * The timeout is registered in the internal tracking system and will be automatically
   * removed from tracking when it executes naturally. Provides the same interface as
   * the native `setTimeout` while adding automatic memory management, input validation,
   * and error handling. If validation fails or an error occurs during creation, it returns `INVALID_TIMEOUT_ID`.
   *
   * @param {() => void} callback - Function to execute after the specified delay.
   * @param {number} delay - Time to wait before executing the callback, in milliseconds.
   *
   * @returns {TimeoutId} The ID of the created timeout that can be used to cancel it,
   *                      or `INVALID_TIMEOUT_ID` (-1) if invalid input is provided or an error occurs during creation.
   *
   * @example
   * // Setting a basic timeout
   * const id1 = timeoutManager.setTimeout(() => {
   *   console.log('This message appears after 1 second.');
   * }, 1000);
   *
   * @example
   * // Setting a timeout with a very short delay
   * const id2 = timeoutManager.setTimeout(() => {
   *   console.log('Immediate action.');
   * }, 0);
   *
   * @example
   * // Handling an invalid timeout creation (e.g., after manager is destroyed)
   * timeoutManager.destroy();
   * const invalidId = timeoutManager.setTimeout(() => {
   *   console.log('This will not run.');
   * }, 500);
   * console.log(invalidId === INVALID_TIMEOUT_ID); // true
   */
  function setTimeout(callback: () => void, delay: number): TimeoutId {
    // Input validation
    if (!validateSetTimeoutInput(callback, delay, isDestroyed)) {
      console.warn('TimeoutManager: Invalid input for setTimeout');
      return INVALID_TIMEOUT_ID;
    }

    try {
      const id = nativeSetTimeout(() => {
        // Remove from tracking when timeout executes naturally
        timeouts.delete(id);

        // Execute callback with error handling
        try {
          callback();
        } catch (error) {
          console.warn('TimeoutManager: Error in timeout callback', error);
        }
      }, delay);

      // Register the timeout ID in the internal tracking set
      timeouts.add(id);

      return id;
    } catch (error) {
      console.warn('TimeoutManager: Failed to create timeout', error);
      return INVALID_TIMEOUT_ID;
    }
  }

  return {
    clearPendingTimeouts,
    clearTimeout,
    destroy,
    activeCount,
    isDestroyed: getIsDestroyed,
    setTimeout,
  };
}
