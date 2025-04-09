<script lang="ts">
  /**
   * Main Application Component
   *
   * @component
   * @description The root component of the Netflix clone application. Manages the overall
   * layout and coordinates the initialization of media data. Renders the navigation bar,
   * billboard, and media rows, handling any potential errors during data fetching.
   *
   * @requires svelte
   * @requires ./components/billboard.svelte
   * @requires ./components/GlobalModal.svelte
   * @requires ./components/Nav.svelte
   * @requires ./components/Row.svelte
   * @requires module:@stores
   * @requires ./stores/mediaStore
   */

  import { onMount } from 'svelte';

  // Components
  import Billboard from '@components/Billboard.svelte';
  import GlobalModal from '@components/GlobalModal.svelte';
  import Nav from '@components/nav/Nav.svelte';
  import Row from '@components/slider/Row.svelte';

  // Stores
  import { continueWatching, error, initializeMedia } from '@stores';
  import {
    actionMovies,
    comedyMovies,
    documentaries,
    horrorMovies,
    netflixOriginals,
    romanceMovies,
    topRated,
    trending,
  } from '@stores/mediaStore';

  /**
   * Lifecycle hook that runs when the component is mounted to the DOM
   *
   * @function
   * @description Initializes all media data by calling the initializeMedia function
   * from the mediaStore. This fetches data for all media categories and sets up
   * the billboard media.
   */
  onMount(() => {
    initializeMedia();
  });
</script>

<div class="app">
  <!-- Fixed navigation bar -->
  <Nav />

  <!-- Featured content billboard -->
  <Billboard />

  <!-- Main content area with media rows -->
  <main>
    {#if $error}
      <!-- Error message display if data fetching fails -->
      <div class="error-message">
        <p>Error: {$error}</p>
        <button on:click={initializeMedia}>Try Again</button>
      </div>
    {:else}
      <!-- Movie category rows -->
      <Row mediaStore={continueWatching} showProgress />
      <Row mediaStore={topRated} isTopMedia />
      <Row mediaStore={netflixOriginals} />
      <Row mediaStore={trending} />
      <Row mediaStore={documentaries} />
      <Row mediaStore={horrorMovies} />
      <Row mediaStore={comedyMovies} />
      <Row mediaStore={actionMovies} />
      <Row mediaStore={romanceMovies} />
    {/if}
  </main>

  <!-- Global modal component -->
  <GlobalModal />
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
