<script lang="ts">
  /**
   * MobileNav Component
   *
   * @component
   * @description Handles the mobile navigation, including the dropdown
   * functionality for smaller screens. Uses the navStore for state management
   * to control the dropdown visibility and handle user interactions.
   *
   * @requires svelte
   * @requires svelte/transition
   * @requires ./NavItem
   * @requires ./NavSubMenu
   * @requires ./NavTrigger
   * @requires ../constants
   * @requires ../stores/navStore
   */

  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  // Components
  import NavItem from './NavItem.svelte';
  import NavSubMenu from './NavSubMenu.svelte';
  import NavTrigger from './NavTrigger.svelte';

  // Constants
  import { TRANSITION_DURATION } from '../constants';

  // Stores
  import { navStore, navItems } from '../stores/navStore';

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

<li class="mobile-nav">
  <!-- Dropdown trigger button with mouse and keyboard event handlers -->
  <NavTrigger dropdownId="primaryNav" />

  {#if $navStore.openDropdowns.primaryNav}
    <!-- Dropdown menu - conditionally rendered when dropdown is open -->
    <span
      role="menu"
      tabindex="0"
      on:mouseenter={() => navStore.setDropdownHover(true, 'primaryNav')}
      on:mouseleave={() => navStore.setDropdownHover(false, 'primaryNav')}
      transition:fade={{ duration: TRANSITION_DURATION }}
    >
      <!-- Navigation submenu -->
      <NavSubMenu isOpen={true}>
        <ul class="mobile-nav__list">
          {#each $navItems as item}
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
</li>

<style>
  /* Mobile navigation container */
  .mobile-nav {
    color: #fff;
    display: block;
    list-style: none;
    margin-left: 18px;
    position: relative;
  }

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

  /* Responsive behavior - hide on larger screens */
  @media screen and (min-width: 885px) {
    .mobile-nav {
      display: none;
    }
  }
</style>
