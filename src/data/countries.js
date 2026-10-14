// CONFIRM WITH CLIENT: final country list
export const countries = [
  {
    slug: 'united-kingdom',
    name: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    universityCount: null, // CONFIRM WITH CLIENT: university count
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop',
    blurb: "Shorter master's programmes, globally recognised degrees and a large Indian student community.",
    intro: null,
    visa: { overview: null, officialLinks: [] }, // officialLinks: [{ label, url }]; only verified official government sources
    lastChecked: null,
    // CONFIRM WITH CLIENT / verify before filling
  },
  {
    slug: 'united-states',
    name: 'United States',
    flag: '🇺🇸',
    region: 'Other destinations',
    universityCount: null, // CONFIRM WITH CLIENT: university count
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=600&auto=format&fit=crop',
    blurb: 'A wide choice of universities and courses, with flexibility to explore subjects before you specialise.',
    intro: null,
    visa: { overview: null, officialLinks: [] }, // officialLinks: [{ label, url }]; only verified official government sources
    lastChecked: null,
    // CONFIRM WITH CLIENT / verify before filling
  },
  {
    slug: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    region: 'Other destinations',
    universityCount: null, // CONFIRM WITH CLIENT: university count
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=600&auto=format&fit=crop',
    blurb: 'Well-regarded colleges and universities, with a welcoming, multicultural environment.',
    intro: null,
    visa: { overview: null, officialLinks: [] }, // officialLinks: [{ label, url }]; only verified official government sources
    lastChecked: null,
    // CONFIRM WITH CLIENT / verify before filling
  },
  {
    slug: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    region: 'Other destinations',
    universityCount: null, // CONFIRM WITH CLIENT: university count
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=600&auto=format&fit=crop',
    blurb: 'Strong universities, a relaxed lifestyle and a large international student population.',
    intro: null,
    visa: { overview: null, officialLinks: [] }, // officialLinks: [{ label, url }]; only verified official government sources
    lastChecked: null,
    // CONFIRM WITH CLIENT / verify before filling
  },
  {
    slug: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    region: 'Europe',
    universityCount: null, // CONFIRM WITH CLIENT: university count
    image: 'https://images.unsplash.com/photo-1587330979470-3595ac045ab0?q=80&w=600&auto=format&fit=crop',
    blurb: 'Highly regarded public universities, many with low or no tuition fees, especially for technical courses.',
    intro: null,
    visa: { overview: null, officialLinks: [] }, // officialLinks: [{ label, url }]; only verified official government sources
    lastChecked: null,
    // CONFIRM WITH CLIENT / verify before filling
  },
  {
    slug: 'france',
    name: 'France',
    flag: '🇫🇷',
    region: 'Europe',
    universityCount: null, // CONFIRM WITH CLIENT: university count
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop',
    blurb: 'Respected universities and business schools, with a growing number of English-taught programmes.',
    intro: null,
    visa: { overview: null, officialLinks: [] }, // officialLinks: [{ label, url }]; only verified official government sources
    lastChecked: null,
    // CONFIRM WITH CLIENT / verify before filling
  },
  {
    slug: 'hungary',
    name: 'Hungary',
    flag: '🇭🇺',
    region: 'Europe',
    universityCount: null, // CONFIRM WITH CLIENT: university count
    image: 'https://images.unsplash.com/photo-1784374037759-52132a375e34?q=80&w=600&auto=format&fit=crop',
    blurb: 'Affordable tuition and living costs, popular English-taught programmes, and a central location in Europe.',
    intro: null,
    visa: { overview: null, officialLinks: [] }, // officialLinks: [{ label, url }]; only verified official government sources
    lastChecked: null,
    // CONFIRM WITH CLIENT / verify before filling
  },
  // CONFIRM WITH CLIENT: country offered + blurb
  {
    slug: 'slovenia',
    name: 'Slovenia',
    flag: '🇸🇮',
    region: 'Europe',
    universityCount: null,
    image: '/images/countries/slovenia.jpg',
    blurb: 'A small Central European EU country with a growing number of English-taught programmes.',
    intro: null,
    visa: { overview: null, officialLinks: [] }, // officialLinks: [{ label, url }]; only verified official government sources
    lastChecked: null,
    // CONFIRM WITH CLIENT / verify before filling
  },
  {
    slug: 'slovakia',
    name: 'Slovakia',
    flag: '🇸🇰',
    region: 'Europe',
    universityCount: null,
    image: '/images/countries/slovakia.jpg',
    blurb: 'A Central European EU country with English-taught programmes and living costs lower than much of Western Europe.',
    intro: null,
    visa: { overview: null, officialLinks: [] }, // officialLinks: [{ label, url }]; only verified official government sources
    lastChecked: null,
    // CONFIRM WITH CLIENT / verify before filling
  },
  {
    slug: 'latvia',
    name: 'Latvia',
    flag: '🇱🇻',
    region: 'Europe',
    universityCount: null,
    image: '/images/countries/latvia.jpg',
    blurb: 'A Baltic EU country, with Riga as its main study hub and English-taught programmes across many subjects.',
    intro: null,
    visa: { overview: null, officialLinks: [] }, // officialLinks: [{ label, url }]; only verified official government sources
    lastChecked: null,
    // CONFIRM WITH CLIENT / verify before filling
  },
  {
    slug: 'lithuania',
    name: 'Lithuania',
    flag: '🇱🇹',
    region: 'Europe',
    universityCount: null,
    image: '/images/countries/lithuania.jpg',
    blurb: 'A Baltic EU country with universities in Vilnius and Kaunas offering English-taught programmes.',
    intro: null,
    visa: { overview: null, officialLinks: [] }, // officialLinks: [{ label, url }]; only verified official government sources
    lastChecked: null,
    // CONFIRM WITH CLIENT / verify before filling
  },
  {
    slug: 'malta',
    name: 'Malta',
    flag: '🇲🇹',
    region: 'Europe',
    universityCount: null,
    image: '/images/countries/malta.jpg',
    blurb: 'An EU island country where English is an official language, which makes everyday life easier for international students.',
    intro: null,
    visa: { overview: null, officialLinks: [] }, // officialLinks: [{ label, url }]; only verified official government sources
    lastChecked: null,
    // CONFIRM WITH CLIENT / verify before filling
  },
  {
    slug: 'bulgaria',
    name: 'Bulgaria',
    flag: '🇧🇬',
    region: 'Europe',
    universityCount: null,
    image: '/images/countries/bulgaria.jpg',
    blurb: 'An EU country known for comparatively low tuition and living costs, and popular English-taught programmes, especially in medicine.',
    intro: null,
    visa: { overview: null, officialLinks: [] }, // officialLinks: [{ label, url }]; only verified official government sources
    lastChecked: null,
    // CONFIRM WITH CLIENT / verify before filling
  },
];
