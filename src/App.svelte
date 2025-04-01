<script lang="ts">
  /**
   * Main Application Component
   *
   * @component
   * @description The root component of the Netflix clone application. Manages the overall
   * layout and coordinates the initialization of movie data. Renders the navigation bar,
   * billboard, and movie rows, handling any potential errors during data fetching.
   *
   * @requires svelte
   * @requires ./components/billboard.svelte
   * @requires ./components/Nav.svelte
   * @requires ./components/Row.svelte
   * @requires ./stores/movieStore
   */

  import { onMount } from 'svelte';

  // Components
  import Billboard from './components/Billboard.svelte';
  import Nav from './components/Nav.svelte';
  import Row from './components/Row.svelte';

  // Stores
  import { continueWatching } from './stores/continueWatchingStore';
  import { initializeMovies, error } from './stores/movieStore';
  import {
    actionMovies,
    comedyMovies,
    documentaries,
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
   * the billboard movie.
   */
  onMount(() => {
    initializeMovies();
  });
</script>

<div class="app">
  <!-- Fixed navigation bar -->
  <Nav />

  <!-- Featured content billboard -->
  <Billboard />

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
      <Row title="Continue Watching" showProgress movies={$continueWatching} />
      <Row title="Top 10 Movies in the U.S. Today" isTopMovies movies={$topRated} />
      <Row title="Only on Netflix" movies={$netflixOriginals} />
      <Row title="Trending Now" movies={$trending} />
      <Row title="Documentaries" movies={$documentaries} />
      <Row title="Horror" movies={$horrorMovies} />
      <Row title="Comedy" movies={$comedyMovies} />
      <Row title="Action" movies={$actionMovies} />
      <Row title="Romance" movies={$romanceMovies} />
    {/if}
  </main>
</div>

<style>
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
