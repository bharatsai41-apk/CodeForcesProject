# CodeForces Project

Codeforces profile dashboard with a React frontend and .NET backend.

## Stack

- **Frontend:** React, Vite
- **Backend:** ASP.NET Core (.NET 10)
- **Data:** Codeforces public API (cached on the server)

## Run locally

**Backend**

```bash
cd backend
dotnet run
```

Runs at `http://localhost:5085`.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173` and proxies API requests to the backend.

## Deploy

See [DEPLOY.md](DEPLOY.md) for Docker and Render setup.

## API

`POST /user-profile`

```json
{ "userName": "tourist" }
```

Returns Codeforces user info and submission status for the handle.
