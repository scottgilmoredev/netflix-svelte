import App from './App.svelte';

/**
 * Initializes the main Svelte Netflix application
 *
 * @description Creates a new instance of the App component and mounts it to the DOM.
 * This is the entry point of the Svelte Netflix application.
 *
 * @constant {App} app
 * @property {HTMLElement} target - The DOM element where the app will be mounted
 *
 * @note The app is mounted to the document body, making it a full-page application.
 * If you need to mount it to a specific element, you can change the target.
 *
 * @see {@link https://svelte.dev/docs#run-time-client-side-component-api-creating-a-component Svelte documentation}
 */
const app = new App({
  target: document.body,
});

export default app;
