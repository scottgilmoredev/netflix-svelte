<script lang="ts">
  /**
   * NavPrimary Component
   *
   * @component
   * @description Primary navigation menu for the Netflix-style navigation bar.
   * Displays navigation items and handles responsive behavior between mobile and desktop views.
   *
   * @prop {NavItem[]} items - Array of navigation items to display
   * @prop {string} [currentItem="Home"] - The currently active navigation item
   *
   * @requires svelte
   * @requires svelte/transition
   * @requires ./NavSubMenu
   * @requires ../types
   */

  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  // Components
  import NavSubMenu from './NavSubMenu.svelte';

  // Types
  import type { NavItem } from '../types';

  /**
   * Props for the NavPrimary component
   *
   * @typedef {Object} NavPrimaryProps
   * @property {NavItem[]} items - Array of navigation items to display
   */
  interface NavPrimaryProps {
    items: NavItem[];
  }

  export let items: NavPrimaryProps['items'];

  /**
   * State variables for dropdown interaction
   *
   * @type {boolean}
   */
  let isDropdownOpen: boolean = false;
  let isMouseOverTrigger: boolean = false;
  let isMouseOverDropdown: boolean = false;

  // Track timeouts to clear them if needed
  let triggerTimeout: number | null = null;
  let dropdownTimeout: number | null = null;

  /**
   * Transition duration in milliseconds
   * @constant {number}
   */
  const TRANSITION_DURATION = 150;

  /**
   * Handles mouse entering the trigger
   *
   * @function handleTriggerMouseEnter
   * @description Updates state when mouse enters the dropdown trigger
   *
   * @example
   * <button on:mouseenter={handleTriggerMouseEnter}>Trigger</button>
   */
  function handleTriggerMouseEnter(): void {
    isMouseOverTrigger = true;
    updateDropdownState();
  }

  /**
   * Handles mouse leaving the trigger
   *
   * @function handleTriggerMouseLeave
   * @description Updates state when mouse leaves the dropdown trigger
   * with a delay to allow movement to the dropdown
   *
   * @example
   * <button on:mouseleave={handleTriggerMouseLeave}>Trigger</button>
   */
  function handleTriggerMouseLeave(): void {
    isMouseOverTrigger = false;

    // Clear any existing timeout
    if (triggerTimeout !== null) {
      clearTimeout(triggerTimeout);
    }

    // setTimeout to allow the mouse to move to the dropdown
    // Type assertion to ensure setTimeout ID is treated as number across all environments
    triggerTimeout = setTimeout(updateDropdownState, 350) as unknown as number;
  }

  /**
   * Handles mouse entering the dropdown
   *
   * @function handleDropdownMouseEnter
   * @description Updates state when mouse enters the dropdown menu
   *
   * @example
   * <div on:mouseenter={handleDropdownMouseEnter}>Dropdown</div>
   */
  function handleDropdownMouseEnter(): void {
    isMouseOverDropdown = true;
    updateDropdownState();
  }

  /**
   * Handles mouse leaving the dropdown
   *
   * @function handleDropdownMouseLeave
   * @description Updates state when mouse leaves the dropdown menu
   * with a short delay to prevent flickering
   *
   * @example
   * <div on:mouseleave={handleDropdownMouseLeave}>Dropdown</div>
   */
  function handleDropdownMouseLeave(): void {
    isMouseOverDropdown = false;

    // Clear any existing timeout
    if (dropdownTimeout !== null) {
      clearTimeout(dropdownTimeout);
    }

    // setTimeout to provide slight delay before closing the dropdown
    // Type assertion to ensure setTimeout ID is treated as number across all environments
    dropdownTimeout = setTimeout(updateDropdownState, 50) as unknown as number;
  }

  /**
   * Handles keyboard interaction with the dropdown trigger
   *
   * @function handleKeydown
   * @param {KeyboardEvent} event - The keyboard event
   * @description Toggles the dropdown when Enter or Space is pressed
   *
   * @example
   * <button on:keydown={handleKeydown}>Trigger</button>
   */
  function handleKeydown(event: KeyboardEvent): void {
    // Check if the dropdown is open and the key pressed is Enter or Space. If so, toggle the dropdown state
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      isDropdownOpen = !isDropdownOpen;
    }

    // Check if the dropdown is open and the key pressed is Escape,.If so, close the dropdown
    if (event.key === 'Escape' && isDropdownOpen) {
      event.preventDefault();
      isDropdownOpen = false;
    }
  }

  /**
   * Updates the dropdown visibility based on mouse position
   *
   * @function updateDropdownState
   * @description Determines if the dropdown should be visible based on
   * whether the mouse is over the trigger or the dropdown itself
   */
  function updateDropdownState(): void {
    isDropdownOpen = isMouseOverTrigger || isMouseOverDropdown;
  }

  /**
   * Cleanup function that runs when component is destroyed
   *
   * @function onDestroy
   * @description Clears any pending timeouts to prevent memory leaks
   * and avoid executing callbacks after component unmount
   */
  onDestroy(() => {
    if (triggerTimeout !== null) clearTimeout(triggerTimeout);
    if (dropdownTimeout !== null) clearTimeout(dropdownTimeout);
  });
</script>

<ul class="nav__primary">
  <!-- Mobile Nav with dropdown -->
  <li class="nav__menu">
    <span
      aria-haspopup="true"
      aria-expanded={isDropdownOpen}
      class="nav__menu--trigger"
      role="button"
      tabindex="0"
      on:keydown={handleKeydown}
      on:mouseenter={handleTriggerMouseEnter}
      on:mouseleave={handleTriggerMouseLeave}
    >
      Browse
    </span>

    {#if isDropdownOpen}
      <div
        class="dropdown-container"
        role="menu"
        tabindex="0"
        on:mouseenter={handleDropdownMouseEnter}
        on:mouseleave={handleDropdownMouseLeave}
        transition:fade={{ duration: TRANSITION_DURATION }}
      >
        <NavSubMenu {items} isOpen={true} />
      </div>
    {/if}
  </li>

  <!-- Desktop Nav -->
  {#each items as item}
    <li class={item.isCurrent ? 'nav__tabbed nav__tabbed--current' : 'nav__tabbed'}>
      {item.label}
    </li>
  {/each}
</ul>

<style>
  /* Primary navigation container */
  .nav__primary {
    align-items: center;
    display: flex;
    margin: 0;
    padding: 0;
  }

  /* Mobile menu trigger element */
  .nav__menu {
    color: #fff;
    display: block;
    list-style: none;
    margin-left: 18px;
  }

  /* Text and dropdown trigger for mobile menu */
  .nav__menu--trigger {
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
  .nav__menu--trigger::after {
    border-color: #fff transparent transparent;
    border-style: solid;
    border-width: 5px 5px 0;
    content: '';
    height: 0;
    margin-left: 5px;
    width: 0;
  }

  /* Individual navigation item */
  .nav__tabbed {
    color: #fff;
    display: none;
    list-style: none;
    margin-left: 18px;
  }

  /* Current/active navigation item */
  .nav__tabbed--current {
    font-weight: 700;
  }

  /* Responsive behavior - show tabs on larger screens */
  @media screen and (min-width: 885px) {
    .nav__menu {
      display: none;
    }

    .nav__tabbed {
      display: block;
    }
  }
</style>
