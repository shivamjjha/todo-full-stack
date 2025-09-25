# Todo Full Stack Application

A comprehensive full-stack Todo application built with Node.js, Express, TypeScript, Drizzle ORM, and a simple HTML/CSS/JS frontend. This project demonstrates authentication, CRUD operations, and a modular codebase structure.

## Features
- User authentication (signup, login, JWT-based session)
- Create, read, update, delete todos
- Responsive UI with vanilla JS and CSS
- Secure API endpoints with middleware
- SQLite database via Drizzle ORM

## Tech Stack
- **Backend:** Node.js, Express, TypeScript
- **Database:** SQLite (Drizzle ORM)
- **Frontend:** HTML, CSS, JavaScript
- **Authentication:** JWT

## Project Structure
```
├── db/
│   ├── drizzle.config.ts      # Drizzle ORM config
│   ├── index.ts               # DB connection
│   ├── local.db               # SQLite database
│   └── schema.ts              # DB schema
├── src/
│   ├── app.ts                 # Express app entrypoint
│   ├── middlewares/
│   │   └── auth.ts            # JWT auth middleware
│   ├── routes/
│   │   ├── auth.ts            # Auth routes (login/signup)
│   │   └── todos.ts           # Todo CRUD routes
│   └── ui/
│       ├── index.html         # Main UI
│       ├── login.html         # Login page
│       ├── signup.html        # Signup page
│       ├── scripts/           # Frontend JS
│       └── styles/            # CSS styles
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd todo-full-stack
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a .env file in the root directory:
     ```env
     JWT_SECRET=your_jwt_secret
     ```
4. Run database migrations:
   ```bash
   npm run drizzle:push
   ```
5. Start the server:
   ```bash
   npm start
   ```
6. Open [http://localhost:5000](http://localhost:5000) in your browser.

## API Endpoints

### Auth
- `POST /auth/signup` — Register a new user
- `POST /auth/login` — Login and receive JWT

### Todos (protected)
- `GET /todos` — Get all todos for logged-in user
- `POST /todos` — Create a new todo
- `PUT /todos/:id` — Update a todo
- `DELETE /todos/:id` — Delete a todo

## Frontend
- index.html — Main todo list UI
- login.html — Login form
- signup.html — Signup form
- JS scripts in scripts handle API requests, authentication, and UI updates.

## Development
- TypeScript is used throughout the backend for type safety.
- Drizzle ORM manages database schema and queries.
- Middleware (`auth.ts`) secures protected routes using JWT.
- Static files served from ui.

## Environment Variables
- `JWT_SECRET`: Secret key for JWT signing (required)

## Scripts
- `npm start`: Start the Express server
- `npm run drizzle:push`: Run Drizzle ORM migrations
- `npm run drizzle:studio`: Open Drizzle studio to see db

---
