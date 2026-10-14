import React from 'react';

import IntroSection from './serviceSections/IntroSection';
import CardGridSection from './serviceSections/CardGridSection';
import ChecklistSection from './serviceSections/ChecklistSection';
import TimelineSection from './serviceSections/TimelineSection';
import TwoColumnListsSection from './serviceSections/TwoColumnListsSection';
import FeatureBandSection from './serviceSections/FeatureBandSection';
import CountryGridSection from './serviceSections/CountryGridSection';
import UniversityGridSection from './serviceSections/UniversityGridSection';
import ProgrammeListSection from './serviceSections/ProgrammeListSection';
import ScholarshipListSection from './serviceSections/ScholarshipListSection';
import StoryStripSection from './serviceSections/StoryStripSection';
import CourseFinderSection from './serviceSections/CourseFinderSection';
import FormSection from './serviceSections/FormSection';
import FaqSection from './serviceSections/FaqSection';
import LinkCardsSection from './serviceSections/LinkCardsSection';
import ServicesListSection from './serviceSections/ServicesListSection';

const SECTION_COMPONENTS = {
  intro: IntroSection,
  cardGrid: CardGridSection,
  checklist: ChecklistSection,
  timeline: TimelineSection,
  twoColumnLists: TwoColumnListsSection,
  featureBand: FeatureBandSection,
  countryGrid: CountryGridSection,
  universityGrid: UniversityGridSection,
  programmeList: ProgrammeListSection,
  scholarshipList: ScholarshipListSection,
  storyStrip: StoryStripSection,
  courseFinder: CourseFinderSection,
  form: FormSection,
  faq: FaqSection,
  linkCards: LinkCardsSection,
  serviceCards: ServicesListSection,
};

export default function ServiceSections({ sections = [], defaultService }) {
  if (!Array.isArray(sections) || sections.length === 0) {
    return null;
  }

  return (
    <div className="service-sections">
      {sections.map((section, idx) => {
        if (!section || !section.type) return null;

        const Component = SECTION_COMPONENTS[section.type];
        if (!Component) {
          console.warn(`[ServiceSections] Unknown section type: ${section.type}`);
          return null;
        }

        const key = section.id || `${section.type}-${idx}`;

        return (
          <Component
            key={key}
            {...section}
            defaultService={defaultService}
          />
        );
      })}
    </div>
  );
}
