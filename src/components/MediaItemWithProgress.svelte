<!-- ContinueWatching.svelte -->
<script lang="ts">
  /**
   * Media Item With Progress Component
   *
   * @component
   * @description Extends the standard MediaItem component with a progress bar
   * for the "Continue Watching" section. Displays how much of the content the
   * user has already watched with a horizontal progress indicator.
   *
   * @prop {string} className - Additional CSS class names to apply to the component
   * @prop {WatchedMovie | null} data - The movie or TV show data to display, including progress
   * @prop {number} width - The width of the component as a percentage
   *
   * @requires ./MediaItem.svelte
   * @requires ../types
   */

  // Import the base MediaItem component
  import MediaItem from './MediaItem.svelte';

  // Types
  import type { WatchedMediaItemProps } from '../types';

  export let className: WatchedMediaItemProps['className'] = '';
  export let data: WatchedMediaItemProps['data'] = null;
  export let width: WatchedMediaItemProps['width'] = 20;

  // Calculate progress percentage (ensure it's between 0-100 for CSS)
  $: progressPercentage = data?.progress || 0;
</script>

<MediaItem {className} {data} {width}>
  <!-- Progress bar -->
  <div class="media-item__progress-container">
    <div class="media-item__progress-bar">
      <span
        aria-hidden="true"
        class="media-item__progress--fill"
        style={`width: ${progressPercentage}%`}
      />
    </div>

    <span class="sr-only">Watched {progressPercentage}%</span>
  </div>
</MediaItem>

<style>
  .media-item__progress-container {
    align-items: center;
    display: flex;
    left: 0;
    padding: 3% 20% 0;
    position: absolute;
    right: 0;
    transition: opacity 0.35s;
  }

  .media-item__progress-bar {
    background-color: hsla(0, 0%, 100%, 0.3);
    display: block;
    flex-grow: 1;
    height: 3px;
    position: relative;
  }

  .media-item__progress--fill {
    background-color: #e50914;
    height: 3px;
    left: 0;
    position: absolute;
    top: 0;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
