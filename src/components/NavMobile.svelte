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
   * @requires ./NavTrigger
   * @requires ./NavSubMenu
   * @requires ../constants
   * @requires ../stores/navStore
   * @requires ../types
   */

  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  // Components
  import NavTrigger from './NavTrigger.svelte';
  import NavSubMenu from './NavSubMenu.svelte';

  // Constants
  import { TRANSITION_DURATION } from '../constants';

  // Stores
  import { navStore, navItems } from '../stores/navStore';

  /**
   * Handles keyboard trigger events
   *
   * @function handleTriggerKeyPress
   * @description Toggles the dropdown visibility when the trigger is activated via keyboard
   *
   * @returns {void}
   */
  function handleTriggerKeyPress(): void {
    navStore.toggleDropdown();
  }

  /**
   * Handles escape key press
   *
   * @function handleTriggerEscape
   * @description Closes the dropdown when the escape key is pressed
   *
   * @returns {void}
   */
  function handleTriggerEscape(): void {
    navStore.closeDropdown();
  }

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
  <NavTrigger
    isOpen={$navStore.isDropdownOpen}
    onMouseEnter={() => navStore.setTriggerHover(true)}
    onMouseLeave={() => navStore.setTriggerHover(false)}
    on:triggerEscape={handleTriggerEscape}
    on:triggerKeyPress={handleTriggerKeyPress}
  />

  {#if $navStore.isDropdownOpen}
    <!-- Dropdown menu - conditionally rendered when dropdown is open -->
    <div
      role="menu"
      tabindex="0"
      on:mouseenter={() => navStore.setDropdownHover(true)}
      on:mouseleave={() => navStore.setDropdownHover(false)}
      transition:fade={{ duration: TRANSITION_DURATION }}
    >
      <!-- Navigation submenu with items from the store -->
      <NavSubMenu items={$navItems} isOpen={true} />
    </div>
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

  /* Responsive behavior - hide on larger screens */
  @media screen and (min-width: 885px) {
    .mobile-nav {
      display: none;
    }
  }
</style>
