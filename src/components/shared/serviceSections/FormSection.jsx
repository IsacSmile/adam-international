import React, { useState } from 'react';
import InlineEnquiryForm from '../InlineEnquiryForm';

export default function FormSection({
  id,
  heading,
  sub,
  formType,
  fields,
  fieldLabels,
  submitLabel,
  successTitle,
  successText,
  note,
  initialValues,
}) {
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <section id={id} className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-[760px] mx-auto">
        {/* Section Heading & Sub */}
        {!isSuccess && (heading || sub) && (
          <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
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
        )}

        <InlineEnquiryForm
          formType={formType}
          fields={fields}
          fieldLabels={fieldLabels}
          submitLabel={submitLabel}
          successTitle={successTitle}
          successText={successText}
          note={note}
          initialValues={initialValues}
          onSuccess={(status) => setIsSuccess(Boolean(status))}
        />
      </div>
    </section>
  );
}
