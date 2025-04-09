<script lang="ts">
  /**
   * ButtonNotification Component
   *
   * @component
   * @description A button that displays notifications with an optional badge counter.
   * Wraps the IconNotification component with additional styling and functionality.
   *
   * @prop {string} [className=''] - Additional CSS class to apply to the component
   * @prop {number} [notificationCount=0] - Number of notifications to display in the badge
   * @prop {boolean} [showBadge=false] - Whether to show the notification badge
   *
   * @requires ./icons/IconNotification
   */

  import IconNotification from './icons/IconNotification.svelte';

  /**
   * Props for the ButtonNotification component
   *
   * @interface ButtonNotificationProps
   * @property {string} [className=''] - Additional CSS class to apply to the component
   * @property {number} [notificationCount=0] - Number of notifications to display in the badge
   * @property {boolean} [showBadge=false] - Whether to show the notification badge
   */
  interface ButtonNotificationProps {
    className?: string;
    notificationCount?: number;
    showBadge?: boolean;
  }

  export let className: ButtonNotificationProps['className'] = '';
  export let notificationCount: ButtonNotificationProps['notificationCount'] = 0;
  export let showBadge: ButtonNotificationProps['showBadge'] = false;

  // TODO: Build out the notification functionality
</script>

<div class={`nav__notification ${className}`}>
  <IconNotification {notificationCount} {showBadge} />
</div>
