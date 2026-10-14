import { countries } from '../../src/data/countries.js';
import { services } from '../../src/data/services.js';
import { branches } from '../../src/data/branches.js';
import { universities } from '../../src/data/universities.js';

export { countries, services, branches, universities };

export const allowedCountryNames = countries.map((c) => c.name);
export const allowedCountrySlugs = countries.map((c) => c.slug);
export const allowedCountries = [...allowedCountryNames, 'Not sure yet'];

export const allowedServiceTitles = services.map((s) => s.title);
export const allowedServiceSlugs = services.map((s) => s.slug);
export const allowedServices = [...allowedServiceTitles, 'Not sure yet'];

export const allowedBranchNames = branches.map((b) => (typeof b === 'object' ? b.name : b));
export const allowedBranches = [...allowedBranchNames, 'Not sure yet'];
export const allowedUniversitySlugs = universities.map((u) => u.slug);

/**
 * Sanitizes country input.
 * Allowed: country name, country slug, or 'Not sure yet'.
 * Returns canonical country name or 'Not sure yet', otherwise null.
 */
export function sanitizeCountry(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.toLowerCase() === 'not sure yet') return 'Not sure yet';

  const match = countries.find(
    (c) =>
      c.name.toLowerCase() === trimmed.toLowerCase() ||
      c.slug.toLowerCase() === trimmed.toLowerCase()
  );
  return match ? match.name : null;
}

/**
 * Sanitizes service input.
 * Allowed: service title, service slug, or 'Not sure yet'.
 * Returns canonical service title or 'Not sure yet', otherwise null.
 */
export function sanitizeService(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.toLowerCase() === 'not sure yet') return 'Not sure yet';

  const match = services.find(
    (s) =>
      s.title.toLowerCase() === trimmed.toLowerCase() ||
      s.slug.toLowerCase() === trimmed.toLowerCase() ||
      s.title.toLowerCase().replace('counselling', 'counseling') ===
        trimmed.toLowerCase().replace('counselling', 'counseling')
  );
  return match ? match.title : null;
}

/**
 * Sanitizes branch input.
 * Allowed: any branch in branches.js or 'Not sure yet'.
 * Returns canonical branch name or 'Not sure yet', otherwise null.
 */
export function sanitizeBranch(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.toLowerCase() === 'not sure yet') return 'Not sure yet';

  const match = branches.find((b) => {
    const name = typeof b === 'object' ? b.name : b;
    const slug = typeof b === 'object' ? b.slug : b;
    return (
      name.toLowerCase() === trimmed.toLowerCase() ||
      slug.toLowerCase() === trimmed.toLowerCase()
    );
  });
  return match ? (typeof match === 'object' ? match.name : match) : null;
}


/**
 * Sanitizes university input.
 * Allowed: known university slug (or university name mapping to its slug).
 * Returns university slug, otherwise null.
 */
export function sanitizeUniversity(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const match = universities.find(
    (u) =>
      u.slug.toLowerCase() === trimmed.toLowerCase() ||
      u.name.toLowerCase() === trimmed.toLowerCase()
  );
  return match ? match.slug : null;
}
