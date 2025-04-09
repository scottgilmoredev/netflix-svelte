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
   *
   * @requires ../icons/IconChevron.svelte
   */

  // Components
  import IconChevron from '../icons/IconChevron.svelte';

  /**
   * Props for the SliderControl component
   *
   * @typedef {Object} SliderControlProps
   * @property {'prev'|'next'} [direction='next'] - The direction of the control button, either 'prev' or 'next'
   * @property {() => void} onClick - Callback function to execute when the button is clicked
   */
  interface SliderControlProps {
    direction?: 'prev' | 'next';
    onClick: () => void;
  }

  export let direction: SliderControlProps['direction'] = 'next';
  export let onClick: SliderControlProps['onClick'];
</script>

<button
  aria-label={direction === 'prev' ? 'See previous titles' : 'See more titles'}
  class="slider__control slider__control--{direction}"
  on:click={onClick}
>
  <span class="slider__control-icon slider__control-icon--{direction}">
    <IconChevron direction={direction === 'prev' ? 'left' : 'right'} />
  </span>
</button>

<style>
  /* Base control styles */
  .slider__control {
    background: hsla(0, 0%, 8%, 0.5);
    border: none;
    bottom: 0;
    color: #fff;
    cursor: pointer;
    display: flex;
    justify-content: center;
    opacity: 0;
    position: absolute;
    text-align: center;
    top: 0;
    transition:
      opacity 0.2s ease,
      background-color 0.2s ease;
    width: 4%;
    z-index: 20;
  }

  /* Next button modifier */
  .slider__control--next {
    right: 0;
  }

  /* Previous button modifier */
  .slider__control--prev {
    left: 0;
  }

  /* Icon element */
  .slider__control-icon {
    align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    transition: transform 0.1s ease-out 0s;
    font-size: 2.5vw;
  }

  /* Right icon modifier */
  .slider__control-icon--next {
    transform-origin: 45% 50%;
  }

  /* Left icon modifier */
  .slider__control-icon--prev {
    transform-origin: 55% 50%;
  }

  /* Hover effects */
  .slider__control:hover .slider__control-icon {
    transform: scale(1.25);
  }

  /* For parent component to control visibility on row hover */
  :global(.row__container:hover) .slider__control {
    opacity: 1;
  }
</style>
