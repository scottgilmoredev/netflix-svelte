/**
 * Error Utilities Module
 *
 * @module
 * @description Provides utility functions for handling errors and error states.
 * Includes handlers for common error scenarios like image loading failures.
 *
 * @requires ../constants
 */

// Constants
import { PLACEHOLDER_URL } from '../constants';

/**
 * Handles image loading errors by replacing with a placeholder
 *
 * @function handleImageError
 * @description Event handler that replaces a failed image with a placeholder image.
 * Used as an error handler for image elements to ensure a fallback is displayed.
 *
 * @param {Event} event - The error event from the image element
 * @returns {void}
 *
 * @example
 * // In a Svelte component
 * <img
 *   src={imageUrl || "/placeholder.svg"}
 *   alt="Movie poster"
 *   on:error={handleImageError}
 * />
 */
export function handleImageError({ target }: Event): void {
  if (target instanceof HTMLImageElement) {
    target.src = PLACEHOLDER_URL;
  }
}
