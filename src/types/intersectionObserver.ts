/**
 * Intersection Observer Types Module
 *
 * @module
 * @description Provides comprehensive type definitions for the intersection observer action system.
 * Ensures type safety, enhanced IDE support, and clear interfaces for intersection detection
 * functionality. Defines consistent typing patterns across all intersection observer implementations
 * and usage scenarios.
 *
 * The module includes types for:
 * - Configuration options with flexible intersection parameters
 * - Custom event detail structures for intersection state communication
 * - Action return interfaces with proper lifecycle method definitions
 * - Observer callback type definitions for consistent function signatures
 * - Global event map extensions for enhanced IDE autocomplete support
 * - Type-safe custom event handling with detailed intersection data
 *
 * All types maintain strict readonly properties where appropriate and provide comprehensive
 * type safety for intersection observer operations including lazy loading, infinite scrolling,
 * animation triggers, and visibility tracking throughout the application.
 */

/**
 * Configuration options for intersection observer
 *
 * @interface IntersectionOptions
 * @description Configuration parameters for customizing intersection observer behavior
 *
 * @property {function} [callback] - Optional callback function executed on intersection state changes
 * @property {boolean} [once] - Whether to disconnect observer after first intersection
 * @property {Element | null} [root] - Element used as viewport for checking visibility
 * @property {string} [rootMargin] - Margin around root element to expand/shrink intersection area
 * @property {number | number[]} [threshold] - Visibility percentage required to trigger intersection
 */
export interface IntersectionOptions {
  callback?: (detail: IntersectionEventDetail) => void;
  once?: boolean;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * Detail object for intersection custom events
 *
 * @interface IntersectionEventDetail
 * @description Structure of detail object dispatched with intersection custom events
 *
 * @property {boolean} isIntersecting - Whether observed element is currently intersecting with root
 * @property {IntersectionObserverEntry} entry - Complete intersection observer entry with detailed metrics
 */
export interface IntersectionEventDetail {
  readonly isIntersecting: boolean;
  readonly entry: IntersectionObserverEntry;
}

/**
 * Return interface for intersection observer action
 *
 * @interface IntersectionObserverAction
 * @description Structure of object returned by intersection observer action function
 *
 * @property {() => void} destroy - Function to clean up observer when element is removed
 * @property {(newOptions: IntersectionOptions) => void} update - Function to update observer configuration
 */
export interface IntersectionObserverAction {
  destroy(): void;
  update(newOptions: IntersectionOptions): void;
}

/**
 * Intersection observer callback function type
 *
 * @type {IntersectionCallback}
 * @description Signature for callback functions used with IntersectionObserver
 */
export type IntersectionCallback = (entries: IntersectionObserverEntry[]) => void;

/**
 * Global event map extension for intersection events
 *
 * @interface HTMLElementEventMap
 * @description Extends global HTMLElementEventMap to include intersection custom event
 *
 * @property {CustomEvent<IntersectionEventDetail>} intersection - Custom event dispatched on intersection changes
 */
declare global {
  interface HTMLElementEventMap {
    intersection: CustomEvent<IntersectionEventDetail>;
  }
}

export {};
