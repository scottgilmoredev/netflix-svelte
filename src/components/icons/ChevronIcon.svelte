<script lang="ts">
  /**
   * ChevronIcon Component
   *
   * @component
   * @description A responsive chevron icon used throughout the application.
   * Can be rendered as either left-pointing or right-pointing and in different sizes.
   *
   * @prop {string} [className=""] - Additional CSS classes to apply to the SVG
   * @prop {'left'|'right'|'up'|'down'} direction - The direction the chevron should point
   * @prop {('default'|'small')} [variant="default"] - Size variant of the chevron
   */

  /**
   * Props for the ChevronIcon component
   *
   * @typedef {Object} ChevronIconProps
   * @property {string} [className=""] - Additional CSS classes to apply to the SVG
   * @property {'left'|'right'|'up'|'down'} direction - The direction the chevron should point
   * @property {'default'|'small'} [variant="default"] - Size variant of the chevron
   */
  interface ChevronIconProps {
    className?: string;
    direction: 'down' | 'left' | 'right' | 'up';
    variant?: 'default' | 'small';
  }

  export let className: ChevronIconProps['className'] = '';
  export let direction: ChevronIconProps['direction'];
  export let style: string = '';
  export let variant: ChevronIconProps['variant'] = 'default';

  /**
   * Get the polyline points based on the direction
   *
   * @function getPolylinePoints
   * @description Returns the appropriate polyline points for the specified direction
   *
   * @param {ChevronIconProps['direction']} dir - The direction of the chevron
   * @returns {string} The polyline points as a string
   */
  function getPolylinePoints(dir: ChevronIconProps['direction']): string {
    switch (dir) {
      case 'left':
        return '9 22 1 12 9 2';

      case 'right':
        return '1 22 9 12 1 2';

      case 'up':
        return '2 9 12 1 22 9';

      case 'down':
        return '2 1 12 9 22 1';

      // Default to right direction if an invalid direction is provided
      default:
        return '1 22 9 12 1 2';
    }
  }

  /**
   * Get the appropriate viewBox based on the direction
   *
   * @function getViewBox
   * @description Returns the appropriate SVG viewBox for the specified direction
   *
   * @param {ChevronIconProps['direction']} dir - The direction of the chevron
   * @returns {string} The viewBox dimensions as a string
   */
  function getViewBox(dir: ChevronIconProps['direction']): string {
    // For vertical directions (up/down), swap the dimensions
    return dir === 'up' || dir === 'down' ? '0 0 24 10' : '0 0 10 24';
  }

  /**
   * Determine if the icon needs special CSS for vertical orientation
   *
   * @function isVertical
   * @description Returns true if the direction is vertical (up/down)
   *
   * @param {ChevronIconProps['direction']} dir - The direction of the chevron
   * @returns {boolean} True if the direction is vertical
   */
  function isVertical(dir: ChevronIconProps['direction']): boolean {
    return dir === 'up' || dir === 'down';
  }

  // Compute the polyline points and viewBox
  const points = getPolylinePoints(direction);
  const viewBox = getViewBox(direction);
  const verticalClass = isVertical(direction) ? 'icon-chevron--vertical' : '';
</script>

<svg
  class={`icon-chevron--${variant} ${verticalClass} ${className}`}
  fill="none"
  stroke="currentColor"
  stroke-linecap="round"
  stroke-linejoin="round"
  stroke-width="3"
  {style}
  xmlns="http://www.w3.org/2000/svg"
  {viewBox}
>
  <polyline {points}></polyline>
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

  /* Adjust dimensions for vertical chevrons (up/down) */
  .icon-chevron--vertical.icon-chevron--default {
    height: var(--override-height, 1.21vw);
    min-width: 16px;
    min-height: 6px;
    stroke-width: 2;
    width: var(--override-width, 3.08vw);
  }

  .icon-chevron--vertical.icon-chevron--small {
    height: 0.85vw;
    width: 0.85vw;
  }
</style>
