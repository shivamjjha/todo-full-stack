# JWT Express API

A simple Express.js API in TypeScript for signing and verifying JWT tokens. Includes environment variable support and error handling.

## Features

- Sign JWT tokens with custom payloads
- Verify JWT tokens
- TypeScript for type safety
- Centralized error handling
- Environment variable support via dotenv

## Getting Started

### Prerequisites

- Node.js >= 22.18.0
- npm

### Installation

```bash
npm install
```

### Environment Setup

Create a .env file in the project root:

```
JWT_SECRET=your_secret_key
```

### Running the Server

```bash
npm run dev
```

Server runs on port `5000` by default.

## API Endpoints

### `POST /auth/sign`

Signs a JWT token.

**Request Body:**
```json
{
  "data": { "userId": "123", "role": "admin" }
}
```

**Response:**
```json
{
  "token": "jwt_token"
}
```

### `POST /auth/verify`

Verifies a JWT token.

**Request Body:**
```json
{
  "data": "jwt_token"
}
```

**Response:**
- Success: `{ "ok": true }`
- Failure: `{ "ok": false }`

## Project Structure

```
src/
  app.ts           # Express app entry point
  routes/
    auth.ts        # JWT sign/verify routes
.env.local         # Environment variables
package.json       # Project metadata and scripts
tsconfig.json      # TypeScript configuration
```

---

## Examples

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
