export const overviewData = {
  seo: {
    title: 'Our Services',
    description:
      'Study abroad support from Adam International: career counselling, admission, financial and visa guidance, travel and pre-departure support.',
  },
  hero: {
    h1: 'Complete Study Abroad Support, From Counselling to Departure',
    sub: 'Get personalised guidance on choosing your course, university and destination, with complete support for admission, visa and pre-departure.',
    image: '/images/services/overview-hero.jpg',
    buttons: [
      {
        label: 'Book a Free Consultation',
        action: { type: 'appointment' },
        variant: 'primary',
      },
      {
        label: 'Explore Our Services',
        action: { type: 'scroll', to: '#all-services' },
        variant: 'secondary',
      },
    ],
  },
  sections: [
    {
      type: 'timeline',
      eyebrow: 'HOW WE HELP YOU',
      heading: 'Your Study Abroad Journey',
      steps: [
        {
          title: 'Career Counselling',
          text: 'Understand your academic profile, interests and career goals.',
          link: { to: '/services/career-counseling', label: 'Learn more' },
        },
        {
          title: 'Course Selection',
          text: 'Find courses that match your qualifications and future plans.',
          link: { to: '/services/career-counseling', label: 'Learn more' },
        },
        {
          title: 'University Selection',
          text: 'Explore suitable universities based on course, location, budget and eligibility.',
          link: { to: '/universities', label: 'Learn more' },
        },
        {
          title: 'Application & Admission',
          text: 'Get support with applications, documentation and admission procedures.',
          link: { to: '/services/admission-support', label: 'Learn more' },
        },
        {
          title: 'Financial Assistance',
          text: 'Get guidance on planning and managing the cost of studying abroad.',
          link: { to: '/services/financial-assistance', label: 'Learn more' },
        },
        {
          title: 'Visa Assistance',
          text: 'Receive guidance throughout the student visa process.',
          link: { to: '/services/visa-assistance', label: 'Learn more' },
        },
        {
          title: 'Travel & Settling In',
          text: 'Prepare for your journey and your first weeks in a new country.',
          link: { to: '/services/pre-departure-post-landing', label: 'Learn more' },
        },
      ],
    },
    {
      type: 'serviceCards',
      id: 'all-services',
      eyebrow: 'OUR SERVICES',
      heading: 'Everything We Help With',
    },
    {
      type: 'featureBand',
      heading: 'Financial & Loan Guidance',
      text: 'Understand your financial options and get guidance on education-loan documentation and related requirements.',
      button: 'Explore Financial Assistance',
      to: '/services/financial-assistance',
    },
    {
      type: 'featureBand',
      heading: 'Student Visa Assistance',
      text: "From documentation to submission, we'll guide you through the visa process.",
      items: [
        'Visa document checklist',
        'Application guidance',
        'Financial-document guidance',
        'Appointment guidance',
        'Interview preparation',
        'Application-status guidance',
      ],
      button: 'Explore Visa Assistance',
      to: '/services/visa-assistance',
    },
    {
      type: 'featureBand',
      heading: 'Find the Right University',
      text: 'Choosing a university is more than choosing a name. We help you compare institutions based on your course, academic profile, budget and preferred destination.',
      button: 'Explore Universities',
      to: '/universities',
    },
    {
      type: 'countryGrid',
      cardStyle: 'overview',
      heading: 'Explore Your European Study Destinations',
      countries: [
        'hungary',
        'slovenia',
        'slovakia',
        'latvia',
        'lithuania',
        'malta',
        'bulgaria',
        'germany',
      ],
    },
    {
      type: 'form',
      id: 'eligibility',
      heading: 'Find the Right Course for Your Profile',
      sub: 'Tell us about yourself and a counsellor will review your profile.',
      formType: 'eligibility',
      fields: [
        'qualification',
        'score',
        'fieldOfStudy',
        'graduationYear',
        'englishTest',
        'country',
        'budget',
      ],
      submitLabel: 'Check Your Eligibility →',
      note: 'This is a preliminary review by our counsellors, not an automatic result or a guarantee of admission.',
      successTitle: "Thanks, we've received your details.",
      successText:
        'A counsellor will review your profile and contact you, usually within one working day.',
    },
  ],
};

export default overviewData;
