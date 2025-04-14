<script lang="ts">
  /**
   * Icon Component
   *
   * @component
   * @description A unified icon component that selects the appropriate specialized or base
   * icon component based on the icon name. This provides a consistent API for all icons
   * while supporting specialized behavior for certain icons.
   *
   * @prop {IconName | SpecialIconName} name - The name of the icon to render
   * @prop {any} [props] - Additional props to pass to the icon component
   *
   * @requires module:@types
   * @requires ./registry/iconRegistry
   */

  // Registry
  import { getIconComponent, isSpecialIcon } from './registry/iconRegistry';

  // Types
  import type { IconName, SpecialIconName } from '@types';

  /**
   * Props for the Icon component
   *
   * @interface IconProps
   * @property {IconName | SpecialIconName} name - The name of the icon to render
   * @property {any} [key: string] - Additional props to pass to the icon component
   */
  interface IconProps {
    name: IconName | SpecialIconName;
    [key: string]: any; // For additional props
  }

  export let name: IconProps['name'];

  /**
   * Extract all other props to pass to the component
   *
   * @description Separates the name prop from all other props to allow
   * proper forwarding to the underlying component.
   */
  const { name: _, ...restProps } = $$props;

  /**
   * Get the appropriate component based on the icon name
   *
   * @description Uses the getIconComponent function to determine which
   * specialized or base icon component should be rendered.
   */
  const IconComponent = getIconComponent(name);

  /**
   * Reactive declaration for component props
   *
   * @description Prepares the props to pass to the selected icon component.
   * Currently, we pass the name to all components, but this could be modified
   * to conditionally pass props based on component type.
   *
   * Note: The conditional logic using isSpecialIcon is commented out as we're
   * currently using a simpler approach of passing name to all components.
   */
  $: componentProps = isSpecialIcon(name) ? restProps : { name, ...restProps };
</script>

<!-- 
  Dynamically render the appropriate icon component with the prepared props.
  This allows for a unified API while supporting specialized icon behavior.
-->
<svelte:component this={IconComponent} {...componentProps} />
