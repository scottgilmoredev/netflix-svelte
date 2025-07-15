<script lang="ts">
  /**
   * ModalPreviewEvidenceTags Component
   *
   * @component
   * @description Displays a list of evidence tags based on media genres and type with bullet
   * point separators. Combines genre information and media type into a cohesive visual
   * representation of content metadata. The component automatically filters out empty values
   * and renders tags in a flexible layout that adapts to content length. Each tag after the
   * first is preceded by a bullet separator for clear visual distinction while maintaining
   * readability and accessibility.
   *
   * @prop {Array<{ name: string }>} [genres=[]] - Array of genre objects containing name properties
   * @prop {string} [type=""] - Media type string (e.g., "Movie", "TV Series", "Documentary")
   *
   * @requires ../../types/media
   */

  import type { Genre } from '@types';

  /**
   * Props for the ModalPreviewEvidenceTags component
   *
   * @interface {Object} ModalPreviewEvidenceTagsProps
   * @property {Array<Genre>} [genres] - Array of genre objects with name properties
   */
  interface ModalPreviewEvidenceTagsProps {
    genres?: Genre[];
  }

  export let genres: ModalPreviewEvidenceTagsProps['genres'] = [];

  let evidenceTags: string[];

  /**
   * Reactive statement for combining and filtering evidence data
   *
   * @description Processes the genres prop to create a unified array of evidence
   * tags for display. Extracts genre names from the genre objects
   * and filters out any falsy values (empty strings, null, undefined) to ensure only
   * meaningful content is rendered. This reactive statement automatically updates whenever
   * the input props change, maintaining synchronization with parent component data.
   *
   * @example
   * // With genres
   * genres = [{ name: "Action" }, { name: "Drama" }];
   * // Result: ["Action", "Drama"]
   */
  $: evidenceTags = (genres?.map((genre) => genre.name) || []).filter(Boolean);
</script>

{#if evidenceTags.length > 0}
  <div class="evidence-tags">
    <div class="evidence-tags__list">
      {#each evidenceTags as tag, index}
        <div class="evidence-tags__item">
          {#if index > 0}
            <span class="evidence-tags__separator" aria-hidden="true" />
          {/if}

          <!-- Evidence tag text -->
          <span>{tag}</span>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  /* Block: Main evidence tags container */
  .evidence-tags {
    margin-bottom: 0.5em;
    opacity: 0;
  }

  /* Element: List container with flexible layout */
  .evidence-tags__list {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-items: flex-start;
    margin: 0;
    padding: 0;
  }

  /* Element: Individual tag item container */
  .evidence-tags__item {
    display: flex;
    align-items: center;
    padding-right: 0.5vw;
  }

  /* Element: Bullet separator between tags */
  .evidence-tags__separator:before {
    color: #646464;
    content: '\2022';
    display: inline-block;
    padding-right: 0.5vw;
  }
</style>
