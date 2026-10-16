import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Check, Calendar, AlertCircle } from 'lucide-react';
import { getFormFieldDefinitions, PREFERRED_TIME_OPTIONS } from '../../data/formFields';
import { contact, whatsappLink } from '../../data/contact';
import { countries } from '../../data/countries';
import SelectField from './SelectField';
import WhatsAppIcon from './WhatsAppIcon';

export default function InlineEnquiryForm({
  formType = 'appointment',
  fields = [],
  fieldLabels = {},
  submitLabel = 'Send Enquiry',
  successTitle = "Thanks, we've received your enquiry.",
  successText = 'Our team will contact you, usually within one working day.',
  note = null,
  initialValues = {},
  onSuccess,
}) {
  const formDefs = getFormFieldDefinitions();

  const effectiveFields = useMemo(() => {
    if (fields && fields.length > 0) return fields;
    if (formType === 'contact') return ['country', 'message'];
    return [];
  }, [fields, formType]);

  // Merge default per-formType overrides with passed fieldLabels
  const defaultOverrides =
    formType === 'visa'
      ? { country: 'Preferred study destination' }
      : formType === 'contact'
      ? { country: 'Preferred Study Destination', message: 'Your Message' }
      : {};
  const mergedFieldLabels = { ...defaultOverrides, ...fieldLabels };

  const [formData, setFormData] = useState(() => {
    const initial = {
      name: '',
      email: '',
      phone: '',
      whatsapp: true,
      consent: false,
      company_website: '',
      message: '',
      preferredDate: '',
      preferredTime: '',
    };
    effectiveFields.forEach((fKey) => {
      let val = initialValues[fKey] || '';
      if (fKey === 'country' && val) {
        const found = countries.find(
          (c) =>
            c.slug.toLowerCase() === val.toLowerCase() ||
            c.name.toLowerCase() === val.toLowerCase()
        );
        if (found) val = found.name;
      }
      initial[fKey] = val;
    });
    return initial;
  });

  const [bookConsultation, setBookConsultation] = useState(false);
  const [submittedConsultation, setSubmittedConsultation] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const istLimits = useMemo(() => {
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const [y, m, d] = todayStr.split('-').map(Number);
    const tomorrow = new Date(Date.UTC(y, m - 1, d + 1));
    const maxDate = new Date(Date.UTC(y, m - 1, d + 60));
    return {
      min: tomorrow.toISOString().slice(0, 10),
      max: maxDate.toISOString().slice(0, 10),
    };
  }, []);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    const trimmedName = formData.name.trim();
    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
      newErrors.name = 'Please enter your name.';
    }

    const trimmedEmail = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || trimmedEmail.length > 254 || !emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const strippedPhone = formData.phone.trim().replace(/[\s\-]/g, '');
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(strippedPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (formType === 'contact') {
      const msg = (formData.message || '').trim();
      if (!msg || msg.length < 10) {
        newErrors.message = 'Please enter a message of at least 10 characters.';
      }
      if (bookConsultation) {
        if (!formData.preferredDate) {
          newErrors.preferredDate = 'Please choose a working day within the next 60 days.';
        } else {
          const match = formData.preferredDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
          if (!match) {
            newErrors.preferredDate = 'Please choose a working day within the next 60 days.';
          } else {
            const [_, y, m, d] = match.map(Number);
            const chosen = new Date(Date.UTC(y, m - 1, d));
            const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
            const [tY, tM, tD] = todayStr.split('-').map(Number);
            const tomorrow = new Date(Date.UTC(tY, tM - 1, tD + 1));
            const maxDate = new Date(Date.UTC(tY, tM - 1, tD + 60));
            const workingDays = contact.workingDays || [1, 2, 3, 4, 5];
            if (
              chosen.getUTCFullYear() !== y ||
              chosen.getUTCMonth() !== m - 1 ||
              chosen.getUTCDate() !== d ||
              chosen < tomorrow ||
              chosen > maxDate ||
              !workingDays.includes(chosen.getUTCDay())
            ) {
              newErrors.preferredDate = 'Please choose a working day within the next 60 days.';
            }
          }
        }
        if (!formData.preferredTime) {
          newErrors.preferredTime = 'Please select a preferred time.';
        }
      }
    }

    if (formData.consent !== true) {
      newErrors.consent = 'Please tick the box so we can contact you.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const details = {};
      if (initialValues && typeof initialValues === 'object') {
        Object.entries(initialValues).forEach(([k, v]) => {
          if (k !== 'message' && v !== undefined && v !== null && v !== '') {
            details[k] = v;
          }
        });
      }
      effectiveFields.forEach((key) => {
        if (key !== 'message' && formData[key] !== undefined && formData[key] !== '') {
          details[key] = formData[key];
        }
      });

      if (formType === 'contact' && bookConsultation) {
        if (formData.preferredDate) details.preferredDate = formData.preferredDate;
        if (formData.preferredTime) details.preferredTime = formData.preferredTime;
      }

      const payload = {
        formType,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        whatsapp: Boolean(formData.whatsapp),
        details,
        message: formData.message ? formData.message.trim() : undefined,
        company_website: formData.company_website,
        consent: formData.consent,
        source_page: typeof window !== 'undefined' ? window.location.pathname : '/',
      };

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        if (formType === 'contact' && bookConsultation && formData.preferredDate && formData.preferredTime) {
          const [y, m, d] = formData.preferredDate.split('-').map(Number);
          const dt = new Date(Date.UTC(y, m - 1, d));
          const formattedDate = dt.toLocaleDateString('en-GB', {
            timeZone: 'UTC',
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
          setSubmittedConsultation({
            formattedDate,
            time: formData.preferredTime,
          });
        }
        setIsSuccess(true);
        setErrors({});
        if (onSuccess) onSuccess(true);
      } else {
        setSubmitError(
          `Sorry, something went wrong and your request wasn't sent. Please try again, or call us on ${contact.phoneDisplay}.`
        );
      }
    } catch (err) {
      setSubmitError(
        `Sorry, something went wrong and your request wasn't sent. Please try again, or call us on ${contact.phoneDisplay}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-6 sm:py-10 text-center space-y-6 animate-fadeIn">
        {/* Elegant Check Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
          <Check className="w-8 h-8 stroke-[2.5]" />
        </div>

        {/* Heading & Subtext */}
        <div className="space-y-2 max-w-lg mx-auto">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
            {successTitle}
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {successText}
          </p>
        </div>

        {/* Requested Consultation Summary Card */}
        {submittedConsultation && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 max-w-md mx-auto text-left flex items-start gap-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/15 flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-5 h-5 text-[#0B1F3A]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Requested Consultation
              </span>
              <p className="text-sm font-bold text-[#0B1F3A] truncate">
                {submittedConsultation.formattedDate}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                {submittedConsultation.time}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 text-xs sm:text-sm font-semibold border border-emerald-200/80 transition-colors shadow-xs active:scale-98"
          >
            <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
            <span>Chat on WhatsApp</span>
          </a>
          <a
            href={`tel:${contact.phoneTel}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#0B1F3A] text-xs sm:text-sm font-semibold border border-slate-200 transition-colors shadow-xs active:scale-98"
          >
            <Phone className="w-4 h-4 text-[#C9A84C]" />
            <span>Call {contact.phoneDisplay}</span>
          </a>
        </div>

        {/* Reset / Send another message */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setSubmittedConsultation(null);
              if (onSuccess) onSuccess(false);
            }}
            className="text-xs font-semibold text-slate-400 hover:text-[#0B1F3A] transition-colors cursor-pointer"
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot */}
      <input
        type="text"
        name="company_website"
        tabIndex="-1"
        autoComplete="off"
        value={formData.company_website}
        onChange={(e) => handleChange('company_website', e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {mergedFieldLabels.name || 'Full Name'} <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
              errors.name
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:ring-[#C9A84C] focus:border-transparent'
            }`}
          />
          {errors.name && (
            <p className="text-xs text-rose-500 font-medium mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {mergedFieldLabels.email || 'Email Address'} <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:ring-[#C9A84C] focus:border-transparent'
            }`}
          />
          {errors.email && (
            <p className="text-xs text-rose-500 font-medium mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {mergedFieldLabels.phone || 'Phone Number'} <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            inputMode="tel"
            placeholder="10-digit mobile number"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
              errors.phone
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:ring-[#C9A84C] focus:border-transparent'
            }`}
          />
          {errors.phone && (
            <p className="text-xs text-rose-500 font-medium mt-1">{errors.phone}</p>
          )}

          {/* WhatsApp checkbox */}
          <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#0B1F3A] focus:ring-[#C9A84C] cursor-pointer"
            />
            <span className="text-xs text-slate-600">This number is on WhatsApp</span>
          </label>
        </div>

        {/* Dynamic Optional Fields */}
        {effectiveFields.map((fKey) => {
          const def = formDefs[fKey];
          if (!def) return null;

          const isFullWidth = def.type === 'textarea' || fKey === 'budget' || fKey === 'message';
          const label = mergedFieldLabels[fKey] || def.label;
          const isRequired = formType === 'contact' && fKey === 'message';

          return (
            <div key={fKey} className={isFullWidth ? 'md:col-span-2' : ''}>
              {def.type === 'select' ? (
                <SelectField
                  id={`ief-${fKey}`}
                  name={fKey}
                  label={label}
                  required={isRequired}
                  value={formData[fKey] || ''}
                  onChange={(e) => handleChange(fKey, e.target.value)}
                  groups={def.optgroups}
                  options={
                    def.optgroups
                      ? def.trailingOption
                        ? [{ value: def.trailingOption, label: def.trailingOption }]
                        : undefined
                      : def.options
                  }
                  placeholder={def.placeholder || 'Select option…'}
                  searchable={fKey === 'country'}
                  error={errors[fKey]}
                />
              ) : (
                <>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {label} {isRequired && <span className="text-rose-500">*</span>}
                  </label>

                  {def.type === 'textarea' ? (
                    <textarea
                      rows={4}
                      maxLength={def.maxLength || 2000}
                      placeholder={def.placeholder || ''}
                      value={formData[fKey] || ''}
                      onChange={(e) => handleChange(fKey, e.target.value)}
                      className={`w-full min-h-[100px] px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                        errors[fKey]
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-200 focus:ring-[#C9A84C]'
                      }`}
                    />
                  ) : (
                    <input
                      type="text"
                      maxLength={def.maxLength || 100}
                      placeholder={def.placeholder || ''}
                      value={formData[fKey] || ''}
                      onChange={(e) => handleChange(fKey, e.target.value)}
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                        errors[fKey]
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-200 focus:ring-[#C9A84C]'
                      }`}
                    />
                  )}

                  {errors[fKey] && (
                    <p className="text-xs text-rose-500 font-medium mt-1">{errors[fKey]}</p>
                  )}
                </>
              )}
            </div>
          );
        })}

        {/* Consultation Option (for contact form) */}
        {formType === 'contact' && (
          <div className="md:col-span-2 pt-2 border-t border-slate-100 space-y-4">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={bookConsultation}
                onChange={(e) => {
                  setBookConsultation(e.target.checked);
                  if (!e.target.checked) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.preferredDate;
                      delete next.preferredTime;
                      return next;
                    });
                  }
                }}
                className="w-4 h-4 rounded border-slate-300 text-[#0B1F3A] focus:ring-[#C9A84C] cursor-pointer"
              />
              <span className="text-sm font-semibold text-[#0B1F3A]">
                I'd like to book a consultation
              </span>
            </label>

            {bookConsultation && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
                {/* Preferred Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    min={istLimits.min}
                    max={istLimits.max}
                    value={formData.preferredDate || ''}
                    onChange={(e) => handleChange('preferredDate', e.target.value)}
                    className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 appearance-none max-w-full ${
                      errors.preferredDate
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-200 focus:ring-[#C9A84C]'
                    }`}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Choose a working day.</p>
                  {errors.preferredDate && (
                    <p className="text-xs text-rose-500 font-medium mt-1">{errors.preferredDate}</p>
                  )}
                </div>

                {/* Preferred Time */}
                <div>
                  <SelectField
                    id="ief-preferredTime"
                    name="preferredTime"
                    label="Preferred time"
                    required={true}
                    value={formData.preferredTime || ''}
                    onChange={(e) => handleChange('preferredTime', e.target.value)}
                    options={PREFERRED_TIME_OPTIONS}
                    placeholder="Select time…"
                    error={errors.preferredTime}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Consent Checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.consent}
            onChange={(e) => handleChange('consent', e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#0B1F3A] focus:ring-[#C9A84C] cursor-pointer"
          />
          <span className="text-xs text-slate-600 leading-snug">
            I agree to Adam International contacting me by phone, email or WhatsApp about my enquiry, and I've read the{' '}
            <Link to="/privacy-policy" className="text-[#0B1F3A] underline font-medium hover:text-[#C9A84C]">
              Privacy Policy
            </Link>. <span className="text-rose-500">*</span>
          </span>
        </label>
        {errors.consent && (
          <p className="text-xs text-rose-500 font-medium mt-1">{errors.consent}</p>
        )}
      </div>

      {/* Note, if specified */}
      {note && (
        <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          {note}
        </p>
      )}

      {/* Submit Error */}
      {submitError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 px-6 rounded-xl bg-[#0B1F3A] hover:bg-[#13335F] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg cursor-pointer"
      >
        {isSubmitting ? 'Sending…' : submitLabel}
      </button>

      {/* Contact Quick Row Under Button */}
      <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-700" />
          <span>Chat on WhatsApp</span>
        </a>
        <span className="text-slate-300">•</span>
        <a
          href={`tel:${contact.phoneTel}`}
          className="inline-flex items-center gap-1.5 font-semibold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span>Call {contact.phoneDisplay}</span>
        </a>
      </div>
    </form>
  );
}

