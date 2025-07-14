<script lang="ts">
  /**
   * Image Component
   *
   * @component
   * @description A reusable image component that provides consistent image handling
   * across the application. Features automatic fallback to placeholder
   * images, built-in error handling, configurable sizing options, and accessibility
   * support. Supports both fixed dimensions for avatars/logos and responsive sizing
   * for media content. Includes proper TypeScript typing and follows project
   * documentation standards.
   *
   * @prop {string} src - Source URL for the image (required)
   * @prop {string} alt - Alt text for accessibility (required)
   * @prop {string} [className=""] - Additional CSS class names for custom styling
   * @prop {string | number} [width] - Fixed width in pixels or percentage
   * @prop {string | number} [height] - Fixed height in pixels or percentage
   * @prop {'cover' | 'contain' | 'fill' | 'none' | 'scale-down'} [objectFit='cover'] - CSS object-fit property
   * @prop {boolean} [responsive=false] - Whether to use responsive sizing (100% width/height)
   * @prop {boolean} [enableErrorHandling=true] - Whether to use built-in error handling
   *
   * @requires @constants
   * @requires @utils
   */

  // Constants
  import { PLACEHOLDER_URL } from '@constants';

  // Utils
  import { handleImageError } from '@utils';

  /**
   * Props interface for the Image component
   *
   * @interface ImageProps
   * @description Defines the type structure for all props accepted by the Image component.
   * Provides comprehensive configuration options for different image use cases throughout
   * the application, from small avatars to large hero images. Ensures type safety and
   * consistent API across all image implementations.
   *
   * @property {string} src - Source URL for the image, required for all instances
   * @property {string} alt - Alt text for screen readers and accessibility compliance
   * @property {string} [className] - CSS classes for styling customization and theme integration
   * @property {boolean} [enableErrorHandling] - Error handling toggle for fallback behavior
   * @property {string | number} [height] - Fixed height dimension for precise sizing control
   * @property {'cover' | 'contain' | 'fill' | 'none' | 'scale-down'} [objectFit] - CSS object-fit behavior
   * @property {boolean} [responsive] - Responsive sizing flag for fluid layouts
   * @property {string | number} [width] - Fixed width dimension for precise sizing control
   */
  interface ImageProps {
    alt?: string;
    src: string;
    className?: string;
    enableErrorHandling?: boolean;
    height?: string | number;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    responsive?: boolean;
    width?: string | number;
  }

  // Required props
  export let src: ImageProps['src'];
  export let alt: ImageProps['alt'];

  // Optional props with defaults
  export let className: ImageProps['className'] = '';
  export let enableErrorHandling: ImageProps['enableErrorHandling'] = true;
  export let height: ImageProps['height'] = undefined;
  export let objectFit: ImageProps['objectFit'] = 'cover';
  export let responsive: ImageProps['responsive'] = false;
  export let width: ImageProps['width'] = undefined;

  $: imageSrc = src || PLACEHOLDER_URL;

  /**
   * Computed inline styles for the image element
   *
   * @description Dynamically generates CSS styles based on component props.
   * Handles both fixed dimensions and responsive sizing modes. Applies object-fit
   * property for consistent image scaling behavior. Provides flexibility for
   * different image use cases while maintaining consistent styling patterns.
   *
   * @type {string}
   */
  $: imageStyles = [
    width !== undefined ? `width: ${typeof width === 'number' ? width + 'px' : width}` : '',
    height !== undefined ? `height: ${typeof height === 'number' ? height + 'px' : height}` : '',
    `object-fit: ${objectFit}`,
  ]
    .filter(Boolean)
    .join('; ');

  /**
   * Handles image loading errors with optional error handling
   *
   * @function handleError
   * @description Processes image loading errors by delegating to the utility function
   * when error handling is enabled. Provides consistent error handling behavior
   * across all image instances while allowing opt-out for special cases.
   *
   * @param {Event} event - The error event from the image element
   *
   * @returns {void}
   *
   * @example
   * // Error handling is enabled by default
   * <Image src={brokenUrl || "/placeholder.svg"} alt="Broken image" />
   *
   * @example
   * // Disable error handling for special cases
   * <Image src={specialUrl || "/placeholder.svg"} alt="Special image" enableErrorHandling={false} />
   */
  function handleError(event: Event): void {
    if (enableErrorHandling) {
      handleImageError(event);
    }
  }
</script>

<img
  {alt}
  class="image {className} {responsive ? 'image--responsive' : ''}"
  src={imageSrc || '/placeholder.svg'}
  style={imageStyles}
  on:error={handleError}
/>

<style>
  /* Base image element with consistent defaults */
  .image {
    display: block;
    height: auto;
    max-width: 100%;
  }

  /* Element: Responsive image variant for fluid layouts */
  .image--responsive {
    height: 100%;
    width: 100%;
  }
</style>
