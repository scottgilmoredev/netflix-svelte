<script lang="ts">
  /**
   * NotificationBadge Component
   *
   * @component
   * @description A small badge that displays a notification count
   *
   * @prop {string} [className=""] - Additional CSS classes to apply to the badge
   * @prop {number} [count=0] - Number to display in the badge
   * @prop {boolean} [show=true] - Whether to show the badge
   */

  /**
   * Props for the NotificationBadge component
   *
   * @typedef {Object} NotificationBadgeProps
   * @property {string} [className=""] - Additional CSS classes to apply to the badge
   * @property {number} [count=0] - Number to display in the badge
   * @property {boolean} [show=true] - Whether to show the badge
   */
  interface NotificationBadgeProps {
    className?: string;
    count: number;
    show?: boolean;
  }

  export let className: NotificationBadgeProps['className'] = '';
  export let count: NotificationBadgeProps['count'] = 0;
  export let show: NotificationBadgeProps['show'] = true;
</script>

{#if show && count > 0}
  <span class={`nav__notification-pill ${className}`}>{count}</span>
{/if}

<style>
  /* Small red circle with number */
  .nav__notification-pill {
    background-color: #b9090b;
    border: none;
    border-radius: 1000px;
    color: #fff;
    display: inline-block;
    font-size: 0.85em;
    font-weight: 500;
    line-height: 0.85;
    min-width: 1em;
    padding: 0.3em;
    position: absolute;
    right: -1em;
    text-align: center;
    top: -0.75em;
    z-index: 2;
  }
</style>
