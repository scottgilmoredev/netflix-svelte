<script lang="ts">
  /**
   * MobileNav Component
   *
   * @component
   * @description Handles the mobile navigation, including the dropdown
   * functionality for smaller screens. Uses the navStore for state management
   * to control the dropdown visibility and handle user interactions.
   * This component is only visible on smaller screens and is hidden on desktop viewports.
   *
   * @requires ./NavMobileMenu
   * @requires ./NavTrigger
   */

  // Components
  import NavMobileMenu from './NavMobileMenu.svelte';
  import NavTrigger from './NavTrigger.svelte';
</script>

<!-- Mobile navigation container - rendered as a list item -->
<li class="mobile-nav">
  <!-- Dropdown trigger button that toggles the primary navigation dropdown -->
  <NavTrigger dropdownId="primaryNav" />

  <!-- Mobile menu component that contains the navigation items -->
  <NavMobileMenu />
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
