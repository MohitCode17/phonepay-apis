# PhonePe Clone — Backend API

A beginner-level backend project inspired by digital wallet applications, built to learn REST API development, authentication, database modeling, wallet operations, and transaction management using Node.js and Express.

> **Project Status:** Learning / Demo Project  
> This project was built as my first backend learning project. It demonstrates core backend concepts and is not production-ready. It does not integrate with real banking infrastructure, UPI networks, or payment gateways.

## Overview

The PhonePe Clone Backend provides APIs for user authentication, wallet balance management, simulated money transfers, bill payments, and transaction history.

The project helped me understand how backend routes, controllers, middleware, database models, and authentication work together to build a RESTful application.

## Features

- **User Authentication**
  - User registration and login.
  - JWT-based authentication.
  - Protected API routes.
  - Password hashing using bcrypt.

- **User Profile**
  - Retrieve the authenticated user's profile.
  - Generate a unique UPI-style ID during registration.
  - Set an MPIN for transaction verification.

- **Wallet Management**
  - Add demo funds to a wallet.
  - Pay bills using the wallet balance.
  - Validate available balance before payments.

- **Money Transfers**
  - Transfer demo funds using a registered phone number or UPI-style ID.
  - Verify the sender's MPIN.
  - Prevent self-transfers.
  - Maintain transaction records.

- **Transaction History**
  - Retrieve transactions involving the authenticated user.
  - View sender and receiver details.
  - Sort transactions by creation date.

- **API Documentation**
  - Swagger UI for exploring and testing API endpoints.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Mongoose | Database modeling and queries |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password and MPIN hashing |
| Swagger UI / OpenAPI | API documentation |
| dotenv | Environment configuration |
| CORS | Cross-origin request handling |

## Project Structure

```text
phonepe-backend/
├── server.js
├── swagger-output.json
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── walletController.js
│   │   └── transactionController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   └── routes/
│       ├── authRoutes.js
│       ├── walletRoutes.js
│       └── transactionRoutes.js
├── .env
├── .gitignore
└── package.json
```

*The structure above represents the intended organization; adjust file and folder names to match the actual repository.*

## Getting Started

### Prerequisites

- Node.js and npm installed.
- A MongoDB instance, either local or hosted.
- Git (optional, for cloning the repository).

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd phonepe-clone-backend
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

Use your own MongoDB connection string and a strong, private JWT secret. Never commit your `.env` file or real credentials to GitHub.

### 4. Start the server

```bash
node server.js
```

The application uses ES module imports. Ensure your `package.json` is configured accordingly.

If the server starts successfully, the default local URLs are:

- **Base URL:** `http://localhost:3000`
- **API Documentation:** `http://localhost:3000/api-docs`

The MongoDB connection must succeed for database-dependent endpoints to work.

## API Endpoints

All endpoints use the `/api` prefix unless otherwise specified.

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Authenticate a user | Public |
| GET | `/api/auth/profile` | Retrieve the current user's profile | Protected |
| POST | `/api/auth/set-mpin` | Set or update the user's MPIN | Protected |

### Wallet

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/wallet/add-money` | Add simulated funds to the wallet | Protected |
| POST | `/api/wallet/pay-bill` | Pay a demo bill using wallet funds | Protected |

### Transactions

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/transactions/send` | Transfer demo funds to another user | Protected |
| GET | `/api/transactions/history` | Retrieve transaction history | Protected |

**Protected endpoints:** Send the JWT returned by registration or login in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Example Requests

#### Register a user

`POST /api/auth/register`

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "9876543210",
  "password": "YourDemoPassword123"
}
```

#### Log in

`POST /api/auth/login`

```json
{
  "email": "rahul@example.com",
  "password": "YourDemoPassword123"
}
```

#### Set an MPIN

`POST /api/auth/set-mpin`

Requires authentication.

```json
{
  "mpin": "1234"
}
```

#### Add demo funds

`POST /api/wallet/add-money`

Requires authentication.

```json
{
  "amount": 1000
}
```

**Note:** This endpoint directly increases the stored wallet balance. It does not verify a real payment.

#### Send demo money

`POST /api/transactions/send`

Requires authentication and a previously configured MPIN.

```json
{
  "receiverIdentifier": "receiver1234@phonepe",
  "amount": 500,
  "mpin": "1234"
}
```

The receiver identifier must match a registered user's phone number or generated UPI-style ID.

#### Pay a demo bill

`POST /api/wallet/pay-bill`

Requires authentication and a configured MPIN.

```json
{
  "billerName": "Electricity Board",
  "amount": 500,
  "mpin": "1234"
}
```

#### Get transaction history

`GET /api/transactions/history`

Requires authentication. Returns transactions where the authenticated user is the sender or receiver.

For interactive API testing, use the Swagger documentation available at `/api-docs`.

## Database Models

### User

The user model includes:

- Name, email, and phone number.
- Hashed password.
- Generated UPI-style ID.
- Hashed MPIN, when configured.
- Wallet balance.
- Creation and update timestamps.

### Transaction

The transaction model records:

- Sender and optional receiver references.
- Transaction type: `TRANSFER`, `ADD_MONEY`, `WITHDRAW`, or `BILL_PAYMENT`.
- Amount and transaction status.
- Optional biller name.
- Creation and update timestamps.

The supported statuses are `PENDING`, `COMPLETED`, and `FAILED`.

## Important Learning Outcomes

Through this project, I gained practical experience with:

- Designing RESTful API endpoints.
- Separating routes, controllers, middleware, and models.
- Implementing JWT authentication and protected routes.
- Hashing sensitive credentials with bcrypt.
- Modeling relationships using MongoDB and Mongoose.
- Validating wallet operations and maintaining transaction history.
- Handling HTTP status codes and API errors.
- Documenting APIs with Swagger/OpenAPI.

## Limitations and Future Improvements

This is an educational project, and several production-level concerns have not been addressed.

Potential improvements include:

- Add comprehensive request validation and centralized error handling.
- Use MongoDB transactions to keep wallet updates and transaction records consistent.
- Prevent race conditions during concurrent transfers.
- Introduce rate limiting, stricter authentication controls, and audit logging.
- Add automated unit and integration tests.
- Implement proper idempotency and transaction reconciliation.
- Integrate a legitimate payment provider for verified wallet top-ups.
- Improve financial data handling, monitoring, and operational security.

**Important:** Wallet balances are simulated application data. The current implementation does not guarantee atomic financial operations and must not be used to handle real money or sensitive financial transactions.

## Disclaimer

This project is an independent educational clone inspired by digital wallet applications. It is not affiliated with, endorsed by, or connected to PhonePe. It does not implement actual UPI payments, banking services, or real-money transfers.

Built for learning backend development with Node.js, Express.js, and MongoDB.
