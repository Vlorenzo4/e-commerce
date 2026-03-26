# E-commerce Backend API

Backend application for an e-commerce platform built with NestJS and TypeScript. It includes authentication, user management, product management, order handling, role-based access control, and image upload integration.

---

## 🚀 Features

- User authentication with JWT
- Role-based access control (admin and user)
- User management
- Product management
- Order management
- Image upload integration with Cloudinary
- Data persistence with PostgreSQL
- RESTful API architecture

---

## 🛠 Technologies

- Node.js
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT
- Cloudinary

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd E-commerce/e-commerce/Backend

## Install dependencies
npm install

## Configure environment variables
Create a .development.env file in the root of the backend project based on .development.env.example.

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database

CLOUD_NAME=your_cloudinary_name
API_KEY=your_api_key
API_SECRET=your_api_secret

JWT_SECRET=your_jwt_secret

## Run the project
npm run start

if you want to run it in development mode, use:
npm run start:dev

## 📌 Usage

- Register and authenticate users
- Manage products  
- Create and manage orders
- Control access based on user roles 
- Upload product images using Cloudinary
