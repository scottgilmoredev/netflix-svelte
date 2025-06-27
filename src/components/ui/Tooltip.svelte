<script lang="ts">
  /**
   * Tooltip Component
   *
   * @component
   * @description A positioned tooltip component that appears above target elements with smooth
   * fade transitions and portal rendering. Features automatic positioning calculation using the
   * positioning system with scroll-aware updates, viewport constraints, and edge
   * detection. Uses portal rendering to ensure proper z-index layering and avoid clipping issues.
   * The component integrates with the positioning system utilities for robust position management,
   * timeout handling for performance optimization, and automatic cleanup to prevent memory leaks.
   *
   * Key features:
   * - Scroll-aware positioning with automatic updates
   * - Viewport constraint handling and edge detection
   * - Performance-optimized timeout management
   * - Automatic cleanup and memory leak prevention
   * - Transform origin calculation for smooth animations
   * - Portal rendering with proper z-index management
   *
   * @prop {string} text - Text content to display inside the tooltip
   * @prop {HTMLElement | undefined} [target=undefined] - Target element to position the tooltip relative to
   *
   * @requires @actions/portal
   * @requires @types
   * @requires @utils/positioning
   * @requires @utils/timeout
   */

  import { onDestroy } from 'svelte';

  // Actions
  import { portal } from '@actions/portal';

  // Types
  import type { PortalPosition } from '@types';

  // Utils
  import {
    createPositionManager,
    createTimeoutManager,
    PositionManager,
    viewportConstraint,
  } from '@utils';

  /**
   * Props for the Tooltip component
   *
   * @interface {Object} TooltipProps
   * @property {HTMLElement | undefined} [target] - The DOM element to position the tooltip relative to.
   *   When provided, triggers automatic positioning calculation using the positioning system.
   *   When undefined or null, the tooltip is hidden and all positioning resources are cleaned up.
   * @property {string} text - The text content to display in the tooltip
   */
  interface TooltipProps {
    target?: HTMLElement | undefined;
    text: string;
  }

  export let text: TooltipProps['text'];
  export let target: TooltipProps['target'] = undefined;

  // DOM reference and state management
  let tooltipElement: HTMLElement;
  let position: PortalPosition | undefined = undefined;
  let isVisible = false;

  // Positioning system integration
  let positionManager: PositionManager | null = null;

  // Timeout management for visibility transitions
  const timeoutManager = createTimeoutManager();

  /**
   * Initializes positioning system and manages tooltip visibility
   *
   * @function initializeTooltipPositioning
   * @description Creates a position manager with follow-trigger strategy, viewport constraints,
   * and automatic scroll handling. Uses the timeout manager to ensure smooth visibility
   * transitions and prevent visual jumps during initial positioning.
   *
   * @example
   * // Called when target and tooltip element become available
   * initializeTooltipPositioning();
   * // Result: position manager created → element attached → visibility updated
   */
  function initializeTooltipPositioning() {
    // Clean up existing position manager
    if (positionManager) {
      positionManager.detach();
    }

    // Create new position manager with positioning system
    positionManager = createPositionManager({
      strategy: 'follow-trigger',
      reference: target,
      offset: { x: 0, y: -10 }, // 10px above the target
      constraints: [viewportConstraint({ padding: 10 })],
      transformOrigin: true,
    });

    // Attach to tooltip element
    positionManager.attach(tooltipElement, target);

    // Show tooltip after positioning
    timeoutManager.setTimeout(() => {
      isVisible = true;
    }, 0);
  }

  /**
   * Cleans up positioning system resources
   *
   * @function cleanupPositioning
   * @description Detaches the position manager and resets tooltip visibility state.
   * Prevents memory leaks by stopping scroll listeners and resize observers.
   */
  function cleanupPositioning() {
    if (positionManager) {
      positionManager.detach();
      positionManager = null;
    }

    isVisible = false;
  }

  /**
   * Reactive statement for positioning system integration
   *
   * @description Monitors changes to the target and tooltipElement references to trigger
   * positioning system initialization when both become available.
   */
  $: if (target && tooltipElement) {
    initializeTooltipPositioning();
  }

  /**
   * Reactive statement for positioning system cleanup
   *
   * @description Monitors the target prop and performs cleanup when the target
   * is removed or becomes undefined.
   */
  $: if (!target && positionManager) {
    cleanupPositioning();
  }

  /**
   * Component cleanup lifecycle handler
   *
   * @function onDestroy
   * @description Performs comprehensive cleanup when the component is destroyed to prevent
   * memory leaks and ensure proper resource management.
   */
  onDestroy(() => {
    cleanupPositioning();
    timeoutManager.clearPendingTimeouts();
  });
</script>

{#if target}
  <div
    aria-label={text}
    class="tooltip"
    class:tooltip--visible={isVisible}
    role="tooltip"
    bind:this={tooltipElement}
    use:portal={{ position, zIndex: 9999 }}
  >
    <div class="tooltip__wrapper">
      <div class="tooltip__content">{text}</div>
    </div>
  </div>
{/if}

<style>
  /* Block: Main tooltip container with portal positioning */
  .tooltip {
    background-color: transparent;
    border-radius: 0.3rem;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transform: translateZ(0px);
    transition: opacity 200ms;
    visibility: hidden;
    will-change: transform, opacity, visibility;
  }

  /* Modifier: Visible state with smooth fade-in transition */
  .tooltip--visible {
    opacity: 1;
    pointer-events: auto;
    transition: opacity 200ms;
    visibility: visible;
  }

  /* Element: Wrapper container for overflow management */
  .tooltip__wrapper {
    position: relative;
    overflow: hidden;
    pointer-events: auto;
  }

  /* Element: Content container with styling and arrow */
  .tooltip__content {
    position: relative;
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
    font-weight: 700;
    color: rgb(24, 24, 24);
    background-color: rgb(230, 230, 230);
    border-radius: 0.3rem;
    box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 1rem;
    box-sizing: border-box;
    pointer-events: none;
    margin-bottom: 1.4rem;
  }

  /* Element: Arrow pointer using CSS pseudo-element */
  .tooltip__content::after {
    content: '';
    display: block;
    position: absolute;
    border-top: 1rem solid rgb(230, 230, 230);
    border-left: 1rem solid transparent;
    border-right: 1rem solid transparent;
    left: 50%;
    transform: translateX(-50%);
    top: 95%;
  }
</style>
