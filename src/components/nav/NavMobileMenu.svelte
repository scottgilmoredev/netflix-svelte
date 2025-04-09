<script lang="ts">
  /**
   * NavMobileMenu Component
   *
   * @component
   * @description Renders the dropdown menu for mobile navigation.
   * This component displays navigation items in a vertical list when the mobile
   * navigation trigger is activated. It uses the navStore for state management
   * to control visibility and handle user interactions. The menu appears with a
   * fade transition and disappears when the mouse leaves the menu area.
   *
   * @requires svelte
   * @requires svelte/transition
   * @requires ./NavItem
   * @requires ./NavSubMenu
   * @requires module:@constants
   * @requires module:@stores
   */
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  // Components
  import NavItem from './NavItem.svelte';
  import NavSubMenu from './NavSubMenu.svelte';

  // Constants
  import { TRANSITION_DURATION } from '@constants';

  // Stores
  import { navStore, navItems } from '@stores';

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

<!-- Conditionally render the mobile menu dropdown when primaryNav is open in the store -->
{#if $navStore.openDropdowns.primaryNav}
  <!-- Dropdown menu container with mouse event handlers and accessibility attributes -->
  <span
    role="menu"
    tabindex="0"
    on:mouseenter={() => navStore.setDropdownHover(true, 'primaryNav')}
    on:mouseleave={() => navStore.setDropdownHover(false, 'primaryNav')}
    transition:fade={{ duration: TRANSITION_DURATION }}
  >
    <!-- NavSubMenu provides the base styling and structure for the dropdown -->
    <NavSubMenu isOpen={true}>
      <!-- Unordered list container for navigation items -->
      <ul class="mobile-nav__list">
        {#each $navItems as item}
          <!-- Render a NavItem component for each navigation item with appropriate styling -->
          <NavItem
            className="mobile-nav__list-item"
            isCurrent={item.isCurrent}
            label={item.label}
          />
        {/each}
      </ul>
    </NavSubMenu>
  </span>
{/if}

<style>
  /* Container for the navigation items list */
  .mobile-nav__list {
    height: auto;
    padding: 0;
  }

  /* Individual navigation item in the dropdown */
  :global(.mobile-nav__list-item) {
    display: block;
    line-height: 24px;
    align-items: center;
    color: #b3b3b3;
    display: flex;
    height: 50px;
    justify-content: center;
    position: relative;
    transition: background-color 0.4s;
    width: 260px;
  }

  /* Hover state for non-current navigation items */
  :global(.mobile-nav__list-item):not(.nav-item--current):hover {
    color: #fff;
    font-weight: 700;
  }
</style>
