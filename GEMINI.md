# GEMINI.md - Context for AI Agents

## Project Overview
This repository contains a modern web application, specifically a profile-based platform. The project is primarily located within the `my-profile` directory and is built using the latest versions of Next.js, React, and Tailwind CSS.

### Key Technologies
- **Next.js 16.2.1**: Utilizes the App Router architecture.
- **React 19.2.4**: Leverages the latest React features.
- **Tailwind CSS 4**: Modern styling with PostCSS 4.
- **TypeScript**: Ensuring type safety across the application.

## ⚠️ CRITICAL: Next.js 16 Breaking Changes
As noted in `my-profile/AGENTS.md`, this version of Next.js (16.x) contains **breaking changes** that may differ from standard training data regarding APIs, conventions, and file structure.
- **Always verify** documentation within `node_modules/next/dist/docs/` before implementing new features.
- Heed all deprecation notices.

## Project Structure
```text
C:\Users\USER\Documents\my-link\
├── README.md           # Simple root README
├── GEMINI.md           # This file (AI Context)
└── my-profile\         # Main application directory
    ├── app\            # Next.js App Router directory
    ├── public\         # Static assets
    ├── AGENTS.md       # AI-specific rules and warnings
    ├── CLAUDE.md       # Points to AGENTS.md
    ├── package.json    # Project dependencies and scripts
    └── tsconfig.json   # TypeScript configuration (uses "@/*" for "./*")
```

## Getting Started (in `my-profile/`)

### Commands
- **Run Development Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Start Production Server**: `npm run start`
- **Linting**: `npm run lint`

## Development Conventions
- **App Router**: All pages and layouts should be placed within the `my-profile/app/` directory.
- **Path Aliases**: Use `@/` to refer to the root of the `my-profile` directory (e.g., `import MyComp from "@/components/MyComp"`).
- **Styling**: Tailwind CSS 4 is used with PostCSS. Configuration is in `postcss.config.mjs` and `next.config.ts`.
- **Typing**: Strict TypeScript is enabled (`strict: true`).

## Key Files
- `my-profile/app/page.tsx`: The main entry point for the home page.
- `my-profile/app/layout.tsx`: The root layout for the application.
- `my-profile/next.config.ts`: Next.js configuration.
