# 🛒 MERN E-Commerce Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE) [![Demo](https://img.shields.io/badge/Live%20Demo-Render-blue)](https://ecommerce-mern-1-seft.onrender.com/)

> A desktop-first, responsive MERN-stack e-commerce application built from scratch for hands-on learning.

## 🚀 Live Demo

👉 [https://urbantrendzmdl.com/](https://urbantrendzmdl.com/)

## 📂 Repository

* GitHub: [PailaKarthik/ECommerce-MERN](https://github.com/PailaKarthik/ECommerce-MERN)

## ✨ Features

* 🔐 **JWT Authentication**: Secure login, register & logout flows with protected routes.
* 💾 **MongoDB Database** (Mongoose): Schemas for users, products, orders, reviews; CRUD operations.
* ☁️ **Cloudinary Integration**: Image upload & management for products.
* 🛠️ **Admin Panel**: Role-based access to add/edit/delete products and manage orders.
* 🔍 **Product Browsing**: Sorting, searching, filtering by category, price range, rating.
* 💳 **Payment Integration**: PayPal Sandbox checkout flow with payment status handling.
* 📦 **Order Tracking & Address Management**: View and update order status and shipping addresses.
* ⭐ **Review & Rating System**: Submit and display product reviews and average ratings.
* 🎨 **UI & Styling**: Tailwind CSS + Shadcn UI components (sheets, dialogs, buttons); Lucide React icons; desktop-first responsive design.
* 🔧 **Error Handling & Feedback**: Input validation, error messages, loading states.

## 🛠️ Tech Stack

* **Frontend:** React, Tailwind CSS, Shadcn UI, Lucide React icons
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Auth:** JWT (JSON Web Tokens)
* **Images:** Cloudinary
* **Payment:** PayPal Sandbox
* **Deployment:** Render

## ⚙️ Getting Started

### Prerequisites

* Node.js (v14+), npm or yarn
* MongoDB (local or cloud)
* Cloudinary account
* PayPal Developer account (sandbox credentials)

### Installation & Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/PailaKarthik/ECommerce-MERN.git
   cd ECommerce-MERN
   ```

2. **Server setup**

   ```bash
   cd server
   npm install
   ```

   * Create a `.env` in `server/` (see below).

3. **Client setup**

   ```bash
   cd ../client
   npm install
   ```

   * Create `.env` if needed (e.g., `REACT_APP_API_URL`, `REACT_APP_PAYPAL_CLIENT_ID`).

### Environment Variables

In `server/.env`:

```
PORT=5000
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_jwt_secret>
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
PAYPAL_CLIENT_ID=<paypal_sandbox_client_id>
PAYPAL_CLIENT_SECRET=<paypal_sandbox_secret>
```

In `client/.env` (example):

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_PAYPAL_CLIENT_ID=<paypal_sandbox_client_id>
```

### Running Locally

1. **Start backend**

   ```bash
   cd server
   npm run dev
   ```
2. **Start frontend**

   ```bash
   cd ../client
   npm start
   ```

* Backend on [http://localhost:5000](http://localhost:5000), frontend on [http://localhost:3000](http://localhost:3000).
* Test flows: register, login, browse, cart, checkout (PayPal sandbox), reviews, admin tasks.

## 🚩 Usage Notes

* Desktop-first design: best on desktop, but responsive on smaller devices.
* Role-based UI: normal users vs admin.
* Ensure environment variables set before running.

## 🧠 Learning Outcomes

* End-to-end JWT auth in React & Express.
* File uploads and third-party integrations (Cloudinary).
* Complex frontend: sorting, searching, filtering state management.
* Payment gateway flow with PayPal sandbox.
* Order lifecycle management.
* Responsive UI design with Tailwind & Shadcn UI.

## 🔮 Future Improvements

* Performance: lazy loading, code splitting.
* Real payment integration and more options.
* Advanced search: fuzzy search or Elasticsearch.
* Product recommendations (e.g., similar items).
* User profiles: wishlist, order history details.
* Notifications: email order confirmations.
* Testing: unit/integration tests.
* Accessibility improvements.
* Dockerization & CI/CD pipelines.

## 📁 Project Structure (Brief)

```
ECommerce-MERN/
├── server/      # Express API, controllers, models, routes, middleware
└── client/      # React app with components, pages, contexts, services
```

## 📬 Contact

Built by **Paila Karthik**. Feedback welcome via GitHub issues or PRs.
