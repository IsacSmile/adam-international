# Guide: How to Add Blog Posts

This guide outlines the simple, step-by-step process for publishing new blog articles on the Adam International website.

---

## Overview

Articles are written in **Markdown** (`.md`) format and stored in the repository under:
`src/content/blog/`

Each article consists of two parts:
1. **Frontmatter** (metadata between `---` markers at the top of the file)
2. **Article Body** (the actual content written in standard Markdown)

---

## Step-by-Step Instructions

### Step 1: Prepare the Article Image
1. Choose a high-quality, relevant image (e.g. university campus, students, European destinations).
2. Size and aspect ratio:
   - **Recommended resolution:** 1200 × 675 px (16:9 landscape aspect ratio).
   - **File size limit:** Keep the compressed file **under 250 KB** (use WebP or optimized JPEG).
3. Save the image to the public folder:
   - `public/images/blog/your-article-slug.jpg` (or `.webp`)

### Step 2: Create the Markdown File
1. In `src/content/blog/`, create a new file named `your-article-slug.md` (use lowercase letters and hyphens only).
2. Copy the template below into your new file.
3. Fill in the frontmatter fields:
   - `title`: The full headline of your article.
   - `slug`: URL slug matching the file name (e.g. `study-in-germany-complete-guide`).
   - `date`: Publication date in `YYYY-MM-DD` format.
   - `updated`: Last updated date in `YYYY-MM-DD` format.
   - `category`: Must match one of the 6 official categories listed below.
   - `summary`: A concise 1–2 sentence summary (shown on the blog cards and search meta).
   - `image`: Path to your image, e.g. `/images/blog/your-article-slug.jpg`.
   - `imageAlt`: Accessible description of the image.
   - `author`: Author name (e.g. `Adam International Team` or consultant name).
   - `featured`: Set to `true` if this should be the primary featured article on the blog homepage, otherwise `false`.
   - `isPlaceholder`: Set to `false` for all real, published articles.

### Step 3: Write the Content
Use standard Markdown to write your article:
- Use `##` for primary section headings and `###` for sub-headings.
- Use `*` or `-` for bullet points.
- Use `1.`, `2.` for numbered steps.
- Use `> ` for callout quotes or key takeaways.
- Use `[link text](https://example.com)` for links. (External links automatically open in a new tab).
- Use `**bold**` and `*italic*` for text emphasis.

### Step 4: Verify and Commit
1. Run `npm run build` locally to confirm the markdown parses cleanly and no build errors exist.
2. Verify the article appears at `/blog` and `/blog/your-article-slug`.

---

## Official Blog Categories

The `category` field in the frontmatter must match one of the following exact category names:

| Category Name | Slug |
|---|---|
| Study in Europe | `study-in-europe` |
| Country Guides | `country-guides` |
| Student Visa Guidance | `student-visa-guidance` |
| University and Course Updates | `university-course-updates` |
| Scholarships and Financial Planning | `scholarships-financial-planning` |
| Student Success Stories | `student-success-stories` |

*(Note: If a category name does not match one of these, it will be logged as a warning during development and displayed under "All" only).*

---

## Ready-to-Copy Template

Create a file named `src/content/blog/your-article-slug.md`:

```markdown
---
title: Complete Guide to Studying in Germany for International Students
slug: study-in-germany-complete-guide
date: 2026-10-15
updated: 2026-10-15
category: Country Guides
summary: Discover public university tuition waivers, blocked account requirements, English-taught programs, and student visa procedures for Germany.
image: /images/blog/study-in-germany-complete-guide.jpg
imageAlt: International students walking outside a German university campus
author: Adam International Team
featured: false
isPlaceholder: false
---

## Introduction

Write an engaging introduction explaining what students will learn from this article.

## Key Admission Requirements

Outline the main criteria students need to qualify for university admission:

* Academic qualification equivalents (Plus-Two or Bachelor's degrees)
* English proficiency scores (IELTS or TOEFL requirements)
* Motivation letter and curriculum vitae

## Step-by-Step Application Process

1. Choose your preferred study program and university.
2. Check specific application deadlines (winter vs summer intakes).
3. Prepare notarized documents and translation if necessary.
4. Submit your application directly or via the university portal.

> **Advisory Note:** Always verify entry requirements with Adam International counselors before submitting official paperwork.

## Conclusion

Summarize the main takeaways and encourage students to book a counseling session.
```
