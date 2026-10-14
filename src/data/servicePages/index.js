import careerCounseling from './career-counseling.js';
import admissionSupport from './admission-support.js';
import trainingAssistance from './training-assistance.js';
import financialAssistance from './financial-assistance.js';
import visaAssistance from './visa-assistance.js';
import travelAssistance from './travel-assistance.js';
import preDeparturePostLanding from './pre-departure-post-landing.js';
import overview from './overview.js';

export const servicePages = {
  'career-counseling': careerCounseling,
  'admission-support': admissionSupport,
  'training-assistance': trainingAssistance,
  'financial-assistance': financialAssistance,
  'visa-assistance': visaAssistance,
  'travel-assistance': travelAssistance,
  'pre-departure-post-landing': preDeparturePostLanding,
  overview,
};

export default servicePages;
