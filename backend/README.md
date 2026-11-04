# MERNexus Backend

This backend powers the MERNexus admin dashboard with a REST API for managing users, products, and orders. It is built with Express and Mongoose and connects to MongoDB through environment-based configuration.

See the [main project documentation](../README.md) for the full-stack overview.

## Overview

The backend follows a simple layered structure:

- Express app entrypoint in [server.js](server.js)
- Application wiring in [src/app.js](src/app.js)
- MongoDB connection logic in [src/config/db.js](src/config/db.js)
- Route handlers in [src/routes](src/routes)
- Controllers in [src/controllers](src/controllers)
- Mongoose models in [src/model](src/model)

The API exposes REST endpoints under the root paths /users, /products, and /orders.

## Backend Tech Stack

- Node.js
- Express.js
- Mongoose
- CORS
- dotenv
- nodemon (development)

## Backend Folder Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── orders.controller.js
│   │   ├── products.controller.js
│   │   └── user.controller.js
│   ├── model/
│   │   ├── orders.model.js
│   │   ├── products.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── order.routes.js
│   │   ├── product.routes.js
│   │   └── user.routes.js
│   └── app.js
├── server.js
└── package.json
```

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Create a .env file in the backend directory with the following variables:

```env
PORT=4000
MONGODB_URL=mongodb://127.0.0.1:27017/mern_lab6
```

## Local MongoDB Setup

1. Install MongoDB Community Server and start its local service.
2. Use mongodb://127.0.0.1:27017/mern_lab6 for MONGODB_URL.
3. Start the backend with npm start (or npm run dev).
4. Open http://localhost:4000 to check the API.

MongoDB creates the database on the first write. No Atlas account is required.
The backend also uses this local URL when MONGODB_URL is unset.
Never commit local .env files; distribute .env.example instead.

## Database Models

### User Model

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| name | String | Yes | Trimmed |
| email | String | Yes | Unique, lowercase, trimmed |
| age | Number | No | Minimum value 1 |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

### Product Model

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| name | String | Yes | Trimmed |
| description | String | Yes | Trimmed |
| price | Number | Yes | Minimum value 0 |
| category | String | Yes | Trimmed |
| stock | Number | Yes | Minimum value 0, default 0 |
| isavail | Boolean | Yes | Availability flag |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

### Order Model

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| user | ObjectId | Yes | References the User model |
| products | Array | Yes | Contains ordered product entries |
| products[].product | ObjectId | Yes | References the Product model |
| products[].quantity | Number | Yes | Minimum 1, default 1 |
| products[].price | Number | Yes | Minimum 0 |
| totalAmount | Number | Yes | Minimum 0 |
| status | String | No | Enum: pending, confirmed, shipped, delivered, cancelled |
| shippingAddress.address | String | Yes | Trimmed |
| shippingAddress.city | String | Yes | Trimmed |
| shippingAddress.state | String | Yes | Trimmed |
| shippingAddress.pincode | String | Yes | Trimmed |
| paymentMethod | String | Yes | Enum: COD, UPI, Card |
| paymentStatus | String | No | Enum: pending, paid, failed |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

## Model Relationships

The orders collection links to users and products through MongoDB ObjectId references. The order controller uses Mongoose populate on the user field and the products.product field so the API can return richer order payloads.

## API Endpoints

### Users

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | /users | Create a user |
| GET | /users | Get all users |
| GET | /users/:id | Get a user by ID |
| PUT | /users/:id | Update a user |
| DELETE | /users/:id | Delete a user |

### Products

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | /products | Create a product |
| GET | /products | Get all products |
| GET | /products/:id | Get a product by ID |
| PUT | /products/:id | Update a product |
| DELETE | /products/:id | Delete a product |

### Orders

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | /orders | Create an order |
| GET | /orders | Get all orders |
| GET | /orders/:id | Get an order by ID |
| PUT | /orders/:id | Update an order |
| DELETE | /orders/:id | Delete an order |

## Request Examples

### Create User

```json
{
  "name": "jaswanth",
  "email": "jaswanth@example.com",
  "age": 28
}
```

### Create Product

```json
{
  "name": "Wireless Headphones",
  "description": "Noise-cancelling Bluetooth headphones",
  "price": 499,
  "category": "Electronics",
  "stock": 20,
  "isavail": true
}
```

### Create Order

```json
{
  "user": "64f1c5d2e4b0a1b2c3d4e5f6",
  "products": [
    {
      "product": "64f1c5d2e4b0a1b2c3d4e5f7",
      "quantity": 2,
      "price": 499
    }
  ],
  "totalAmount": 998,
  "status": "pending",
  "shippingAddress": {
    "address": "123 Main Street",
    "city": "Vijayawada",
    "state": "Andhra Pradesh",
    "pincode": "520010"
  },
  "paymentMethod": "COD",
  "paymentStatus": "pending"
}
```

## Response Examples

Successful create or update calls return a JSON payload shaped like this:

```json
{
  "success": true,
  "data": {
    "_id": "64f1c5d2e4b0a1b2c3d4e5f6",
    "name": "jaswanth"
  }
}
```

List endpoints return a similar structure with a count field:

```json
{
  "success": true,
  "count": 3,
  "data": []
}
```

## Order Population

The order list and detail routes populate the related user and product documents so each order includes the resolved customer and product information.

## Validation and Error Handling

The backend relies on Mongoose validation and the controller error handling. Common validation rules include:

- required strings for user and product core fields
- minimum numeric values for price, stock, quantity, and total amount
- enum values for order status, payment method, and payment status
- duplicate email handling through the unique constraint on the user email field

Error responses return a JSON message field when validation or lookup fails.

## Running Backend

```bash
npm run dev
```

The server starts on port 4000 by default, or the value provided in the PORT environment variable.

## API Testing

You can test the API manually with tools such as Postman or curl. The frontend already consumes the same REST endpoints when you run the full application.

## Security Notes

- Keep the .env file local and uncommitted.
- Never expose the MongoDB connection string in public repositories.
- The current implementation does not include authentication or role-based authorization.


## Populate the local database

With MongoDB running, run the following from the backend folder:

```powershell
npm run seed
```

This adds 3 fictional users, 5 products, and 3 linked orders to the database
selected by MONGODB_URL (default: local mern_lab6). It does not clear data or
modify existing records. Stable sample IDs prevent duplicates on repeated runs.
Edits to sample records are preserved; deleted sample records are recreated.
Refresh the dashboard after running the command. The API need not be running.
