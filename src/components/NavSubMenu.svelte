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
   * @requires ../types
   */

  // Types
  import type { NavItem } from '../types';

  /**
   * Props for the NavSubMenu component
   *
   * @typedef {Object} NavSubMenuProps
   * @property {boolean} isOpen - Whether the dropdown menu is currently open
   * @property {NavItem[]} items - Array of navigation items to display
   */
  interface NavSubMenuProps {
    isOpen: boolean;
    items: NavItem[];
  }

  /**
   * Controls the visibility of the dropdown menu
   * When true, the menu is visible with full opacity
   * When false, the menu is hidden
   *
   * @type {boolean}
   * @default false
   */
  export let isOpen: NavSubMenuProps['isOpen'] = false;

  /**
   * The navigation items to display in the dropdown menu
   * Each item can have a current/active state that affects its styling
   *
   * @type {NavItem[]}
   * @default []
   */
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
      <li class="sub-menu__list-item" class:sub-menu__list-item--current={item.isCurrent}>
        {item.label}
      </li>
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
    top: 64px;
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
    transform: translateY(0);
  }

  /* Container for the navigation items list */
  .sub-menu__list {
    height: auto;
    padding: 0;
  }

  /* Individual navigation item in the dropdown */
  .sub-menu__list-item {
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

  /* Current/active navigation item and hover state */
  .sub-menu__list-item--current,
  .sub-menu__list-item:hover {
    font-weight: 700;
    color: #fff;
  }
</style>
