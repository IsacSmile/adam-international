export const travelAssistanceData = {
  seo: {
    title: 'Travel Assistance',
    description:
      'Travel guidance for students heading to Europe: flight options, travel insurance and pre-departure preparation.',
  },
  hero: {
    h1: 'Travel to Europe with Confidence',
    sub: 'Plan your journey with travel guidance from Adam International, including flight booking help, travel insurance guidance and pre-departure preparation.',
    image: '/images/services/travel-assistance-hero.jpg',
    buttons: [
      {
        label: 'Get Travel Assistance',
        action: { type: 'appointment', service: 'travel-assistance' },
        variant: 'primary',
      },
      {
        label: 'Contact Our Team',
        action: { type: 'whatsapp' },
        variant: 'secondary',
      },
    ],
  },
  sections: [
    {
      type: 'cardGrid',
      columns: 2,
      items: [
        {
          icon: 'Plane',
          // CONFIRM: do they book tickets or only guide?
          title: 'Flight Booking Assistance',
          text: "Help exploring flight options, comparing fares, understanding baggage allowances and planning travel dates around your university's reporting schedule.",
          button: 'Enquire About Flight Booking',
          action: { type: 'appointment', service: 'travel-assistance' },
        },
        {
          icon: 'ShieldCheck',
          title: 'Travel Insurance Guidance',
          text: 'Help understanding travel insurance options, coverage, exclusions and the documents your destination requires.',
          button: 'Get Insurance Guidance',
          action: { type: 'appointment', service: 'travel-assistance' },
        },
        {
          icon: 'Luggage',
          title: 'Pre-Departure Briefing',
          text: 'Travel preparation, essential documents, baggage planning, airport procedures and key information about your destination.',
          button: 'Learn About Pre-Departure',
          action: { type: 'link', to: '/services/pre-departure-post-landing' },
        },
        {
          icon: 'Compass',
          title: 'International Adaptation Session',
          text: 'An introduction to cultural differences, local customs, communication, everyday life and what to expect in your destination country.',
          button: 'Explore Orientation Support',
          action: { type: 'link', to: '/services/pre-departure-post-landing' },
        },
      ],
    },
    {
      type: 'timeline',
      heading: 'How It Works',
      steps: [
        {
          title: 'Submit an Enquiry',
          text: 'Share your destination, university and expected travel date.',
        },
        {
          title: 'Discuss Your Travel Plans',
          text: 'Review your requirements and the support you need.',
        },
        {
          title: 'Prepare for Departure',
          text: 'Get guidance on bookings, documents and travel preparation.',
        },
        {
          title: 'Get Ready to Travel',
          text: 'Complete your preparations and review the essentials for your journey.',
        },
      ],
    },
    {
      type: 'checklist',
      interactive: true,
      heading: 'Before You Travel to Europe',
      sub: 'Use this general checklist to prepare for your journey. Requirements vary by country and individual circumstances.',
      items: [
        'Passport and travel documents',
        'University admission letter',
        'Visa and entry documents, as applicable',
        'Flight booking and baggage allowance',
        'Travel insurance, if required',
        'Accommodation details',
        'Emergency contact information',
        'Essential items and personal medicines',
      ],
    },
    {
      type: 'cardGrid',
      columns: 3,
      heading: 'Why Choose Adam International for Travel Assistance?',
      items: [
        {
          icon: 'CheckCircle2',
          title: 'Student-Focused Travel Planning',
          text: 'Plan your travel around your university schedule, destination and personal needs.',
        },
        {
          icon: 'CheckCircle2',
          title: 'Hassle-Free Preparation',
          text: 'Understand travel arrangements, documents, baggage rules and airport procedures before you leave.',
        },
        {
          icon: 'CheckCircle2',
          title: 'Clear, Reliable Information',
          text: 'Practical guidance, and pointers to the latest information from airlines and the relevant authorities.',
        },
        {
          icon: 'CheckCircle2',
          title: 'Personalised Assistance',
          text: 'Support tailored to your travel plans, destination and specific concerns.',
        },
        {
          icon: 'CheckCircle2',
          title: 'Pre-Departure Orientation',
          text: 'Guidance on cultural differences, local customs and everyday life in your new country.',
        },
        {
          icon: 'CheckCircle2',
          title: 'A More Confident Journey',
          text: 'Start your studies abroad knowing what to expect at each step.',
        },
      ],
    },
    {
      type: 'faq',
      heading: 'Frequently Asked Questions',
      items: [
        {
          q: 'When should I book my flight?',
          a: 'Usually after your visa is approved. Booking before that risks losing money if dates change.',
        },
        {
          q: 'Do I need travel or health insurance?',
          a: "Many countries, including those in the Schengen area, require health insurance as part of the visa. Others, like the UK, charge a health surcharge with the visa application instead. We'll tell you what applies to you.",
        },
        {
          q: 'Can you help me find accommodation?',
          a: 'Yes. We help you compare university and private options and check them before you pay a deposit.',
        },
        {
          q: 'How much cash can I carry?',
          a: "There are limits on how much foreign currency you can carry and when you must declare it. We'll explain the current rules before you travel.",
        },
      ],
    },
  ],
};

export default travelAssistanceData;
