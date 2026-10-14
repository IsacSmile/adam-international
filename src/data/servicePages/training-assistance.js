export const trainingAssistanceData = {
  seo: {
    title: 'Training Assistance',
    description:
      'Training support to help students prepare for the language, interview and readiness requirements of studying abroad.',
  },
  hero: {
    h1: 'Build Your Skills. Prepare for Your Future.',
    sub: 'Training support to help you prepare for the requirements of studying abroad, so you can take each step with confidence.',
    image: '/images/services/training-assistance-hero.jpg',
    objectPosition: '85% center',
    buttons: [
      {
        label: 'Enquire About Training',
        action: { type: 'scroll', to: '#training-form' },
        variant: 'primary',
      },
    ],
  },
  sections: [
    {
      type: 'intro',
      heading: 'What is Training Assistance?',
      image: '/images/services/training-assistance-intro.jpg',
      paragraphs: [
        'Studying abroad often means meeting an English-language requirement, attending a university or visa interview, and adjusting to a new way of learning. Training Assistance helps you prepare for these steps, so you can approach each one with confidence.',
      ],
    },
    {
      type: 'programmeList',
      heading: 'Our Training Programmes',
      formId: 'training-form',
    },
    {
      type: 'storyStrip',
      tag: 'training',
      heading: 'Student Success Stories',
      button: { label: 'Read Student Stories', to: '/success-stories' },
    },
    {
      type: 'form',
      id: 'training-form',
      heading: 'Enquire About Training',
      formType: 'training',
      fields: ['programme', 'message'],
      submitLabel: 'Send My Enquiry',
      successTitle: "Thanks, we've received your enquiry.",
      successText: 'Our team will contact you about programmes and batches, usually within one working day.',
    },
    {
      type: 'faq',
      heading: 'Frequently Asked Questions',
      items: [
        {
          q: 'Which training programmes are available?',
          a: 'Our current programmes are listed on this page. If you can’t find what you’re looking for, ask us and we’ll tell you what’s available.',
        },
        {
          q: 'Who can join?',
          a: 'Eligibility depends on the programme and is listed with each one.',
        },
        {
          q: 'How long does the training take?',
          a: 'The duration depends on the programme and is listed with each one.',
        },
        {
          q: 'What are the fees?',
          a: 'Fees are listed with each programme, or you can ask us for the current fees.',
        },
        {
          q: 'Will I receive a certificate?',
          a: 'Course completion certificates are awarded based on attendance and performance requirements for eligible programmes.',
        },
        {
          q: 'How do I register?',
          a: 'Fill in the enquiry form on this page, or call or WhatsApp us, and we’ll confirm the next available batch.',
        },
      ],
    },
    {
      type: 'linkCards',
      heading: 'Related Services',
      cards: [
        'career-counseling',
        'admission-support',
        'pre-departure-post-landing',
      ],
    },
  ],
};

export default trainingAssistanceData;
