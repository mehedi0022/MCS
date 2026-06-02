# Merin Consultancy Website (MCS)

Merin Consultancy Website is a full-stack maritime consultancy platform built with a Next.js frontend and an Express.js backend. It presents public-facing company content such as services, projects, clients, contact information, and company story, while also providing an admin dashboard for managing the website content.

## Overview

The project is split into two applications:

- `frontend` - Next.js app for the public website and admin interface
- `backend` - Express API with Prisma, MySQL, authentication, uploads, email, and content management endpoints

## Features

### Public Website

- Home page with dynamic hero slides
- About us, journey, and company story sections
- Services and expertise pages
- Projects listing and project details pages
- Clients and sectors page
- Contact page with message submission
- FAQ, training, privacy, and terms pages
- Dynamic site settings, logo, favicon, contact details, and social links

### Admin Dashboard

- Secure login, forgot password, and reset password flows
- Dashboard overview
- Manage hero slides
- Manage services
- Manage projects and project galleries
- Manage clients
- Manage contact messages
- Manage users
- Manage site settings
- Manage journey, our story, and what-we-do content

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui style components
- Axios
- Framer Motion / Motion
- Swiper
- Lucide React

### Backend

- Node.js
- Express 5
- TypeScript
- Prisma ORM
- MySQL
- JWT authentication
- Cookie-based sessions
- Multer
- Cloudinary
- Nodemailer
- Yup validation

## Project Structure

```text
.
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── templates/
│   │   ├── utils/
│   │   ├── validations/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── lib/
│   ├── public/
│   ├── .env.local.example
│   ├── Dockerfile
│   └── package.json
│
├── .gitignore
└── readme.md
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- MySQL database
- Cloudinary account, required for production image uploads
- SMTP credentials, required for sending email

### 1. Clone the Repository

```bash
git clone https://github.com/mehedi0022/mcs.git
cd "Merin Consultency Website MCS"
```

If your local folder name is different, open that folder instead.

### 2. Configure the Backend

```bash
cd backend
npm install
copy .env.example .env
```

Update `backend/.env` with your own values:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/mcs"
JWT_SECRET="replace-with-a-long-random-secret"
COOKIE_NAME=mcs_admin_token
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=mcs
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASS=your_app_password
SMTP_FROM_NAME=MCS Team
```

Generate Prisma client, run migrations, and seed the database:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

Start the backend API:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### 3. Configure the Frontend

Open a new terminal:

```bash
cd frontend
npm install
copy .env.local.example .env.local
```

Update `frontend/.env.local` if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The website runs at:

```text
http://localhost:3000
```

## Useful Scripts

### Backend

Run from `backend`:

```bash
npm run dev              # Start development server
npm run build            # Compile TypeScript
npm run start            # Run compiled server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run Prisma migrations
npm run seed             # Seed initial database data
```

### Frontend

Run from `frontend`:

```bash
npm run dev        # Start Next.js development server
npm run build      # Build production frontend
npm run start      # Start production frontend
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript checks
npm run format     # Format TS/TSX files
```

## API Modules

The backend exposes these main API groups:

```text
GET  /api/health

/api/auth
/api/dashboard
/api/hero-slides
/api/services
/api/projects
/api/clients
/api/messages
/api/settings
/api/users
/api/what-we-do
/api/journey
/api/our-story
```

## Authentication

Admin authentication uses JWT tokens with HTTP cookies. The frontend API client sends credentials automatically and refreshes expired sessions through the auth refresh endpoint.

## Database

The database is managed with Prisma and MySQL. The schema includes:

- Users and auth sessions
- Services
- Projects and galleries
- Clients
- Hero slides
- Contact messages
- Site settings
- What-we-do items
- Journey milestones
- Our story content

## File Uploads

The backend supports file upload handling through Multer and Cloudinary. Configure Cloudinary values in `backend/.env` before using image upload features in production.

## Deployment

Recommended deployment approach:

- Frontend: Vercel, Netlify, or any Next.js-compatible host
- Backend: VPS, Render, Railway, DigitalOcean, or Docker-based hosting
- Database: Managed MySQL or self-hosted MySQL
- Media: Cloudinary
- Email: SMTP provider such as Gmail, SendGrid, Mailgun, or another production email service

Before deploying:

- Set production environment variables for both apps
- Set `FRONTEND_URL` to the deployed frontend URL
- Set `NEXT_PUBLIC_API_URL` to the deployed backend API URL
- Use a strong `JWT_SECRET`
- Configure CORS and cookie domain values correctly
- Run Prisma migrations against the production database
- Build both applications successfully

## Author

Mehedi Hassan  
Full Stack Developer
