import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUpRight 
} from 'lucide-react';
import { services } from '../data/services';
import { successStories } from '../data/successStories';
import { galleryItems } from '../data/gallery';
import { SHOW_PLACEHOLDERS } from '../lib/contentFlags';
import { hasVisibleBlogPosts } from '../lib/blog';

const hasStories = SHOW_PLACEHOLDERS || successStories.some((s) => !s.isPlaceholder);
const hasGallery = SHOW_PLACEHOLDERS
  ? Array.isArray(galleryItems) && galleryItems.length > 0
  : galleryItems.some((i) => !i.isPlaceholder);
const hasBlog = hasVisibleBlogPosts();

const baseQuickLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Countries', href: '/countries' },
  { name: 'Universities', href: '/universities' },
  { name: 'Success Stories', href: '/success-stories' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact Us', href: '/#contact' },
];

const quickLinks = baseQuickLinks.filter((link) => {
  if ((link.href === '/success-stories' || link.name === 'Success Stories') && !hasStories) {
    return false;
  }
  if ((link.href === '/gallery' || link.name === 'Gallery') && !hasGallery) {
    return false;
  }
  if ((link.href === '/blog' || link.name === 'Blog') && !hasBlog) {
    return false;
  }
  return true;
});

export default function Footer({ onOpenModal }) {
  return (
    <footer className="bg-[#0B1F3A] text-white pt-16 pb-8 px-5 lg:px-8 border-t border-white/10 relative overflow-hidden">
      {/* Container */}
      <div className="max-w-[1280px] mx-auto">
        {/* TOP GRID (5 COLUMNS ON DESKTOP, STACKED ON MOBILE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          {/* COLUMN 1: BRAND */}
          <div className="lg:col-span-1 sm:col-span-2 lg:sm:col-span-1">
            <Link
              to="/"
              className="inline-block mb-4 outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9A84C]"
              aria-label="Adam International Home"
            >
              <div className="h-[48px] w-auto overflow-hidden flex items-center justify-start">
                <img
                  src="/logo234.webp"
                  alt="Adam International Study Abroad"
                  className="h-[48px] w-auto max-w-none object-cover object-left block"
                />
              </div>
            </Link>

            {/* CONFIRM WITH CLIENT: "since 2008" */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6 font-normal">
              Top-tier overseas education consultancy helping students achieve their global academic dreams since 2008.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#C9A84C] hover:border-[#C9A84C] hover:bg-white/10 transition-all duration-200"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#C9A84C] hover:border-[#C9A84C] hover:bg-white/10 transition-all duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#C9A84C] hover:border-[#C9A84C] hover:bg-white/10 transition-all duration-200"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div>
            <h3 className="text-xs font-bold text-[#C9A84C] mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-300 hover:text-[#C9A84C] transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: SERVICES */}
          <div>
            <h3 className="text-xs font-bold text-[#C9A84C] mb-4 uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-gray-300 hover:text-[#C9A84C] transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {service.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: OUR BRANCHES */}
          <div>
            <h3 className="text-xs font-bold text-[#C9A84C] mb-4 uppercase tracking-wider">
              Our Branches
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              {[
                'Kochi (Head Office)',
                'Kozhikode',
                'Trivandrum',
                'Bangalore',
                'Mangalore',
                'Alappuzha',
              ].map((branch) => (
                <li key={branch} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/60" />
                  <span>{branch}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 5: CONTACT */}
          <div>
            <h3 className="text-xs font-bold text-[#C9A84C] mb-4 uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C9A84C] shrink-0 mt-1" />
                <span className="leading-snug">MAF Plaza, Edappally-Panvel Highway, Kochi, Kerala</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C9A84C] shrink-0" />
                <a href="tel:+919895890500" className="hover:text-[#C9A84C] transition-colors font-medium">
                  +91 9895 890 500
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C9A84C] shrink-0" />
                <a href="mailto:info@adaminternational.in" className="hover:text-[#C9A84C] transition-colors font-medium">
                  info@adaminternational.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR WITH THIN GOLD DIVIDER */}
        <div className="pt-8 border-t border-[#C9A84C]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2025 Adam International. All rights reserved.</p>

          <p className="flex items-center gap-1.5 text-gray-300">
            <span>Built by</span>
            <a
              href="https://www.instagram.com/faiz_imam__/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A84C] hover:text-white font-extrabold transition-colors hover:underline"
            >
              Faiz.I
            </a>
          </p>

          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-[#C9A84C] transition-colors">Privacy Policy</Link>
            <span className="text-gray-600">•</span>
            <Link to="/terms" className="hover:text-[#C9A84C] transition-colors">Terms & Conditions</Link>
            <span className="text-gray-600">•</span>
            <Link to="/credits" className="hover:text-[#C9A84C] transition-colors">Image Credits</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
