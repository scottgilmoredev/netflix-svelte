<script lang="ts">
  /**
   * NavSubMenu Component
   *
   * @component
   * @description Dropdown menu that appears when hovering over the "Browse" option
   * in the condensed navigation. Displays a list of navigation options in a floating
   * panel with a dark, semi-transparent background.
   *
   * @prop {boolean} [isOpen=false] - Whether the dropdown menu is currently open
   * @prop {NavItem[]} [items=[]] - Array of navigation items to display in the dropdown
   *
   * @requires ./NavItem
   * @requires ../types
   */

  // Components
  import NavItem from './NavItem.svelte';

  // Types
  import type { NavItem as NavItemType } from '../types';

  /**
   * Props for the NavSubMenu component
   *
   * @typedef {Object} NavSubMenuProps
   * @property {boolean} isOpen - Whether the dropdown menu is currently open
   * @property {NavItemType[]} items - Array of navigation items to display
   */
  interface NavSubMenuProps {
    isOpen: boolean;
    items: NavItemType[];
  }

  export let isOpen: NavSubMenuProps['isOpen'] = false;
  export let items: NavSubMenuProps['items'] = [];
</script>

<div class="nav__sub-menu" class:nav__sub-menu--open={isOpen}>
  <!-- The arrow pointing to the trigger -->
  <div class="callout-arrow" />

  <!-- The top bar of the dropdown -->
  <div class="topbar" />

  <!-- The list of navigation items -->
  <ul class="sub-menu__list">
    {#each items as item}
      <NavItem label={item.label} isCurrent={item.isCurrent} className="sub-menu__list-item" />
    {/each}
  </ul>
</div>

<style>
  /* Main dropdown container with semi-transparent background */
  .nav__sub-menu {
    background-color: rgba(0, 0, 0, 0.9);
    border: 1px solid hsla(0, 0%, 100%, 0.15);
    box-sizing: border-box;
    color: #fff;
    cursor: default;
    font-size: 13px;
    line-height: 21px;
    opacity: 0;
    position: absolute;
    top: 3rem;
    margin-left: -90px;
  }

  /* Triangle indicator pointing to the trigger element */
  .callout-arrow {
    border: 7px solid transparent;
    border-bottom-color: #e5e5e5;
    height: 0;
    left: 50%;
    margin-left: -7px;
    position: absolute;
    top: -16px;
    width: 0;
  }

  /* Horizontal accent line at the top of the dropdown */
  .topbar {
    background: #e5e5e5;
    height: 2px;
    left: 0;
    position: absolute;
    right: 0;
    top: -2px;
  }

  /* Visible state for the dropdown */
  .nav__sub-menu--open {
    opacity: 1;
    visibility: visible;
  }

  /* Container for the navigation items list */
  .sub-menu__list {
    height: auto;
    padding: 0;
  }

  /* Individual navigation item in the dropdown */
  :global(.sub-menu__list-item) {
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
  :global(.sub-menu__list-item):not(.nav-item--current):hover {
    color: #fff;
    font-weight: 700;
  }
</style>
