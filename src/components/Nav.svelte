<script lang="ts">
  /**
   * Navigation Component
   *
   * @component
   * @description A fixed navigation bar that appears at the top of the page.
   * The background becomes visible when the user scrolls down the page.
   * Contains the Netflix logo and user avatar.
   *
   * @requires svelte
   * @requires ../constants
   * @requires ./NavPrimary
   * @requires ./NavSecondary
   */

  import { onMount } from 'svelte';

  // Components
  import NavPrimary from './NavPrimary.svelte';
  import NavSecondary from './NavSecondary.svelte';

  // Constants
  import { NAV_ITEMS, NETFLIX_LOGO_URL, USER_AVATAR_URL } from '../constants';

  /**
   * State variable to control the visibility of the navigation background
   *
   * @type {boolean}
   * @default false
   */
  let show: boolean = false;

  /**
   * Handles the scroll event to show/hide the navigation background
   *
   * @function
   * @description Sets the 'show' state to true when the user scrolls more than 100px
   * down the page, and false otherwise. This controls the visibility of the
   * navigation background.
   *
   * @returns {void}
   */
  function handleScroll(): void {
    show = window.scrollY > 10;
  }

  /**
   * Lifecycle hook that runs when the component is mounted to the DOM
   *
   * @function
   * @description Adds a scroll event listener to the window when the component
   * is mounted and removes it when the component is destroyed to prevent memory leaks.
   *
   * @returns {Function} Cleanup function that removes the event listener
   */
  onMount(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<nav class="nav">
  <div class="nav__container">
    <div class={show ? 'nav__main nav__main--black' : 'nav__main'}>
      <!-- Netflix Logo -->
      <img alt="Netflix Logo" class="nav__logo" src={NETFLIX_LOGO_URL} />

      <!-- Primary navigation -->
      <NavPrimary items={NAV_ITEMS} />

      <!-- Secondary navigation -->
      <NavSecondary avatarSrc={USER_AVATAR_URL} showNotifications={true} notificationCount={5} />
    </div>
  </div>
</nav>

<style>
  /* Root navigation element - fixed at the top of the viewport with minimum height */
  .nav {
    height: auto;
    min-height: 70px;
    position: fixed;
    top: 0px;
    z-index: 1;
  }

  /* Full-width container that spans the viewport - creates positioning context */
  .nav__container {
    background: transparent;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 1;
  }

  /* Main navigation bar with gradient background that fades to transparent */
  .nav__main {
    align-items: center;
    background-color: transparent;
    background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 10%, transparent);
    display: flex;
    font-size: 0.75rem;
    height: 41px;
    padding: 0 4%;
    position: relative;
    transition: background-color 0.4s;
  }

  /* Black background modifier applied when page is scrolled */
  .nav__main--black {
    background-color: #111;
  }

  /* Netflix logo styling - maintains aspect ratio with object-fit */
  .nav__logo {
    margin-right: 5px;
    object-fit: contain;
    width: 80px;
  }

  /* Responsive height adjustment for desktop viewports */
  @media screen and (min-width: 950px) {
    .nav__main {
      height: 68px;
    }
  }
</style>
