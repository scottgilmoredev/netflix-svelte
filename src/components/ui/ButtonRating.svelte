<script lang="ts">
  /**
   * RatingButton Component
   *
   * @component
   * @description A circular button component designed for rating overlay interactions that displays
   * rating options with consistent styling and behavior. Features hover effects, tooltip integration,
   * and slot-based content for flexible icon display. Provides accessible labeling for screen readers
   * and smooth visual transitions. The component is optimized for performance with will-change
   * properties and supports custom icon content through slots.
   *
   * @prop {string} label - Accessible label for the button used by screen readers and assistive technologies
   * @prop {string} tooltipText - Text content to display in the tooltip on hover interaction
   *
   * @slot default - Icon or content to display inside the button (typically thumbs up/down icons)
   *
   * @requires @actions/tooltip
   */

  import { tooltip } from '@actions/tooltip';

  /**
   * Props for the RatingButton component
   *
   * @interface {Object} RatingButtonProps
   * @property {string} label - Accessible label text for screen readers and ARIA compliance
   * @property {string} tooltipText - Tooltip content displayed on hover for additional context
   */
  interface RatingButtonProps {
    label: string;
    tooltipText: string;
  }

  export let label: RatingButtonProps['label'];
  export let tooltipText: RatingButtonProps['tooltipText'];
</script>

<!-- 
  Rating button with tooltip integration and slot-based content
  
  @example
  <RatingButton label="I like this" tooltipText="I like this">
    <Icon name="thumbsUp" />
  </RatingButton>
  
  @example
  <RatingButton label="Love this!" tooltipText="Love this!">
    <DoubleThumbsUp />
  </RatingButton>
-->
<button aria-label={label} class="rating-button" use:tooltip={tooltipText}>
  <slot />
</button>

<style>
  /* Block: Main rating button with circular design and hover effects */
  .rating-button {
    background-color: transparent;
    border: none;
    border-radius: 50%;
    color: #fff;
    height: 2.75em;
    will-change: background-color, color, transform;
    width: 2.75em;
  }

  /* Button hover state with subtle background highlight */
  .rating-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
</style>
