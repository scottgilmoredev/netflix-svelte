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
   * @requires ../icons/IconNotification
   */

  // import Notifications from './Notifications.svelte';
  import Icon from '@components/icons/Icon.svelte';
  import NotificationBadge from './NotificationBadge.svelte';

  /**
   * Props for the ButtonNotification component
   *
   * @interface ButtonNotificationProps
   * @property {string} [className=''] - Additional CSS class to apply to the component
   */
  interface ButtonNotificationProps {
    className?: string;
  }

  export let className: ButtonNotificationProps['className'] = '';

  // TODO: Build out the notification functionality
</script>

<div class={`nav__notification ${className}`}>
  <!-- Notification icon -->
  <Icon name="notification" />

  <!-- Notification badge -->
  <NotificationBadge count={3} show={true} />
</div>

<style>
  .nav__notification {
    position: relative;
    display: inline-block;
  }
</style>
