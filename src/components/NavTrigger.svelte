<script lang="ts">
  /**
   * NavTrigger Component
   *
   * @component
   * @description Manages the dropdown trigger button for mobile navigation,
   * handling mouse events and keyboard interactions. Displays a "Browse" label
   * with a dropdown arrow that rotates when the dropdown is open.
   *
   * @prop {boolean} isOpen - Whether the dropdown is currently open
   * @prop {Function} onMouseEnter - Handler for mouseenter event
   * @prop {Function} onMouseLeave - Handler for mouseleave event
   *
   * @requires svelte
   */

  import { createEventDispatcher } from 'svelte';

  /**
   * Props for the NavTrigger component
   *
   * @interface NavTriggerProps
   * @property {boolean} isOpen - Whether the dropdown is currently open
   * @property {() => void} onMouseEnter - Handler function for mouseenter event
   * @property {() => void} onMouseLeave - Handler function for mouseleave event
   */
  interface NavTriggerProps {
    isOpen: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  }

  export let isOpen: NavTriggerProps['isOpen'];
  export let onMouseEnter: NavTriggerProps['onMouseEnter'];
  export let onMouseLeave: NavTriggerProps['onMouseLeave'];

  /**
   * Event dispatcher for custom events
   *
   * @type {Function}
   * @description Creates a typed event dispatcher for sending events to parent components
   */
  const dispatch: Function = createEventDispatcher<{
    triggerKeyPress: void;
    triggerEscape: void;
  }>();

  /**
   * Handles keyboard interaction with the dropdown trigger
   *
   * @function handleKeydown
   * @description Dispatches custom events for keyboard interactions:
   * - Enter/Space: Toggles the dropdown
   * - Escape: Closes the dropdown if it's open
   *
   * @param {KeyboardEvent} event - The keyboard event
   * @returns {void}
   */
  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      // Dispatch a custom event for the parent to handle
      dispatch('triggerKeyPress');
    }

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();

      // Dispatch a custom event for the parent to handle
      dispatch('triggerEscape');
    }
  }
</script>

<!-- Dropdown trigger button with accessibility attributes -->
<span
  aria-haspopup="true"
  aria-expanded={isOpen}
  class="nav-trigger"
  role="button"
  tabindex="0"
  on:keydown={handleKeydown}
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
>
  <!-- Default content is "Browse", but can be customized via slots -->
  <slot>Browse</slot>
</span>

<style>
  /* Text and dropdown trigger for mobile menu */
  .nav-trigger {
    align-items: center;
    color: #fff;
    cursor: pointer;
    display: flex;
    font-weight: 500;
    height: 100%;
    position: relative;
    text-decoration: none;
  }

  /* Triangle indicator using ::after pseudo-element */
  .nav-trigger::after {
    border-color: #fff transparent transparent;
    border-style: solid;
    border-width: 5px 5px 0;
    content: '';
    height: 0;
    margin-left: 5px;
    width: 0;
  }

  /* Rotate arrow when dropdown is open */
  .nav-trigger[aria-expanded='true']::after {
    transform: rotate(180deg);
    border-color: transparent transparent #fff;
    border-width: 0 5px 5px;
  }
</style>
