# Restaurant Management System API

A backend REST API for managing restaurant operations including menu items, tables, reservations, orders, inventory, and daily sales reports.

This project was developed using **Node.js, Express.js, MongoDB, and Mongoose** as part of the CodeAlpha Backend Development Internship.

## Features

* Menu item management
* View available menu items
* Restaurant table management
* Check available tables
* Table reservations
* Reservation cancellation
* Inventory management
* Low-stock alerts
* Order placement
* Order item management
* Automatic inventory stock deduction
* Order processing and status management
* Automatic table status updates
* Daily sales reports

## Technologies Used

* Node.js
* Express.js
* MongoDB
* Mongoose
* dotenv
* Postman

## Project Structure

```text
CodeAlpha_RestaurantManagementSystem
│
├── config
│   └── database.js
│
├── controllers
│   ├── menuController.js
│   ├── tableController.js
│   ├── reservationController.js
│   ├── inventoryController.js
│   ├── orderController.js
│   └── reportController.js
│
├── models
│   ├── MenuItem.js
│   ├── RestaurantTable.js
│   ├── Reservation.js
│   ├── Order.js
│   ├── OrderItem.js
│   └── Inventory.js
│
├── routes
│   ├── menuRoutes.js
│   ├── tableRoutes.js
│   ├── reservationRoutes.js
│   ├── inventoryRoutes.js
│   ├── orderRoutes.js
│   └── reportRoutes.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## API Endpoints

### Menu

| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| GET    | `/api/menu`     | Get all menu items    |
| GET    | `/api/menu/:id` | Get a menu item by ID |
| POST   | `/api/menu`     | Create a menu item    |

### Tables

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| GET    | `/api/tables`           | Get all restaurant tables |
| GET    | `/api/tables/available` | Get available tables      |
| POST   | `/api/tables`           | Create a restaurant table |

### Reservations

| Method | Endpoint                       | Description          |
| ------ | ------------------------------ | -------------------- |
| GET    | `/api/reservations`            | Get all reservations |
| POST   | `/api/reservations`            | Create a reservation |
| PATCH  | `/api/reservations/:id/cancel` | Cancel a reservation |

### Inventory

| Method | Endpoint                   | Description         |
| ------ | -------------------------- | ------------------- |
| GET    | `/api/inventory`           | Get all inventory   |
| GET    | `/api/inventory/low-stock` | Get low-stock items |
| POST   | `/api/inventory`           | Create inventory    |
| PATCH  | `/api/inventory/:id`       | Update inventory    |

### Orders

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| GET    | `/api/orders`            | Get all orders      |
| GET    | `/api/orders/:id`        | Get an order by ID  |
| POST   | `/api/orders`            | Place a new order   |
| PATCH  | `/api/orders/:id/status` | Update order status |

### Reports

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| GET    | `/api/reports/daily-sales` | Generate daily sales report |

## Order Processing Flow

```text
Customer places an order
        ↓
Check table
        ↓
Check menu item availability
        ↓
Check inventory stock
        ↓
Calculate order total
        ↓
Create order and order items
        ↓
Automatically decrease inventory
        ↓
Set table status to occupied
        ↓
Process order
        ↓
Pending → Preparing → Ready → Served
        ↓
Set table status to available
```

## Inventory Auto-Update

The system automatically updates inventory when an order is placed.

For example:

```text
Initial Stock: 20 Chicken Burgers

Customer Orders: 3

Remaining Stock: 17
```

The system also provides a low-stock endpoint that identifies inventory items whose quantity reaches or falls below their configured threshold.

## Daily Sales Report

The system can generate a daily sales report based on order creation date.

Example:

```text
GET /api/reports/daily-sales?date=28-09-2026
```

Example response:

```json
{
    "success": true,
    "data": {
        "date": "28-09-2026",
        "totalOrders": 1,
        "totalSales": 1500
    }
}
```

## Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the project

```bash
cd CodeAlpha_RestaurantManagementSystem
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://127.0.0.1:27017/restaurant_management
```

### 5. Start the server

```bash
node server.js
```

The API will run on:

```text
http://localhost:3000
```

## Testing

The API was tested using **Postman**.

Tested functionality includes:

* Menu retrieval and creation
* Table creation and availability
* Reservation creation and cancellation
* Inventory creation and updates
* Low-stock detection
* Order placement
* Automatic inventory deduction
* Order status processing
* Table status updates
* Daily sales reporting

## Environment Variables

The following environment variable is required:

```env
MONGO_URI=your_mongodb_connection_string
```

Do not upload the `.env` file to GitHub.

## Internship Task

**Program:** CodeAlpha Backend Development Internship

**Project:** Restaurant Management System

**Technology:** Node.js + Express.js + MongoDB

**Task:** Task 3 — Restaurant Management System

## Author

**Iqra Khan**

Backend Development Intern
<br>
BS Information Technology
