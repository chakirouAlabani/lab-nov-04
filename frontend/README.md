# MERNexus Frontend

This frontend provides the admin dashboard experience for MERNexus. It is a React + Vite application with Tailwind styling that talks to the Express and MongoDB backend for all CRUD workflows.

See the [main project documentation](../README.md) for the project overview and backend context.

## Overview

The frontend is organized around a single-page admin experience with sections for dashboard, users, products, and orders. Each section offers list views, detail views, create forms, edit forms, and delete confirmation flows.

## Frontend Tech Stack

- React
- Vite
- Tailwind CSS
- Fetch API
- Oxlint (linting)

## Frontend Folder Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── AlertMessage.jsx
│   │   ├── ConfirmModal.jsx
│   │   ├── EmptyState.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── users/
│   │   ├── products/
│   │   └── orders/
│   ├── services/
│   │   ├── api.js
│   │   ├── userService.js
│   │   ├── productService.js
│   │   └── orderService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── index.html
```

## Installation

```bash
cd frontend
npm install
```

## Environment Variables

The frontend uses a single environment variable for the API base URL:

```env
VITE_API_BASE_URL=http://localhost:4000
```

If the variable is not set, the app falls back to http://localhost:4000.

## Running Frontend

```bash
npm run dev
```

Vite serves the app locally in development mode, typically on port 5173 unless that port is already in use.

## Pages and Navigation

The app exposes four main dashboard sections:

- Dashboard
- Users
- Products
- Orders

Inside each section you can create, view, edit, or delete records through the available page components.

## User Management UI

The users section supports:

- Creating a new user
- Viewing a user profile
- Editing user details
- Deleting a user with confirmation
- Searching users by name or email

## Product Management UI

The products section supports:

- Creating a new product
- Viewing product details
- Updating product details
- Deleting a product with confirmation
- Filtering products by category and availability
- Searching by name or description

## Order Management UI

The orders section supports:

- Creating a new order
- Selecting a customer and one or more products
- Adding multiple order items with quantity and price inputs
- Calculating the order total
- Capturing shipping details and payment information
- Viewing, editing, and deleting orders
- Filtering orders by status and payment status

## API Integration

The frontend uses a small service layer in [src/services](src/services):

- [src/services/api.js](src/services/api.js) centralizes fetch requests and error handling.
- [src/services/userService.js](src/services/userService.js) wraps user API calls.
- [src/services/productService.js](src/services/productService.js) wraps product API calls.
- [src/services/orderService.js](src/services/orderService.js) wraps order API calls.

Each service sends JSON requests to the backend and updates local state after successful mutations.

## UI/UX

The interface includes:

- A dark dashboard theme
- Responsive layouts built with Tailwind CSS
- Loading indicators while data is fetched
- Success and error alert banners
- Confirmation modals for deletes
- Empty states when no records are available

## Component Structure

Reusable UI pieces include:

- Navbar for section switching
- AlertMessage for feedback
- ConfirmModal for destructive actions
- EmptyState for empty lists
- LoadingSpinner for async states

## Backend Dependency

The frontend requires a running backend API. Make sure the backend is started first and that the VITE_API_BASE_URL value points to the correct host and port.

## Build

```bash
npm run build
```

## Troubleshooting

- If the dashboard cannot load data, confirm the backend is running.
- If API calls fail, verify VITE_API_BASE_URL points to the backend host.
- If dropdowns appear empty, make sure users and products exist in the backend database.
- If the connection fails, verify the local MongoDB server and the backend environment variables.

