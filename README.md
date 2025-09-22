
## Express JWT CRUD

This project is a RESTful API built with Express.js, TypeScript, and Drizzle ORM. It demonstrates user authentication using JWT, secure password hashing, and CRUD operations for a simple todo list. The project uses SQLite as the database and includes middleware for authentication.

---

## Features

- **User Sign Up**: Register new users with secure password hashing (argon2).
- **User Sign In**: Authenticate users and issue JWT tokens.
- **JWT Middleware**: Protect routes using JWT authentication middleware.
- **Todos CRUD**: Add, view, update, and delete todo items for authenticated users.

---

## Folder Structure

```text
express-jwt-crud/
├── db/
│   ├── drizzle.config.ts      # Drizzle ORM configuration
│   ├── index.ts              # DB connection setup
│   ├── local.db              # SQLite database file
│   └── schema.ts             # Database schema definitions
├── src/
│   ├── app.ts                # Express app entry point
│   ├── middlewares/
│   │   └── auth.ts           # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.ts           # Auth routes (sign in, sign up)
│   │   └── todos.ts          # Todos CRUD routes
│   └── utils/                # Utility functions (if any)
├── .env.local                # Environment variables
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

---

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   - Copy `.env.local` and set `JWT_SECRET` and `DB_FILE_NAME`.

3. **Run database migrations**
   ```bash
   npm run drizzle:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

---

## API Endpoints

### Auth

- `POST /auth/signup` — Register a new user
  - Body: `{ username, password }`
- `POST /auth/signin` — Login and receive JWT token
  - Body: `{ username, password }`

### Todos (Protected)

- `GET /todos` — Get all todos for authenticated user
- `POST /todos` — Add a new todo
  - Body: `{ title, description }`
- `PUT /todos/:id` — Update a todo
  - Body: `{ title?, description? }`
- `DELETE /todos/:id` — Delete a todo

---

## Middleware

- **JWT Authentication**: Protects `/todos` routes. Checks for valid JWT in `Authorization` header.

---

## Tech Stack

- Express.js
- TypeScript
- Drizzle ORM
- SQLite
- JWT (jsonwebtoken)
- Argon2 (password hashing)
- Zod (validation)

---

## License

MIT

## Examples (in prog)

### Generating token
```bash
curl -X POST -H "Content-Type: application/json" --data '{"data":{"user":"username","password":"xyz"}}' http://localhost:5000/auth/sign
```

Response
```
{"token":"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidXNlcm5hbWUiLCJwYXNzd29yZCI6Inh5eiIsImlhdCI6MTc1ODAzNzE0MywiZXhwIjoxNzU4MDQwNzQzfQ.njMEcZ2GgULngrxTdgfhNVBlVV6vteYLLjHHW3dgLxQhp3UoqLtkL1OFpsQ2t9K3jH3_460llz235UKiIq-ynA"}
```

### Verifying token
```bash
curl -X POST -H "Content-Type: application/json" --data '{"data":"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidXNlcm5hbWUiLCJwYXNzd29yZCI6Inh5eiIsImlhdCI6MTc1ODAzNjM1MywiZXhwIjoxNzU4MDM5OTUzfQ.ng8QtAt5o6OHMevg_ERsaEIv7l_iYLch6JXfJXk-LfKsHvHI6Sv8TNXzdKW9HO82CY4HBeJcbafzZI0F6QU6hA"}' http://localhost:5000/auth/verify
```

Response
```
{"ok":true}
```

```bash
curl -X POST -H "Content-Type: application/json" --data '{"data":"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidXNlcm5hbWUiLCJwYXNzd29yZCI6Inh5eiIsImlhdCI6MTc1ODAzNjM1MywiZXhwIjoxNzU4MDM5OTUzfQ.ng8QtAt5o6OHMevg_ERsaEIv7l_iYLch6JXfJXk-LfKsHvHI6Sv8TNXzdKW9HO82CY4HBeJcbafzZI0F6QU7hA"}' http://localhost:5000/auth/verify
```

Response
```
{"ok":false}
```
