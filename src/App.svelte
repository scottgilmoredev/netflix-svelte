<script lang="ts">
  /**
   * Main Application Component
   *
   * @component
   * @description The root component of the Netflix clone application. Manages the overall
   * layout and coordinates the initialization of movie data. Renders the navigation bar,
   * banner, and movie rows, handling any potential errors during data fetching.
   *
   * @requires svelte
   * @requires ./components/Banner.svelte
   * @requires ./components/Nav.svelte
   * @requires ./components/Row.svelte
   * @requires ./stores/movieStore
   */

  import { onMount } from 'svelte';
  import Banner from './components/Banner.svelte';
  import Nav from './components/Nav.svelte';
  import { initializeMovies, error } from './stores/movieStore';
  import {
    actionMovies,
    bannerMovie,
    comedyMovies,
    horrorMovies,
    netflixOriginals,
    romanceMovies,
    topRated,
    trending,
  } from './stores/movieStore';

  /**
   * Lifecycle hook that runs when the component is mounted to the DOM
   *
   * @function
   * @description Initializes all movie data by calling the initializeMovies function
   * from the movieStore. This fetches data for all movie categories and sets up
   * the banner movie.
   */
  onMount(() => {
    initializeMovies();
  });
</script>

<div class="app">
  <!-- Fixed navigation bar -->
  <Nav />

  <!-- Featured content banner -->
  <Banner />

  <!-- Main content area with movie rows -->
  <main>
    {#if $error}
      <!-- Error message display if data fetching fails -->
      <div class="error-message">
        <p>Error: {$error}</p>
        <button on:click={initializeMovies}>Try Again</button>
      </div>
    {:else}
      <!-- Movie category rows -->
    {/if}
  </main>
</div>

<style>
  .app {
    background-color: #111;
  }

  .error-message {
    color: white;
    background-color: rgba(255, 0, 0, 0.3);
    padding: 20px;
    margin: 20px;
    border-radius: 4px;
    text-align: center;
  }

  .error-message button {
    background-color: #e50914;
    color: white;
    border: none;
    padding: 10px 20px;
    margin-top: 10px;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
