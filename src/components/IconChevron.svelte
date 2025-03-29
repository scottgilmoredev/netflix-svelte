<script lang="ts">
  /**
   * IconChevron Component
   *
   * @component
   * @description A responsive chevron icon used to identify slider controls.
   * Can be rendered as either left-pointing or right-pointing.
   *
   * @prop {('left'|'right')} direction - The direction the chevron should point
   * @prop {string} [className=""] - Additional CSS classes to apply to the SVG
   */

  /**
   * Props for the IconChevron component
   *
   * @typedef {Object} IconChevronProps
   * @property {'left'|'right'} direction - The direction the chevron should point
   * @property {string} [className=""] - Additional CSS classes to apply to the SVG
   */
  interface IconChevronProps {
    direction: 'left' | 'right';
    className?: string;
  }

  export let direction: IconChevronProps['direction'];
  export let className: IconChevronProps['className'] = '';
</script>

<svg
  class={className}
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
  svg {
    width: 1.21vw;
    height: 3.08vw;

    /* Maintain minimum size for very small screens */
    min-width: 6px;
    min-height: 16px;
  }
</style>
