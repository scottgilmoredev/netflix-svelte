<script lang="ts">
  /**
   * RowHeader Component
   *
   * @component
   * @description Header section for content rows, displaying the title and "Explore All" link.
   * Features a two-stage hover effect where the chevron appears on row hover,
   * and the "Explore All" text appears on title hover.
   *
   * @prop {string} [exploreUrl="/"] - URL to navigate to when "Explore All" is clicked
   * @prop {string} title - The title text to display
   *
   * @requires ../icons/IconChevron.svelte
   * @requires module:@stores
   * @requires module:@types
   */

  // Components
  import IconChevron from '../icons/IconChevron.svelte';

  // Stores
  import { openModal } from '@stores';

  // Types
  import type { MediaStore } from '@types';

  /**
   * Props for the RowHeader component
   *
   * @interface {Object} RowHeaderProps
   * @property {boolean} [isTopMedia=false] - Whether the row is for top media
   * @property {string} title - The title text to display
   */
  interface RowHeaderProps {
    isTopMedia?: boolean;
    title: string;
  }

  export let isTopMedia: RowHeaderProps['isTopMedia'] = false;
  export let mediaStore: MediaStore;

  const { displayTitle } = mediaStore;

  /**
   * Opens the modal with the current media store
   *
   * @function handleExploreClick
   * @description Handles click on the "Explore All" button by opening the modal
   * with the current media store's content. Uses the store reference directly
   * rather than looking it up by title for efficiency.
   *
   * @fires {openModal} Opens the modal with the current media store
   *
   * @example
   * // Attach to a button click event
   * <button on:click={handleExploreClick}>Explore All</button>
   */
  function handleExploreClick() {
    openModal(mediaStore);
  }
</script>

<h2 class="row__header">
  {#if isTopMedia}
    <!-- Basic title - does not expand -->
    <span class="row__title">
      <div class="row__title-text">{displayTitle}</div>
    </span>
  {:else}
    <!-- Clickable title - will expand on hover -->
    <button class="row__title" on:click={handleExploreClick}>
      <!-- Row title -->
      <div class="row__title-text">{displayTitle}</div>

      <!-- Explore All block - expands on hover -->
      <div class="row__explore">
        <!-- Displays on row__title:hover -->
        <div class="row__explore-link">Explore All</div>

        <!-- Displays on row:hover -->
        <div class="row__explore-chevron">
          <IconChevron direction="right" variant="small" />
        </div>
      </div>
    </button>
  {/if}
</h2>

<style>
  /* Row header */
  .row__header {
    line-height: 1.3;
    margin: 0;
  }

  /* Row title */
  .row__title {
    background-color: transparent;
    border: none;
    color: #e5e5e5;
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
    margin: 0 4% 0.5em;
    min-width: 6em;
    padding: 0;
    text-decoration: none;
  }

  button.row__title {
    cursor: pointer;
  }

  /* Title text */
  .row__title-text {
    display: table-cell;
    font-size: 12px;
    line-height: 1.25vw;
  }

  /* Row explore container */
  .row__explore {
    display: table-cell;
  }

  /* Explore link */
  .row__explore-link {
    color: #54b9c5;
    cursor: pointer;
    display: inline-block;
    font-size: 0.9vw;
    line-height: 0.8vw;
    max-width: 0;
    opacity: 0;
    transition:
      max-width 1s,
      opacity 1s,
      transform 0.75s;
    white-space: nowrap;
  }

  /* Explore chevron */
  .row__explore-chevron {
    color: #54b9c5;
    display: none;
    font-size: 0.9vw;
    transition: transform 0.75s;
  }

  /* Hover states */
  :global(.row:hover) .row__title .row__explore-chevron {
    display: inline-block;
    font-size: 0.9vw;
  }

  .row__title:hover .row__explore .row__explore-link {
    max-width: 200px;
    opacity: 1;
    transform: translate(1vw);
  }

  .row__title:hover .row__explore .row__explore-chevron {
    font-size: 0.65vw;
    line-height: 0.8vw;
    transform: translate(1vw);
  }

  .row__title:hover .row__explore .row__explore-chevron :global(svg) {
    height: 0.75vw;
    stroke-width: 4;
  }

  @media screen and (min-width: 800px) {
    .row__title,
    .row__title-text {
      font-size: 1.4vw;
    }
  }
</style>
