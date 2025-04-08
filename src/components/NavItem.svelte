<script lang="ts">
  /**
   * NavItem Component
   *
   * @component
   * @description Renders a single navigation item that can be used in both desktop
   * and mobile navigation menus. Supports custom styling, current state indication,
   * and optional icon and content slots.
   *
   * @prop {string} [className=""] - Additional CSS class to apply to the item
   * @prop {boolean} [isCurrent=false] - Whether this item is the current/active item
   * @prop {string} label - The text to display for this navigation item
   *
   * @slot icon - Optional slot for an icon to display before the label
   * @slot default - Optional slot for additional content after the label
   */

  /**
   * Props interface for the NavItem component
   *
   * @interface NavItemProps
   * @property {string} [className] - Additional CSS class to apply to the item
   * @property {boolean} [isCurrent] - Whether this item is the current/active item
   * @property {string} label - The text to display for this navigation item
   */
  interface NavItemProps {
    className?: string;
    isCurrent?: boolean;
    label: string;
  }

  export let className: NavItemProps['className'] = '';
  export let isCurrent: NavItemProps['isCurrent'] = false;
  export let label: NavItemProps['label'];
</script>

<!-- 
  Navigation item list element
  - Dynamically applies the provided className
  - Adds 'nav-item--current' class when the item is active/current
-->
<li class={`${className} ${isCurrent ? 'nav-item--current' : ''}`}>
  <!-- Icon slot: Renders before the label text, typically used for navigation icons -->
  <slot name="icon"></slot>

  <!-- Label: Displays the navigation item text -->
  <span>{label}</span>

  <!-- Default slot: Renders after the label, can be used for additional content like badges or indicators -->
  <slot></slot>
</li>

<style>
  /* Current/active navigation item */
  .nav-item--current {
    color: #fff;
    font-weight: 700;
  }
</style>
