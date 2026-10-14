export const careerCounselingData = {
  seo: {
    title: 'Career Counselling',
    description:
      'Personalised career counselling to help you choose the right course, university and European study destination for your profile and budget.',
  },
  hero: {
    h1: 'Find the Right Course. Build Your Future in Europe.',
    sub: 'Personalised career guidance to help you explore courses, universities and study destinations that match your academic background and future goals.',
    image: '/images/services/career-counseling-hero.jpg',
    buttons: [
      {
        label: 'Book a Free Consultation',
        action: { type: 'appointment', service: 'career-counseling' },
        variant: 'primary',
      },
      {
        label: 'Call Us',
        action: { type: 'tel' },
        variant: 'secondary',
      },
    ],
  },
  sections: [
    {
      type: 'cardGrid',
      columns: 3,
      eyebrow: 'IS THIS FOR YOU?',
      heading: 'Who Needs Career Counselling?',
      items: [
        {
          icon: 'School',
          title: 'Plus Two students',
          text: "Explore bachelor's options that suit your stream, marks and interests.",
        },
        {
          icon: 'BookOpen',
          title: 'Undergraduate applicants',
          text: 'Compare programmes and countries before you commit to a degree.',
        },
        {
          icon: 'GraduationCap',
          title: "Graduates planning a master's",
          text: 'Find postgraduate programmes that build on your degree and career plans.',
        },
        {
          icon: 'HelpCircle',
          title: 'Unsure about your course',
          text: 'Get clarity on which course or specialisation fits you best.',
        },
        {
          icon: 'Globe2',
          title: 'Planning to study in Europe',
          text: 'Understand your options across European study destinations.',
        },
        {
          icon: 'Wallet',
          title: 'Working within a budget',
          text: 'Find programmes that fit both your qualifications and your budget.',
        },
      ],
    },
    {
      type: 'cardGrid',
      columns: 2,
      heading: 'What Our Career Counselling Includes',
      items: [
        {
          icon: 'Compass',
          title: 'Academic background evaluation',
        },
        {
          icon: 'BookOpenCheck',
          title: 'Course and specialisation selection',
        },
        {
          icon: 'Globe2',
          title: 'Identifying suitable European study destinations',
          link: { label: 'Explore destinations', to: '/countries' },
        },
        {
          icon: 'Building2',
          title: 'University and programme recommendations',
          link: { label: 'Explore universities', to: '/universities' },
        },
        {
          icon: 'Wallet',
          title: 'Tuition fees and estimated living expenses',
          link: { label: 'Financial guidance', to: '/services/financial-assistance' },
        },
        {
          icon: 'Languages',
          title: 'Entry and language requirements',
          link: { label: 'Training support', to: '/services/training-assistance' },
        },
        {
          icon: 'FileCheck2',
          title: 'Admission requirements and application preparation',
          link: { label: 'Admission support', to: '/services/admission-support' },
        },
      ],
    },
    {
      type: 'countryGrid',
      cardStyle: 'detailed',
      heading: 'Explore European Study Destinations',
      countries: [
        'slovenia',
        'slovakia',
        'hungary',
        'malta',
        'latvia',
        'lithuania',
        'bulgaria',
      ],
    },
    {
      type: 'timeline',
      heading: 'How Our Career Counselling Works',
      steps: [
        {
          title: 'Share Your Details',
          text: 'Tell us about your qualifications and interests.',
        },
        {
          title: 'Attend a Counselling Session',
          text: 'Discuss your goals, preferences and budget with a counsellor.',
        },
        {
          title: 'Explore Suitable Options',
          text: 'Review courses, universities and countries that fit your profile.',
        },
        {
          title: 'Plan Your Next Steps',
          text: 'Get clear guidance on admission requirements and the application process.',
        },
      ],
    },
    {
      type: 'cardGrid',
      columns: 3,
      heading: 'Why Choose Adam International?',
      items: [
        {
          icon: 'CheckCircle2',
          title: 'Personalised course and country recommendations',
        },
        {
          icon: 'CheckCircle2',
          title: 'Guidance based on your qualifications and budget',
        },
        {
          icon: 'CheckCircle2',
          title: 'Support with university selection and admission procedures',
        },
        {
          icon: 'CheckCircle2',
          title: 'Visa and documentation guidance, where applicable',
        },
        {
          icon: 'CheckCircle2',
          title: 'Support throughout your study-abroad journey',
        },
      ],
    },
    {
      type: 'storyStrip',
      heading: 'Student Success Stories',
      button: { label: 'Read Student Stories', to: '/success-stories' },
    },
    {
      type: 'faq',
      heading: 'Frequently Asked Questions',
      items: [
        {
          q: 'Is the first session really free?',
          a: 'Yes. The first consultation costs nothing and you are under no obligation to continue with us.',
        },
        {
          q: 'I have a gap year or backlogs. Can I still study abroad?',
          a: 'In many cases, yes. Many universities accept gaps if you can explain what you did during them, and backlog limits vary by university and country. Bring your documents and we will tell you honestly where you stand.',
        },
        {
          q: 'Do I need IELTS or PTE before I come in?',
          a: 'No. Come and talk to us first. We will tell you which test you need, the score to aim for, and whether any of your options accept alternatives.',
        },
        {
          q: 'Can my parents join the session?',
          a: 'Of course. Many students bring a parent, and we are happy to do the session online if they are somewhere else.',
        },
        {
          q: 'How do you decide which country suits me?',
          a: 'We look at your course, budget, preferred intake, career plans and each country’s post-study work rules, then explain the trade-offs so you can choose.',
        },
      ],
    },
  ],
};

export default careerCounselingData;
