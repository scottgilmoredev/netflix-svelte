<script lang="ts">
  /**
   * NavAccountLinks Component
   *
   * @component
   * @description Renders a list of account-related menu items with icons.
   * Used within the account dropdown menu to display options like "Manage Profiles",
   * "Account", "Help Center", etc. Each item is rendered with its corresponding icon.
   *
   * @requires module:@constants
   * @requires ../icons/Icon
   * @requires ./NavItem
   */

  // Constants
  import { ACCOUNT_MENU_ITEMS } from '@constants';

  // Components
  import Icon from '@components/icons/Icon.svelte';
  import NavItem from './NavItem.svelte';
</script>

<!-- Main container for account menu links - renders as an unordered list -->
<ul class="account-menu__links">
  {#each ACCOUNT_MENU_ITEMS as item}
    <!-- Render a NavItem component for each menu item with appropriate class and label -->
    <NavItem className="account-menu__item" label={item.label}>
      <svelte:fragment slot="icon">
        <!-- Container for the icon -->
        <div class="account-menu__icon">
          {#if item.icon}
            <!-- Dynamically render the appropriate icon component based on the icon name -->
            <Icon name={item.icon} />
          {/if}
        </div>
      </svelte:fragment>
    </NavItem>
  {/each}
</ul>

<style>
  /* Container for menu links/options */
  .account-menu__links {
    list-style: none;
    margin: 0;
    padding: 0.75rem 0;
  }

  /* Icon container for menu items with icons */
  .account-menu__icon {
    color: #b3b3b3;
    display: flex;
    height: 24px;
    padding: 0 13px 0 5px;
    width: 24px;
  }
</style>
