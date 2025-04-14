<script lang="ts">
  /**
   * NavSecondaryContainer Component
   *
   * @component
   * @description A container component that composes the NavSecondary component with
   * specific elements for search, notifications, and account management. This component
   * serves as a higher-level abstraction that provides a complete secondary navigation
   * implementation with all the necessary functionality.
   *
   * It populates the NavSecondary slots with:
   * - left: Search button for content search functionality
   * - center: Notification button with optional badge and count
   * - right: Account menu trigger with user avatar and dropdown menu
   *
   * @requires ../ui/ButtonNotification
   * @requires ../ui/ButtonSearch
   * @requires ./NavAccountMenu
   * @requires ./NavSecondary
   * @requires ./NavTrigger
   * @requires ../ui/UserAvatar
   */

  // Components
  import ButtonNotification from '../ui/ButtonNotification.svelte';
  import ButtonSearch from '../ui/ButtonSearch.svelte';
  import NavAccountMenu from './NavAccountMenu.svelte';
  import NavSecondary from './NavSecondary.svelte';
  import NavTrigger from './NavTrigger.svelte';
  import UserAvatar from '../ui/UserAvatar.svelte';

  /**
   * Props for the NavSecondaryContainer component
   *
   * @interface NavSecondaryProps
   * @property {string} avatarSrc - Source URL for the user avatar image
   * @property {string} [avatarAlt="Netflix user avatar"] - Alt text for the avatar image
   */
  interface NavSecondaryProps {
    avatarAlt?: string;
    avatarSrc: string;
  }

  export let avatarAlt: NavSecondaryProps['avatarAlt'] = 'Netflix user avatar';
  export let avatarSrc: NavSecondaryProps['avatarSrc'];
</script>

<!-- NavSecondary component with slots populated with specific navigation elements -->
<NavSecondary>
  <!-- Search - Placed in the left slot -->
  <svelte:fragment slot="left">
    <ButtonSearch className="nav__secondary--element" />
  </svelte:fragment>

  <!-- Notification - Placed in the center slot -->
  <svelte:fragment slot="center">
    <ButtonNotification className="nav__secondary--element" />
  </svelte:fragment>

  <!-- Account Menu - Placed in the right slot -->
  <svelte:fragment slot="right">
    <!-- Wrapper for account-related elements with relative positioning for dropdown -->
    <div class="nav__secondary--element account-wrapper">
      <!-- NavTrigger that toggles the account dropdown when clicked -->
      <NavTrigger dropdownId="accountNav">
        <!-- User avatar displayed as the trigger content -->
        <UserAvatar alt={avatarAlt} src={avatarSrc} />
      </NavTrigger>

      <!-- Account menu dropdown that appears when triggered -->
      <NavAccountMenu />
    </div>
  </svelte:fragment>
</NavSecondary>

<style>
  /* Wrapper for account-related elements with relative positioning for dropdown */
  .account-wrapper {
    position: relative;
  }

  /* Spacing between navigation elements (search, notifications, account) */
  :global(.nav__secondary--element):not(:last-child) {
    margin-right: 1rem;
  }
</style>
