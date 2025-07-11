import type { VFile } from 'vfile';

/**
 * Process org-mode keywords and extract metadata for frontmatter
 * Handles date parsing, filetags normalization, and slug generation
 */
export const processFrontmatter = () => {
  return (_tree: unknown, file: VFile) => {
    const keywords = (file.data.keywords as Record<string, any>) || {};

    // Parse org-mode date format [YYYY-MM-DD Day HH:MM]
    if (keywords.date && typeof keywords.date === 'string') {
      const dateMatch = keywords.date
        .match(/\[(\d{4}-\d{2}-\d{2}) (\w{3}) (\d{2}:\d{2})\]/);
      if (dateMatch) {
        const [, datePart, , timePart] = dateMatch;
        const date = new Date(`${datePart}T${timePart}`);
        keywords.date = date;
      }
    }

    // Normalize filetags to array format
    keywords.filetags = Array.isArray(keywords.filetags)
      ? keywords.filetags
      : typeof keywords.filetags === 'string'
        ? keywords.filetags.split(':').filter(Boolean)
        : [];

    // Extract slug from filename (simple .org removal)
    const fileName = file.history[0]?.split('/').pop() || '';
    const slug = fileName.replace('.org', '');

    // Ensure astro frontmatter structure exists
    if (!file.data.astro) {
      file.data.astro = { frontmatter: {} };
    }

    // Merge keywords and slug into frontmatter
    file.data.astro.frontmatter = {
      ...file.data.astro.frontmatter,
      ...keywords,
      slug,
    };
  };
}
