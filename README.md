# Finance Tracker — Client

A personal finance dashboard built with React, TypeScript, and Tailwind CSS. Connects to the [Finance Tracker API](https://github.com/ileitao/finance-tracker) to track income, expenses, and spending by category.

**Live demo:** [https://finance-tracker-client-six.vercel.app/dashboard](https://finance-tracker-client-six.vercel.app/dashboard)

![Dashboard preview]()

---

## Features

- Register and login with JWT authentication
- Add income and expense transactions
- Dashboard with real-time summary cards — total income, expenses, and balance
- Bar chart showing spending breakdown by category
- Transaction list with amount, category, and date
- Protected routes — unauthenticated users are redirected to login
- Auto-login after registration

---

## Tech Stack

- **Framework** — React 18 + TypeScript
- **Build tool** — Vite
- **Routing** — React Router v6
- **Data fetching** — TanStack Query
- **HTTP client** — Axios
- **Charts** — Recharts
- **Styling** — Tailwind CSS v4
- **Deployment** — Vercel

---

## Project Structure

```
finance-tracker-client/
├── src/
│   ├── api/
│   │   └── client.ts         # Axios instance with JWT interceptor
│   ├── components/
│   │   ├── Navbar.tsx         # Top navigation with logout
│   │   └── AddTransactionForm.tsx  # Form to create transactions
│   ├── context/
│   │   └── AuthContext.tsx    # Auth state — token, login, logout
│   ├── pages/
│   │   ├── Login.tsx          # Login page
│   │   ├── Register.tsx       # Register page
│   │   └── Dashboard.tsx      # Main dashboard
│   ├── App.tsx                # Routes and protected route logic
│   └── main.tsx               # App entry point with providers
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- The [Finance Tracker API](https://github.com/ileitao/finance-tracker) running locally or deployed

### 1. Clone the repository

```bash
git clone https://github.com/ileitao/finance-tracker-client.git
cd finance-tracker-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file at the project root:

```env
VITE_API_URL=http://localhost:3000
```

For production point this at your Railway API URL:

```env
VITE_API_URL=https://your-api.up.railway.app
```

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Architecture Notes

**Auth flow**

The app uses JWT tokens stored in `localStorage`. On login, the token is saved and attached to every subsequent API request via an Axios interceptor:

```ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

This means no component needs to manually attach the token — it's handled globally.

**Auth context**

`AuthContext` provides `token`, `login()`, `logout()`, and `isAuthenticated` to the entire component tree. State is initialized from `localStorage` so the user stays logged in across page refreshes.

**Protected routes**

The `ProtectedRoute` component wraps any route that requires authentication. Unauthenticated users are redirected to `/login`:

```tsx
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}
```

**Data fetching with TanStack Query**

`useQuery` handles all GET requests with automatic caching and loading states. `useMutation` handles POST requests — after a successful transaction creation, `invalidateQueries` triggers a refetch of both `transactions` and `summary`, updating the dashboard instantly without a page refresh.

---

## Deployment (Vercel)

The app is deployed to Vercel and connects to the Finance Tracker API on Railway.

### Deploy your own

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add the environment variable:
   - `VITE_API_URL` = your Railway API URL
4. Click Deploy

Vercel automatically redeploys on every push to `main`.

---

## Scripts

```bash
npm run dev      # start development server
npm run build    # build for production
npm run preview  # preview production build locally
```

---

## Related

- [Finance Tracker API](https://github.com/ileitao/finance-tracker) — the backend this app connects to
