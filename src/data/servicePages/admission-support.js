export const admissionSupportData = {
  seo: {
    title: 'Admission Support',
    description:
      'University admission support for Europe: programme selection, applications, document checks and offer guidance.',
  },
  hero: {
    h1: 'Your Journey to a European University Starts Here',
    sub: 'Get personalised guidance on university selection, application preparation, admission requirements and the next steps toward studying in Europe.',
    image: '/images/services/admission-support-hero.jpg',
    buttons: [
      {
        label: 'Explore Universities',
        action: { type: 'link', to: '/universities' },
        variant: 'primary',
      },
      {
        label: 'Enquire Now',
        action: { type: 'scroll', to: '#admission-form' },
        variant: 'secondary',
      },
    ],
  },
  sections: [
    {
      type: 'cardGrid',
      columns: 3,
      heading: 'What Our Admission Support Includes',
      items: [
        {
          icon: 'Building2',
          title: 'University and programme selection',
        },
        {
          icon: 'ClipboardCheck',
          title: 'Eligibility and academic qualification assessment',
        },
        {
          icon: 'FileEdit',
          title: 'Application form preparation and submission guidance',
        },
        {
          icon: 'FileCheck2',
          title: 'Document checklist and verification support',
        },
        {
          icon: 'PenLine',
          title: 'Guidance on statements of purpose and CVs, where required',
        },
        {
          icon: 'RefreshCw',
          title: 'Application status follow-up, where available',
        },
        {
          icon: 'MailCheck',
          title: 'Guidance on admission offers and next steps',
        },
      ],
    },
    {
      type: 'form',
      id: 'admission-form',
      heading: 'Check Your Eligibility & Enquire',
      sub: 'Share a few details and our admission team will get back to you with suitable options.',
      formType: 'admission',
      fields: ['qualification', 'score', 'courseInterest', 'country', 'intake'],
      submitLabel: 'Send My Enquiry',
      note: 'This is a preliminary assessment, not a guarantee of admission.',
      successTitle: "Thanks, we've received your enquiry.",
      successText: 'Our admission team will contact you, usually within one working day.',
    },
    {
      type: 'universityGrid',
      heading: 'Explore Universities We Support',
      limit: 6,
      showDetails: true,
      buttonText: 'View All Universities',
    },
    {
      type: 'checklist',
      interactive: false,
      heading: 'Documents Required for University Admission',
      items: [
        'Academic certificates and mark sheets',
        'Passport or other accepted identification',
        'Updated CV or résumé, if required',
        'Statement of purpose or motivation letter, if required',
        'English-language test results, where applicable',
        'Letters of recommendation, where required by the programme',
      ],
      note: 'A general guide only. Each university and programme sets its own requirements.',
    },
    {
      type: 'timeline',
      heading: 'Step-by-Step Admission Process',
      steps: [
        {
          title: 'Enquiry and profile assessment',
          text: 'We understand your background, goals and budget.',
        },
        {
          title: 'Course and university shortlisting',
          text: 'We agree a realistic list of options with you.',
        },
        {
          title: 'Document preparation',
          text: 'We help you gather and check everything you need.',
        },
        {
          title: 'Application submission',
          text: 'Your applications go in complete and on time.',
        },
        {
          title: 'Admission decision and offer review',
          text: 'We go through each offer and its conditions with you.',
        },
        {
          title: 'Next steps',
          text: 'Including visa preparation, where applicable.',
        },
      ],
    },
    {
      type: 'courseFinder',
      id: 'course-finder',
      heading: 'University & Course Finder',
      sub: 'Search the universities and programmes we currently support.',
    },
    {
      type: 'faq',
      heading: 'Frequently Asked Questions',
      items: [
        {
          q: 'How do I apply to a European university?',
          a: "Most applications are made online, either on the university's own portal or through a national application system. You'll usually need your academic documents and passport, and sometimes an English test score, CV or motivation letter. We help you choose programmes, prepare your documents and submit each application.",
        },
        {
          q: 'Can I apply after Plus Two?',
          a: 'Yes, Plus Two students can apply for bachelor’s programmes. Entry requirements vary by university and course: some ask for specific subjects or minimum marks, and some programmes include an entrance exam or interview.',
        },
        {
          q: 'Can I apply for a master’s degree after graduation?',
          a: 'Yes. Most master’s programmes ask for a relevant bachelor’s degree and your transcripts, and some also ask for an English test, CV or motivation letter. Requirements differ by programme.',
        },
        {
          q: 'Is IELTS required for every university?',
          a: 'No. Some universities accept a Medium of Instruction certificate, an interview or their own test, while others require IELTS or a similar test. We’ll check each university on your shortlist.',
        },
        {
          q: 'How much are the application and tuition fees?',
          a: 'They vary widely by country, university and course, and some universities don’t charge an application fee at all. We’ll give you the current fees for each university on your shortlist before you apply.',
        },
        {
          q: 'Can I apply to multiple universities?',
          a: 'Yes, and it’s usually sensible to apply to a few. We’ll help you choose a realistic mix based on your profile and budget.',
        },
        {
          q: 'What happens after I receive an admission offer?',
          a: 'You’ll usually need to accept the offer, meet any remaining conditions and sometimes pay a deposit or tuition instalment before applying for your visa. We’ll walk you through each step.',
        },
        {
          q: 'Does admission support guarantee a university offer or visa?',
          a: 'No. Universities make admission decisions, and embassies or immigration authorities make visa decisions. What we do is help you submit complete, well-prepared applications.',
        },
      ],
    },
  ],
};

export default admissionSupportData;
