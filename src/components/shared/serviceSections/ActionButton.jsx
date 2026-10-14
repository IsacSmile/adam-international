import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointment } from '../../../context/AppointmentContext';
import { useLenis } from '../../SmoothScroll';
import { ArrowRight, Phone, MessageCircle } from 'lucide-react';

export function handleButtonAction(action, { openAppointment, navigate, lenis, defaultService } = {}) {
  if (!action) return;

  if (typeof action === 'function') {
    action();
    return;
  }

  const type = action.type;

  if (type === 'appointment') {
    openAppointment?.({ service: action.service || defaultService });
  } else if (type === 'link') {
    if (action.to) {
      if (action.to.startsWith('http')) {
        window.open(action.to, '_blank', 'noopener,noreferrer');
      } else {
        navigate?.(action.to);
      }
    }
  } else if (type === 'scroll') {
    const target = action.to?.startsWith('#') ? action.to : `#${action.to}`;
    if (lenis) {
      lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    } else {
      const el = document.querySelector(target);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  } else if (type === 'whatsapp') {
    window.open('https://wa.me/919895890500', '_blank', 'noopener,noreferrer');
  } else if (type === 'tel') {
    window.location.href = 'tel:+919895890500';
  }
}

export default function ActionButton({
  action,
  label,
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  defaultService,
  icon,
  onClick,
}) {
  const navigate = useNavigate();
  const { openAppointment } = useAppointment();
  const lenis = useLenis();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!action) return;
    handleButtonAction(action, { openAppointment, navigate, lenis, defaultService });
  };

  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 cursor-pointer rounded-xl select-none';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  const variantStyles = {
    primary:
      'bg-[#C9A84C] hover:bg-[#DFBE7A] text-[#0B1F3A] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm',
    navy:
      'bg-[#0B1F3A] hover:bg-[#13335F] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0',
    outline:
      'bg-transparent hover:bg-slate-100 text-[#0B1F3A] border border-slate-300 hover:border-[#0B1F3A]',
    goldOutline:
      'bg-transparent hover:bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]',
    ghost:
      'bg-transparent hover:bg-slate-100 text-[#0B1F3A] hover:text-[#C9A84C]',
  };

  const content = label || children;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
    >
      <span>{content}</span>
      {icon === true ? (
        action?.type === 'whatsapp' ? (
          <MessageCircle className="w-4 h-4" />
        ) : action?.type === 'tel' ? (
          <Phone className="w-4 h-4" />
        ) : (
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        )
      ) : (
        icon
      )}
    </button>
  );
}
