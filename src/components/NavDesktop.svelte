<script lang="ts">
  /**
   * DesktopNav Component
   *
   * @component
   * @description Renders the desktop navigation items, encapsulating
   * desktop-specific layout and behavior. Uses the navItems derived store
   * which automatically updates the isCurrent property based on the current
   * navigation selection.
   *
   * @requires ./NavItem
   * @requires ../stores/navStore
   */

  // Components
  import NavItem from './NavItem.svelte';

  // Stores
  import { navItems } from '../stores/navStore';
</script>

{#each $navItems as item}
  <NavItem className="desktop-nav__item" isCurrent={item.isCurrent} label={item.label} />
{/each}

<style>
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
