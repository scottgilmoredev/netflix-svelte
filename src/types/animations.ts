/**
 * Animation System Type Definitions
 *
 * @module
 * @description Provides comprehensive type definitions for the animation system throughout
 * the application. Defines types for CSS easing functions, animatable properties, and animation
 * step configurations. Ensures type safety and consistency across all animation-related
 * components and utilities.
 *
 * The module includes type definitions for:
 * - CSS easing function specifications with cubic-bezier support
 * - Animatable CSS property names with extensibility
 * - Animation step configuration objects for sequencing
 */

/**
 * CSS property names that can be animated
 *
 * @type {AnimatableProperty}
 * @description Common CSS properties that support transitions and animations.
 * Includes the most frequently used animatable properties while allowing
 * extensibility through string union. Provides type safety for property
 * names in animation utilities and transition configurations.
 *
 * @example
 * // Using predefined animatable properties
 * const property1: AnimatableProperty = 'opacity';
 * const property2: AnimatableProperty = 'transform';
 * const property3: AnimatableProperty = 'background-color';
 *
 * @example
 * // Using custom property names
 * const customProperty: AnimatableProperty = 'border-radius';
 * const vendorProperty: AnimatableProperty = '-webkit-transform';
 */
export type AnimatableProperty =
  | 'opacity'
  | 'transform'
  | 'width'
  | 'height'
  | 'background-color'
  | 'color'
  | 'border-color'
  | 'box-shadow'
  | 'filter'
  | string; // Allow other properties

/**
 * Animation step configuration interface
 *
 * @interface AnimationStep
 * @description Configuration object for individual animation steps in a sequence.
 * Defines the structure for animation steps including callback functions and
 * timing delays. Used by animation sequencing utilities to orchestrate complex
 * multi-step animations with precise timing control.
 *
 * @property {() => void} callback - Function to execute for this animation step
 * @property {number} delay - Delay in milliseconds before executing this step
 *
 * @example
 * // Creating animation steps for a sequence
 * const fadeInStep: AnimationStep = {
 *   callback: () => element.style.opacity = '1',
 *   delay: 100
 * };
 *
 * const scaleStep: AnimationStep = {
 *   callback: () => element.style.transform = 'scale(1.1)',
 *   delay: 200
 * };
 *
 * @example
 * // Using animation steps in a sequence
 * const animationSequence: AnimationStep[] = [
 *   { callback: () => showElement(), delay: 0 },
 *   { callback: () => animateIn(), delay: 50 },
 *   { callback: () => completeAnimation(), delay: 300 }
 * ];
 */
export interface AnimationStep {
  readonly callback: () => void;
  readonly delay: number;
}

/**
 * CSS easing function type
 *
 * @type {CSSEasing}
 * @description Valid CSS easing function strings including predefined keywords and
 * cubic-bezier functions. Provides type safety for animation timing functions and
 * ensures only valid CSS easing values are used throughout the animation system.
 * Supports both standard easing keywords and custom cubic-bezier curves.
 *
 * @example
 * // Using predefined easing functions
 * const easing1: CSSEasing = 'ease-in-out';
 * const easing2: CSSEasing = 'linear';
 *
 * @example
 * // Using custom cubic-bezier easing
 * const customEasing: CSSEasing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
 * const bounceEasing: CSSEasing = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';
 */
export type CSSEasing =
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'linear'
  | `cubic-bezier(${number}, ${number}, ${number}, ${number})`;
