<script lang="ts">
  /**
   * DesktopNav Component
   *
   * @component
   * @description Renders the desktop navigation items, encapsulating
   * desktop-specific layout and behavior. Uses the navStore for state management
   * to display navigation items with their current state.
   *
   * @requires ./NavItem
   * @requires ../stores/navStore
   * @requires ../types
   */

  // Components
  import NavItem from './NavItem.svelte';

  // Stores
  import { navItems } from '../stores/navStore';
</script>

<ul class="desktop-nav">
  {#each $navItems as item}
    <NavItem label={item.label} isCurrent={item.isCurrent} className="desktop-nav__item" />
  {/each}
</ul>

<style>
  /* Desktop navigation container */
  .desktop-nav {
    align-items: center;
    display: flex;
    margin: 0;
    padding: 0;
  }

  /* Individual desktop navigation item */
  :global(.desktop-nav__item) {
    color: #e5e5e5;
    display: none;
    margin-left: 18px;
  }

  /* Hover state for non-current navigation items */
  :global(.desktop-nav__item):not(.nav-item--current):hover {
    color: #b3b3b3;
  }

  /* Responsive behavior - show tabs on larger screens */
  @media screen and (min-width: 885px) {
    :global(.desktop-nav__item) {
      display: block;
    }
  }
</style>
