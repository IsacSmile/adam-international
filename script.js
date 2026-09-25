/**
 * Adam International - Header & Navigation Interactivity
 * Handles scroll effects, mobile drawer toggle, accessible dropdowns, and modal dialogs.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Element References ---
  const header = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mobileDropdownToggle = document.getElementById('mobileServicesToggle');
  const mobileSubMenu = document.getElementById('mobileSubMenu');
  const appointmentModal = document.getElementById('appointmentModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const bookBtns = document.querySelectorAll('.js-book-btn');

  // ==========================================================================
  // 1. STICKY HEADER SHADOW ON SCROLL
  // ==========================================================================
  const handleScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // ==========================================================================
  // 2. MOBILE DRAWER NAVIGATION TOGGLE
  // ==========================================================================
  const openMobileDrawer = () => {
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    drawerBackdrop.classList.add('is-open');
    document.body.classList.add('menu-open');
    
    // Focus first focusable element inside drawer for accessibility
    const firstNavLink = mobileDrawer.querySelector('a, button');
    if (firstNavLink) firstNavLink.focus();
  };

  const closeMobileDrawer = () => {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    drawerBackdrop.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    mobileToggle.focus();
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeMobileDrawer);
  }

  // Close drawer on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
        closeMobileDrawer();
      }
      if (appointmentModal && appointmentModal.classList.contains('is-open')) {
        closeModal();
      }
    }
  });

  // ==========================================================================
  // 3. MOBILE DROPDOWN ACCORDION (Services)
  // ==========================================================================
  if (mobileDropdownToggle && mobileSubMenu) {
    mobileDropdownToggle.addEventListener('click', () => {
      const isExpanded = mobileDropdownToggle.getAttribute('aria-expanded') === 'true';
      mobileDropdownToggle.setAttribute('aria-expanded', !isExpanded);
      mobileSubMenu.classList.toggle('is-expanded', !isExpanded);
    });
  }

  // Close mobile drawer when a non-dropdown nav link is clicked
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link:not(.mobile-dropdown-toggle), .mobile-sub-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  // ==========================================================================
  // 4. DESKTOP ACCESSIBLE DROPDOWN
  // ==========================================================================
  const desktopServicesItem = document.getElementById('desktopServicesItem');
  const desktopServicesLink = document.getElementById('desktopServicesLink');
  const desktopDropdownMenu = document.getElementById('desktopServicesMenu');

  if (desktopServicesLink && desktopDropdownMenu) {
    // Keyboard navigation for desktop dropdown
    desktopServicesLink.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        desktopDropdownMenu.classList.add('is-open');
        desktopServicesLink.setAttribute('aria-expanded', 'true');
        const firstDropdownItem = desktopDropdownMenu.querySelector('a');
        if (firstDropdownItem) firstDropdownItem.focus();
      }
    });

    desktopServicesItem.addEventListener('mouseleave', () => {
      desktopDropdownMenu.classList.remove('is-open');
      desktopServicesLink.setAttribute('aria-expanded', 'false');
    });
  }

  // ==========================================================================
  // 5. APPOINTMENT MODAL DIALOG CONTROLS
  // ==========================================================================
  const openModal = () => {
    if (appointmentModal) {
      appointmentModal.classList.add('is-open');
      appointmentModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
      const nameInput = document.getElementById('modalName');
      if (nameInput) nameInput.focus();
    }
  };

  const closeModal = () => {
    if (appointmentModal) {
      appointmentModal.classList.remove('is-open');
      appointmentModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    }
  };

  bookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (mobileDrawer.classList.contains('is-open')) {
        closeMobileDrawer();
      }
      openModal();
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (appointmentModal) {
    appointmentModal.addEventListener('click', (e) => {
      if (e.target === appointmentModal) {
        closeModal();
      }
    });
  }

  // Form submission handler preview
  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your counseling appointment request has been received. Our study abroad team will contact you shortly.');
      closeModal();
      appointmentForm.reset();
    });
  }
});
