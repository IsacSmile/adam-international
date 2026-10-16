import { universities } from '../data/universities.js';
import { SHOW_PLACEHOLDERS } from './contentFlags.js';

/**
 * Returns all universities visible under current environment flags.
 * Rule: clientListed === true || SHOW_PLACEHOLDERS
 */
export function getVisibleUniversities() {
  return universities.filter(
    (u) => u.clientListed === true || Boolean(SHOW_PLACEHOLDERS)
  );
}

/**
 * Returns a single visible university by slug, or null if not found or hidden.
 */
export function getVisibleUniversityBySlug(slug) {
  if (!slug) return null;
  const visible = getVisibleUniversities();
  return visible.find((u) => u.slug.toLowerCase() === slug.toLowerCase()) || null;
}

/**
 * Featured countries order per prompt Section 1.2 / 2.4:
 * Bulgaria, Hungary, Latvia, Lithuania, Malta, Slovakia, Slovenia, Spain, Sweden
 */
export const FEATURED_COUNTRY_SLUGS = [
  'bulgaria',
  'hungary',
  'latvia',
  'lithuania',
  'malta',
  'slovakia',
  'slovenia',
  'spain',
  'sweden',
];

/**
 * Sorts or prioritizes a list of universities by placing featured countries first
 * (in the explicit featured order), then the rest.
 */
export function sortUniversitiesFeaturedFirst(uniList) {
  return [...uniList].sort((a, b) => {
    const aIdx = FEATURED_COUNTRY_SLUGS.indexOf(a.country);
    const bIdx = FEATURED_COUNTRY_SLUGS.indexOf(b.country);
    const aIsFeatured = aIdx !== -1;
    const bIsFeatured = bIdx !== -1;

    if (aIsFeatured && bIsFeatured) {
      return aIdx - bIdx;
    }
    if (aIsFeatured && !bIsFeatured) return -1;
    if (!aIsFeatured && bIsFeatured) return 1;

    // Both non-featured: sort alphabetically by name
    return a.name.localeCompare(b.name);
  });
}
