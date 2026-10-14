# How to Add Photos to the Gallery

Follow these short steps to add new photos and videos to the Adam International Gallery (`/gallery`).

---

## Steps to Add a New Gallery Item

1. **Compress the photo:**
   - Keep the file size to **300 KB or less**.
   - Maximum dimension: **1600px** on the long side.
   - Use standard tools or WebP/JPEG compression.

2. **Save the photo in the correct folder:**
   - Visa approvals & admission offers: `public/images/gallery/visa/`
   - University events, visits & seminars: `public/images/gallery/events/`
   - Pre-departure, travel & student life: `public/images/gallery/student-life/`

3. **Add an entry in `src/data/gallery.js`:**
   - Copy the example schema below and append it to the `galleryItems` array.
   - Fill in the actual image `width` and `height` in pixels to prevent layout shifts.

4. **Verify student consent:**
   - Set `consentOnFile: true` **only** when the student has provided written permission.
   - Photos under `visa` and student-life categories (`Student life in Europe`, `Student send-off`) will **not** display on the site unless `consentOnFile: true`.

5. **Adding videos:**
   - Upload the video clip to YouTube (public or unlisted).
   - Set `video: { provider: 'youtube', id: 'YOUR_YOUTUBE_ID' }`.

---

## Schema Example (`src/data/gallery.js`)

```js
{
  id: 'visa-2026-001',
  category: 'visa',          // 'visa' | 'events' | 'student-life'
  type: 'Visa approval',     // from galleryTypes
  image: '/images/gallery/visa/visa-2026-001.jpg',
  width: 1200, height: 1500, // real pixel size, used to prevent layout shift
  alt: 'Student holding her approved visa',
  video: null,               // or { provider: 'youtube', id: 'XXXXXXXXXXX' }
  caption: 'Visa stamped for University of Debrecen, Hungary',
  studentName: 'Ananya Sharma',
  country: 'hungary',        // country slug from countries.js
  university: 'University of Debrecen',
  message: 'Thank you Adam International for making the visa process seamless!',
  date: '2026-10-15',        // 'YYYY-MM-DD'
  location: 'Kochi branch',  // e.g. 'Kochi branch'
  consentOnFile: true,       // MUST be true for student photos to render
  featured: false,           // featured items appear first
}
```

---

## Allowed Types by Category

- **Visa (`visa`):**
  - `'Visa approval'`
  - `'Admission offer'`

- **Events (`events`):**
  - `'University delegate visit'`
  - `'Spot admission session'`
  - `'Counselling event'`
  - `'Student seminar'`
  - `'Education fair'`
  - `'Our team'`

- **Pre-Departure & Student Life (`student-life`):**
  - `'Pre-departure session'`
  - `'Student send-off'`
  - `'Travel preparation'`
  - `'Student life in Europe'`

---

## Photos to Request from the Client

- **Visa approvals:** students holding their visa or offer letter, with their written permission. Include the student name, country, university, and a one-line message.
- **University events:**
  - University delegate visits
  - Spot admission sessions
  - Counselling events and seminars
  - Education fairs
  - Team photos
  *(Include the date and branch location for each).*
- **Pre-departure:** briefing sessions and student send-offs at the office or airport, with written permission.
- **Student life:** photos students have sent from European universities or cities, with written permission.
- **Videos:** short visa celebration clips or student testimonials, as YouTube links.
