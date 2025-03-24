<script lang="ts">
  /**
   * Slider Control Component
   *
   * @component
   * @description A navigation control button for content sliders/carousels.
   * Renders as either a "previous" or "next" button with appropriate arrow icons
   * and positioning. Features a semi-transparent background that becomes fully
   * visible on hover. Includes proper accessibility attributes for screen readers.
   *
   * @prop {('prev'|'next')} direction - The direction of the control button, either 'prev' or 'next'
   * @prop {Function} onClick - Callback function to execute when the button is clicked
   */

  export let direction: 'prev' | 'next' = 'next';
  export let onClick: () => void;
</script>

<button
  class="slider-control"
  class:slider-control--right={direction === 'next'}
  on:click={onClick}
  aria-label={direction === 'prev' ? 'Previous' : 'Next'}
>
  {#if direction === 'prev'}
    <!-- Left arrow icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  {/if}

  <!-- Right arrow icon -->
  {#if direction === 'next'}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  {/if}
</button>

<style>
  .slider-control {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 4%;
    background: rgba(20, 20, 20, 0.5);
    border: none;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .slider-control:hover {
    opacity: 1;
  }

  .slider-control--right {
    right: 0;
  }

  .slider-control:not(.slider-control--right) {
    left: 0;
  }

  svg {
    width: 30px;
    height: 30px;
  }
</style>
