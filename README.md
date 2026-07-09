# Personal Expense Tracker — Project Setup

This is the initial scaffold: project structure + Firebase wiring only.
No dashboard features are built yet (that's Phase 1 in the roadmap) — this
is the foundation to build on.

## What's here

- **Vite + React** app, Tailwind CSS v4 (via `@tailwindcss/vite`, no separate
  `tailwind.config.js` needed — theme tokens live in `src/styles/index.css`).
- **Firebase** wired for Auth (Google + email/password), Firestore, and
  Storage, config driven entirely by environment variables.
- **React Router** with a `ProtectedRoute` gate and a placeholder
  Login/Dashboard page.
- **Zustand** stores for auth state and app settings (currency/theme/accent).
- Folder structure matching the spec (`features/`, `pages/`, `services/`,
  `store/`, etc.).
- Firestore + Storage **security rules**, scoped to a single authenticated
  user (`uid` field must match `request.auth.uid`).

## 1. Create your Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/) →
   create a new project.
2. **Authentication** → Sign-in method → enable **Google** and
   **Email/Password**.
3. **Firestore Database** → create database (start in production mode —
   the rules in `firestore.rules` handle access control).
4. **Storage** → create default bucket.
5. Project Settings → General → "Your apps" → add a **Web app** → copy the
   config values.

## 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in the six `VITE_FIREBASE_*` values from step 1.5 above. `.env` is
git-ignored — never commit real keys.

## 3. Install and run

```bash
npm install
npm run dev
```

## 4. Deploy Firestore/Storage rules and Hosting (once you have the CLI)

```bash
npm install -g firebase-tools
firebase login
firebase use --add        # select your project, alias it e.g. "default"
firebase deploy --only firestore:rules,storage:rules
npm run build
firebase deploy --only hosting
```

## Folder structure

```
src/
  app/            # app-level providers/composition (future)
  components/     # shared, reusable UI components
  pages/          # route-level page components
  layouts/        # shared layout shells (e.g. sidebar + topbar)
  features/       # one folder per domain: expense, income, budget, goals,
                  # reports, analytics, calendar, recurring, import, export,
                  # settings, profile
  hooks/          # shared custom hooks
  services/
    firebase/     # config.js, auth.js, firestore.js, storage.js
  utils/          # formatting, date math, calculations
  constants/      # categories, payment methods, routes, currency
  types/          # shared JS(Doc)/TS type definitions
  store/          # Zustand stores (useAuthStore, useSettingsStore, ...)
  assets/
  styles/         # index.css — Tailwind + theme tokens
```

## Theme tokens (in `src/styles/index.css`)

| Token | Value | Usage |
|---|---|---|
| `--color-background` | `#0f172a` | App background (almost-black) |
| `--color-primary` | `#10b981` | Emerald — primary actions/accents |
| `--color-secondary` | `#3b82f6` | Blue — secondary accents |
| `--radius-card` | `1.25rem` | Large rounded corners for cards |

A `.glass-card` utility class is defined for the glassmorphism card look
used across the dashboard.

## Next steps (Phase 1)

- Build out `layouts/` (sidebar + topbar shell) and wire `pages/` into it.
- Expense CRUD: `features/expense/` — form (React Hook Form), Firestore
  read/write hooks, and the Excel-like table (`@tanstack/react-table`).
- Dashboard summary cards + automatic period calculations
  (today/week/month/year/lifetime).
