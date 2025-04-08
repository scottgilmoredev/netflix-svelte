<script lang="ts">
  /**
   * IconSearch Component
   *
   * @component
   * @description A magnifying glass icon used for search functionality
   *
   * @prop {string} [width="24"] - Width of the icon in pixels
   * @prop {string} [height="24"] - Height of the icon in pixels
   * @prop {string} [className=""] - Additional CSS classes to apply to the SVG
   */

  /**
   * Props for the IconSearch component
   *
   * @typedef {Object} IconSearchProps
   * @property {string} [width="24"] - Width of the icon in pixels
   * @property {string} [height="24"] - Height of the icon in pixels
   * @property {string} [className=""] - Additional CSS classes to apply to the SVG
   */
  interface IconSearchProps {
    width?: string;
    height?: string;
    className?: string;
  }

  export let width: IconSearchProps['width'] = '24';
  export let height: IconSearchProps['height'] = '24';
  export let className: IconSearchProps['className'] = '';
</script>

<div class="nav__search">
  <span class="nav.nav__search-icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      role="img"
      viewBox="0 0 24 24"
      {width}
      {height}
      data-icon="MagnifyingGlassStandard"
      aria-hidden="true"
      class={`nav__search-icon ${className}`}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10ZM15.6177 17.0319C14.078 18.2635 12.125 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 12.125 18.2635 14.078 17.0319 15.6177L22.7071 21.2929L21.2929 22.7071L15.6177 17.0319Z"
        fill="currentColor"
      />
    </svg>
  </span>
</div>

<style>
  .nav__search {
    display: inline-block;
    vertical-align: middle;
  }

  .nav__search-icon {
    background: transparent;
    border: none;
    /* cursor: pointer; */
    display: inline-block;
  }
</style>
