export const preDeparturePostLandingData = {
  seo: {
    title: 'Pre-Departure & Post-Landing Services',
    description:
      'Guidance to help students prepare for travel to Europe and settle into their new destination after arrival.',
  },
  hero: {
    h1: 'Your Journey to Europe, Made Easier',
    sub: 'From pre-departure preparation to settling into your new destination, Adam International helps you prepare for your international education journey.',
    image: '/images/services/pre-departure-hero.jpg',
    objectPosition: '85% center',
    buttons: [
      {
        label: 'Explore Our Services',
        action: { type: 'scroll', to: '#support' },
        variant: 'primary',
      },
      {
        label: 'Get Student Support',
        action: { type: 'appointment', service: 'pre-departure-post-landing' },
        variant: 'secondary',
      },
    ],
  },
  sections: [
    {
      type: 'twoColumnLists',
      id: 'support',
      left: {
        title: 'Pre-Departure Assistance',
        sub: 'Help preparing for your journey before you leave India.',
        items: [
          'Pre-departure orientation and travel preparation',
          'Travel document and checklist guidance',
          'Accommodation planning assistance',
          'Information about local culture, weather and daily life',
          'Guidance on budgeting and managing expenses',
          'Information about university reporting and arrival procedures',
        ],
      },
      right: {
        title: 'Post-Landing Assistance',
        sub: 'Help with the practical steps of settling into your destination.',
        items: [
          'Guidance on reaching your accommodation',
          'Information about local transport',
          'Guidance on university registration and orientation',
          'Information about SIM cards, banking and essential services',
          'Guidance on local rules and emergency contacts',
          'Information about student support services',
        ],
      },
    },
    {
      type: 'timeline',
      heading: 'How We Support You',
      steps: [
        {
          title: 'Prepare for Departure',
          text: 'Review your travel checklist and the key steps before leaving India.',
        },
        {
          title: 'Plan Your Journey',
          text: 'Prepare for travel, accommodation and arrival procedures.',
        },
        {
          title: 'Settle Into Your Destination',
          text: 'Understand local transport, essential services and university procedures.',
        },
        {
          title: 'Begin Your Student Journey',
          text: 'Get to know your university and the student support available to you.',
        },
      ],
    },
    {
      type: 'cardGrid',
      columns: 3,
      heading: 'Why Choose Adam International for Pre-Departure & Post-Landing Support?',
      intro:
        'Moving to another country for higher education is exciting, but preparing for a new environment can also feel challenging. We help you prepare with practical guidance and the right information.',
      items: [
        {
          icon: 'CheckCircle2',
          title: 'Personalised Guidance',
          text: 'Support based on your destination and individual needs.',
        },
        {
          icon: 'CheckCircle2',
          title: 'Travel Preparation',
          text: 'Understand the documents, travel arrangements and steps before departure.',
        },
        {
          icon: 'CheckCircle2',
          title: 'Destination Awareness',
          text: 'Learn about local culture, transport and everyday essentials.',
        },
        {
          icon: 'CheckCircle2',
          title: 'Arrival Guidance',
          text: 'Understand the first steps of settling into your new destination.',
        },
        {
          icon: 'CheckCircle2',
          title: 'Student-Focused Support',
          text: 'Start your international education with greater confidence.',
        },
      ],
    },
    {
      type: 'faq',
      heading: 'Frequently Asked Questions',
      items: [
        {
          q: 'What should I prepare before travelling to Europe for studies?',
          a: 'Your passport and visa, admission letter, accommodation details, travel insurance if required, some money in local currency or on a forex card, and copies of your important documents. We’ll give you a full checklist in your pre-departure briefing.',
        },
        {
          q: 'What documents should I carry when travelling?',
          a: 'Carry the originals of your passport, visa, admission letter, academic certificates, accommodation confirmation and insurance in your hand luggage, along with printed and digital copies. Your destination or university may ask for others.',
        },
        {
          q: 'How can I plan my accommodation before arrival?',
          a: 'Start early, because many cities fill up before the semester begins. We help you compare university housing and private options, and check they’re genuine before you pay a deposit.',
        },
        {
          q: 'What should I do after arriving in my destination country?',
          a: 'Get to your accommodation, let your family know you’ve arrived, then follow your first-week plan: university registration, any local registration or residence-permit steps your country requires, a SIM card and a bank account.',
        },
        {
          q: 'How can I prepare for university registration?',
          a: 'Read your university’s arrival instructions, keep your documents ready and note any deadlines. We’ll go through the usual steps with you before you travel.',
        },
        {
          q: 'Can I receive guidance specific to my destination country?',
          a: 'Yes. Our briefing covers the country you’re travelling to, and you can ask us questions about your city and university.',
        },
      ],
    },
  ],
};

export default preDeparturePostLandingData;
