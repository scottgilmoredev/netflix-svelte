<script lang="ts">
  /**
   * IconChevron Component
   *
   * @component
   * @description A responsive chevron icon used throughout the application.
   * Can be rendered as either left-pointing or right-pointing and in different sizes.
   *
   * @prop {('left'|'right')} direction - The direction the chevron should point
   * @prop {string} [className=""] - Additional CSS classes to apply to the SVG
   * @prop {('default'|'small')} [variant="default"] - Size variant of the chevron
   */

  /**
   * Props for the IconChevron component
   *
   * @typedef {Object} IconChevronProps
   * @property {'left'|'right'} direction - The direction the chevron should point
   * @property {string} [className=""] - Additional CSS classes to apply to the SVG
   * @property {'default'|'small'} [variant="default"] - Size variant of the chevron
   */
  interface IconChevronProps {
    direction: 'left' | 'right';
    className?: string;
    variant?: 'default' | 'small';
  }

  export let direction: IconChevronProps['direction'];
  export let className: IconChevronProps['className'] = '';
  export let variant: IconChevronProps['variant'] = 'default';
</script>

<svg
  class={`icon-chevron--${variant} ${className}`}
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 10 24"
  fill="none"
  stroke="currentColor"
  stroke-width="3"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  {#if direction === 'left'}
    <polyline points="9 22 1 12 9 2"></polyline>
  {:else}
    <polyline points="1 22 9 12 1 2"></polyline>
  {/if}
</svg>

<style>
  /* Default size for slider controls */
  .icon-chevron--default {
    height: 3.08vw;
    width: 1.21vw;

    /* Maintain minimum size for very small screens */
    min-width: 6px;
    min-height: 16px;
  }

  /* Small size for row headers */
  .icon-chevron--small {
    height: 0.85vw;
    stroke-width: 6;
    width: 0.85vw;
  }
</style>
