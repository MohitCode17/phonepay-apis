# Digital Wallet Backend API (PhonePe-inspired)

A beginner-level backend project inspired by digital wallet apps, built to learn REST API development, authentication, database modeling, wallet operations, and transaction handling with Node.js, Express, and MongoDB.

> **Project status:** Learning / demo project.
> This was backend project. It demonstrates core backend concepts and is not production-ready. It does not integrate with real banking infrastructure, UPI networks, or payment gateways.

## Overview

The API supports user authentication, wallet balance management, simulated money transfers, bill payments, and transaction history. Building it taught me how routes, controllers, middleware, models, and authentication fit together in a REST application.

## Features

- **Authentication:** registration, login, JWT-protected routes, bcrypt password hashing.
- **User profile:** fetch the authenticated user's profile, generate a unique UPI-style ID at registration, set an MPIN for transaction verification.
- **Wallet:** add demo funds, pay bills from the wallet, check available balance before payments.
- **Money transfers:** send demo funds by phone number or UPI-style ID, verify the sender's MPIN, block self-transfers, record every transaction.
- **Transaction history:** list transactions where the user is sender or receiver, newest first, with sender and receiver details.
- **API documentation:** Swagger UI for exploring and testing endpoints.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB + Mongoose | Database and data modeling |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password and MPIN hashing |
| Swagger UI / OpenAPI | API documentation |
| dotenv | Environment configuration |
| CORS | Cross-origin request handling |

## Project Structure

```text
phonepay-apis/
├── server.js
├── swagger-output.json
├── package.json
├── package-lock.json
├── .gitignore
└── src/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── walletController.js
    │   └── transactionController.js
    ├── middlewares/
    │   └── authMiddleware.js
    ├── models/
    │   ├── User.js
    │   └── Transaction.js
    └── routes/
        ├── authRoutes.js
        ├── walletRoutes.js
        └── transactionRoutes.js
```

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB instance, local or hosted (for example MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/MohitCode17/phonepay-apis.git
cd phonepay-apis
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Use your own MongoDB connection string and a long, random JWT secret. `.env` is listed in `.gitignore`; never commit it or any real credentials.

### 4. Start the server

```bash
node server.js
```

The project uses ES module imports, so `package.json` must contain `"type": "module"`.

When the server starts successfully:

- Base URL: `http://localhost:3000`
- Swagger docs: `http://localhost:3000/api-docs`

The MongoDB connection must succeed for database-backed endpoints to work.

## API Endpoints

All endpoints use the `/api` prefix.

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Log in and receive a JWT | Public |
| GET | `/api/auth/profile` | Get the current user's profile | Protected |
| POST | `/api/auth/set-mpin` | Set or update the MPIN | Protected |

### Wallet

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/wallet/add-money` | Add simulated funds to the wallet | Protected |
| POST | `/api/wallet/pay-bill` | Pay a demo bill from the wallet | Protected |

### Transactions

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/transactions/send` | Transfer demo funds to another user | Protected |
| GET | `/api/transactions/history` | Get transaction history | Protected |

Protected endpoints need the JWT from registration or login in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Example Requests

**Register** — `POST /api/auth/register`

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "9876543210",
  "password": "YourDemoPassword123"
}
```

**Log in** — `POST /api/auth/login`

```json
{
  "email": "rahul@example.com",
  "password": "YourDemoPassword123"
}
```

**Set an MPIN** — `POST /api/auth/set-mpin` (authenticated)

```json
{
  "mpin": "1234"
}
```

**Add demo funds** — `POST /api/wallet/add-money` (authenticated)

```json
{
  "amount": 1000
}
```

This endpoint directly increases the stored balance. It does not verify a real payment.

**Send demo money** — `POST /api/transactions/send` (authenticated, MPIN required)

```json
{
  "receiverIdentifier": "receiver1234@phonepe",
  "amount": 500,
  "mpin": "1234"
}
```

The receiver identifier must match a registered user's phone number or generated UPI-style ID.

**Pay a demo bill** — `POST /api/wallet/pay-bill` (authenticated, MPIN required)

```json
{
  "billerName": "Electricity Board",
  "amount": 500,
  "mpin": "1234"
}
```

**Transaction history** — `GET /api/transactions/history` (authenticated)

Returns transactions where the authenticated user is the sender or receiver. You can try every endpoint interactively in Swagger at `/api-docs`.

## Database Models

**User:** name, email, phone, hashed password, generated UPI-style ID, hashed MPIN (once set), wallet balance, timestamps.

**Transaction:** sender and optional receiver references, type (`TRANSFER`, `ADD_MONEY`, `WITHDRAW`, `BILL_PAYMENT`), amount, status (`PENDING`, `COMPLETED`, `FAILED`), optional biller name, timestamps.

## What I Learned

- Designing RESTful endpoints and returning correct HTTP status codes.
- Separating routes, controllers, middleware, and models.
- Implementing JWT authentication and protected routes.
- Hashing passwords and MPINs with bcrypt.
- Modeling related data with MongoDB and Mongoose.
- Validating wallet operations and keeping a transaction history.
- Documenting an API with Swagger/OpenAPI.

## Known Limitations

This is an educational project. The current implementation does **not** guarantee atomic financial operations and must not be used with real money.

Not yet addressed:

- Wallet updates and transaction records are not wrapped in a database transaction, so a failure midway can leave them inconsistent.
- Concurrent transfers can cause race conditions.
- There is no idempotency handling, so a retried request can be processed twice.
- Request validation and centralized error handling are minimal.
- There is no rate limiting, audit logging, or automated test suite.
- Wallet top-ups are not verified through a payment provider.

I am addressing the consistency, concurrency, and idempotency items in a separate PostgreSQL-based ledger project.

## Disclaimer

This is an independent educational project inspired by digital wallet apps. It is not affiliated with, endorsed by, or connected to PhonePe, and it does not implement real UPI payments, banking services, or money transfers.
