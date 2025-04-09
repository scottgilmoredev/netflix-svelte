<script lang="ts">
  /**
   * NavSubMenu Component
   *
   * @component
   * @description Dropdown menu that appears when hovering over navigation items.
   * Displays content in a floating panel with a dark, semi-transparent background.
   * Supports both standard navigation dropdowns and account menus through CSS classes.
   *
   * @prop {string} [className=""] - Additional CSS class to apply to the menu
   * @prop {boolean} [isOpen=false] - Whether the dropdown menu is currently open
   *
   * @slot default - Content to display inside the dropdown menu
   */

  /**
   * Props for the NavSubMenu component
   *
   * @interface NavSubMenuProps
   * @property {string} [className] - Additional CSS class to apply to the menu
   * @property {boolean} isOpen - Whether the dropdown menu is currently open
   */
  interface NavSubMenuProps {
    className?: string;
    isOpen: boolean;
  }

  export let className: NavSubMenuProps['className'] = '';
  export let isOpen: NavSubMenuProps['isOpen'] = false;
</script>

<div class={`nav__sub-menu ${className}`} class:nav__sub-menu--open={isOpen}>
  <!-- The arrow pointing to the trigger -->
  <div class="callout-arrow" />

  <!-- The top bar of the dropdown -->
  <div class="topbar" />

  <!-- Custom content via slot -->
  <slot></slot>
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

  /* Special positioning for account menu variant */
  .nav__sub-menu:global(.account-menu) {
    margin-left: 0;
    right: 0;
    top: 4rem;
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

  /* Adjust callout arrow position for account menu */
  :global(.account-menu) > .callout-arrow {
    left: auto;
    right: 5%;
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

  /* Hide topbar for account menu */
  :global(.account-menu) > .topbar {
    display: none;
  }

  /* Visible state for the dropdown */
  .nav__sub-menu--open {
    opacity: 1;
    visibility: visible;
  }
</style>
