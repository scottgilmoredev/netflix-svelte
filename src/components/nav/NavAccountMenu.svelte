<script lang="ts">
  /**
   * NavAccountMenu Component
   *
   * @component
   * @description Renders a dropdown menu for account-related options.
   * This component displays user profiles, account management links, and a sign-out option.
   * The menu appears when the user interacts with the account avatar and disappears
   * when the mouse leaves the menu area. Uses the navStore for state management.
   *
   * @requires svelte
   * @requires svelte/transition
   * @requires ./NavAccountLinks
   * @requires ./NavAccountProfiles
   * @requires ../Divider
   * @requires ./NavItem
   * @requires ./NavSubMenu
   * @requires module:@constants
   * @requires module:@stores
   */
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  // Components
  import NavAccountLinks from './NavAccountLinks.svelte';
  import NavAccountProfiles from './NavAccountProfiles.svelte';
  import Divider from '../Divider.svelte';
  import NavItem from './NavItem.svelte';
  import NavSubMenu from './NavSubMenu.svelte';

  // Constants
  import { TRANSITION_DURATION } from '@constants';

  // Stores
  import { navStore } from '@stores';

  /**
   * Cleanup function that runs when component is destroyed
   *
   * @function
   * @description Cleans up any resources used by the component,
   * including timeouts managed by the navStore
   *
   * @returns {void}
   */
  onDestroy(() => {
    navStore.cleanup();
  });
</script>

<!-- Conditionally render the account menu dropdown when accountNav is open in the store -->
{#if $navStore.openDropdowns.accountNav}
  <!-- Dropdown menu container with mouse event handlers and accessibility attributes -->
  <div
    role="menu"
    tabindex="0"
    on:mouseenter={() => navStore.setDropdownHover(true, 'accountNav')}
    on:mouseleave={() => navStore.setDropdownHover(false, 'accountNav')}
    transition:fade={{ duration: TRANSITION_DURATION }}
  >
    <!-- NavSubMenu provides the base styling and structure for the dropdown -->
    <NavSubMenu isOpen={true} className="account-menu">
      <!-- Profiles section - Shows all available user profiles to switch to -->
      <NavAccountProfiles />

      <!-- Divider between profiles and menu options -->
      <Divider />

      <!-- Menu options - Account settings and preferences -->
      <NavAccountLinks />

      <!-- Divider between menu options and sign out -->
      <Divider />

      <!-- Sign out option - Always appears at the bottom of the menu -->
      <NavItem className="account-menu__sign-out" label="Sign out of Netflix" />
    </NavSubMenu>
  </div>
{/if}

<style>
  /* Set the width of the account menu dropdown */
  :global(.account-menu) {
    width: 220px;
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

  /* Individual menu item styling */
  :global(.account-menu__item) {
    align-items: center;
    display: flex;
    padding: 5px 10px;
  }
</style>
