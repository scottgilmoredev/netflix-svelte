<!-- SliderPagination.svelte -->
<script lang="ts">
  /**
   * Slider Pagination Indicators Component
   *
   * @component
   * @description Displays pagination indicators for a slider component.
   * Shows indicators representing each page of content, with the current page highlighted.
   * This component is typically used within a slider to provide visual feedback
   * about the current position and total number of pages.
   *
   * @prop {Array<undefined>} indicators - Array representing pagination indicators
   * @prop {number} currentIndex - Index of the currently active page
   *
   * @requires svelte
   *
   * @example
   * <SliderPagination
   *   indicators={paginationIndicators}
   *   currentIndex={currentPaginationIndex}
   * />
   */

  /**
   * Props for the SliderPagination component
   *
   * @interface SliderPaginationProps
   * @description Defines the properties required by the SliderPagination component.
   *
   * @property {Array<undefined>} indicators - Array representing pagination indicators.
   *   The length of this array determines how many pagination indicators are displayed.
   *   Each element in the array represents one page in the slider.
   *
   * @property {number} currentIndex - Index of the currently active page.
   *   This determines which pagination indicator is highlighted.
   *   Should be a valid index within the indicators array.
   */
  interface SliderPaginationProps {
    indicators: Array<undefined>;
    currentIndex: number;
  }

  // Component props
  export let indicators: SliderPaginationProps['indicators'] = [];
  export let currentIndex: SliderPaginationProps['currentIndex'] = 0;
</script>

{#if indicators.length > 0}
  <ul class="slider__pagination-indicator">
    {#each indicators as _, index}
      <li class:slider__pagination-item--active={currentIndex === index}></li>
    {/each}
  </ul>
{/if}

<style>
  /* Pagination Indicator styling */
  .slider__pagination-indicator {
    display: block;
    list-style-type: none;
    margin: -24px 0 12px;
    padding: 0;
    position: absolute;
    right: 4%;
    top: 0;

    /* Indicator */
    & li {
      background-color: #4d4d4d;
      display: inline-block;
      height: 2px;
      margin-left: 1px;
      width: 12px;
    }

    /* Active indicator */
    & .slider__pagination-item--active {
      background-color: #aaa;
    }
  }
</style>
