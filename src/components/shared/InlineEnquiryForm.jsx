import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { getFormFieldDefinitions } from '../../data/formFields';

export default function InlineEnquiryForm({
  formType = 'appointment',
  fields = [],
  fieldLabels = {},
  submitLabel = 'Send Enquiry',
  successTitle = "Thanks, we've received your enquiry.",
  successText = 'Our team will contact you, usually within one working day.',
  note = null,
  initialValues = {},
}) {
  const formDefs = getFormFieldDefinitions();

  // Merge default per-formType overrides with passed fieldLabels
  const defaultOverrides =
    formType === 'visa' ? { country: 'Preferred study destination' } : {};
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
    };
    fields.forEach((fKey) => {
      initial[fKey] = initialValues[fKey] || '';
    });
    return initial;
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

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
      fields.forEach((key) => {
        if (key !== 'message' && formData[key] !== undefined && formData[key] !== '') {
          details[key] = formData[key];
        }
      });

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
        setIsSuccess(true);
        setErrors({});
      } else {
        setSubmitError(
          "Sorry, something went wrong and your request wasn't sent. Please try again, or call us on +91 9895 890 500."
        );
      }
    } catch (err) {
      setSubmitError(
        "Sorry, something went wrong and your request wasn't sent. Please try again, or call us on +91 9895 890 500."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-8 sm:p-10 text-center space-y-4 animate-fadeIn">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
          {successTitle}
        </h3>
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
          {successText}
        </p>
        <div className="pt-2 flex items-center justify-center gap-6 text-xs sm:text-sm font-semibold">
          <a
            href="https://wa.me/919895890500"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
          <span className="text-slate-300">•</span>
          <a
            href="tel:+919895890500"
            className="inline-flex items-center gap-1.5 text-[#0B1F3A] hover:text-[#C9A84C]"
          >
            <Phone className="w-4 h-4 text-[#C9A84C]" />
            <span>Call +91 9895 890 500</span>
          </a>
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
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
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
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
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
            placeholder="10-digit mobile number"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
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
        {fields.map((fKey) => {
          const def = formDefs[fKey];
          if (!def) return null;

          const isFullWidth = def.type === 'textarea' || fKey === 'budget';
          const label = mergedFieldLabels[fKey] || def.label;

          return (
            <div key={fKey} className={isFullWidth ? 'md:col-span-2' : ''}>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {label}
              </label>

              {def.type === 'select' ? (
                <select
                  value={formData[fKey] || ''}
                  onChange={(e) => handleChange(fKey, e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                >
                  <option value="">Select option…</option>
                  {def.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : def.type === 'textarea' ? (
                <textarea
                  rows={4}
                  maxLength={def.maxLength || 2000}
                  placeholder={def.placeholder || ''}
                  value={formData[fKey] || ''}
                  onChange={(e) => handleChange(fKey, e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                />
              ) : (
                <input
                  type="text"
                  maxLength={def.maxLength || 100}
                  placeholder={def.placeholder || ''}
                  value={formData[fKey] || ''}
                  onChange={(e) => handleChange(fKey, e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                />
              )}

              {errors[fKey] && (
                <p className="text-xs text-rose-500 font-medium mt-1">{errors[fKey]}</p>
              )}
            </div>
          );
        })}
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
          href="https://wa.me/919895890500"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Chat on WhatsApp</span>
        </a>
        <span className="text-slate-300">•</span>
        <a
          href="tel:+919895890500"
          className="inline-flex items-center gap-1.5 font-semibold text-[#0B1F3A] hover:text-[#C9A84C] transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span>Call +91 9895 890 500</span>
        </a>
      </div>
    </form>
  );
}
