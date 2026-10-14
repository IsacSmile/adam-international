export const financialAssistanceData = {
  seo: {
    title: 'Financial Assistance',
    description:
      'Guidance on study-abroad costs, education loans, scholarships and proof-of-funds requirements for studying in Europe.',
  },
  hero: {
    h1: 'Plan and Fund Your European Education',
    sub: 'Get guidance on planning your education expenses, exploring funding options and preparing financially for your international study journey.',
    image: '/images/services/financial-assistance-hero.jpg',
    buttons: [
      {
        label: 'Explore Funding Options',
        action: { type: 'scroll', to: '#funding' },
        variant: 'primary',
      },
      {
        label: 'Book a Consultation',
        action: { type: 'appointment', service: 'financial-assistance' },
        variant: 'secondary',
      },
    ],
  },
  sections: [
    {
      type: 'intro',
      id: 'funding',
      heading: 'Education Loan Assistance',
      image: '/images/services/financial-assistance-intro.jpg',
      paragraphs: [
        'We help you explore education loan options from banks and financial institutions, and understand what each option involves before you apply.',
      ],
      items: [
        'Understanding loan eligibility',
        'Documents commonly required',
        'Secured and unsecured education loans, where applicable',
        'Interest rates, repayment periods and other charges',
        'Support with the application process',
      ],
      note: 'Loan approval, amount and interest rate are decided by the lender.',
    },
    {
      type: 'scholarshipList',
      heading: 'Scholarships and Financial Aid',
      sub: 'Many universities and organisations offer scholarships and other financial support. We help you find the ones you may qualify for.',
    },
    {
      type: 'checklist',
      interactive: true,
      heading: 'Financial Planning Checklist',
      sub: 'Use this list to estimate how much you may need before you travel.',
      items: [
        'Tuition fees and initial university payments',
        'Accommodation and living expenses',
        'Visa and application charges',
        'Travel and health insurance costs',
        'Proof-of-funds requirements for your destination',
        'Emergency funds and other initial expenses',
      ],
      note: 'A general guide only. Costs and requirements vary by country, city and university.',
    },
    {
      type: 'faq',
      heading: 'Frequently Asked Questions',
      items: [
        {
          q: 'How much does it cost to study in Europe?',
          a: 'Tuition fees and living expenses vary widely depending on the country, city and university. We provide detailed estimates covering tuition, accommodation, food, insurance and incidentals for each destination on your shortlist.',
        },
        {
          q: 'Can I get an education loan without collateral?',
          a: 'Yes, several banks and NBFCs offer unsecured education loans for eligible courses and universities, typically evaluated based on student academic merit and co-applicant financial profile.',
        },
        {
          q: 'What documents are required for an education loan?',
          a: 'Generally, you will need your admission offer letter, fee structure, academic transcripts, KYC documents, and financial documents of the co-applicant (income tax returns, bank statements, salary slips).',
        },
        {
          q: 'Are scholarships available for international students in Europe?',
          a: 'Yes, merit-based, need-based, and government-sponsored scholarships (such as Stipendium Hungaricum) exist across several European nations. We help you identify those matching your academic credentials.',
        },
        {
          q: 'What is proof of funds for a student visa?',
          a: 'Immigration authorities require proof that you have sufficient funds to cover your tuition and living costs for your study period, typically shown via bank balance, loan sanction letter, or blocked account depending on the destination.',
        },
      ],
    },
  ],
};

export default financialAssistanceData;
