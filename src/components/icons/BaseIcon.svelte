<script lang="ts">
  /**
   * BaseIcon Component
   *
   * @component
   * @description A base component for rendering SVG icons using path data from the icon registry.
   * This component handles the common SVG structure and attributes, while the specific path
   * data is retrieved from the ICON_PATHS registry based on the provided name.
   *
   * @prop {keyof typeof ICON_PATHS} name - The name of the icon to render from the ICON_PATHS registry
   * @prop {string} [width="24"] - Width of the icon in pixels
   * @prop {string} [height="24"] - Height of the icon in pixels
   * @prop {string} [className=""] - Additional CSS classes to apply to the SVG
   *
   * @requires module:@constants
   */

  import { ICON_PATHS } from '@constants';

  /**
   * Props for the BaseIcon component
   *
   * @interface BaseIconProps
   * @property {keyof typeof ICON_PATHS} name - The name of the icon to render
   * @property {string} [width="24"] - Width of the icon in pixels
   * @property {string} [height="24"] - Height of the icon in pixels
   * @property {string} [className=""] - Additional CSS classes to apply to the SVG
   */
  interface BaseIconProps {
    className?: string;
    height?: string;
    name: keyof typeof ICON_PATHS;
    width?: string;
  }

  export let className: BaseIconProps['className'] = '';
  export let height: BaseIconProps['height'] = '24';
  export let name: BaseIconProps['name'];
  export let width: BaseIconProps['width'] = '24';

  $: path = ICON_PATHS[name]?.path || '';
  $: viewBox = ICON_PATHS[name]?.viewBox || '0 0 24 24';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  role="img"
  {viewBox}
  {width}
  {height}
  data-icon={name}
  aria-hidden="true"
  class={className}
>
  {#if path}
    <path fill-rule="evenodd" clip-rule="evenodd" d={path} fill="currentColor" />
  {/if}
</svg>
