import { contact } from './contact.js';

export const branches = [
  { slug: 'kochi', name: 'Kochi (Head Office)', city: 'Kochi', address: 'MAF Plaza, Edappally-Panvel Highway, Kochi, Kerala', phone: contact.phoneDisplay, lat: 9.9312, lng: 76.2673, isHeadOffice: true },
  { slug: 'kozhikode', name: 'Kozhikode', city: 'Kozhikode', address: null, phone: null, lat: 11.2588, lng: 75.7804 },
  { slug: 'trivandrum', name: 'Trivandrum', city: 'Thiruvananthapuram', address: null, phone: null, lat: 8.5241, lng: 76.9366 },
  { slug: 'bangalore', name: 'Bangalore', city: 'Bengaluru', address: null, phone: null, lat: 12.9716, lng: 77.5946 },
  { slug: 'mangalore', name: 'Mangalore', city: 'Mangaluru', address: null, phone: null, lat: 12.9141, lng: 74.8560 },
  { slug: 'alappuzha', name: 'Alappuzha', city: 'Alappuzha', address: null, phone: null, lat: 9.4981, lng: 76.3388 },
];
// CONFIRM WITH CLIENT: full address and phone for every branch except Kochi.
// lat/lng are city-centre coordinates, used only to find the nearest branch.

