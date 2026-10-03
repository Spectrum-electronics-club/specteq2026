# Website Development Plan: Specteq Content + e-Yantra UI

Based on your request, we will build a professional, user-friendly website for hosting competitions. The content will be adapted from **Specteq**, and the visual aesthetic and user interface will be inspired by **e-Yantra**.

## 1. Project Setup and Architecture
- **Location:** `d:\Spectrum\Specteq2026`
- **Tech Stack:** Since this is a modern, dynamic website with several sections, I recommend using **React (via Vite)** with **Tailwind CSS**. This aligns with modern web standards and allows for modular UI components similar to the e-Yantra portal.
- **Routing:** We will set it up primarily as a smooth-scrolling single-page application (SPA) with dedicated routes for any complex pages (e.g., specific rules or registration portals) if needed.

## 2. Design System (e-Yantra Aesthetic)
We will replicate the professional, clean, and academic feel of the e-Yantra portal:
- **Typography:** `Montserrat` (for clean, authoritative headings) and a readable sans-serif or mono font for body text.
- **Color Palette:** A professional combination of deep blues/blacks (trust, technology) combined with vibrant accent colors (e.g., orange or teal) for call-to-actions.
- **Layout:** Grid-based card layouts, ample whitespace, and clear visual hierarchy to make dense information (like rules and timelines) easy to digest.
- **Micro-animations:** Subtle hover states on cards and buttons, and smooth reveal animations on scroll to make the site feel premium and dynamic.

## 3. Content Migration & Component Development
We will create components for all the sections currently present on the Specteq site, but styled in the new aesthetic:
1.  **Navbar:** Sticky header with clean links and an accented "Register" button.
2.  **Hero Section:** High-impact landing area with a strong tagline ("Industry-grade robotics competition platform"), dates, and primary CTA.
3.  **About:** Clean text presentation with visual elements detailing the competition's purpose.
4.  **Technologies / Themes:** Card-based grid showcasing different competition tracks, utilizing icons or imagery.
5.  **Timeline:** A vertical or horizontal visual roadmap of important dates (registration, submission, finale).
6.  **Prizes:** Tiered visual cards highlighting rewards.
7.  **Rules & FAQ:** Accordion-style expandable components for a clean UI without overwhelming the user with text.
8.  **Registration / Footer:** Clean form areas or CTA banners leading to registration, followed by a professional footer with links and social icons.

## 4. Execution Steps
1.  **Step 1:** Initialize the Vite + React + Tailwind project in your workspace.
2.  **Step 2:** Define the global CSS (`index.css`), Tailwind config, and fonts.
3.  **Step 3:** Build the base layout and shared UI components (Buttons, Cards, Accordions).
4.  **Step 4:** Iteratively build each section (Hero, About, Themes, Timeline, etc.).
5.  **Step 5:** Final polish (responsive design checks, animations, and SEO).

---

### Questions before we begin:
1. Do you agree with using **React (Vite) + Tailwind CSS** for this project, or would you prefer a different stack (like standard HTML/JS/Vanilla CSS)?
2. The current e-Yantra site heavily features a dashboard for teams. Are we building just the public-facing landing page, or do we need to stub out user authentication/dashboard views as well?
