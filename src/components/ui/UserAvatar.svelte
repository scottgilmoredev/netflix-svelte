<script lang="ts">
  /**
   * UserAvatar Component
   *
   * @component
   * @description A user avatar image component used in the navigation bar
   *
   * @prop {string} [alt="User avatar"] - Alt text for the avatar image
   * @prop {string} [className=""] - Additional CSS classes to apply to the avatar
   * @prop {string} [height="32"] - Height of the avatar in pixels
   * @prop {string} src - Source URL for the avatar image
   * @prop {string} [width="32"] - Width of the avatar in pixels
   */

  /**
   * Props for the UserAvatar component
   *
   * @typedef {Object} UserAvatarProps
   * @property {string} [alt="User avatar"] - Alt text for the avatar image
   * @property {string} [className=""] - Additional CSS classes to apply to the avatar
   * @property {string} [height="32"] - Height of the avatar in pixels
   * @property {string} src - Source URL for the avatar image
   * @property {string} [width="32"] - Width of the avatar in pixels
   */
  interface UserAvatarProps {
    alt?: string;
    className?: string;
    height?: string;
    src: string;
    width?: string;
  }

  export let src: UserAvatarProps['src'];
  export let alt: UserAvatarProps['alt'] = 'User avatar';
  export let width: UserAvatarProps['width'] = '32';
  export let height: UserAvatarProps['height'] = '32';
  export let className: UserAvatarProps['className'] = '';
</script>

<div class="nav__avatar-wrapper">
  <img src={src || '/placeholder.svg'} {alt} {width} {height} class={`nav__avatar ${className}`} />
</div>

<style>
  /* Container for the avatar image */
  .nav__avatar-wrapper {
    display: block;
    font-size: 12px;
    position: relative;
    z-index: 0;
    align-items: center;
    display: flex;
    width: 100%;
    height: 40px;
  }

  /* Avatar image styling with rounded corners */
  .nav__avatar {
    border-radius: 4px;
    height: 32px;
    vertical-align: middle;
    width: 32px;
    object-fit: cover;
  }

  @media screen and (min-width: 950px) {
    .nav__avatar-wrapper {
      height: 32px;
    }
  }
</style>
