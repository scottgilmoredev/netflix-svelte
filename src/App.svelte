<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import svelteLogo from './assets/svelte.svg';
  import viteLogo from '/vite.svg';
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

  // Initialize data on component mount
  onMount(async () => {
    try {
      await initializeMovies();

      const allStores = {
        actionMovies: get(actionMovies),
        bannerMovie: get(bannerMovie),
        comedyMovies: get(comedyMovies),
        horrorMovies: get(horrorMovies),
        netflixOriginals: get(netflixOriginals),
        romanceMovies: get(romanceMovies),
        topRated: get(topRated),
        trending: get(trending),
      };

      console.log('All store data:', allStores);
    } catch (err) {
      console.log('Current error store value:', get(error));
    }
  });
</script>

<main>
  <div>
    <a href="https://vite.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte</h1>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer"
      >SvelteKit</a
    >, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">Click on the Vite and Svelte logos to learn more</p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
