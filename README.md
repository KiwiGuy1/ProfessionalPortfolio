# Professional Portfolio

A Next.js portfolio site with an animated 3D homepage, project pages, contact APIs, NextAuth, and Prisma-backed persistence.

## Quick Start

```bash
npm install
copy .env.example .env.local
npm run prisma:generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Daily Commands

```bash
npm run dev              # Start the local dev server
npm run check            # Run TypeScript and ESLint
npm run typecheck        # TypeScript only
npm run lint             # ESLint only
npm run build            # Production build
npm run db:migrate       # Create/apply a Prisma migration
npm run db:studio        # Open Prisma Studio
```

## Project Map

- `src/app/`: Next.js App Router routes, layouts, providers, and API handlers.
- `src/components/home/HomePage.tsx`: animated homepage experience.
- `src/components/home/ModelScene.tsx`: homepage 3D model scene.
- `src/components/home/home-page.module.css`: homepage visual styling.
- `src/components/navigation/`: global navigation and route-transition link helpers.
- `src/components/physics/`: Matter.js physics playground UI.
- `src/app/projects/page.tsx`: projects page.
- `src/app/contact/page.tsx`: contact page.
- `src/app/api/contact/route.ts`: public contact form endpoint.
- `src/app/api/messages/route.ts`: dashboard/messages endpoint.
- `src/app/api/auth/[...nextauth]/route.ts`: NextAuth route.
- `src/assets/fonts/`: local font packages and font source files.
- `prisma/schema.prisma`: database models.
- `public/`: static assets, images, and `.glb` models.

## Environment

Create `.env.local` from `.env.example` and fill in the real values:

- `DATABASE_URL`: PostgreSQL connection string used by Prisma.
- `PRISMA_ACCELERATE_URL`: optional Prisma Accelerate URL.
- `NEXTAUTH_SECRET`: long random secret for NextAuth.
- `NEXTAUTH_URL`: `http://localhost:3000` locally.
- `AUTH_TRUST_HOST`: usually `true` for the current auth setup.

## Development Notes

- The site uses Next.js App Router with TypeScript.
- The production build fetches Google Fonts through `next/font`, so `npm run build` needs network access the first time fonts are resolved.
- `npm run lint` uses `eslint .` because `next lint` is no longer the right command for this setup.
- Run `npm run check` before handing off changes.
- If Prisma models change, run `npm run db:migrate` during development and commit the generated migration.

## Design Notes

The current visual direction is mostly black with bright orange highlights. The shared color tokens live in `src/app/globals.css`, and the homepage-specific glow, HUD, and CTA accents live in `src/components/home/home-page.module.css`.
