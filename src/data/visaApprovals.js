export const visaApprovals = [
  {
    id: 'va-001',
    studentName: 'Adith Dinesh',
    photo: '/images/_placeholder/students/adith-dinesh.jpg',
    country: 'hungary',
    university: 'University of Debrecen',
    universitySlug: 'university-of-debrecen',
    course: 'B.Sc. Computer Science',
    visaType: 'National Visa (Type D)',
    status: 'Approved',
    approvalDate: '2024-10-13',
    storyId: 'adith-dinesh',
    consentOnFile: false,
    isPlaceholder: true,
  },
  {
    id: 'va-002',
    studentName: 'Kiran Sunil Kumar',
    photo: '/images/_placeholder/students/kiran-sunil-kumar.jpg',
    country: 'france',
    university: 'NEOMA Business School',
    universitySlug: 'neoma-business-school',
    course: 'Master in Management (MIM)',
    visaType: 'Student Visa (VLS-TS)',
    status: 'Approved',
    approvalDate: '2024-10-13',
    storyId: 'kiran-sunil-kumar',
    consentOnFile: false,
    isPlaceholder: true,
  },
  {
    id: 'va-003',
    studentName: 'Anagha Sabu',
    photo: '/images/_placeholder/students/anagha-sabu.jpg',
    country: 'hungary',
    university: 'Eötvös Loránd University (ELTE)',
    universitySlug: 'eotvos-lorand-university',
    course: 'M.Sc. Biotechnology',
    visaType: 'National Visa (Type D)',
    status: 'Approved',
    approvalDate: '2024-10-13',
    storyId: 'anagha-sabu',
    consentOnFile: false,
    isPlaceholder: true,
  },
];

// Dev-only check for placeholders
if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
  if (visaApprovals.some((v) => v.isPlaceholder)) {
    console.warn('[Adam International] Warning: visaApprovals contains placeholder records pending client written consent.');
  }
}
