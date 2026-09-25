import React, { useState } from 'react';
import { X, CheckCircle, Calendar, GraduationCap } from 'lucide-react';

export default function AppointmentModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'United Kingdom',
    studyLevel: 'Master\'s Degree',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F3A]/60 backdrop-blur-sm transition-opacity animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="bg-white rounded-2xl max-w-[500px] w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/15 flex items-center justify-center text-[#0B1F3A]">
                <GraduationCap className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <h2 id="modalTitle" className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
                Book Free Consultation
              </h2>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Connect with senior study abroad advisors at Adam International.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alexander Vance"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2834"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Preferred Target Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent bg-white"
                >
                  <option value="United Kingdom">United Kingdom (UK)</option>
                  <option value="United States">United States (USA)</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany / Europe</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0B1F3A] hover:bg-navy-dark text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md text-sm mt-2"
              >
                Confirm Appointment Request
              </button>
            </form>
          </>
        ) : (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-[#0B1F3A]">Appointment Request Received!</h3>
            <p className="text-sm text-gray-600">
              Our educational counselors will get in touch with you shortly.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
