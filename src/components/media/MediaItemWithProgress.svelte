<script lang="ts">
  /**
   * Media Item With Progress Component
   *
   * @component
   * @description Extends the MediaItemBase component with a progress bar
   * for the "Continue Watching" section. Displays how much of the content the
   * user has already watched with a horizontal progress indicator.
   *
   * @prop {string} className - Additional CSS class names to apply to the component
   * @prop {AnyMedia | null} data - The movie or TV show data to display, including progress
   * @prop {number} width - The width of the component as a percentage
   *
   * @requires ./MediaItemBase.svelte
   * @requires ./ProgressBar.svelte
   * @requires module:@constants
   * @requires module:@types
   */

  // Constants
  import { MEDIA_ITEM_DEFAULTS } from '@constants';

  // Components
  import MediaItemBase from './MediaItemBase.svelte';
  import ProgressBar from './ProgressBar.svelte';

  // Types
  import type { BaseMediaItemProps } from '@types';

  export let className: BaseMediaItemProps['className'] = MEDIA_ITEM_DEFAULTS.className;
  export let data: BaseMediaItemProps['data'] = MEDIA_ITEM_DEFAULTS.data;
  export let width: BaseMediaItemProps['width'] = MEDIA_ITEM_DEFAULTS.width;

  $: progressPercentage = data && 'progress' in data ? data.progress : 0;
</script>

<MediaItemBase {className} {data} {width}>
  <!-- Progress bar -->
  <ProgressBar percentage={progressPercentage} />
</MediaItemBase>
