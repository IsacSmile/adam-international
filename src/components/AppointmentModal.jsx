import React, { useState, useEffect } from 'react';
import { X, CheckCircle, GraduationCap, Building2 } from 'lucide-react';
import { useAppointment } from '../context/AppointmentContext';
import { countries } from '../data/countries';
import { services } from '../data/services';
import { branches } from '../data/branches';
import { universities } from '../data/universities';

export default function AppointmentModal({ isOpen: propIsOpen, onClose: propOnClose }) {
  let contextAppointment = null;
  try {
    contextAppointment = useAppointment();
  } catch (e) {
    // Graceful fallback if rendered outside AppointmentProvider
  }

  const isOpen = propIsOpen !== undefined ? propIsOpen : contextAppointment?.isOpen;
  const onClose = propOnClose || contextAppointment?.closeAppointment;
  const appointmentData = contextAppointment?.appointmentData;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'Not sure yet',
    service: 'Not sure yet',
    branch: 'Not sure yet',
    university: '',
    universitySlug: '',
    company_website: '',
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pre-fill from openAppointment(...) arguments
  useEffect(() => {
    if (isOpen) {
      let matchedCountryName = 'Not sure yet';
      if (appointmentData?.country) {
        const foundC = countries.find(
          (c) =>
            c.slug === appointmentData.country ||
            c.name.toLowerCase() === appointmentData.country.toLowerCase()
        );
        if (foundC) {
          matchedCountryName = foundC.name;
        } else if (appointmentData.country !== 'all') {
          matchedCountryName = appointmentData.country;
        }
      }

      let matchedServiceTitle = 'Not sure yet';
      if (appointmentData?.service) {
        const foundS = services.find(
          (s) =>
            s.slug === appointmentData.service ||
            s.title.toLowerCase() === appointmentData.service.toLowerCase()
        );
        if (foundS) {
          matchedServiceTitle = foundS.title;
        } else {
          matchedServiceTitle = appointmentData.service;
        }
      }

      let matchedUnivName = '';
      let matchedUnivSlug = '';
      if (appointmentData?.university) {
        const foundU = universities.find(
          (u) =>
            u.slug === appointmentData.university ||
            u.name.toLowerCase() === appointmentData.university.toLowerCase()
        );
        matchedUnivName = foundU ? foundU.name : appointmentData.university;
        matchedUnivSlug = foundU ? foundU.slug : appointmentData.university;
      }

      let matchedBranchName = 'Not sure yet';
      if (appointmentData?.branch) {
        const foundB = branches.find(
          (b) =>
            (typeof b === 'object' ? b.name : b).toLowerCase() ===
              appointmentData.branch.toLowerCase() ||
            (typeof b === 'object' ? b.slug : b).toLowerCase() ===
              appointmentData.branch.toLowerCase()
        );
        matchedBranchName = foundB
          ? (typeof foundB === 'object' ? foundB.name : foundB)
          : appointmentData.branch;
      }

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        country: matchedCountryName,
        service: matchedServiceTitle,
        branch: matchedBranchName,
        university: matchedUnivName,
        universitySlug: matchedUnivSlug,
        company_website: '',
        consent: false,
      });

      setErrors({});
      setSubmitError(null);
      setIsSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen, appointmentData]);

  const handleClose = () => {
    if (onClose) onClose();
    // Reset the form after the modal closes
    setIsSuccess(false);
    setSubmitError(null);
    setErrors({});
    setIsSubmitting(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      country: 'Not sure yet',
      service: 'Not sure yet',
      branch: 'Not sure yet',
      university: '',
      universitySlug: '',
      company_website: '',
      consent: false,
    });
  };

  // Handle ESC key and scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    const trimmedName = formData.fullName.trim();
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
      const payload = {
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        country: formData.country,
        service: formData.service,
        branch: formData.branch,
        university: formData.universitySlug || formData.university,
        company_website: formData.company_website,
        consent: formData.consent,
        source_page: window.location.pathname || '/',
      };

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data && data.ok) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F3A]/60 backdrop-blur-sm transition-opacity animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-[520px] w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/15 flex items-center justify-center text-[#0B1F3A]">
                <GraduationCap className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <h2 id="modalTitle" className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
                Book Free Consultation
              </h2>
            </div>
            
            {/* Modal Subtitle */}
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              Leave your details and an advisor will call you back, usually within one working day.
            </p>

            {/* University Pre-fill indicator if passed */}
            {formData.university && (
              <div className="mb-5 p-3.5 bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/20 flex items-center justify-center text-[#0B1F3A] shrink-0">
                  <Building2 className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Enquiring about
                  </div>
                  <div className="text-sm font-bold text-[#0B1F3A] truncate">
                    {formData.university}
                  </div>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 leading-relaxed">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Honeypot field (hidden from view and assistive tech) */}
              <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <label htmlFor="company_website">Company Website</label>
                <input
                  id="company_website"
                  type="text"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={formData.company_website}
                  onChange={(e) =>
                    setFormData({ ...formData, company_website: e.target.value })
                  }
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anjali Nair"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-slate-800 ${
                    errors.name ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="anjali@example.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-slate-800 ${
                      errors.email ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98xxx xxxxx"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: null });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-slate-800 ${
                      errors.phone ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Country & Service Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Country you're interested in
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent bg-white text-slate-800"
                  >
                    <option value="Not sure yet">Not sure yet</option>
                    {countries.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Service you're interested in
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) =>
                      setFormData({ ...formData, service: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent bg-white text-slate-800"
                  >
                    <option value="Not sure yet">Not sure yet</option>
                    {services.map((s) => (
                      <option key={s.slug} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nearest branch (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Nearest branch
                </label>
                <select
                  value={formData.branch}
                  onChange={(e) =>
                    setFormData({ ...formData, branch: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent bg-white text-slate-800"
                >
                  <option value="Not sure yet">Not sure yet</option>
                  {branches.map((b) => {
                    const name = typeof b === 'object' ? b.name : b;
                    return (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    );
                  })}
                </select>

              </div>

              {/* Required Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => {
                      setFormData({ ...formData, consent: e.target.checked });
                      if (errors.consent) setErrors({ ...errors, consent: null });
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#0B1F3A] focus:ring-[#C9A84C] cursor-pointer"
                  />
                  <span className="leading-relaxed">
                    I agree to Adam International contacting me by phone, email or WhatsApp about my enquiry, and I've read the{' '}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0B1F3A] underline font-semibold hover:text-[#C9A84C]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Privacy Policy
                    </a>.
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-xs text-red-600 mt-1">{errors.consent}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0B1F3A] hover:bg-[#13335F] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md text-sm mt-3 cursor-pointer"
              >
                {isSubmitting ? 'Sending…' : 'Request a Callback'}
              </button>
            </form>
          </>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 id="modalTitle" className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
              Thanks, we've got your details.
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
              An advisor will call you back, usually within one working day. If it's urgent, call us on{' '}
              <a
                href="tel:+919895890500"
                className="text-[#0B1F3A] font-semibold hover:text-[#C9A84C] whitespace-nowrap"
              >
                +91 9895 890 500
              </a>.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center justify-center bg-[#0B1F3A] hover:bg-[#13335F] text-white font-bold py-2.5 px-8 rounded-lg transition-colors text-sm cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
