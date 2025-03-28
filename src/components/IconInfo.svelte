<script lang="ts">
  /**
   * IconInfo Component
   *
   * @component
   * @description A circular information icon used in buttons and UI elements
   *
   * @prop {string} [className=""] - Additional CSS classes to apply to the wrapper
   * @prop {string} [height="24"] - Height of the icon in pixels
   * @prop {string} [width="24"] - Width of the icon in pixels
   */

  /**
   * Props for the IconInfo component
   *
   * @typedef {Object} IconInfoProps
   * @property {string} [className=""] - Additional CSS classes to apply to the wrapper
   * @property {string} [height="24"] - Height of the icon in pixels
   * @property {string} [width="24"] - Width of the icon in pixels
   */
  interface IconInfoProps {
    className?: string;
    height?: string;
    width?: string;
  }

  export let className: IconInfoProps['className'] = '';
  export let height: IconInfoProps['height'] = '24';
  export let width: IconInfoProps['width'] = '24';
</script>

<div class={`info-icon ${className}`} role="presentation">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    role="img"
    viewBox="0 0 24 24"
    {width}
    {height}
    data-icon="CircleIStandard"
    aria-hidden="true"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
      fill="currentColor"
    />
  </svg>
</div>

<style>
  /* Container for the icon with flexible sizing */
  .info-icon {
    align-items: center;
    display: flex;
    justify-content: center;
  }
</style>
