<script lang="ts">
  /**
   * NavTrigger Component
   *
   * @component
   * @description Manages the dropdown trigger button for navigation,
   * handling mouse events and keyboard interactions. Displays a label
   * (defaulting to "Browse") with a dropdown arrow that rotates when
   * the dropdown is open. Uses the navStore to manage dropdown state.
   *
   * @prop {string} [dropdownId="primaryNav"] - Identifier for the dropdown this trigger controls
   *
   * @slot default - Content to display as the trigger text (defaults to "Browse")
   *
   * @requires ../stores/navStore
   */

  import { navStore } from '../stores/navStore';

  /**
   * Props for the NavTrigger component
   *
   * @interface NavTriggerProps
   * @property {string} dropdownId - Identifier for the dropdown this trigger controls
   */
  interface NavTriggerProps {
    dropdownId: string;
  }

  export let dropdownId: NavTriggerProps['dropdownId'] = 'primaryNav';

  /**
   * Reactive variable to track if accountNav dropdown is open
   * Used to handle trigger animation (only accountNav trigger rotates on hover)
   */
  $: isOpen = $navStore.openDropdowns.accountNav;

  /**
   * Handles keyboard interaction with the dropdown trigger
   *
   * @function handleKeydown
   * @description Dispatches custom events for keyboard interactions:
   * - Enter/Space: Toggles the dropdown
   * - Escape: Closes the dropdown if it's open
   *
   * @param {KeyboardEvent} event - The keyboard event
   *
   * @returns {void}
   */
  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navStore.toggleDropdown(dropdownId);
    }

    if (event.key === 'Escape' && $navStore.openDropdowns[dropdownId]) {
      event.preventDefault();
      navStore.closeDropdown(dropdownId);
    }
  }
</script>

<!-- Dropdown trigger button with accessibility attributes -->
<span
  aria-haspopup="true"
  aria-expanded={isOpen}
  class="nav-trigger"
  class:nav-trigger--account={dropdownId === 'accountNav'}
  role="button"
  tabindex="0"
  on:keydown={handleKeydown}
  on:mouseenter={() => navStore.setTriggerHover(true, dropdownId)}
  on:mouseleave={() => navStore.setTriggerHover(false, dropdownId)}
>
  <!-- Default content is "Browse", but can be customized via slots -->
  <slot>Browse</slot>
</span>

<style>
  /* Text and dropdown trigger for mobile menu */
  .nav-trigger {
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
  .nav-trigger::after {
    border-color: #fff transparent transparent;
    border-style: solid;
    border-width: 5px 5px 0;
    content: '';
    height: 0;
    margin-left: 5px;
    transition:
      transform 0.2s ease,
      border-width 0.2s ease,
      border-color 0.2s ease;
    width: 0;
  }

  /* Special handling for account menu caret - hide by default on small screens */
  .nav-trigger--account::after {
    display: none;
  }

  /* Show account menu caret only on screens wider than 950px */
  @media screen and (min-width: 950px) {
    .nav-trigger--account::after {
      display: block;
    }
  }

  /* Rotate arrow when dropdown is open */
  .nav-trigger[aria-expanded='true']::after {
    transform: rotate(180deg);
  }
</style>
