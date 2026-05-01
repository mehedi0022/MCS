# 🌊 Marine Consultancy Website

A modern full-stack web application for a Marine Consultancy Company, built with **Next.js** (frontend) and **Express.js** (backend). This platform showcases company services, projects, and allows clients to connect easily while providing an admin dashboard for management.

---

## 🚀 Tech Stack

### Frontend

- Next.js
- React.js
- Tailwind CSS

### Backend

- Node.js
- Express.js

### Database

- MySQL

### ORM

- Prisma ORM

---

## 📁 Project Structure

```
mcs/
│
├── frontend/   # Next.js frontend
├── backend/   # Express backend
```

---

## ✨ Features

### 🌐 Public Website

- Home Page
- About Us
- Services Showcase
- Projects / Portfolio
- Contact Form
- Testimonials

### 🔐 Admin Dashboard

- Manage Services
- Manage Projects
- Manage Clients
- Handle Contact Messages
- Upload Images & Documents

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/mehedi0022/mcs.git
cd mcs
```

---

### 2️⃣ Setup Frontend

```
cd client
npm install
npm run dev
```

---

### 3️⃣ Setup Backend

```
cd server
npm install
```

### ▶️ Run Backend (Development)

```
npm run dev
```

---

## 🔑 Environment Variables

Create `.env` files in both client and server:

### Backend `.env`

```
PORT=5000
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
JWT_SECRET=your_secret_key
```

### Frontend `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🗄️ Database (MySQL + Prisma)

### Initialize Prisma

```
npx prisma init
```

### Run Migration

```
npx prisma migrate dev --name init
```

### Generate Prisma Client

```
npx prisma generate
```

---

## 📡 API Example

```
GET    /api/services
POST   /api/services
PUT    /api/services/:id
DELETE /api/services/:id
```

---

## 📂 File Upload

- Uses `multer` for handling file uploads
- Uploaded files are stored in `/server/uploads`

---

## 🔐 Authentication

- JWT-based authentication
- Protected admin routes

---

## 🚀 Deployment

- Frontend: Vercel
- Backend: VPS / DigitalOcean
- Database: MySQL (Cloud / Local Server)

---

## 🧠 Future Improvements

- SEO Optimization
- Advanced Search & Filters
- Analytics Dashboard
- Multi-language Support

---

## 👨‍💻 Author

**Mehedi Hassan**
Full Stack Developer (MERN)

---

## 📄 License

This project is licensed under the MIT License.

---
