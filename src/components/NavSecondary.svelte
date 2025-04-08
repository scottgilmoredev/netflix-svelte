<script lang="ts">
  /**
   * NavSecondary Component
   *
   * @component
   * @description Secondary navigation section for the Netflix-style navigation bar.
   * Contains the search icon, notifications, and user avatar. Positioned at the right
   * side of the navigation bar to provide user-specific functionality.
   *
   * @prop {string} [avatarAlt="Netflix user avatar"] - Alt text for the avatar image
   * @prop {string} avatarSrc - Source URL for the user avatar image
   * @prop {number} [notificationCount=0] - Number of notifications to display
   * @prop {boolean} [showNotifications=false] - Whether to show the notification badge
   *
   * @requires svelte/transition
   * @requires ./IconNotification
   * @requires ./IconSearch
   * @requires ./NavItem
   * @requires ./NavSubMenu
   * @requires ./NavTrigger
   * @requires ./UserAvatar
   * @requires ../constants
   * @requires ../stores/navStore
   * @requires ../types
   */

  import type { ComponentType, SvelteComponent } from 'svelte';
  import { fade } from 'svelte/transition';

  // Components
  import IconCircleQuestionMark from './IconCircleQuestionMark.svelte';
  import IconNotification from './IconNotification.svelte';
  import IconPencil from './IconPencil.svelte';
  import IconProfileArrow from './IconProfileArrow.svelte';
  import IconSearch from './IconSearch.svelte';
  import IconUser from './IconUser.svelte';
  import NavItem from './NavItem.svelte';
  import NavSubMenu from './NavSubMenu.svelte';
  import NavTrigger from './NavTrigger.svelte';
  import UserAvatar from './UserAvatar.svelte';

  // Constants
  import { ACCOUNT_PROFILES, ACCOUNT_MENU_ITEMS, TRANSITION_DURATION } from '../constants';

  // Stores
  import { navStore } from '../stores/navStore';

  // Types
  import type { IconName } from '../types';

  /**
   * Props for the NavSecondary component
   *
   * @interface NavSecondaryProps
   * @property {string} avatarSrc - Source URL for the user avatar image
   * @property {string} [avatarAlt="Netflix user avatar"] - Alt text for the avatar image
   * @property {number} [notificationCount=0] - Number of notifications to display
   * @property {boolean} [showNotifications=false] - Whether to show the notification badge
   */
  interface NavSecondaryProps {
    avatarAlt?: string;
    avatarSrc: string;
    notificationCount?: number;
    showNotifications?: boolean;
  }

  export let avatarAlt: NavSecondaryProps['avatarAlt'] = 'Netflix user avatar';
  export let avatarSrc: NavSecondaryProps['avatarSrc'];
  export let notificationCount: NavSecondaryProps['notificationCount'] = 0;
  export let showNotifications: NavSecondaryProps['showNotifications'] = false;

  /**
   * Mapping of icon names to their component implementations
   *
   * @type {Record<IconName, ComponentType<SvelteComponent>>}
   */
  const iconComponents: Record<IconName, ComponentType<SvelteComponent>> = {
    pencil: IconPencil,
    transfer: IconProfileArrow,
    user: IconUser,
    help: IconCircleQuestionMark,
  };

  /**
   * Gets the corresponding icon component for a given icon name
   *
   * @function getIconComponent
   * @param {IconName} iconName - The name of the icon to retrieve
   * @returns {ComponentType<SvelteComponent>} The Svelte component for the icon
   */
  function getIconComponent(iconName: IconName): ComponentType<SvelteComponent> {
    return iconComponents[iconName];
  }
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

  <!-- Account Menu - Shows the user avatar and handles menu display -->
  <div class="nav__secondary--element">
    <NavTrigger dropdownId="accountNav">
      <UserAvatar alt={avatarAlt} src={avatarSrc} />
    </NavTrigger>

    <!-- Only render the dropdown menu when it's open in the store -->
    {#if $navStore.openDropdowns.accountNav}
      <div
        role="menu"
        tabindex="0"
        on:mouseenter={() => navStore.setDropdownHover(true, 'accountNav')}
        on:mouseleave={() => navStore.setDropdownHover(false, 'accountNav')}
        transition:fade={{ duration: TRANSITION_DURATION }}
      >
        <NavSubMenu isOpen={true} className="account-menu">
          <!-- Profiles section - Shows all available user profiles -->
          <ul class="account-menu__profiles">
            {#each ACCOUNT_PROFILES as profile}
              <NavItem className="account-menu__item" label={profile.label}>
                <svelte:fragment slot="icon">
                  <img
                    alt={`${profile.label} profile avatar`}
                    class="account-menu__avatar"
                    src={profile.avatarSrc || '/placeholder.svg'}
                  />
                </svelte:fragment>
              </NavItem>
            {/each}
          </ul>

          <!-- Divider between profiles and menu options -->
          <div class="account-menu__divider" />

          <!-- Menu options - Account settings and preferences -->
          <ul class="account-menu__links">
            {#each ACCOUNT_MENU_ITEMS as item}
              <NavItem className="account-menu__item" label={item.label}>
                <svelte:fragment slot="icon">
                  <div class="account-menu__icon">
                    {#if item.icon}
                      <svelte:component this={getIconComponent(item.icon)} />
                    {/if}
                  </div>
                </svelte:fragment>
              </NavItem>
            {/each}
          </ul>

          <!-- Divider between menu options and sign out -->
          <div class="account-menu__divider" />

          <!-- Sign out option - Always appears at the bottom of the menu -->
          <NavItem className="account-menu__sign-out" label="Sign out of Netflix" />
        </NavSubMenu>
      </div>
    {/if}
  </div>
</div>

<style>
  /*
   * SECONDARY NAVIGATION
   * Main container and spacing for the right-side navigation elements
   */

  /* Secondary navigation container - positions elements at the right side of the navbar */
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

  /* Spacing between navigation elements (search, notifications, account) */
  .nav__secondary--element:not(:last-child) {
    margin-right: 1rem;
  }

  /*
   * ACCOUNT MENU
   * Styles for the dropdown menu that appears when clicking the user avatar
   */

  /* Set the width of the account menu dropdown */
  :global(.account-menu) {
    width: 220px;
  }

  /* 
   * ACCOUNT MENU SECTIONS
   * Styles for different sections within the account menu
   */

  /* Profiles section containing user avatars and names */
  .account-menu__profiles {
    height: auto;
    overflow: hidden;
    padding: 10px 0 5px;
  }

  /* Horizontal divider between menu sections */
  .account-menu__divider {
    background-color: hsla(0, 0%, 100%, 0.15);
    height: 1px;
    margin: 0;
    width: 100%;
  }

  /* Container for menu links/options */
  .account-menu__links {
    list-style: none;
    padding: 0.75rem 0;
  }

  /* 
   * ACCOUNT MENU ITEMS
   * Styles for individual elements within the account menu
   */

  /* User avatar image styling */
  .account-menu__avatar {
    border-radius: 4px;
    height: 32px;
    margin-right: 10px;
    vertical-align: middle;
    width: 32px;
  }

  /* Icon container for menu items with icons */
  .account-menu__icon {
    color: #b3b3b3;
    display: flex;
    height: 24px;
    padding: 0 13px 0 5px;
    width: 24px;
  }

  /* Individual menu item styling */
  :global(.account-menu__item) {
    align-items: center;
    display: flex;
    padding: 5px 10px;
  }

  /* Sign out button at the bottom of the menu */
  :global(.account-menu__sign-out) {
    list-style: none;
    padding: 10px 0;
    text-align: center;
  }

  /* Hover state for non-current navigation items */
  :global(.account-menu__item):not(.nav-item--current):hover,
  :global(.account-menu__sign-out):hover {
    text-decoration: underline;
  }
</style>
