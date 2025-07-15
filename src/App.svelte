<script lang="ts">
  /**
   * Main Application Component
   *
   * @component
   * @description The root component of the application. Manages the overall
   * layout and coordinates the initialization of media data. Renders the navigation bar,
   * billboard, and media rows, handling any potential errors during data fetching.
   *
   * @requires svelte
   * @requires ./components/ui/billboard.svelte
   * @requires ./components/ui/ModalGlobal.svelte
   * @requires ./components/Nav.svelte
   * @requires ./components/Row.svelte
   * @requires module:@stores
   * @requires ./stores/mediaStore
   */

  import { onMount } from 'svelte';

  // Components
  import Billboard from '@/components/ui/Billboard.svelte';
  import ModalGlobal from '@/components/ui/ModalGlobal.svelte';
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
        <!-- Priority rows (fetch details on load) -->
        <Row mediaStore={continueWatching} priority showProgress />
        <Row mediaStore={topRated} isTopMedia priority />
        <Row mediaStore={netflixOriginals} priority />
        <Row mediaStore={trending} priority />

        <!-- Regular rows (fetch details on scroll) -->
        <Row mediaStore={documentaries} />
        <Row mediaStore={horrorMovies} />
        <Row mediaStore={comedyMovies} />
        <Row mediaStore={actionMovies} />
        <Row mediaStore={romanceMovies} />
      {/if}
    </main>

    <!-- Global UI components -->
    <ModalGlobal />
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
