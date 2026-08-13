<p align="center">
  <h1 align="center">🚆 Rail Booking System</h1>
  <p align="center">
    <strong>Rail Way</strong> — A full-stack train ticket booking platform built with Next.js and Express.js
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Express-5.2.1-000000?logo=express" alt="Express.js" />
    <img src="https://img.shields.io/badge/Prisma-7.3.0-2D3748?logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/MySQL-MariaDB-4479A1?logo=mysql" alt="MySQL" />
    <img src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
  </p>
</p>

---

## 📖 Project Overview

**Rail Way** is a comprehensive train ticket booking system designed to streamline the process of searching, selecting, and purchasing train tickets online. The platform provides a seamless experience for both customers and administrators.

### Problem Solved

Traditional train ticket purchasing can be time-consuming and inefficient. Rail Way digitizes the entire workflow — from browsing schedules and selecting seats to completing purchases — all through a modern, responsive web interface.

### Target Users

| Role | Description |
|------|-------------|
| **Customer** | End-users who search schedules, book tickets, select seats, and manage purchases |
| **Administrator** | Staff who manage trains, carriages, seats, schedules, users, and monitor dashboard analytics |

### System Architecture

The project follows a **decoupled client-server architecture** with a clear separation of concerns:

```
┌─────────────────────┐       REST API        ┌─────────────────────┐
│                     │  ◄──────────────────►  │                     │
│   Frontend (SSR)    │    JSON + JWT Auth     │   Backend (API)     │
│   Next.js 16        │                        │   Express 5         │
│   Port 3000         │                        │   Port 5000         │
│                     │                        │                     │
└─────────────────────┘                        └────────┬────────────┘
                                                        │
                                                        │ Prisma ORM
                                                        ▼
                                               ┌─────────────────────┐
                                               │  MySQL / MariaDB    │
                                               │  Database: ukk      │
                                               └─────────────────────┘
```

---

## ✨ Key Features

### 🧑‍💼 Customer Features

- **User Registration & Login** — Secure account creation with bcrypt password hashing and JWT-based authentication
- **Schedule Search** — Browse available train schedules with departure/destination filtering
- **Station Search** — Discover available departure and destination stations
- **Interactive Seat Selection** — Visual seat map with carriage-by-carriage browsing and real-time seat availability
- **Seat Holding Mechanism** — Temporary seat reservation (hold) during the booking process to prevent double-booking
- **Multi-Seat Booking** — Book up to 10 seats per transaction with per-passenger details
- **Dynamic Pricing** — Prices calculated based on carriage category (Executive, Business, Economy) with multipliers
- **Purchase History** — View all past ticket purchases with detailed information
- **Purchase Details** — View individual purchase breakdowns including seat and carriage information
- **Profile Management** — Update personal details and upload profile pictures
- **About Us Page** — Informational landing page with partner highlights and popular destinations

### 🛡️ Administrator Features

- **Admin Dashboard** — Aggregated statistics overview (total users, bookings, revenue, active schedules, recent purchases)
- **User Management** — Full CRUD operations for managing users (create, read, update, delete) with profile picture uploads
- **Train Management** — Create, update, and delete trains with image uploads and status tracking
- **Carriage Management** — Manage carriages per train with category assignment (Executive, Business, Economy) and quota configuration
- **Seat Management** — Configure individual seats within carriages
- **Schedule Management** — Create and manage train schedules with departure/arrival dates, pricing, and status control
- **Purchase Management** — View all ticket purchases and delete transactions when necessary
- **Resource Locking** — Automatic protection preventing deletion of trains, carriages, and seats tied to active schedules

### ⚙️ System Features

- **JWT Authentication** — Stateless token-based auth with 24-hour expiration
- **Role-Based Access Control** — Server-side middleware enforcing ADMIN/CUSTOMER permissions
- **Server-Side Route Protection** — Next.js middleware validates tokens before rendering protected pages
- **Automatic Schedule Expiration** — Cron job marks schedules as `FINISHED` when arrival time has passed
- **Automatic Seat Hold Release** — Cron job releases expired seat holds every 30 seconds
- **Train Status Sync** — Trains automatically switch between `AVAILABLE` and `ACTIVE` based on active schedules
- **File Upload Support** — Profile pictures and train images with disk storage via Multer
- **Dark/Light Theme Toggle** — Client-side theme switching via `next-themes`
- **Toast Notifications** — User feedback via `react-toastify`
- **Framer Motion Animations** — Smooth page transitions and micro-animations
- **WIB Timezone Support** — Server time normalized to UTC+7 (Western Indonesia Time)

---

## 🛠️ Technology Stack

### Backend

| Category | Technology | Version |
|----------|-----------|---------|
| **Runtime** | Node.js | — |
| **Language** | TypeScript | ^5.9.3 |
| **Framework** | Express.js | ^5.2.1 |
| **ORM** | Prisma Client | ^7.3.0 |
| **Database Adapter** | @prisma/adapter-mariadb | ^7.3.0 |
| **Database** | MySQL / MariaDB | — |
| **Authentication** | JSON Web Token (jsonwebtoken) | ^9.0.3 |
| **Password Hashing** | bcrypt | ^6.0.0 |
| **File Upload** | Multer | ^2.0.2 |
| **Task Scheduling** | node-cron | ^4.2.1 |
| **Environment Config** | dotenv | ^17.2.3 |
| **UUID Generation** | uuid | ^13.0.0 |
| **CORS** | cors | ^2.8.6 |
| **Dev Server** | nodemon + tsx | ^3.1.11 / ^4.21.0 |
| **Module System** | ES Modules (ESM) | — |

### Frontend

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.1.1 |
| **Language** | TypeScript | ^5 |
| **UI Library** | React | 19.2.3 |
| **CSS Framework** | Tailwind CSS | ^4 |
| **PostCSS** | @tailwindcss/postcss | ^4 |
| **HTTP Client** | Axios | ^1.13.2 |
| **Animations** | Framer Motion | ^12.33.0 |
| **Icons** | react-icons, lucide-react, @iconify/react | Various |
| **Theme Management** | next-themes | ^0.4.6 |
| **Toast Notifications** | react-toastify | ^11.0.5 |
| **Cookie Management** | nookies | ^2.5.2 |
| **UI Components** | react-bits | ^1.0.5 |
| **Typography** | Poppins (Google Fonts) | — |
| **Linting** | ESLint + eslint-config-next | ^9 |
| **Package Manager** | npm | — |

---

## 📁 Project Structure

```
FINAL UKK/
├── Backend/                    # Express.js REST API server
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (10 models, 5 enums)
│   │   └── migrations/         # Prisma migration files
│   ├── src/
│   │   ├── index.ts            # Server entry point (port 5000)
│   │   ├── global.ts           # Environment config exports
│   │   ├── controllers/        # Request handlers (8 controllers)
│   │   │   ├── authController.ts
│   │   │   ├── userController.ts
│   │   │   ├── trainController.ts
│   │   │   ├── carriageController.ts
│   │   │   ├── seatController.ts
│   │   │   ├── scheduleController.ts
│   │   │   ├── purchaseController.ts
│   │   │   └── dashboardController.ts
│   │   ├── routes/             # API route definitions (8 routers)
│   │   ├── middleware/         # Auth, role guard, file upload
│   │   ├── services/           # Background jobs (schedule auto-expire)
│   │   └── types/              # TypeScript type extensions
│   ├── public/                 # Static file storage
│   │   ├── profilePicture/     # User profile images
│   │   └── train_picture/      # Train images
│   ├── generated/              # Prisma generated client
│   ├── package.json
│   └── tsconfig.json
│
├── Frontend/                   # Next.js 16 client application
│   ├── app/                    # App Router pages
│   │   ├── layout.tsx          # Root layout (Poppins font, ToastProvider)
│   │   ├── page.tsx            # Landing page
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── access-denied/      # Unauthorized access page
│   │   ├── types.ts            # Shared TypeScript interfaces
│   │   ├── types/              # Additional type definitions
│   │   ├── admin/              # Admin panel pages
│   │   │   ├── dashboard/      # Analytics dashboard
│   │   │   ├── user/           # User CRUD (add, edit, delete)
│   │   │   ├── train/          # Train CRUD (add, edit, delete)
│   │   │   ├── carriage/       # Carriage CRUD (add, edit, delete)
│   │   │   ├── seat/           # Seat CRUD (add, edit, delete)
│   │   │   ├── schedule/       # Schedule CRUD (add, edit, delete)
│   │   │   └── purchase/       # Purchase management (view, delete)
│   │   └── customer/           # Customer-facing pages
│   │       ├── dashboard/      # Customer landing page
│   │       ├── schedule/       # Schedule browsing
│   │       ├── booking/        # Ticket booking flow
│   │       ├── purchases/      # Purchase history
│   │       └── aboutus/        # About us page
│   ├── components/             # Reusable UI components
│   │   ├── BookingSummary/     # Booking confirmation summary
│   │   ├── CarriageSelector/   # Carriage selection UI
│   │   ├── SeatMap/            # Interactive seat map
│   │   ├── SearchBar/          # Schedule search component
│   │   ├── FileInput/          # File upload component
│   │   ├── adminTemplates/     # Admin layout templates
│   │   ├── customerTemplates/  # Customer layout templates
│   │   ├── modal/              # Modal dialogs
│   │   ├── alert/              # Alert components
│   │   ├── animation/          # Animation wrappers
│   │   ├── button/             # Button variants
│   │   ├── inputComponent/     # Form input components
│   │   ├── select/             # Select dropdowns
│   │   ├── header.tsx          # Admin header with breadcrumbs
│   │   ├── sidebar.tsx         # Admin sidebar navigation
│   │   ├── dashboard-card.tsx  # Dashboard statistics card
│   │   ├── theme-provider.tsx  # Theme toggle component
│   │   ├── theme-toggle.tsx    # Theme switch button
│   │   └── toast-provider.tsx  # Toast notification provider
│   ├── contexts/               # React Context providers
│   │   └── BookingContext.tsx   # Booking state management (useReducer)
│   ├── lib/                    # Utility libraries
│   │   ├── api-bridge.ts       # Axios HTTP client wrapper
│   │   ├── client-cookies.ts   # Client-side cookie helpers (nookies)
│   │   ├── server-cookies.ts   # Server-side cookie helpers
│   │   ├── menu.ts             # Navigation menu config
│   │   └── types.ts            # Legacy type definitions
│   ├── middleware.ts           # Next.js route protection middleware
│   ├── global.ts               # API base URL configuration
│   ├── next.config.ts          # Next.js configuration
│   ├── postcss.config.mjs      # PostCSS + Tailwind config
│   ├── eslint.config.mjs       # ESLint configuration
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                   # This file
```

---

## 🚀 Installation Guide

### Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MySQL** or **MariaDB** server running locally
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/rail-booking-system.git
cd rail-booking-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
DATABASE_URL="mysql://root:@localhost:3306/ukk"
SECRET="your-jwt-secret-key"
PORT=5000
```

> **Note:** Replace the database credentials and JWT secret with your own values for production use.

### 4. Database Setup

Create the MySQL/MariaDB database:

```sql
CREATE DATABASE ukk;
```

Run Prisma migrations to create the schema:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy
```

### 5. Create Required Directories

Ensure the static file directories exist:

```bash
mkdir -p public/profilePicture
mkdir -p public/train_picture
```

### 6. Start the Backend Server

```bash
npm run dev
```

The backend will start on `http://localhost:5000`.

### 7. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install
```

### 8. Start the Frontend Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`.

---

## 📋 Usage Guide

### Registration & Login

1. Navigate to `http://localhost:3000/register`
2. Fill in username, email, password, and optional profile details
3. Upon successful registration, you receive a JWT token and are redirected to the customer dashboard
4. To log in subsequently, go to `http://localhost:3000/login` and enter your credentials

### Customer Workflow

#### Browse Train Schedules
1. Navigate to **Schedule** from the customer menu
2. Browse available train schedules with departure/destination, dates, and pricing
3. Use the search functionality to filter schedules by station

#### Book Tickets
1. Navigate to **Book Ticket**
2. Select a schedule from the available list
3. Choose a carriage (Executive, Business, or Economy) — each has different pricing
4. Select your preferred seats from the interactive seat map (up to 10 seats)
5. Seats are temporarily held for you during the booking process
6. Fill in passenger details for each seat
7. Confirm and complete the purchase

#### View Purchase History
1. Navigate to **My Purchases**
2. View all your past ticket purchases
3. Click on a purchase to see detailed breakdown (seats, carriages, pricing)

### Administrator Workflow

#### Dashboard
- Access the admin dashboard at `/admin/dashboard`
- View real-time statistics: total users, bookings, revenue, and active schedules
- Monitor the 5 most recent purchases

#### Manage Resources
- **Users** → `/admin/user` — Create, edit, and delete user accounts
- **Trains** → `/admin/train` — Add trains with images, update details, delete inactive trains
- **Carriages** → `/admin/carriage` — Configure carriages per train with category and quota
- **Seats** → `/admin/seat` — Add and manage individual seats within carriages
- **Schedules** → `/admin/schedule` — Create schedules with departure/arrival times, set prices, manage status
- **Purchases** → `/admin/purchase` — View all customer purchases, delete transactions

> ⚠️ **Resource Locking:** Trains, carriages, and seats linked to active schedules are protected from deletion. The system automatically enforces this constraint.

---

## 🔐 Environment Variables

### Backend (`Backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL/MariaDB connection string used by Prisma | `mysql://root:@localhost:3306/ukk` |
| `SECRET` | JWT signing secret key for token generation and verification | `your-secret-key` |
| `PORT` | Server port number (referenced in `global.ts`) | `5000` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BASE_API_URL` | Backend API base URL (set in `global.ts`) | `http://localhost:5000` |

---

## 📡 API Documentation

All API endpoints are prefixed with `http://localhost:5000`. Authentication is via `Bearer <token>` in the `Authorization` header.

### 🔓 Authentication (`/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Login and receive JWT token | No |
| `GET` | `/auth/verify` | Verify JWT token validity | Yes |

### 👤 Users (`/user`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `GET` | `/user` | Get all users | ADMIN |
| `GET` | `/user/:id` | Get user by ID | ADMIN, CUSTOMER |
| `POST` | `/user` | Create new user | ADMIN |
| `PUT` | `/user/:id` | Update user | ADMIN, CUSTOMER |
| `PUT` | `/user/picture/:id` | Upload profile picture | ADMIN, CUSTOMER |
| `DELETE` | `/user/:id` | Delete user | ADMIN |

### 🚂 Trains (`/train`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `GET` | `/train` | Get all trains | ADMIN, CUSTOMER |
| `GET` | `/train/:id` | Get train by ID | ADMIN, CUSTOMER |
| `POST` | `/train` | Create new train | ADMIN |
| `PUT` | `/train/:id` | Update train | ADMIN |
| `PUT` | `/train/picture/:id` | Upload train picture | ADMIN |
| `DELETE` | `/train/:id` | Delete train | ADMIN |

### 🚃 Carriages (`/carriage`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `GET` | `/carriage` | Get all carriages | ADMIN |
| `GET` | `/carriage/:id` | Get carriage by ID | ADMIN |
| `POST` | `/carriage` | Create new carriage | ADMIN |
| `PUT` | `/carriage/:id` | Update carriage | ADMIN |
| `DELETE` | `/carriage/:id` | Delete carriage | ADMIN |

### 💺 Seats (`/seat`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `GET` | `/seat` | Get all seats | ADMIN |
| `GET` | `/seat/:id` | Get seat by ID | ADMIN |
| `POST` | `/seat` | Create new seat | ADMIN |
| `PUT` | `/seat/:id` | Update seat | ADMIN |
| `DELETE` | `/seat/:id` | Delete seat | ADMIN |

### 📅 Schedules (`/schedule`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `GET` | `/schedule` | Get all schedules | ADMIN, CUSTOMER |
| `GET` | `/schedule/:id` | Get schedule by ID | ADMIN, CUSTOMER |
| `GET` | `/schedule/customer` | Get customer-facing schedules | ADMIN, CUSTOMER |
| `GET` | `/schedule/stations` | Get available stations | ADMIN, CUSTOMER |
| `GET` | `/schedule/search` | Search schedules by criteria | ADMIN, CUSTOMER |
| `GET` | `/schedule/seatmapping/:id` | Get seat map for a schedule | ADMIN, CUSTOMER |
| `GET` | `/schedule/server-time` | Get server time (WIB) | Public |
| `POST` | `/schedule` | Create new schedule | ADMIN |
| `PUT` | `/schedule/:id` | Update schedule | ADMIN |
| `DELETE` | `/schedule/:id` | Delete schedule | ADMIN |

### 🎫 Purchases (`/purchase`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `GET` | `/purchase` | Get all purchases | ADMIN |
| `GET` | `/purchase/my` | Get current user's purchases | ADMIN, CUSTOMER |
| `GET` | `/purchase/:id` | Get purchase by ID | ADMIN, CUSTOMER |
| `POST` | `/purchase` | Create a ticket purchase | ADMIN, CUSTOMER |
| `POST` | `/purchase/hold` | Hold seats temporarily | ADMIN, CUSTOMER |
| `DELETE` | `/purchase/hold` | Release held seats | ADMIN, CUSTOMER |
| `DELETE` | `/purchase/:id` | Delete purchase | ADMIN |

### 📊 Dashboard (`/dashboard`)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `GET` | `/dashboard/summary` | Get aggregated dashboard statistics | ADMIN |

### Static Files

| Path | Description |
|------|-------------|
| `/profilePicture/*` | User profile images |
| `/train_picture/*` | Train images |

---

## 📜 Scripts

### Backend (`Backend/package.json`)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `nodemon --exec tsx src/index.ts` | Start the development server with hot-reload |
| `test` | `echo "Error: no test specified"` | Placeholder test script |

### Frontend (`Frontend/package.json`)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Start the Next.js development server |
| `build` | `next build` | Build the production bundle |
| `start` | `next start` | Start the production server |
| `lint` | `eslint` | Run ESLint across the project |

---

## 🤝 Contributing

Contributions are welcome! Follow these steps to get started:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with clear, descriptive messages
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. **Push** to your branch
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open** a Pull Request with a detailed description of your changes

### Guidelines

- Follow the existing code style and patterns
- Write descriptive commit messages using [Conventional Commits](https://www.conventionalcommits.org/)
- Update documentation for any new features
- Test your changes thoroughly before submitting

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Zidane Rosyidi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📬 Contact

**Zidane Rosyidi**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/zidane-rosyidi-6b438333b/)
[![Email](https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white)](mailto:zidanerosyidi@gmail.com)

- **LinkedIn:** [linkedin.com/in/zidane-rosyidi-6b438333b](https://www.linkedin.com/in/zidane-rosyidi-6b438333b/)
- **Email:** [zidanerosyidi@gmail.com](mailto:zidanerosyidi@gmail.com)

---

<p align="center">
  Made with ❤️ using Next Js & Tailwind CSS
</p>
