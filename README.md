# **Payment Application - Backend with NestJS**

## 👀 **Project Description:**

The goal of this project is to develop a backend application using **NestJS** to manage payments. The application should meet the following requirements:

## 📜 **Project Setup:**

### 1. Prerequisites:

Before you begin, make sure you have the following software installed on your machine:

- **Docker**: (Optional) Used to run the database in a containerized environment.  
  You can download and install Docker from here: [Docker Official Website](https://www.docker.com/products/docker-desktop)

- **Node.js**: Used to run the backend application.  
  You can download and install Node.js from here: [Node.js Official Website](https://nodejs.org/en/download/)

### 2. Clone the Repository:

```bash
git clone <repository_url>
```

### 3. Navigate to the project directory

Change to your project directory:

```bash
cd <project_folder>
```

### 4. Install node dependencies

To install all the dependencies required for the project, run:

```bash
npm install
```

### 5. Install and up Postgres using Docker (Optional)

Then, run the following command to start Postgres in a container. Optional if you already have a :

```bash
docker compose up -d
```

### 6. Configure environment variables 

Create a .env file in the root directory of the project and add the following environment variables:

```bash
DATABASE_URL=<your_database_url>
```

Replace <your_database_url> with your database url.

If .env is missing, copy from .env.example if available:

```bash
cp .env.example .env
```

### 7. Initialize prisma

a. Generate Prisma Client

```bash
npx prisma generate
```

b. Run Migrations (if applicable)

```bash
npx prisma migrate dev
```

Otherwise, if the DB already exists and you want to sync Prisma with it:

```bash
npx prisma db pull
```

### 8. Run the application

After installing dependencies and configuring the environment, you can start the application with:

```bash
npm run start:dev
```

## Steps for accesing the features:

# 📚 API Documentation

This API handles basic user management and monetary transactions between users. It is built with **NestJS** and uses **Prisma ORM**.

---

> **Note**
> You can use a Data Visualization Tool such as [Table Plus](https://tableplus.com/) for better DB managing.

- Once you have the app up and running, go to [localhost:3000/swagger](localhost:3000/swagger) and check the different endpoints and schemas available.


## 🔗 Base URL

http://localhost:3000

## 🧑‍💼 Users Endpoints

### ➕ Create a User

**POST** `/users`

Creates a new user.

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "balance": 1000
}
```

#### Response 

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "balance": 1000
}
```

### 📄 Get All Transactions for a User 

**GET** `:id/transactions`

Returns all transactions for a user ordered by creation date (newest first).

### 🔍 Get a Single User

**GET** `/users/:id`

Returns a user by their ID.

```bash
GET /users/1
```

## 💸 Transactions endpoints

### ➕ Create a Transaction

**POST** `/transactions`

Creates a new user.

#### Request Body

```json
{
  "originId": 1,
  "destinationId": 2,
  "amount": 25000
}
```

- If amount > 50000, the transaction will be created with status PENDING.

- If amount <= 50000, the transaction will be created with status APPROVED.

#### Response 

```json
{
  "id": 1,
  "originId": 1,
  "destinationId": 2,
  "amount": 25000,
  "status": "APPROVED",
  "createdAt": "2025-06-12T15:30:00.000Z"
}
```

### 📄 Get All Transactions

**GET** `/transactions`

Returns all transactions ordered by creation date (newest first).

### ✏️ Update Transaction Status

**PATCH** `/transactions/updateStatus/:id`

Updates the status of a PENDING transaction to either APPROVED or REJECTED.

```json
{
  "status": "APPROVED"
}
```

- If APPROVED, the amount is added to the destination’s balance.

- If REJECTED, the amount is refunded to the origin’s balance.