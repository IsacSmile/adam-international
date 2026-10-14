import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from '../SmoothScroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    const activeLenis = lenis || (typeof window !== 'undefined' ? window.__lenis : null);

    if (hash) {
      // Allow DOM to settle, then scroll to the hash anchor with header offset
      const timer = setTimeout(() => {
        const headerEl = document.querySelector('header');
        const headerHeight = headerEl ? headerEl.offsetHeight : 80;

        const targetEl = document.querySelector(hash);
        if (targetEl) {
          if (activeLenis) {
            activeLenis.scrollTo(targetEl, { offset: -headerHeight, duration: 1.2 });
          } else {
            const top = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
        ScrollTrigger.refresh();
      }, 100);

      return () => clearTimeout(timer);
    } else {
      // Instant scroll to top on route change without hash
      if (activeLenis) {
        activeLenis.scrollTo(0, { immediate: true });
      } else if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }

      // Refresh ScrollTrigger calculations after content mounts
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 50);

      return () => clearTimeout(refreshTimer);
    }
  }, [pathname, hash, lenis]);

  return null;
}
