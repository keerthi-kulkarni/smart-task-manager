# Smart Task Manager

A production-ready full-stack productivity app for a React.js and Node.js internship portfolio. Users can register, sign in, manage tasks, filter and search their work, export tasks as CSV, and review productivity analytics.

## Tech Stack

**Frontend**
- React 19
- React Router
- Axios
- Context API
- CSS Modules
- Recharts
- react-hot-toast

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt password hashing

## Features

- Register, login, logout
- HTTP-only JWT cookie authentication
- Protected frontend routes
- Password hashing with bcrypt
- Task create, read, update, delete
- Search by title and description
- Filter by status, priority, and category
- Sort by due date, priority, newest, and oldest
- Automatic overdue detection
- Smart priority suggestion from due date
- Dashboard cards and charts
- Productivity completion percentage
- Task completion streak
- Activity log
- User profile page
- Dark mode
- CSV export
- Loading, error, toast, and empty states
- Responsive desktop, tablet, and mobile UI

## Folder Structure

```text
smart-task-manager/
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- services/
|   |-- utils/
|   |-- .env.example
|   |-- package.json
|   |-- server.js
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- styles/
|   |   |-- utils/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |-- .env.example
|   |-- index.html
|   |-- package.json
|   |-- vite.config.js
|
|-- .gitignore
|-- package.json
|-- README.md
```

## API Routes

### Authentication

| Method | Route | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Public |
| GET | `/api/auth/me` | Private |
| PATCH | `/api/auth/profile` | Private |

### Tasks

| Method | Route | Access |
| --- | --- | --- |
| GET | `/api/tasks` | Private |
| GET | `/api/tasks/:id` | Private |
| POST | `/api/tasks` | Private |
| PUT | `/api/tasks/:id` | Private |
| DELETE | `/api/tasks/:id` | Private |
| GET | `/api/tasks/export/csv` | Private |

### Dashboard

| Method | Route | Access |
| --- | --- | --- |
| GET | `/api/dashboard/stats` | Private |

## Environment Variables

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart-task-manager
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
COOKIE_NAME=smart_task_token
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Setup

1. Install Node.js 20+ and MongoDB.
2. Start MongoDB locally or use a MongoDB Atlas connection string.
3. Install dependencies:

```bash
npm install
```

4. Copy environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

5. Update `JWT_SECRET` in `backend/.env`.
6. Run both apps:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend runs at `http://localhost:5000`.

## Demo Data

After configuring `backend/.env`, run:

```bash
npm run seed
```

Demo login:

```text
Email: demo@example.com
Password: password123
```

## Query Examples

```http
GET /api/tasks?status=Overdue
GET /api/tasks?priority=High&category=Study
GET /api/tasks?search=react&sort=dueDate
```

## Security Notes

- Passwords are hashed with bcrypt before storage.
- JWTs are stored in HTTP-only cookies.
- Protected routes use JWT verification middleware.
- Express rate limiting, Helmet, CORS, validation, and centralized error handling are enabled.

## Build

```bash
npm run build
```

For production, deploy the backend as a Node service and deploy `frontend/dist` to a static host. Set `CLIENT_URL`, `MONGO_URI`, and `JWT_SECRET` in the production environment.
