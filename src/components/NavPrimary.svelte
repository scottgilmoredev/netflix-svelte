<script lang="ts">
  /**
   * NavPrimary Component
   *
   * @component
   * @description Primary navigation menu for the Netflix-style navigation bar.
   * Displays navigation items and handles responsive behavior between mobile and desktop views.
   *
   * @prop {NavItem[]} items - Array of navigation items to display
   * @prop {string} [currentItem="Home"] - The currently active navigation item
   */

  // Types
  import type { NavItem } from '../types';

  /**
   * Props for the NavPrimary component
   *
   * @typedef {Object} NavPrimaryProps
   * @property {NavItem[]} items - Array of navigation items to display
   */
  interface NavPrimaryProps {
    items: NavItem[];
  }

  export let items: NavPrimaryProps['items'];
</script>

<ul class="nav__primary">
  <!-- Mobile Nav -->
  <li class="nav__menu">
    <span class="nav__menu--trigger">Browse</span>
  </li>

  <!-- Desktop Nav -->
  {#each items as item}
    <li class={item.isCurrent ? 'nav__tabbed nav__tabbed--current' : 'nav__tabbed'}>
      {item.label}
    </li>
  {/each}
</ul>

<style>
  /* Primary navigation container */
  .nav__primary {
    align-items: center;
    display: flex;
    margin: 0;
    padding: 0;
  }

  /* Mobile menu trigger element */
  .nav__menu {
    color: #fff;
    display: block;
    list-style: none;
    margin-left: 18px;
  }

  /* Text and dropdown trigger for mobile menu */
  .nav__menu--trigger {
    align-items: center;
    color: #fff;
    cursor: pointer;
    display: flex;
    font-weight: 500;
    height: 100%;
    position: relative;
    text-decoration: none;
  }

  /* Triangle indicator using ::after pseudo-element */
  .nav__menu--trigger::after {
    border-color: #fff transparent transparent;
    border-style: solid;
    border-width: 5px 5px 0;
    content: '';
    height: 0;
    margin-left: 5px;
    width: 0;
  }

  /* Individual navigation item */
  .nav__tabbed {
    color: #fff;
    display: none;
    list-style: none;
    margin-left: 18px;
  }

  /* Current/active navigation item */
  .nav__tabbed--current {
    font-weight: 700;
  }

  /* Responsive behavior - show tabs on larger screens */
  @media screen and (min-width: 885px) {
    .nav__menu {
      display: none;
    }

    .nav__tabbed {
      display: block;
    }
  }
</style>
