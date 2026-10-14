import { contact } from '../contact.js';

export const visaAssistanceData = {
  seo: {
    title: 'Visa Assistance',
    description:
      'Student visa guidance for European destinations: document checks, application preparation and interview readiness.',
  },
  hero: {
    h1: 'Your European Study Visa Journey Starts Here',
    sub: 'Get expert guidance on student visa documentation, application preparation and interview readiness for your chosen European study destination.',
    image: '/images/services/visa-assistance-hero.jpg',
    buttons: [
      {
        label: 'Get Visa Assistance',
        action: { type: 'scroll', to: '#visa-form' },
        variant: 'primary',
      },
      {
        label: 'Book a Free Consultation',
        action: { type: 'appointment', service: 'visa-assistance' },
        variant: 'secondary',
      },
    ],
  },
  sections: [
    {
      type: 'intro',
      heading: 'Expert Guidance for Your Student Visa Application',
      image: '/images/services/visa-assistance-intro.jpg',
      paragraphs: [
        'We help you prepare a complete, well-organised visa application, with careful document review and clear guidance at every step.',
      ],
      note: 'Visa decisions are made by the relevant embassy or immigration authority, and requirements vary by country and visa type. No one can guarantee approval. What we do is help you submit the strongest application you can.',
    },
    {
      type: 'timeline',
      heading: 'How Our Visa Assistance Works',
      steps: [
        {
          title: 'Initial Consultation',
          text: 'We understand your destination, admission status and the visa requirements that apply to you.',
        },
        {
          title: 'Document Verification',
          text: 'We help you review your passport, admission letter, financial documents and other paperwork.',
        },
        {
          title: 'Application Preparation',
          text: 'We guide you through the forms, supporting documents and submission requirements.',
        },
        {
          title: 'Interview Preparation',
          text: 'We help you prepare for common questions and explain your study plans clearly, where an interview applies.',
        },
        {
          title: 'Final Guidance',
          text: 'We explain the next steps, appointment requirements and travel preparation for your application.',
        },
      ],
    },
    {
      type: 'countryGrid',
      cardStyle: 'compact',
      heading: 'Country-Specific Visa Guidance',
      countries: [
        'hungary',
        'slovenia',
        'malta',
        'slovakia',
        'latvia',
        'lithuania',
        'bulgaria',
      ],
      linkPrefix: '/countries/{slug}#visa',
    },
    {
      type: 'checklist',
      interactive: true,
      heading: 'Student Visa Document Checklist',
      items: [
        'Valid passport',
        'University admission letter',
        'Academic certificates and transcripts',
        'Proof of financial resources',
        'Accommodation details, where required',
        'Health insurance, where required',
        'Completed visa application form',
        'Additional documents required by your destination country',
      ],
      note: 'A general guide only, not a complete or official list. Requirements vary by country, visa type and your circumstances. Always check the official embassy or immigration website.',
    },
    {
      type: 'form',
      id: 'visa-form',
      heading: 'Get Student Visa Guidance',
      formType: 'visa',
      fields: ['currentQualification', 'country', 'admissionStatus', 'message'],
      fieldLabels: {
        country: 'Preferred study destination',
      },
      submitLabel: 'Get Student Visa Guidance',
      successTitle: "Thanks, we've received your request.",
      successText: 'A visa advisor will contact you, usually within one working day.',
    },
    {
      type: 'faq',
      heading: 'Frequently Asked Questions',
      items: [
        {
          q: 'What documents are required for a European student visa?',
          a: "It depends on the country and your situation, but most applications ask for a valid passport, your university admission letter, academic documents and proof of funds, and often accommodation details and health insurance. Use the checklist above as a starting point, and we'll give you the exact list for your destination.",
        },
        {
          q: 'Can Adam International help me prepare my visa application?',
          a: 'Yes. We help you gather and review your documents, complete the forms, prepare for your appointment and interview, and understand what happens next. The application is made in your name, and the decision is made by the embassy or immigration authority.',
        },
        {
          q: 'How early should I start preparing my visa documents?',
          a: 'As soon as you accept your offer. Some documents, such as bank statements, certificates or translations, can take weeks to arrange, and appointment slots fill up quickly before the main intakes.',
        },
        {
          q: 'Is an IELTS score required for every European study destination?',
          a: "Not always. Some universities accept a Medium of Instruction certificate or their own test, while others require IELTS or a similar score, and the embassy may have its own expectations. We'll check what applies to your university and country.",
        },
        {
          q: 'What happens if my visa application is refused?',
          a: "We'll go through the refusal letter with you, address each reason, and advise whether to reapply or, where possible, appeal.",
        },
        {
          q: 'Does the visa process differ between European countries?',
          a: 'Yes. Each country sets its own rules for long-stay study visas or residence permits, including documents, fees, processing times and whether an interview is needed. We guide you through the process for your destination.',
        },
        {
          q: 'How can I book a visa consultation with Adam International?',
          a: `Fill in the form on this page, use Book a Free Consultation, message us on WhatsApp, or call ${contact.phoneDisplay}.`,
        },
      ],
    },
  ],
};

export default visaAssistanceData;
