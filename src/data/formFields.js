import { countries } from './countries.js';
import { trainingProgrammes } from './trainingProgrammes.js';
import { contact } from './contact.js';

export const FORM_TYPES = [
  'appointment',
  'eligibility',
  'admission',
  'visa',
  'training',
  'contact',
];

export const FORM_TYPE_LABELS = {
  appointment: 'Booking form',
  eligibility: 'Eligibility check',
  admission: 'Admission enquiry',
  visa: 'Visa enquiry',
  training: 'Training enquiry',
  contact: 'Contact enquiry',
};

export const FORM_TYPE_ALLOWLIST = {
  eligibility: [
    'qualification',
    'score',
    'fieldOfStudy',
    'graduationYear',
    'englishTest',
    'country',
    'budget',
  ],
  admission: ['qualification', 'score', 'courseInterest', 'country', 'intake'],
  visa: ['currentQualification', 'country', 'admissionStatus', 'message'],
  training: ['programme', 'message'],
  contact: ['country', 'preferredDate', 'preferredTime', 'message'],
  appointment: [],
};

export const QUALIFICATION_OPTIONS = [
  'Plus Two',
  'Diploma',
  "Bachelor's degree",
  "Master's degree",
  'Other',
];

export const ENGLISH_TEST_OPTIONS = [
  'IELTS',
  'PTE',
  'TOEFL',
  'Duolingo English Test',
  'Not taken yet',
  'Other',
];

export const BUDGET_OPTIONS = [
  'Under ₹5 lakh',
  '₹5–10 lakh',
  '₹10–15 lakh',
  '₹15–25 lakh',
  'Above ₹25 lakh',
  'Not sure yet',
];

export const ADMISSION_STATUS_OPTIONS = [
  "I've received an offer",
  "I'm applying",
  "I'm exploring options",
];

// CONFIRM WITH CLIENT: preferred time options must sit inside office hours
export const PREFERRED_TIME_OPTIONS = [
  'Morning (9:30 AM – 12:00 PM)',
  'Afternoon (12:00 PM – 3:00 PM)',
  'Late afternoon (3:00 PM – 5:30 PM)',
];

export function getGraduationYearOptions(fromDate = new Date()) {
  const currentYear = fromDate.getFullYear();
  const nextYear = currentYear + 1;
  const startYear = currentYear - 15;
  const years = [];
  for (let y = nextYear; y >= startYear; y--) {
    years.push(String(y));
  }
  return years;
}

export function getIntakeOptions(fromDate = new Date()) {
  const result = [];
  let year = fromDate.getFullYear();
  let month = fromDate.getMonth();
  while (result.length < 4) {
    if (month < 1 || (month === 1 && fromDate.getDate() <= 15)) {
      result.push(`February ${year}`);
      if (result.length === 4) break;
    }
    if (month < 8 || (month === 8 && fromDate.getDate() <= 15)) {
      result.push(`September ${year}`);
      if (result.length === 4) break;
    }
    year += 1;
    month = -1;
  }
  result.push('Not sure yet');
  return result;
}

export function getCountryOptions() {
  const list = countries.map((c) => c.name);
  return [...list, 'Not sure yet'];
}

export function getProgrammeOptions() {
  const list = (trainingProgrammes || []).map((p) => p.title);
  return [...list, 'Not sure yet'];
}

export const FIELD_LABELS = {
  qualification: 'Highest qualification',
  currentQualification: 'Current qualification',
  score: 'Percentage / CGPA',
  fieldOfStudy: 'Field of study',
  graduationYear: 'Graduation year',
  englishTest: 'English-language qualification',
  country: 'Preferred country',
  budget: 'Approximate budget per year (tuition + living)',
  courseInterest: "Course you're interested in",
  intake: 'Preferred intake',
  admissionStatus: 'Admission status',
  programme: "Programme you're interested in",
  message: 'Message or question',
  preferredDate: 'Preferred date',
  preferredTime: 'Preferred time',
};

/**
 * Returns complete field definitions including dynamically resolved option lists.
 */
export function getFormFieldDefinitions(now = new Date()) {
  return {
    qualification: {
      key: 'qualification',
      label: FIELD_LABELS.qualification,
      type: 'select',
      options: QUALIFICATION_OPTIONS,
    },
    currentQualification: {
      key: 'currentQualification',
      label: FIELD_LABELS.currentQualification,
      type: 'select',
      options: QUALIFICATION_OPTIONS,
    },
    score: {
      key: 'score',
      label: FIELD_LABELS.score,
      type: 'text',
      maxLength: 20,
      placeholder: 'e.g. 78% or 8.2 CGPA',
    },
    fieldOfStudy: {
      key: 'fieldOfStudy',
      label: FIELD_LABELS.fieldOfStudy,
      type: 'text',
      maxLength: 100,
      placeholder: 'e.g. Computer Science, Commerce',
    },
    graduationYear: {
      key: 'graduationYear',
      label: FIELD_LABELS.graduationYear,
      type: 'select',
      options: getGraduationYearOptions(now),
    },
    englishTest: {
      key: 'englishTest',
      label: FIELD_LABELS.englishTest,
      type: 'select',
      options: ENGLISH_TEST_OPTIONS,
    },
    country: {
      key: 'country',
      label: FIELD_LABELS.country,
      type: 'select',
      options: getCountryOptions(),
    },
    budget: {
      key: 'budget',
      label: FIELD_LABELS.budget,
      type: 'select',
      options: BUDGET_OPTIONS,
    },
    courseInterest: {
      key: 'courseInterest',
      label: FIELD_LABELS.courseInterest,
      type: 'text',
      maxLength: 100,
      placeholder: 'e.g. MSc Data Science, BBA',
    },
    intake: {
      key: 'intake',
      label: FIELD_LABELS.intake,
      type: 'select',
      options: getIntakeOptions(now),
    },
    admissionStatus: {
      key: 'admissionStatus',
      label: FIELD_LABELS.admissionStatus,
      type: 'select',
      options: ADMISSION_STATUS_OPTIONS,
    },
    programme: {
      key: 'programme',
      label: FIELD_LABELS.programme,
      type: 'select',
      options: getProgrammeOptions(),
    },
    message: {
      key: 'message',
      label: FIELD_LABELS.message,
      type: 'textarea',
      maxLength: 2000,
      placeholder: 'Tell us about your requirements or questions…',
    },
    preferredDate: {
      key: 'preferredDate',
      label: FIELD_LABELS.preferredDate,
      type: 'date',
    },
    preferredTime: {
      key: 'preferredTime',
      label: FIELD_LABELS.preferredTime,
      type: 'select',
      options: PREFERRED_TIME_OPTIONS,
    },
  };
}

/**
 * Validates a lead's formType, details, and message server-side.
 * Drops unknown keys on details. Validates allowed keys against rules.
 */
export function validateLeadPayload(rawFormType, rawDetails, rawMessage) {
  const formType = rawFormType || 'appointment';
  if (!FORM_TYPES.includes(formType)) {
    return {
      ok: false,
      error: 'validation',
      fields: { formType: `Unknown form type: ${formType}` },
    };
  }

  // Validate message (optional, trimmed, max 2000 chars)
  let cleanMessage = null;
  if (rawMessage !== undefined && rawMessage !== null) {
    if (typeof rawMessage !== 'string') {
      return {
        ok: false,
        error: 'validation',
        fields: { message: 'Message must be text.' },
      };
    }
    const trimmedMessage = rawMessage.trim();
    if (trimmedMessage.length > 2000) {
      return {
        ok: false,
        error: 'validation',
        fields: { message: 'Message must not exceed 2000 characters.' },
      };
    }
    cleanMessage = trimmedMessage || null;
  }

  // Validate details object
  const cleanDetails = {};
  const allowedKeys = FORM_TYPE_ALLOWLIST[formType] || [];
  const fieldDefs = getFormFieldDefinitions();

  if (rawDetails && typeof rawDetails === 'object' && !Array.isArray(rawDetails)) {
    for (const [key, val] of Object.entries(rawDetails)) {
      // Only keep keys in the allow-list for that form type
      // Note: 'message' is saved to the message column, not details
      if (key === 'message') {
        if (!cleanMessage && typeof val === 'string' && val.trim()) {
          const trimmed = val.trim();
          if (trimmed.length > 2000) {
            return {
              ok: false,
              error: 'validation',
              fields: { message: 'Message must not exceed 2000 characters.' },
            };
          }
          cleanMessage = trimmed;
        }
        continue;
      }

      if (!allowedKeys.includes(key)) {
        // Drop unknown keys
        continue;
      }

      if (val === null || val === undefined || val === '') {
        continue;
      }

      const def = fieldDefs[key];
      if (!def) continue;

      if (key === 'preferredDate') {
        if (typeof val !== 'string') {
          return {
            ok: false,
            error: 'validation',
            fields: { preferredDate: 'Please choose a working day within the next 60 days.' },
          };
        }
        const trimmed = val.trim();
        const dateMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!dateMatch) {
          return {
            ok: false,
            error: 'validation',
            fields: { preferredDate: 'Please choose a working day within the next 60 days.' },
          };
        }
        const [_, y, m, d] = dateMatch.map(Number);
        const chosenDate = new Date(Date.UTC(y, m - 1, d));
        if (
          chosenDate.getUTCFullYear() !== y ||
          chosenDate.getUTCMonth() !== m - 1 ||
          chosenDate.getUTCDate() !== d
        ) {
          return {
            ok: false,
            error: 'validation',
            fields: { preferredDate: 'Please choose a working day within the next 60 days.' },
          };
        }

        // Calculate tomorrow and 60 days ahead
        const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        const [tY, tM, tD] = todayStr.split('-').map(Number);
        const todayDate = new Date(Date.UTC(tY, tM - 1, tD));
        const tomorrowDate = new Date(todayDate);
        tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 1);
        const maxDate = new Date(todayDate);
        maxDate.setUTCDate(maxDate.getUTCDate() + 60);

        if (chosenDate < tomorrowDate || chosenDate > maxDate) {
          return {
            ok: false,
            error: 'validation',
            fields: { preferredDate: 'Please choose a working day within the next 60 days.' },
          };
        }

        const dayOfWeek = chosenDate.getUTCDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
        const workingDays = contact.workingDays || [1, 2, 3, 4, 5];
        if (!workingDays.includes(dayOfWeek)) {
          return {
            ok: false,
            error: 'validation',
            fields: { preferredDate: 'Please choose a working day within the next 60 days.' },
          };
        }

        cleanDetails.preferredDate = trimmed;
      } else if (def.type === 'select') {
        if (typeof val !== 'string') {
          return {
            ok: false,
            error: 'validation',
            fields: { [key]: `Invalid value for ${def.label}.` },
          };
        }
        const trimmed = val.trim();
        // Check if value is in allowed options
        if (!def.options.includes(trimmed)) {
          return {
            ok: false,
            error: 'validation',
            fields: { [key]: `Invalid option for ${def.label}.` },
          };
        }
        cleanDetails[key] = trimmed;
      } else if (def.type === 'text') {
        if (typeof val !== 'string') {
          return {
            ok: false,
            error: 'validation',
            fields: { [key]: `${def.label} must be text.` },
          };
        }
        const trimmed = val.trim();
        if (def.maxLength && trimmed.length > def.maxLength) {
          return {
            ok: false,
            error: 'validation',
            fields: {
              [key]: `${def.label} must be at most ${def.maxLength} characters.`,
            },
          };
        }
        if (trimmed) {
          cleanDetails[key] = trimmed;
        }
      }
    }
  }

  return {
    ok: true,
    formType,
    cleanDetails,
    cleanMessage,
  };
}
