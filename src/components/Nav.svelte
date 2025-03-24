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
   */

  import { onMount } from 'svelte';

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
    show = window.scrollY > 100;
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

<nav class={show ? 'nav nav__black' : 'nav'}>
  <!-- Netflix Logo -->
  <img
    class="nav__logo"
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/250px-Netflix_2015_logo.svg.png"
    alt="Netflix Logo"
  />

  <!-- User Avatar -->
  <img
    class="nav__avatar"
    src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/366be133850498.56ba69ac36858.png"
    alt="Avatar"
  />
</nav>

<style>
  .nav {
    position: fixed;
    top: 0;
    width: 100%;
    padding: 20px;
    height: 30px;
    z-index: 1;

    /* Animations */
    transition-timing-function: ease-in;
    transition: all 0.5s;
  }

  .nav__black {
    background-color: #111;
  }

  .nav__logo {
    position: fixed;
    left: 20px;
    width: 80px;
    object-fit: contain;
  }

  .nav__avatar {
    position: fixed;
    right: 20px;
    width: 30px;
    object-fit: contain;
  }
</style>
