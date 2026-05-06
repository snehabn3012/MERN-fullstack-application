# 🛍️ Full Stack E-Commerce Platform (MERN)

A production-ready, scalable e-commerce application for Grocery items built using the MERN stack.  
Designed with a modular architecture, secure authentication, and optimized frontend performance using React.

- 🔗 **Live Demo (Home Page):** https://e-commerce-fullstack-inx2.vercel.app/  
- 🔗 **SignIn Page:** - https://e-commerce-fullstack-inx2.vercel.app/signin/
- 🔗 **SignUp Page:** - https://e-commerce-fullstack-inx2.vercel.app/signup/
- 🔗 **All Products:** - https://e-commerce-fullstack-inx2.vercel.app/shop/
- 🔗 **All Products:** - https://e-commerce-fullstack-inx2.vercel.app/cart/
- 🔗 **Admin Page to upload/manage Products:** - https://e-commerce-fullstack-inx2.vercel.app/admin/dashboard
- 🔗 **API Base URL:** https://mern-fullstack-application-1.onrender.com/api/
---

## 📌 Project Overview

This project simulates a real-world e-commerce system with authentication, product management, cart and payment flow, and order handling.  

The focus was on:

- Clean frontend architecture
- Reusable UI components
- Secure backend APIs
- Proper environment configuration
- Production-ready deployment

---

## 🧠 Architecture
Client (React)  →  Express API  →  MongoDB Atlas
      │                 │
    Vercel           Render

- Frontend and backend are deployed independently.
- Environment variables are isolated per service.
- RESTful API structure with JWT-based authentication.

---

## 🏗️ Tech Stack

### Frontend
- React
- React Router
- Context API / State Management
- Vitest

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Bcrypt (password hashing)

### Dev & Deployment
- GitHub
- Render (Backend Hosting)
- Vercel (Frontend Hosting)
- MongoDB Atlas (Cloud Database)

---

## 🔐 Core Features

### 👤 Authentication
- Secure user registration & login
- JWT-based session handling
- Protected routes (frontend + backend)
- Password hashing using bcrypt

### 🛒 Shopping Flow
- Product listing with dynamic data
- Product details page
- Add to cart functionality
- Quantity updates
- Order placement
- Order History
- User Account page with edit

### 🛠️ Admin Capabilities
- Add / Update / Delete products
- Order management

---

## ⚡ Performance & Engineering Highlights

- Modular folder structure (separated client & server)
- Proper CORS configuration
- Error handling middleware
- Scalable backend routing structure
- Reusable React components
- Clean separation of concerns
