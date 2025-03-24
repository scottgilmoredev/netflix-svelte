<script lang="ts">
  /**
   * Media Item Rank Number Component
   *
   * @component
   * @description Renders a stylized SVG number representing a media item's rank.
   * Used within ranked media displays to show the position (1-10) of a movie or show
   * in a top list. Automatically constrains rank values to valid range and applies
   * appropriate styling. The component uses predefined SVG path data for each number.
   *
   * @prop {string} className - Additional CSS class names to apply to the SVG element
   * @prop {string} color - The stroke color for the SVG path
   * @prop {RankSvgNumber} rank - The rank number to display (1-10)
   * @prop {number} strokeWidth - The stroke width for the SVG path
   *
   * @requires ../constants
   * @requires ../types
   */

  // Constants
  import {
    RANK_SVG_DATA,
    RANK_SVG_COLOR,
    RANK_SVG_STROKE_WIDTH,
    RANK_MAX,
    RANK_MIN,
  } from '../constants';

  // Types
  import type { RankSvgData, RankSvgNumber } from '../types';

  export let className: string = '';
  export let color: string = RANK_SVG_COLOR;
  export let rank: number = RANK_MIN;
  export let strokeWidth: number = RANK_SVG_STROKE_WIDTH;

  // Ensure rank is within valid range
  $: safeRank = Math.max(RANK_MIN, Math.min(RANK_MAX, rank)) as RankSvgNumber;

  // Get the data for the current rank
  $: data = RANK_SVG_DATA[safeRank] as RankSvgData;
</script>

<svg
  aria-label={`Rank ${safeRank}`}
  class="ranked-media-item__svg {className}"
  viewBox={data.viewBox}
  height="100%"
  width="100%"
>
  <path stroke={color} stroke-width={strokeWidth} stroke-linejoin="miter" d={data.path}></path>
</svg>
