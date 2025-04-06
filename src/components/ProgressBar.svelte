<script lang="ts">
  /**
   * Progress Bar Component
   *
   * @component
   * @description Displays a horizontal progress bar for media content.
   * Used to indicate how much of a video has been watched.
   *
   * @prop {number} percentage - The percentage of progress (0-100)
   * @prop {string} className - Additional CSS class names to apply to the component
   *
   * @requires ../types
   */

  export let className = '';
  export let percentage = 0;

  // Ensure percentage is within valid range
  $: safePercentage = Math.max(0, Math.min(100, percentage));
</script>

<div class={`progress-bar__container ${className}`}>
  <div class="progress-bar__track">
    <span aria-hidden="true" class="progress-bar__fill" style={`width: ${safePercentage}%;`} />
  </div>

  <span class="sr-only">Watched: {safePercentage}%</span>
</div>

<style>
  .progress-bar__container {
    align-items: center;
    display: flex;
    left: 0;
    padding: 3% 20% 0;
    position: absolute;
    right: 0;
    transition: opacity 0.35s;
  }

  .progress-bar__track {
    background-color: hsla(0, 0%, 100%, 0.3);
    display: block;
    flex-grow: 1;
    height: 3px;
    position: relative;
  }

  .progress-bar__fill {
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
