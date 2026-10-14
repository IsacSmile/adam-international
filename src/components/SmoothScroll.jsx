import React, { useEffect, createContext, useContext, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScroll({ children }) {
  const [lenisInstance, setLenisInstance] = useState(null);

  useEffect(() => {
    // Initialize Lenis Smooth Scroll across mobile and desktop
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.8,
    });

    setLenisInstance(lenis);
    if (typeof window !== 'undefined') {
      window.__lenis = lenis;
    }

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      setLenisInstance(null);
      if (typeof window !== 'undefined') {
        window.__lenis = null;
      }
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}
