# Deploy CF Analytics

This project ships as **one Docker container**: the .NET API serves the built React app from `wwwroot`.

## Quick deploy (Render — free tier)

1. Push this repo to GitHub (see below).
2. Go to [render.com](https://render.com) → **New** → **Blueprint**.
3. Connect your GitHub repo — Render reads `render.yaml` automatically.
4. Click **Apply** — Render builds the Docker image and gives you a public URL like `https://codeforces-dashboard.onrender.com`.

Health check: `GET /health`

---

## Deploy with Docker (any VPS, Railway, Fly.io, Azure)

### Build and run locally

```bash
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080)

### Push to a container registry

```bash
docker build -t cf-analytics .
docker tag cf-analytics YOUR_REGISTRY/cf-analytics:latest
docker push YOUR_REGISTRY/cf-analytics:latest
```

Run on any host that supports Docker with port **8080** exposed.

---

## Split deploy (optional)

If you prefer **Vercel/Netlify for frontend** and **Render/Railway for API**:

### Backend only

Deploy the backend folder as a .NET web service (port 8080 or platform default).

### Frontend

Set this env var at **build time**:

```
VITE_API_URL=https://your-backend-url.onrender.com
```

Then deploy the `frontend/` folder with Vercel or Netlify (`npm run build`, output `dist/`).

CORS is already enabled on the backend.

---

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/CodeForcesProject.git
git push -u origin main
```

Create an empty repo on GitHub first (no README or .gitignore).

---

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ASPNETCORE_URLS` | `http://+:8080` | Listen address inside container |
| `ASPNETCORE_ENVIRONMENT` | `Production` | Enables static file serving |
| `VITE_API_URL` | *(empty)* | Set only for split frontend deploy |

---

## Notes

- Free Render instances **sleep after inactivity** — first load may take ~30s.
- API rate limit: **3 requests/minute per IP** (backend setting).
- Codeforces data is cached for **10 minutes** per handle.
