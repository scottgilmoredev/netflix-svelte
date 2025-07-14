<script lang="ts">
  /**
   * billboard Component
   *
   * @component
   * @description Displays a featured media or TV show at the top of the page with
   * a background image, title, description, and action buttons. The component
   * automatically selects a random Netflix original from the store.
   *
   * @requires svelte
   * @requires module:@constants
   * @requires ./icons/Icon
   * @requires module:@stores
   * @requires module:@types
   * @requires module:@utils
   */

  import { type Readable } from 'svelte/store';

  // Components
  import Icon from '@components/icons/Icon.svelte';
  import Image from '@components/ui/Image.svelte';

  // Constants
  import { IMAGE_BASE_URL } from '@constants';

  // Stores
  import { billboardMedia } from '@stores';

  // Types
  import type { AnyMedia } from '@types';

  // Utils
  import { truncate } from '@utils';

  let billboardTitle: string;
  let billboardDescription: string;

  /**
   * The current billboard media from the store
   * @type {Readable<AnyMedia | null>}
   */
  const billboardMediaStore: Readable<AnyMedia | null> = billboardMedia;

  $: billboardImage = $billboardMediaStore?.backdrop_path
    ? `${IMAGE_BASE_URL}${$billboardMediaStore.backdrop_path}`
    : '';
  $: billboardTitle = $billboardMediaStore?.name || $billboardMediaStore?.original_name || '';
  $: billboardDescription = truncate($billboardMediaStore?.overview || '', 150);
</script>

<!-- style="{billboardStyle} background-size: cover; background-position: center center;" -->

<header class="billboard">
  <div class="billboard__row">
    <div class="billboard__pane">
      <!-- Billboard hero image -->
      <div class="billboard__image-wrapper">
        <Image
          alt={billboardTitle || 'Billboard image'}
          className="billboard__image"
          responsive
          src={billboardImage}
        />

        <!-- Gradient fade effect at the bottom of the billboard -->
        <div class="billboard__fade-bottom" />
      </div>

      <div class="billboard__metadata">
        <!-- Title of the media or TV show. Falls back to name or original_name -->
        <h1 class="billboard__title">
          {billboardTitle}
        </h1>

        <!-- Description of the media or TV show, truncated to 150 characters -->
        <h1 class="billboard__description">
          {billboardDescription}
        </h1>

        <!-- Action buttons for the billboard -->
        <div class="billboard__buttons">
          <!-- Play title button -->
          <button class="billboard__button billboard__button--primary">
            <span class="billboard__button-text">Play Title</span>
          </button>

          <!-- More info button -->
          <button class="billboard__button billboard__button--secondary">
            <!-- Info icon -->
            <Icon name="info" />

            <!-- Spacer -->
            <span class="billboard__button-spacer" />

            <!-- Button Text -->
            <span class="billboard__button-text">More Info</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</header>

<style>
  /* Main billboard container - holds the entire hero section */
  .billboard {
    display: block;
    position: relative;
  }

  /* Row container that establishes aspect ratio and positioning context */
  .billboard__row {
    left: 0;
    margin-bottom: 20px;
    padding-bottom: 60%;
    position: relative;
    right: 0;
    top: 0;
  }

  /* Pane that contains all billboard content and establishes height */
  .billboard__pane {
    height: 350px;
    position: absolute;
    width: 100%;
  }

  /* Wrapper for the billboard image to maintain proper positioning */
  .billboard__image-wrapper {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  /* The actual billboard image that fills the container */
  :global(.billboard__image) {
    background-position: 50%;
    background-size: cover;
    bottom: 0;
    left: 0;
    opacity: 1;
    position: absolute;
    right: 0;
    top: 0;
    transition: opacity 0.4s cubic-bezier(0.665, 0.235, 0.265, 0.8) 0s;
  }

  /* Gradient overlay that fades the bottom of the image for better text readability */
  .billboard__fade-bottom {
    background-color: transparent;
    background-image: linear-gradient(
      180deg,
      hsla(0, 0%, 8%, 0) 0,
      hsla(0, 0%, 8%, 0.15) 15%,
      hsla(0, 0%, 8%, 0.35) 29%,
      hsla(0, 0%, 8%, 0.58) 44%,
      #141414 68%,
      #141414
    );
    background-position: 0 top;
    background-repeat: repeat-x;
    background-size: 100% 100%;
    bottom: -1px;
    height: 14.7vw;
    left: 0;
    opacity: 1;
    position: absolute;
    right: 0;
    top: auto;
    width: 100%;
    z-index: 8;
  }

  /* Container for title, description and buttons with semi-transparent background */
  .billboard__metadata {
    background-color: hsla(0, 0%, 8%, 0.33);
    border-radius: 4px;
    bottom: 10%;
    left: 2%;
    max-width: 100%;
    padding: 1rem 2%;
    position: absolute;
    right: 2%;
    z-index: 10;
  }

  /* Media or show title styling */
  .billboard__title {
    color: #fff;
    font-size: 1.5rem;
    font-weight: 800;
    padding-bottom: 0.3rem;
  }

  /* Media or show description styling */
  .billboard__description {
    color: white;
    font-size: 12px;
    font-weight: 400;
    line-height: 24px;
    margin: 0px;
    padding: 0px;
  }

  /* Container for action buttons */
  .billboard__buttons {
    display: flex;
    margin-top: 24px;
  }

  /* Base button styling shared by all billboard buttons */
  .billboard__button {
    align-items: center;
    appearance: none;
    border: 0px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    opacity: 1;
    padding: 8px;
    position: relative;
    transition: background-color 0.2s ease;
    user-select: none;
    white-space: nowrap;
    will-change: background-color, color;
    word-break: break-word;
  }

  /* Primary action button (Play) - white background with black text */
  .billboard__button--primary {
    background-color: #fff;
    color: #000;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  /* Hover state for primary button - slightly transparent */
  .billboard__button--primary:hover {
    background-color: rgba(255, 255, 255, 0.75);
  }

  /* Secondary action button (More Info) - semi-transparent gray */
  .billboard__button--secondary {
    background-color: rgba(109, 109, 110, 0.7);
    color: white;
    margin-left: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  /* Hover state for secondary button - more transparent */
  .billboard__button--secondary:hover {
    background-color: rgba(109, 109, 110, 0.4);
  }

  /* Text inside buttons - responsive sizing */
  .billboard__button-text {
    font-size: 2vw;
    font-weight: 700;
  }

  /* Small spacer between icon and text in secondary button */
  .billboard__button-spacer {
    width: 4px;
  }

  /* Tablet breakpoint - adjusts sizes for medium screens */
  @media screen and (min-width: 600px) {
    /* Increase pane height for better proportions on tablets */
    .billboard__pane {
      height: 53vw;
    }

    /* Adjust row padding to maintain aspect ratio */
    .billboard__row {
      padding-bottom: 52%;
    }

    /* Fix button text size for better readability on tablets */
    .billboard__button-text {
      font-size: 0.8rem;
    }
  }

  /* Larger tablet breakpoint - improves typography */
  @media screen and (min-width: 700px) {
    /* Increase description text size for better readability */
    .billboard__description {
      font-size: 16px;
    }

    /* Larger title for better visual hierarchy */
    .billboard__title {
      font-size: 3rem;
    }
  }

  /* Small desktop breakpoint - constrains content width */
  @media screen and (min-width: 960px) {
    /* Limit metadata width for better readability on wider screens */
    .billboard__metadata {
      max-width: 475px;
    }
  }

  /* Desktop breakpoint - refines positioning and proportions */
  @media screen and (min-width: 1024px) {
    /* Adjust metadata position for better placement on large screens */
    .billboard__metadata {
      bottom: 29%;
    }

    /* Adjust aspect ratio for desktop viewing */
    .billboard__row {
      padding-bottom: 40%;
    }
  }
</style>
