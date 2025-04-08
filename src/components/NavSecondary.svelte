<script lang="ts">
  /**
   * NavSecondary Component
   *
   * @component
   * @description Secondary navigation container for the Netflix-style navigation bar.
   * Positioned at the right side of the navigation bar to provide user-specific functionality.
   * This component uses a slot-based architecture to allow flexible composition of secondary
   * navigation elements such as search icons, notifications, and user avatars.
   *
   * It provides four slots:
   * - left: For elements that should appear on the left side of the secondary nav
   * - center: For elements that should appear in the center of the secondary nav
   * - right: For elements that should appear on the right side of the secondary nav
   * - default: For elements without a specific position preference
   *
   * @requires svelte
   *
   * @example
   * <NavSecondary>
   *   <IconSearch slot="left" />
   *   <IconNotification slot="center" />
   *   <AccountMenuTrigger slot="right" />
   * </NavSecondary>
   */
</script>

<div class="nav__secondary">
  <!-- Left-aligned elements in the secondary navigation -->
  <slot name="left"></slot>

  <!-- Center-aligned elements in the secondary navigation -->
  <slot name="center"></slot>

  <!-- Right-aligned elements in the secondary navigation -->
  <slot name="right"></slot>

  <!-- Default slot for elements without a specific position preference -->
  <slot></slot>
</div>

<style>
  /* Secondary navigation container - positions elements at the right side of the navbar */
  .nav__secondary {
    align-items: center;
    color: #fff;
    display: flex;
    flex-grow: 1;
    height: 100%;
    justify-content: flex-end;
    position: absolute;
    right: 4%;
    top: 0;
  }
</style>
