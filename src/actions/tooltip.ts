/**
 * Tooltip Action Module
 *
 * @module
 * @description Provides a comprehensive Svelte action that adds interactive tooltips to DOM
 * elements with hover-based triggers and intelligent positioning.
 *
 * The module includes:
 * - Hover-triggered tooltip display with configurable delays
 * - Dynamic tooltip content updates without recreation
 * - Automatic positioning relative to target elements
 * - Flicker prevention through intelligent timeout management
 * - Memory-efficient component lifecycle management
 * - Automatic cleanup and event listener removal
 * - Performance-optimized rendering and destruction patterns
 *
 * @requires module:@components/ui/Tooltip.svelte
 * @requires module:@utils/timeout
 * @requires module:@/types
 */

// Components
import Tooltip from '@components/ui/Tooltip.svelte';

// Types
import type { TimeoutManager } from '@/types';

// Utils
import { createTimeoutManager } from '@utils/timeout';

// Constants
const TOOLTIP_HIDE_DELAY = 50;
const TOOLTIP_SHOW_DELAY = 50;

/**
 * Return interface for the tooltip action
 *
 * @interface TooltipAction
 * @description Structure of object returned by tooltip action function.
 * Provides methods for updating tooltip content and cleaning up resources
 * when the element is removed from the DOM.
 *
 * @property {(newText: string) => void} update - Function to update tooltip text content dynamically
 * @property {() => void} destroy - Function to clean up tooltip when element is removed from DOM
 */
interface TooltipAction {
  update(newText: string): void;
  destroy(): void;
}

/**
 * Svelte action for adding interactive tooltips to elements
 *
 * @function tooltip
 * @description Creates and manages a tooltip that appears on hover with intelligent timing
 * and positioning. Handles component lifecycle, event management, and content updates
 * seamlessly. Provides flicker-free user experience through optimized timeout management
 * and prevents memory leaks through proper cleanup procedures.
 *
 * @param {HTMLElement} node - The DOM element that will trigger the tooltip on hover
 * @param {string} text - The text content to display in the tooltip
 *
 * @returns {TooltipAction} Action object with update and destroy methods for Svelte lifecycle management
 *
 * @example
 * // Basic tooltip usage
 * <button use:tooltip="Click to save your changes">
 *   Save
 * </button>
 *
 * @example
 * // Dynamic tooltip content
 * <div use:tooltip={tooltipText}>
 *   Hover for info
 * </div>
 *
 * <script>
 *   import { tooltip } from './actions/tooltip';
 *
 *   let tooltipText = 'Initial tooltip text';
 *
 *   function updateTooltip() {
 *     tooltipText = 'Updated tooltip content';
 *   }
 * </script>
 */
export function tooltip(node: HTMLElement, text: string): TooltipAction {
  // Input validation
  if (!node || !(node instanceof HTMLElement)) {
    console.warn('Tooltip: Invalid node provided');
    return { update: () => {}, destroy: () => {} };
  }

  if (typeof text !== 'string') {
    console.warn('Tooltip: Invalid text provided, using empty string');
    text = '';
  }

  const timeoutManager: TimeoutManager = createTimeoutManager();
  let tooltipComponent: Tooltip | null = null;
  let currentText = text;
  let isDestroyed = false;

  /**
   * Handles mouse enter events to show tooltip
   *
   * @function handleMouseEnter
   * @description Creates and displays the tooltip component after a configured delay.
   * Prevents multiple tooltip instances and handles component creation errors gracefully.
   *
   * @returns {void}
   */
  function handleMouseEnter(): void {
    if (isDestroyed) {
      console.debug('Tooltip: handleMouseEnter ignored, action already destroyed.');
      return;
    }

    timeoutManager.setTimeout(() => {
      if (!tooltipComponent && !isDestroyed) {
        try {
          tooltipComponent = new Tooltip({
            target: document.body,
            props: {
              text: currentText,
              target: node,
            },
          });
        } catch (error) {
          console.warn('Tooltip: Failed to create tooltip component', error);
        }
      }
    }, TOOLTIP_SHOW_DELAY);
  }

  /**
   * Handles mouse leave events to hide tooltip
   *
   * @function handleMouseLeave
   * @description Destroys the tooltip component after a configured delay.
   * Includes error handling for component destruction and proper cleanup.
   *
   * @returns {void}
   */
  function handleMouseLeave(): void {
    if (isDestroyed) {
      console.debug('Tooltip: handleMouseLeave ignored, action already destroyed.');
      return;
    }

    timeoutManager.setTimeout(() => {
      if (tooltipComponent && !isDestroyed) {
        try {
          tooltipComponent.$destroy();
        } catch (error) {
          console.warn('Tooltip: Error destroying tooltip component', error);
        } finally {
          tooltipComponent = null;
        }
      }
    }, TOOLTIP_HIDE_DELAY);
  }

  /**
   * Updates tooltip text content
   *
   * @function updateTooltip
   * @description Updates the tooltip text content dynamically. If the tooltip is currently
   * visible, updates the displayed text immediately. Validates input and handles errors
   * during the update process.
   *
   * @param {string} newText - The new text content for the tooltip
   *
   * @returns {void}
   */
  function updateTooltip(newText: string): void {
    if (isDestroyed) {
      console.debug('Tooltip: Cannot update destroyed tooltip');
      return;
    }

    if (typeof newText !== 'string') {
      console.warn('Tooltip: Invalid text provided for update, using empty string');
      newText = '';
    }

    currentText = newText;

    // Update existing tooltip if it's currently shown
    if (tooltipComponent) {
      try {
        tooltipComponent.$set({ text: newText });
      } catch (error) {
        console.warn('Tooltip: Error updating tooltip text', error);
      }
    }
  }

  /**
   * Cleans up tooltip resources
   *
   * @function destroyTooltip
   * @description Performs comprehensive cleanup of all tooltip resources including
   * timeout cancellation, event listener removal, and component destruction.
   * Prevents memory leaks and ensures proper resource management.
   *
   * @returns {void}
   */
  function destroyTooltip(): void {
    if (isDestroyed) {
      console.debug('Tooltip: Already destroyed, skipping cleanup.');
      return;
    }

    isDestroyed = true;

    try {
      // Remove event listeners
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);

      // Clear all pending timeouts
      timeoutManager.clearPendingTimeouts();

      // Destroy tooltip component if it exists
      if (tooltipComponent) {
        tooltipComponent.$destroy();
        tooltipComponent = null;
      }
    } catch (error) {
      console.warn('Tooltip: Error during cleanup', error);
    }
  }

  // Add event listeners
  try {
    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);
  } catch (error) {
    console.warn('Tooltip: Failed to add event listeners', error);
    return { update: () => {}, destroy: () => {} };
  }

  return {
    update: updateTooltip,
    destroy: destroyTooltip,
  };
}
