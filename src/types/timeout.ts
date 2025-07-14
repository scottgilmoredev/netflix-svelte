/**
 * Timeout Management System Types Module
 *
 * @module
 * @description Type definitions for the timeout management system throughout the application.
 * Provides interfaces and types for timeout manager configuration objects, environment
 * functions, and timeout identifiers. This module centralizes all timeout-related
 * type definitions to ensure consistency across timeout components and utilities.
 *
 * The module includes types for:
 * - The result of clearing timeout operations
 * - The environment functions (setTimeout, clearTimeout) used by the manager
 * - The type of a timeout identifier
 * - The comprehensive interface for the TimeoutManager itself
 */

/**
 * Result Interface for Timeout Clearing Operations
 *
 * @interface ClearAllResult
 * @description Defines the structure of the object returned by functions that clear multiple timeouts,
 * such as `clearPendingTimeouts` and `destroy`. It provides a summary of the operation's outcome.
 *
 * @property {number} cleared - The number of timeouts that were successfully cleared.
 * @property {number} errors - The number of errors encountered while attempting to clear timeouts.
 */
export interface ClearAllResult {
  cleared: number;
  errors: number;
}

/**
 * Timeout Environment Interface
 *
 * @interface TimeoutEnvironment
 * @description Defines the structure for providing custom `setTimeout` and `clearTimeout` functions
 * to the `TimeoutManager`. This allows for dependency injection, enabling testing with mocked
 * timers or adapting to different JavaScript runtime environments (e.g., web workers, Node.js).
 *
 * @property {typeof setTimeout} setTimeout - The `setTimeout` function to be used by the manager.
 * @property {typeof clearTimeout} clearTimeout - The `clearTimeout` function to be used by the manager.
 */
export interface TimeoutEnvironment {
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;
}

/**
 * Type Alias for Timeout Identifier
 *
 * @typedef {ReturnType<typeof setTimeout>} TimeoutId
 * @description Represents the type of the identifier returned by `setTimeout`.
 * This type can vary across different JavaScript environments (e.g., `number` in browsers,
 * `NodeJS.Timeout` object in Node.js), so `ReturnType<typeof setTimeout>` ensures
 * compatibility and type safety.
 */
export type TimeoutId = ReturnType<typeof setTimeout>;

/**
 * Timeout Manager Interface
 *
 * @interface TimeoutManager
 * @description Comprehensive interface for managing timeouts with automatic cleanup capabilities.
 * Provides methods for creating, tracking, and clearing timeouts to prevent memory leaks
 * and ensure proper resource management. Essential for components that use multiple timeouts
 * and need reliable cleanup on unmount or state changes.
 *
 * @property {() => number} getActiveCount - Returns the number of currently active (pending) timeouts.
 * @property {() => ClearAllResult} clearPendingTimeouts - Cancels all currently active timeouts without destroying the manager.
 * @property {(id: TimeoutId) => boolean} clearTimeout - Cancels a specific timeout by its ID.
 * @property {() => ClearAllResult} destroy - Performs a final cleanup, clearing all timeouts and marking the manager as destroyed.
 * @property {() => boolean} isDestroyed - Returns `true` if the manager has been destroyed and can no longer set new timeouts.
 * @property {(callback: () => void, delay: number) => TimeoutId} setTimeout - Sets a new timeout and tracks it for automatic cleanup.
 */
export interface TimeoutManager {
  activeCount: () => number;
  clearPendingTimeouts: () => void;
  clearTimeout: (id: TimeoutId) => void;
  destroy: () => ClearAllResult;
  isDestroyed: () => boolean;
  setTimeout: (callback: () => void, delay: number) => TimeoutId;
}
