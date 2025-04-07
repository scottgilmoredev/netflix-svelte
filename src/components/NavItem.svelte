<script lang="ts">
  /**
   * NavItem Component
   *
   * @component
   * @description Renders a single navigation item, designed for reusability
   * across both desktop and mobile navigation menus.
   *
   * @prop {string} [className=""] - Additional CSS class to apply to the item
   * @prop {boolean} [isCurrent=false] - Whether this item is the current/active item
   * @prop {string} label - The text to display for this navigation item
   */

  /**
   * Props for the NavItem component
   *
   * @interface NavItemProps
   * @property {string} [className=""] - Additional CSS class to apply to the item
   * @property {boolean} [isCurrent=false] - Whether this item is the current/active item
   * @property {string} label - The text to display for this navigation item
   */
  interface NavItemProps {
    className?: string;
    isCurrent?: boolean;
    label: string;
  }

  export let label: NavItemProps['label'];
  export let isCurrent: NavItemProps['isCurrent'] = false;
  export let className: NavItemProps['className'] = '';
</script>

<li class={`${className} ${isCurrent ? 'nav-item--current' : ''}`}>
  {label}
</li>

<style>
  /* Current/active navigation item */
  .nav-item--current {
    color: #fff;
    font-weight: 700;
  }
</style>
