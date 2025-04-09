<script lang="ts">
  /**
   * Global Modal Component
   *
   * @component
   * @description A global modal component that displays content from movie stores.
   * Subscribes to the modalStore to determine when to show and what content to display.
   * Features smooth transitions, keyboard navigation, and responsive grid layout.
   *
   * @requires svelte
   * @requires svelte/store
   * @requires svelte/transition
   * @requires ../actions/portal
   * @requires ./media/MediaItemBase.svelte
   * @requires module:@stores
   * @requires module:@types
   */

  import { onDestroy } from 'svelte';
  import type { Unsubscriber } from 'svelte/store';
  import { fade, scale } from 'svelte/transition';

  // Actions
  import { portal } from '@actions/portal';

  // Components
  import MediaItemBase from './media/MediaItemBase.svelte';

  // Stores
  import { modalStore, closeModal } from '@stores';

  // Types
  import type { AnyMedia, MediaStore } from '@types';

  // Local state
  let media: AnyMedia[] = [];
  let isOpen: boolean = false;
  let currentStore: MediaStore | null = null;
  let displayTitle: string = '';

  /**
   * Subscribe to the modal store to handle modal state changes
   *
   * @description Subscribes to the modal store to receive updates when the modal state changes.
   * Updates local state variables and manages body scroll locking.
   *
   * @type {Unsubscriber}
   */
  const modalStoreUnsubscribe: Unsubscriber = modalStore.subscribe((state) => {
    isOpen = state.isOpen;
    currentStore = state.store;
    displayTitle = currentStore?.displayTitle || '';

    // Handle body scroll locking
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // Subscribe to the current store when it changes
    if (currentStore && isOpen) {
      if (storeUnsubscribe) storeUnsubscribe();

      storeUnsubscribe = currentStore.subscribe((value) => {
        media = value;
      });
    }
  });

  /**
   * Unsubscribe function for the current media store subscription
   *
   * @type {Unsubscriber|null}
   */
  let storeUnsubscribe: Unsubscriber | null = null;

  /**
   * Handles clicks on the backdrop
   *
   * @function handleBackdropClick
   * @description Closes the modal when the user clicks outside the modal content
   *
   * @param {MouseEvent} event - The click event
   */
  function handleBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  /**
   * Handles keyboard events
   *
   * @function handleKeydown
   * @description Closes the modal when the user presses the Escape key
   *
   * @param {KeyboardEvent} event - The keyboard event
   */
  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  /**
   * Clean up subscriptions when component is destroyed
   *
   * @function
   * @description Unsubscribes from all store subscriptions and cleans up resources
   * to prevent memory leaks when the component is unmounted.
   */
  onDestroy(() => {
    if (storeUnsubscribe) storeUnsubscribe();
    modalStoreUnsubscribe();

    // Ensure body scroll is restored when component is destroyed
    document.body.style.overflow = '';
  });
</script>

<!-- Listen for keyboard events when modal is open -->
<svelte:window on:keydown={isOpen ? handleKeydown : null} />

{#if isOpen}
  <!-- Modal backdrop - covers the entire screen and handles click-outside -->
  <div
    use:portal
    class="modal-backdrop"
    role="button"
    tabindex="0"
    transition:fade={{ duration: 300 }}
    on:click={handleBackdropClick}
    on:keydown={handleKeydown}
  >
    <!-- Modal container - holds the actual content -->
    <div
      aria-labelledby="modal-title"
      aria-modal="true"
      class="modal"
      role="dialog"
      transition:scale={{ duration: 450, start: 0 }}
    >
      <!-- Modal header with title and close button -->
      <div class="modal__header">
        <!-- Close button -->
        <button class="modal__close" aria-label="Close modal" on:click={closeModal}>
          &times;
        </button>

        <!-- Modal title -->
        <h2 id="modal-title" class="modal__title">
          {displayTitle}
        </h2>
      </div>

      <!-- Modal content area - scrollable container for media items -->
      <div class="modal__content">
        {#if media && media.length > 0}
          <!-- Grid layout for media items -->
          <div class="modal__grid">
            {#each media as movie (movie.id)}
              <MediaItemBase data={movie} width={100} />
            {/each}
          </div>
        {:else}
          <!-- Empty state when no content is available -->
          <p>No content available</p>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  /* Modal backdrop - full screen overlay with semi-transparent background */
  .modal-backdrop {
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    overflow-y: auto;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 12;
  }

  /* Modal container - holds all modal content */
  .modal {
    background-color: #181818;
    border-radius: 4px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    color: #fff;
    display: flex;
    flex-direction: column;
    max-width: 80vw;
    min-height: 100vh;
    position: absolute;
    top: 2rem;
    transform-origin: 50% 12.5%; /* Origin point for scale animation */
    width: 80vw;
  }

  /* Modal header - contains title and close button */
  .modal__header {
    align-items: center;
    display: flex;
    height: 7rem;
    justify-content: center;
    position: relative;
    padding: 40px 20px 16px;
  }

  /* Modal title styling */
  .modal__title {
    font-size: 2rem;
    font-weight: 900;
    padding: 0px 6%;
  }

  /* Close button styling */
  .modal__close {
    align-items: center;
    background: none;
    border-radius: 50%;
    border: none;
    color: #999;
    cursor: pointer;
    display: flex;
    font-size: 1.8rem;
    height: 30px;
    justify-content: center;
    margin: 0;
    padding: 0;
    position: absolute;
    right: 10px;
    top: 10px;
    width: 30px;
  }

  /* Close button hover state */
  .modal__close:hover {
    background-color: rgb(24, 24, 24);
    color: #fff;
  }

  /* Close button focus state for accessibility */
  .modal__close:focus {
    border: 2px solid #fff;
  }

  /* Modal content area - scrollable container */
  .modal__content {
    flex: 1;
    padding: 20px var(--slider-padding-left-right) var(--slider-padding-left-right);
    overflow-y: auto;
  }

  /* Grid layout for media items */
  .modal__grid {
    display: grid;
    gap: 4vw var(--item-gap);
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    width: 100%;
  }
</style>
