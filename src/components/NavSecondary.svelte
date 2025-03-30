<script lang="ts">
  /**
   * NavSecondary Component
   *
   * @component
   * @description Secondary navigation section for the Netflix-style navigation bar.
   * Contains the search icon, notifications, and user avatar.
   *
   * @prop {number} [notificationCount=0] - Number of notifications to display
   * @prop {boolean} [showNotifications=false] - Whether to show the notification badge
   * @prop {string} avatarSrc - Source URL for the user avatar image
   * @prop {string} [avatarAlt="Netflix user avatar"] - Alt text for the avatar image
   */

  // Components
  import IconSearch from './IconSearch.svelte';
  import IconNotification from './IconNotification.svelte';
  import UserAvatar from './UserAvatar.svelte';

  /**
   * Props for the NavSecondary component
   *
   * @typedef {Object} NavSecondaryProps
   * @property {number} [notificationCount=0] - Number of notifications to display
   * @property {boolean} [showNotifications=false] - Whether to show the notification badge
   * @property {string} avatarSrc - Source URL for the user avatar image
   * @property {string} [avatarAlt="Netflix user avatar"] - Alt text for the avatar image
   */
  interface NavSecondaryProps {
    notificationCount?: number;
    showNotifications?: boolean;
    avatarSrc: string;
    avatarAlt?: string;
  }

  export let notificationCount: NavSecondaryProps['notificationCount'] = 0;
  export let showNotifications: NavSecondaryProps['showNotifications'] = false;
  export let avatarSrc: NavSecondaryProps['avatarSrc'];
  export let avatarAlt: NavSecondaryProps['avatarAlt'] = 'Netflix user avatar';
</script>

<div class="nav__secondary">
  <!-- Search Icon -->
  <div class="nav__secondary--element">
    <IconSearch className="nav__search-icon" />
  </div>

  <!-- Notification Icon -->
  <div class="nav__secondary--element">
    <IconNotification showBadge={showNotifications} {notificationCount} />
  </div>

  <!-- User Avatar -->
  <div class="nav__secondary--element">
    <UserAvatar src={avatarSrc} alt={avatarAlt} className="nav__user-avatar" />
  </div>
</div>

<style>
  /* Secondary navigation container */
  .nav__secondary {
    align-items: center;
    color: #fff;
    display: flex;
    flex-grow: 1;
    height: 100%;
    justify-content: flex-end;
    position: absolute;
    right: 4%;
    top: 0;
  }

  /* Spacing between secondary navigation elements */
  .nav__secondary--element:not(:last-child) {
    margin-right: 10px;
  }
</style>
