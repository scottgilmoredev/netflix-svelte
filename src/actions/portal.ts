/**
 * Portal Action Module
 *
 * @function portal
 * @description Svelte action that appends the element to the document body when mounted
 * and removes it when the component is destroyed. Useful for modals and other overlay components
 * that need to be rendered outside their parent's DOM hierarchy to avoid z-index and
 * overflow issues.
 *
 * @param {HTMLElement} node - The element to portal to the document body
 * @returns {Object} Action object with destroy method for cleanup
 *
 * @example
 * <div use:portal class="modal">
 *   Modal content
 * </div>
 */
export function portal(node: HTMLElement): object {
  // Move node to body
  document.body.appendChild(node);

  return {
    destroy() {
      // If the node still exists and is in the body, remove it
      if (node.parentNode === document.body) {
        document.body.removeChild(node);
      }
    },
  };
}
