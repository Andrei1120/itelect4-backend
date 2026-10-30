# I‑Telec t4 – Backend (GT5)

## Quick start
1. **Copy** `.env.example` → `.env` in the **backend** folder and fill in:
   - `MONGODB_URI` – your MongoDB Atlas connection string.
   - `JWT_SECRET` – a secret for signing JWTs.
   - `CORS_ORIGIN` – a comma‑separated list of allowed origins (include the Vercel frontend URL, e.g. `https://itelect4-project-xxxx.vercel.app`).
2. Install dependencies:
   ```powershell
   npm install
   ```
3. **Run locally** (development server):
   ```powershell
   npm run dev
   ```
   The API will be available at <http://localhost:4000>.
4. **Build for production** (Vercel does this automatically):
   ```powershell
   npm run build
   ```
5. **Deploy to Vercel**:
   - Push the code to GitHub (branch `gt4-part2`).
   - Vercel builds the project using the `vercel.json` that routes all traffic to `src/app.ts`.
   - Set the environment variable `CORS_ORIGIN` in the Vercel dashboard (Production) to the live frontend URL.
   - Redeploy the backend so the new env‑var takes effect.

## What this repo contains
- Express + TypeScript backend.
- Mongoose models for `User`, `Course`, `Submission`, `Item`.
- JWT authentication middleware.
- Centralised error handling.
- Health endpoint (`/api/health`) that Vercel uses for status checks.

## Deploy status (GT5)
- **Backend URL**: `https://itelect4-backend-xxxx.vercel.app`
- Tag: `gt5`

## License
MIT © 2026 Your Name
