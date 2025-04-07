<script lang="ts">
  /**
   * NavPrimary Component
   *
   * @component
   * @description Primary navigation menu for the navigation bar.
   * Displays navigation items and handles responsive behavior between mobile and desktop views.
   * Serves as a container for both mobile and desktop navigation components.
   *
   * @requires ./NavDesktop
   * @requires ./NavMobile
   */

  // Components
  import DesktopNav from './NavDesktop.svelte';
  import MobileNav from './NavMobile.svelte';
</script>

<ul class="nav__primary">
  <!-- Mobile Navigation -->
  <MobileNav />

  <!-- Desktop Navigation -->
  <DesktopNav />
</ul>

<style>
  /* Primary navigation container */
  .nav__primary {
    align-items: center;
    display: flex;
    margin: 0;
    padding: 0;
  }
</style>
