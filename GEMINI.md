# GEMINI.md - Imobi2% Project Context

## Project Overview
**Imobi2%** is a new concept in real estate, acting as a high-end showcase (vitrine) for property sales rather than a traditional agency. It offers a low-commission (2%) alternative with specialized curation. The application provides a seamless experience for buyers to browse a curated vitrine and for owners to showcase their properties.

### Main Technologies
- **Framework:** Next.js 16 (App Router) - *Note: This version contains breaking changes compared to previous versions.*
- **Backend-as-a-Service:** Supabase (Database, Auth, and Storage).
- **Styling:** Tailwind CSS 4 with custom CSS variables and PostCSS.
- **Animations:** Framer Motion.
- **Icons:** Lucide React.
- **Language:** TypeScript.
- **Fonts:** Geist Sans, Geist Mono, and Cormorant Garamond.

## Building and Running
The project uses standard npm scripts for development and production:

- **Development:** `npm run dev` - Starts the development server at `http://localhost:3000`.
- **Build:** `npm run build` - Creates an optimized production build.
- **Start:** `npm run start` - Runs the compiled production application.
- **Lint:** `npm run lint` - Runs ESLint to check for code quality issues.

## Development Conventions

### Architecture & Structure
- **App Router:** Follows the Next.js App Router convention under `src/app/`.
- **Components:** Modularized in `src/components/`, organized by scope:
  - `layout/`: Global layout components (Navbar, etc.).
  - `property/`: Components specific to property listings (Cards, Filters, Comparison).
  - `sections/`: High-level page sections (Hero, Featured Properties).
  - `ui/`: Reusable primitive components.
  - `providers/`: Context providers (Theme, Favorites, Comparison).
- **Data Layer:** Supabase interactions are centralized in `src/lib/supabase/`.
  - `properties.ts`: CRUD operations for properties.
  - `client.ts`: Supabase client initialization.

### Coding Standards
- **Language:** UI and documentation are primarily in **Portuguese (pt-BR)**.
- **Styling:** Use Tailwind CSS 4 classes. Global styles and custom tokens (colors, spacing) are defined in `src/app/globals.css`.
- **State Management:** Uses React Context for application-wide states like favorites and property comparison.
- **Mock Data:** The application includes a fallback mechanism with mock data in `src/lib/supabase/properties.ts` for development when Supabase is not fully configured.

### Database Schema
The database is managed via Supabase. The core table is `public.properties`, which stores:
- Basic info: title, description, price.
- Details: type, beds, baths, area, neighborhood.
- Metadata: status (active, pending, sold), images (array), and features (array).
- SEO: unique slugs for property pages.

### Important Warnings
- **Next.js 16:** As noted in `AGENTS.md`, this version has breaking changes. Always check for deprecation notices and refer to the internal documentation if available.
- **RLS:** Row Level Security is enabled on Supabase. Ensure policies allow public read access for active properties.

## Project Structure Highlights
- `src/app/(listing)/imoveis`: Public property listing and detail pages.
- `src/app/admin`: Internal management dashboard.
- `src/app/anunciar`: (Redirected to WhatsApp) Property registration flow now handled via direct contact.
- `supabase/schema.sql`: Source of truth for the database structure.
