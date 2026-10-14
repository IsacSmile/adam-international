// CONFIRM WITH CLIENT: office hours and that this number is on WhatsApp
export const contact = {
  phoneDisplay: '+91 98958 90500',
  phoneTel: '+919895890500',
  whatsappNumber: '919895890500',
  whatsappEnabled: true,
  whatsappText: 'Hi Adam International, I would like guidance on studying in Europe.',
  email: 'info@adaminternational.in',
  headOffice: {
    name: 'Adam International — Head Office',
    address: 'MAF Plaza, Edappally–Panvel Highway, Kochi, Kerala',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=MAF%20Plaza%2C%20Edappally%20Panvel%20Highway%2C%20Kochi%2C%20Kerala',
    embedUrl: 'https://www.google.com/maps?q=MAF%20Plaza%2C%20Edappally%20Panvel%20Highway%2C%20Kochi%2C%20Kerala&output=embed',
  },
  hours: [
    { days: 'Monday – Friday', time: '9:30 AM – 5:30 PM' },
  ],
  workingDays: [1, 2, 3, 4, 5], // 0 = Sunday … 6 = Saturday
};

export const whatsappLink = (text = contact.whatsappText) =>
  `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
