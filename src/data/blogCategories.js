export const blogCategories = [
  { name: 'Study in Europe', slug: 'study-in-europe' },
  { name: 'Country Guides', slug: 'country-guides' },
  { name: 'Student Visa Guidance', slug: 'student-visa-guidance' },
  { name: 'University and Course Updates', slug: 'university-course-updates' },
  { name: 'Scholarships and Financial Planning', slug: 'scholarships-financial-planning' },
  { name: 'Student Success Stories', slug: 'student-success-stories' },
];

export const getCategoryBySlug = (slug) =>
  blogCategories.find((c) => c.slug === slug);

export const getCategoryByName = (name) =>
  blogCategories.find((c) => c.name.toLowerCase() === name?.toLowerCase());
