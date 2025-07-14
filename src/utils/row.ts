import { get } from 'svelte/store';
import type { Unsubscriber } from 'svelte/store';

// Stores
import { createSliderStore } from '@stores';

// Types
import type { MediaStore, ResponsiveItemsStore, SliderStore } from '@types';

/**
 * Sets up all stores needed for a row component
 *
 * @param mediaStore The store containing media items
 * @param itemsToDisplay The responsive items store
 * @returns An object containing the slider store and cleanup function
 */
export function setupRowStores(
  mediaStore: MediaStore,
  itemsToDisplay: ResponsiveItemsStore
): {
  sliderStore: SliderStore;
  cleanup: () => void;
} {
  // Get the current value from the store
  const initialCount = get(itemsToDisplay);

  // Initialize with empty array and current count
  const sliderStore = createSliderStore([], initialCount);

  // Update slider store when media store changes
  const mediaStoreUnsubscribe: Unsubscriber = mediaStore.subscribe((media) => {
    sliderStore.state.update((s) => ({
      ...s,
      media,
    }));
  });

  // Update slider store when responsive items change
  const itemsUnsubscribe: Unsubscriber = itemsToDisplay.subscribe((count) => {
    sliderStore.state.update((s) => ({
      ...s,
      itemsToDisplayInRow: count,
    }));
  });

  // Return the store and cleanup function
  return {
    sliderStore,
    cleanup: () => {
      mediaStoreUnsubscribe();
      itemsUnsubscribe();
      itemsToDisplay.destroy();
    },
  };
}
