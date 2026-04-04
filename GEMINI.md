# MyLink - Project Guide (GEMINI.md)

This document provides the structure, tech stack, development rules, and operational guide for **MyLink**.

---

## 1. Project Overview

*   **Purpose:** A minimalist profile link service that aggregates various channels (blogs, SNS, websites) into a single, shareable page.
*   **Key Concepts:** 
    *   **Minimalism:** Modern UI based on text and auto-generated favicons, no images.
    *   **Inline Editing:** WYSIWYG experience allowing instant updates directly on the page.
    *   **Zero-Config:** Automatic URL slug generation via Google Login for instant onboarding.

---

## 2. Tech Stack

*   **Framework:** Next.js 16 (App Router)
*   **Library:** React 19
*   **Styling:** Tailwind CSS 4, shadcn/ui
*   **Language:** TypeScript
*   **Backend:** Firebase Authentication (Google Login Only), Cloud Firestore
*   **Icons/Images:** Lucide-React, Google Favicon API

---

## 3. Project Structure

```text
C:\Users\USER\Documents\my-link\
├── @app/                # Next.js App Router (Pages & Layouts)
├── @components/         # UI Components (shadcn/ui & Custom)
├── @docs/               # PRD, User Scenarios, Wireframes
├── @hooks/              # Custom React Hooks
├── @lib/                # Utils & Config (cn, firebase, etc.)
├── @public/             # Static Assets
└── (Config Files)      # @package.json, @tsconfig.json, @next.config.mjs, etc.
```

---

## 4. Core Features

1.  **Auth:** Firebase Google Social Login (One-Click onboarding).
2.  **Profile Editing:** 
    *   **DisplayName:** URL slug (requires uniqueness check).
    *   **Username / Bio:** Supports inline editing.
3.  **Link Management:** 
    *   Add links with real-time favicon integration via Google Favicon API.
    *   Inline editing for link titles and URLs.
    *   One-touch link deletion.

---

## 5. Commands

*   `npm run dev`: Start dev server (Turbopack)
*   `npm run build`: Production build
*   `npm run start`: Start production server
*   `npm run lint`: ESLint check
*   `npm run format`: Prettier formatting (`**/*.{ts,tsx}`)
*   `npm run typecheck`: TypeScript type check

---

## 6. Development Conventions

*   **UI/UX:**
    *   Maintain minimalist design using `shadcn/ui`.
    *   Single fixed theme (no dark/light mode toggle).
    *   Apply **"Click-to-Edit"** (Inline Editing) UX to all editable text elements.
*   **Data Model:**
    *   User profiles stored as Firestore documents.
    *   Individual link items managed as **sub-collections** under the user document.
*   **Security:** 
    *   Manage sensitive API keys in `@.env.local` (Never commit).
*   **Commit Messages:** Write detailed messages in Korean, clearly stating the "why" and "what".

---

## 7. Documentation References

*   `@docs/PRD.md`: Product Requirements Document
*   `@docs/USER_SCENARIO.md`: User & Visitor Scenarios
*   `@docs/WIREFRAME.md`: UI Layout & Component Hierarchy
