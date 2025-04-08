<script lang="ts">
  /**
   * NavAccountProfiles Component
   *
   * @component
   * @description Renders a list of user profiles in the account menu.
   * Each profile is displayed with its avatar and name, allowing users to
   * switch between different profiles. The profiles are defined in the
   * ACCOUNT_PROFILES constant.
   *
   * @requires ../constants
   * @requires ./NavItem
   */

  // Constants
  import { ACCOUNT_PROFILES } from '../constants';

  // Components
  import NavItem from './NavItem.svelte';
</script>

<!-- Container for user profiles in the account menu -->
<ul class="account-menu__profiles">
  {#each ACCOUNT_PROFILES as profile}
    <!-- Render a NavItem component for each profile with appropriate class and label -->
    <NavItem className="account-menu__item" label={profile.label}>
      <svelte:fragment slot="icon">
        <!-- Profile avatar image with fallback to placeholder if source is missing -->
        <img
          alt={`${profile.label} profile avatar`}
          class="account-menu__avatar"
          src={profile.avatarSrc || '/placeholder.svg'}
        />
      </svelte:fragment>
    </NavItem>
  {/each}
</ul>

<style>
  /* Profiles section containing user avatars and names */
  .account-menu__profiles {
    height: auto;
    list-style: none;
    margin: 0;
    overflow: hidden;
    padding: 10px 0 5px;
  }

  /* User avatar image styling */
  .account-menu__avatar {
    border-radius: 4px;
    height: 32px;
    margin-right: 10px;
    vertical-align: middle;
    width: 32px;
  }
</style>
