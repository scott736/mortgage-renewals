# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

Single Astro 6 static site (Mortgage Renewal Hub) with React calculators and Vercel SSR API routes for booking (Nylas), contact forms (Elastic Email), and pending bookings (Upstash Redis). No local database or Docker.

### Node.js version (required)

The repo pins **Node 24.x** (`.nvmrc`, `package.json` `engines`). The VM default `node` at `/exec-daemon/node` is **Node 22** and will fail engine checks or behave inconsistently. Before any `npm` command, activate Node 24 via nvm and prepend it to `PATH`:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 24
export PATH="$(dirname "$(nvm which current)"):$PATH"
```

### Running the dev server

From repo root after dependencies are installed:

```bash
npm run dev
```

Default URL: `http://localhost:4321`. Use `--host 0.0.0.0` if accessing from outside the shell (e.g. browser on the VM desktop).

Long-running dev server: use a dedicated tmux session (e.g. `astro-dev-server`), not a one-shot background shell.

### Lint, format, build

| Command | Purpose |
|---------|---------|
| `npm run lint` | ESLint (warnings only in current tree; exit 0) |
| `npm run format:check` | Prettier check |
| `npm run build` | Production build (`astro build` → `dist/`) |
| `npm run preview` | Serve production build locally |

There is **no automated test suite** (`npm test` is not defined).

### Optional `.env` for API routes

Copy `.env.example` → `.env`. External keys are only needed for full booking/email flows:

- **Nylas** — `/book-a-call/`, `/api/nylas/*`
- **Elastic Email** — `/api/contact`, booking confirmation emails
- **Upstash Redis** — durable pending bookings (in-memory fallback works for basic local dev)

Pages and client-side calculators work without any `.env` keys.

### Hello-world smoke test

1. `npm run dev`
2. Open `http://localhost:4321/mortgage-renewal-calculator/`
3. Change balance or rate on the Payment Estimator — monthly payment should update immediately.
