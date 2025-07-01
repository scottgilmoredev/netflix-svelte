/**
 * Portal Action Module
 *
 * @module
 * @description Provides a comprehensive Svelte action that moves DOM elements to different
 * locations in the document tree, typically to the document body or other containers.
 * Essential for modals, tooltips, dropdowns, and other overlay components that need to
 * escape their parent's DOM hierarchy to avoid z-index, overflow, and positioning issues.
 *
 * The module includes:
 * - Flexible target container selection for element portaling
 * - Integrated positioning management with custom position support
 * - Automatic cleanup and memory management on component destruction
 * - Dynamic target and position updates without element recreation
 * - Z-index management for proper layering control
 * - Type-safe configuration with comprehensive options
 * - Performance-optimized DOM manipulation patterns
 * - Seamless integration with positioning utilities
 *
 * @requires module:@types
 * @requires module:@utils
 */

// Types
import type { PortalOptions } from '@types';

// Utils
import { createPositionManager, type PositionManager } from '@utils';

/**
 * Svelte action for portaling elements to different DOM locations
 *
 * @function portal
 * @description Creates and manages a portal that moves a DOM element to a specified target
 * container (typically document.body) with optional positioning management. Handles automatic
 * cleanup when the component is destroyed and supports dynamic updates to target and position
 * configuration. Integrates with the positioning system for precise element placement.
 *
 * @param {HTMLElement} node - The DOM element to portal to the target container
 * @param {PortalOptions} [options] - Configuration options for the portal behavior
 * @param {HTMLElement} [options.target] - Target container element (defaults to document.body)
 * @param {object} [options.position] - Position configuration for the portaled element
 * @param {number} [options.zIndex] - Z-index value for layering control
 *
 * @returns {object} Action object with destroy and update methods for Svelte lifecycle management
 *
 * @example
 * // Basic portal to document body
 * <div use:portal class="modal">
 *   Modal content that escapes parent overflow
 * </div>
 *
 * @example
 * // Portal with custom target and positioning
 * <div
 *   use:portal={{
 *     target: document.getElementById('overlay-container'),
 *     position: { top: 100, left: 200 },
 *     zIndex: 1000
 *   }}
 *   class="tooltip"
 * >
 *   Positioned tooltip content
 * </div>
 *
 * @example
 * // Dynamic portal configuration
 * <div
 *   use:portal={portalConfig}
 *   class="dropdown"
 * >
 *   Dropdown content
 * </div>
 *
 * <script>
 *   let portalConfig = {
 *     target: document.body,
 *     position: { top: 0, left: 0 }
 *   };
 *
 *   function updatePortalPosition(newPosition) {
 *     portalConfig = {
 *       ...portalConfig,
 *       position: newPosition
 *     };
 *   }
 * </script>
 *
 * @example
 * // Modal with escape key handling
 * <div
 *   use:portal={{ zIndex: 9999 }}
 *   class="modal-overlay"
 *   on:click={closeModal}
 * >
 *   <div class="modal-content" on:click|stopPropagation>
 *     Modal content with proper layering
 *   </div>
 * </div>
 *
 * @example
 * // Conditional portaling
 * {#if showOverlay}
 *   <div
 *     use:portal={{
 *       target: isMobile ? document.body : overlayContainer,
 *       position: isMobile ? null : { top: 50, left: 50 }
 *     }}
 *     class="responsive-overlay"
 *   >
 *     Responsive overlay content
 *   </div>
 * {/if}
 */
export function portal(
  node: HTMLElement,
  options: PortalOptions = {}
): { destroy: () => void; update: (newOptions: PortalOptions) => void } {
  // Default to document.body if no target is provided
  const target = options.target || document.body;

  // Create position manager if position is provided
  let positionManager: PositionManager | null = null;

  if (options.position) {
    positionManager = createPositionManager({
      strategy: 'custom',
      customPosition: () => options.position || {},
      zIndex: options.zIndex,
    });
  }

  // Move node to target
  target.appendChild(node);

  // Apply initial positioning if provided
  if (positionManager) {
    positionManager.attach(node);
  }

  return {
    /**
     * Cleanup function called when element is removed from DOM
     *
     * @function destroy
     * @description Cleans up the portal by detaching position management and removing
     * the element from its target container. Prevents memory leaks and ensures proper
     * cleanup when the component is destroyed. Automatically called by Svelte when
     * the action is no longer needed.
     *
     * @returns {void}
     *
     * @example
     * // Automatic cleanup when component is destroyed
     * // No manual intervention required - Svelte handles this
     */
    destroy(): void {
      // Clean up position manager
      if (positionManager) {
        positionManager.detach();
      }

      // If the node still exists and is in the target, remove it
      if (node.parentNode === target) {
        target.removeChild(node);
      }
    },

    /**
     * Updates portal configuration when options change
     *
     * @function update
     * @description Updates the portal configuration with new options, handling target
     * container changes and position updates seamlessly. Moves the element to a new
     * target if specified and updates positioning management without recreating the
     * portal. Ensures smooth transitions when portal configuration changes.
     *
     * @param {PortalOptions} newOptions - New configuration options for the portal
     *
     * @returns {void}
     *
     * @example
     * // Automatic update when reactive options change
     * let portalTarget = document.body;
     *
     * // When target changes, the portal updates automatically
     * function changeTarget() {
     *   portalTarget = document.getElementById('new-container');
     * }
     *
     * @example
     * // Dynamic position updates
     * let portalPosition = { top: 100, left: 100 };
     *
     * function updatePosition(x, y) {
     *   portalPosition = { top: y, left: x };
     *   // Portal automatically updates position
     * }
     *
     * @example
     * // Responsive portal configuration
     * function handleResize() {
     *   const newConfig = {
     *     target: window.innerWidth > 768 ? overlayContainer : document.body,
     *     position: window.innerWidth > 768 ? { top: 50, left: 50 } : null
     *   };
     *   // Portal updates automatically with new configuration
     * }
     */
    update(newOptions: PortalOptions): void {
      const newTarget = newOptions.target || document.body;

      // If target changed, move the node
      if (newTarget !== target && node.parentNode === target) {
        target.removeChild(node);
        newTarget.appendChild(node);
      }

      // Update positioning
      if (newOptions.position) {
        if (!positionManager) {
          // Create position manager if it doesn't exist
          positionManager = createPositionManager({
            strategy: 'custom',
            customPosition: () => newOptions.position || {},
            zIndex: newOptions.zIndex,
          });
          positionManager.attach(node);
        } else {
          // Update existing position manager
          positionManager.updateConfig({
            customPosition: () => newOptions.position || {},
            zIndex: newOptions.zIndex,
          });
        }
      } else if (positionManager) {
        // Remove positioning if no longer needed
        positionManager.detach();
        positionManager = null;
      }
    },
  };
}
