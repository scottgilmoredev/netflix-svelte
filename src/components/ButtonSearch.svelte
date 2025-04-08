<script lang="ts">
  /**
   * ButtonSearch Component
   *
   * @component
   * @description A button that displays a search icon and handles search functionality.
   * Wraps the IconSearch component with additional styling and behavior.
   *
   * @prop {string} [className=''] - Additional CSS class to apply to the component
   *
   * @requires ./IconSearch
   */

  import IconSearch from './IconSearch.svelte';

  /**
   * Props for the ButtonSearch component
   *
   * @interface ButtonSearchProps
   * @property {string} [className=''] - Additional CSS class to apply to the component
   */
  interface ButtonSearchProps {
    className?: string;
  }

  // TODO: Build out the search functionality
  export let className: ButtonSearchProps['className'] = '';
</script>

<div class={`nav__search ${className}`}>
  <IconSearch className="nav__search-icon" />
</div>
