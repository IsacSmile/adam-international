import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Info } from 'lucide-react';
import { getVisibleUniversities } from '../../../lib/universities';
import { countries } from '../../../data/countries';
import SelectField from '../SelectField';

export default function CourseFinderSection({
  id = 'course-finder',
  heading = 'University & Course Finder',
  sub = 'Search the universities and programmes we currently support.',
}) {
  const navigate = useNavigate();

  const visibleUniversities = useMemo(() => getVisibleUniversities(), []);

  // Extract available countries from universities list
  const availableCountries = useMemo(() => {
    const uniCountrySlugs = new Set(visibleUniversities.map((u) => u.country).filter(Boolean));
    return countries
      .filter((c) => uniCountrySlugs.has(c.slug))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [visibleUniversities]);

  // Extract study levels from available programmes
  const availableLevels = useMemo(() => {
    const levels = new Set();
    visibleUniversities.forEach((u) => {
      (u.programs || []).forEach((p) => {
        if (p.level) levels.add(p.level);
      });
    });
    return Array.from(levels);
  }, [visibleUniversities]);

  // Extract subject areas from available programmes
  const availableSubjects = useMemo(() => {
    const subjects = new Set();
    visibleUniversities.forEach((u) => {
      (u.programs || []).forEach((p) => {
        const name = p.name || p.title;
        if (name) subjects.add(name);
      });
    });
    return Array.from(subjects);
  }, [visibleUniversities]);

  // Extract intakes from available programmes
  const availableIntakes = useMemo(() => {
    const intakes = new Set();
    visibleUniversities.forEach((u) => {
      (u.programs || []).forEach((p) => {
        if (Array.isArray(p.intakes)) {
          p.intakes.forEach((intk) => intakes.add(intk));
        } else if (p.intake) {
          intakes.add(p.intake);
        }
      });
    });
    return Array.from(intakes);
  }, [visibleUniversities]);

  // Filter selections
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedIntake, setSelectedIntake] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (selectedCountry) query.set('country', selectedCountry);
    if (selectedLevel) query.set('level', selectedLevel);
    if (selectedSubject) query.set('subject', selectedSubject);
    if (selectedIntake) query.set('intake', selectedIntake);

    const queryString = query.toString();
    navigate(queryString ? `/universities?${queryString}` : '/universities');
  };

  return (
    <section id={id} className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-[1040px] mx-auto">
        
        {/* Header */}
        <div className="max-w-2xl mb-8 sm:mb-10 text-center mx-auto">
          {heading && (
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
              {heading}
            </h2>
          )}
          {sub && (
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {sub}
            </p>
          )}
        </div>

        {/* Finder Card Form */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Country: Always shown */}
            <SelectField
              id="cf-country"
              name="country"
              label="Country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              options={[
                { value: '', label: 'All Destinations' },
                ...availableCountries.map((c) => ({
                  value: c.slug,
                  label: `${c.flag} ${c.name}`,
                })),
              ]}
              placeholder="All Destinations"
              searchable={true}
            />

            {/* 2. Study Level: Only shown if options exist */}
            {availableLevels.length > 0 && (
              <SelectField
                id="cf-level"
                name="level"
                label="Study Level"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                options={[
                  { value: '', label: 'All Levels' },
                  ...availableLevels.map((lvl) => ({ value: lvl, label: lvl })),
                ]}
                placeholder="All Levels"
              />
            )}

            {/* 3. Subject Area: Only shown if options exist, or free-text search */}
            {availableSubjects.length > 0 && (
              <SelectField
                id="cf-subject"
                name="subject"
                label="Subject Area"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                options={[
                  { value: '', label: 'All Subjects' },
                  ...availableSubjects.map((subj) => ({ value: subj, label: subj })),
                ]}
                placeholder="All Subjects"
              />
            )}

            {/* 4. Preferred Intake: Only shown if options exist */}
            {availableIntakes.length > 0 && (
              <SelectField
                id="cf-intake"
                name="intake"
                label="Preferred Intake"
                value={selectedIntake}
                onChange={(e) => setSelectedIntake(e.target.value)}
                options={[
                  { value: '', label: 'All Intakes' },
                  ...availableIntakes.map((intk) => ({ value: intk, label: intk })),
                ]}
                placeholder="All Intakes"
              />
            )}

          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500 italic">
              <Info className="w-3.5 h-3.5 text-[#C9A84C] shrink-0 not-italic" />
              <span>Only verified, currently available programmes and intakes are listed.</span>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#13335F] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4 text-[#C9A84C]" />
              <span>Find My University →</span>
            </button>
          </div>
        </form>

      </div>
    </section>
  );
}
