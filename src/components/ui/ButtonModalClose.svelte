<script lang="ts">
  /**
   * ModalCloseButton Component
   *
   * @component
   * @description A reusable close button component for modal dialogs that provides
   * keyboard accessibility while remaining visually hidden. Handles Enter and Spacebar
   * key presses following WCAG guidelines and dispatches close events to parent components.
   * Designed for use in modal overlays where visual close buttons are not desired but
   * keyboard accessibility is required.
   *
   * @prop {string} [ariaLabel="Close"] - Accessible label for screen readers
   * @prop {string} [className=""] - Additional CSS classes for styling customization
   *
   * @fires {CustomEvent<void>} close - Dispatched when the close button is activated
   *
   * @requires @components/icons/Icon.svelte
   */

  import { createEventDispatcher } from 'svelte';
  import Icon from '@components/icons/Icon.svelte';

  /**
   * Props for the ModalCloseButton component
   */
  interface ModalCloseButtonProps {
    ariaLabel?: string;
    className?: string;
  }

  export let ariaLabel: ModalCloseButtonProps['ariaLabel'] = 'Close';
  export let className: ModalCloseButtonProps['className'] = '';

  // Event dispatcher for parent communication
  const dispatch = createEventDispatcher<{
    close: void;
  }>();

  /**
   * Handles keyboard events for the close button
   *
   * @function handleKeydown
   * @description Processes Enter and Spacebar key presses on the close button,
   * following WCAG guidelines for button keyboard interaction.
   *
   * @param {KeyboardEvent} event - The keyboard event object
   *
   * @returns {void}
   */
  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      dispatch('close');
    }
  }
</script>

<button aria-label={ariaLabel} class="close-button {className}" on:keydown={handleKeydown}>
  <Icon name="close" />
</button>

<style>
  /* Hidden close button for keyboard accessibility */
  .close-button {
    display: none;
    margin: 1em;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
  }
</style>
