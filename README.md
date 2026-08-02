# 🏡 RentNest — Modern Property Rental Platform Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-6772E5?style=for-the-badge&logo=stripe&logoColor=white)

**RentNest** is a comprehensive, state-of-the-art frontend application designed to power a modern property rental platform. Built with the **Next.js App Router**, **React 19**, **TypeScript**, and **Tailwind CSS v4**, it offers tailored experiences for different user roles (Admin, Landlord, Tenant) through highly interactive and responsive dashboards.

---

## 🔗 Quick Links & Live Demos

- 🌐 **Live Frontend Application**: [[https://rentnest-app.vercel.app](https://rentnest-teal.vercel.app/)
- 💻 **GitHub Repository**: [https://github.com/asif-shahriar-tauhid/RentNest-Frontend](https://github.com/asif-shahriar-tauhid/RentNest-Frontend)
- 🔌 **Backend API URL**: [https://rentnestb7a4.vercel.app](https://rentnestb7a4.vercel.app)

---

## 🔑 Demo Credentials

Test the platform across different user roles using the following pre-seeded credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| 🛡️ **Admin** | `admin1@rentnest.com` | `Password123!` |
| 🏠 **Landlord** | `landlord1@rentnest.com` | `Password123!` |
| 👤 **Tenant** | `tenant1@rentnest.com` | `password` |

---

## ✨ Features Overview

### 🔐 1. Authentication & Authorization
- **Role-Based Access Control (RBAC)**: Distinct dashboards and permissions for `TENANT`, `LANDLORD`, and `ADMIN`.
- **JWT Authentication**: Client-side cookie management and protected Next.js routes.

### 🏠 2. Property Exploration (Public)
- **Dynamic Property Listings**: Browse available properties with detailed listing cards.
- **Rich Property Details**: View image galleries, property specs (bedrooms, bathrooms, area), amenities, and landlord contact details.
- **Premium UI Experience**: Smooth page transitions, dark mode support, and micro-animations via Framer Motion.

### 👥 3. Admin Dashboard & Operations
- **Platform Overview**: High-level metrics tracking total users, active properties, and total rentals platform-wide.
- **User Management**: View user directories, search by details, and ban/unban users to maintain platform integrity.
- **Global Oversight**: Track and forcefully remove inappropriate property listings or manage platform-wide rentals.

### 🏡 4. Landlord Dashboard
- **Property Management**: Complete CRUD operations via modals to add, edit, or delete property listings easily.
- **Request Handling**: Landlords can review incoming rental applications and approve or reject them based on tenant profiles.
- **Analytics**: Real-time stats on listed properties, pending requests, and active rentals.

### 👤 5. Tenant Dashboard
- **Rental Tracking**: Monitor the lifecycle of submitted rental requests (`PENDING` ➔ `APPROVED` ➔ `ACTIVE`).
- **Payment Processing**: Seamless Stripe integration allowing tenants to securely checkout and pay rent for approved requests.
- **Financial History**: View detailed payment histories and status.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js (v16 App Router)** | Core React Framework & Server/Client routing |
| **React (v19)** | UI Library |
| **TypeScript** | Strongly typed programming language |
| **Tailwind CSS (v4)** | Utility-first CSS framework for rapid styling |
| **shadcn/ui & Radix UI** | Accessible, unstyled UI components |
| **Framer Motion** | Declarative animations and transitions |
| **React Hook Form & Zod** | Form management and schema validation |
| **Sonner** | Toast notifications for structured UI error handling |
| **Recharts** | Composable charting library for dashboard analytics |

---

## 📁 Project Directory Structure

```
b7a5-rentnestfrontend/
├── app/                        # Next.js App Router (Routes & Layouts)
│   ├── (auth)/                 # Login and Registration routes
│   ├── (public)/               # Public-facing pages (Home, Properties)
│   ├── dashboard/              # Protected role-based dashboards
│   │   ├── admin/              # Admin dashboard view
│   │   ├── landlord/           # Landlord dashboard view
│   │   └── tenant/             # Tenant dashboard view
│   ├── payment/                # Payment success & cancel callbacks
│   └── globals.css             # Global Tailwind configuration & variables
├── components/                 # Reusable UI Components
│   ├── property/               # Property cards, Add/Edit modals
│   ├── rental/                 # Request modals, Landlord & Tenant tables
│   ├── shared/                 # Navbars, Sidebars, Stats Cards, Skeletons
│   └── ui/                     # Base UI components (Buttons, Inputs from shadcn)
├── context/                    # Global State Contexts (AuthContext)
├── lib/                        # Utilities & API Handlers
│   ├── api.ts                  # Centralized fetch wrapper & endpoints
│   └── utils.ts                # Formatting & clsx utility helpers
├── types/                      # Global TypeScript definitions (Property, User, etc.)
├── .env.example                # Sample environment variables template
├── next.config.ts              # Next.js specific configuration
├── package.json                # Project dependencies
└── tailwind.config.ts          # Tailwind styling configuration
```

---

## ⚙️ Environment Variables

Create a `.env` or `.env.local` file in the root directory:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL="http://localhost:5000/api"

# Optional: Stripe Publishable Key (if handled directly on frontend)
NEXT_PUBLIC_STRIPE_KEY="pk_test_..."
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher installed.
- **npm** or **yarn**.

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/asif-shahriar-tauhid/RentNest-Frontend.git
   cd b7a5-rentnestfrontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the required environment variables into `.env.local`.

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will launch on `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📜 Available NPM Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Starts the Next.js production server |
| `npm run lint` | Runs ESLint to check for code issues |

---

## 📡 Frontend ↔ Backend API Mapping

This section outlines how the frontend components connect to the RentNest Backend endpoints.

### 🔐 Authentication (`/api/auth`)

| Endpoint | Method | Frontend Component | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | `POST` | `app/(auth)/login/page.tsx` | Authenticates user and retrieves JWT |
| `/api/auth/register` | `POST` | `app/(auth)/register/page.tsx` | Registers a new user account |
| `/api/auth/me` | `GET` / `PATCH`| `context/AuthContext.tsx` | Fetches/updates logged-in user profile |
| `/api/auth/logout` | `POST` | `context/AuthContext.tsx` | Clears user session / cookies |

### 🏠 Properties (`/api/property`)

| Endpoint | Method | Frontend Component | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/property` | `GET` | `app/(public)/properties/page.tsx` | Fetches property lists (supports filters) |
| `/api/property/:id` | `GET` | `app/(public)/properties/[id]/page.tsx` | Fetches single property details |
| `/api/property` | `POST` | `components/property/AddPropertyModal.tsx` | Landlord creates a new listing |
| `/api/property/:id` | `PATCH` | `components/property/EditPropertyModal.tsx` | Landlord updates a listing |
| `/api/property/:id` | `DELETE`| `app/dashboard/landlord/page.tsx` | Landlord/Admin deletes a listing |

### 📑 Rental Requests (`/api/rentals`)

| Endpoint | Method | Frontend Component | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/rentals` | `POST` | `components/rental/RequestModal.tsx` | Tenant submits a rental application |
| `/api/rentals` | `GET` | `app/dashboard/tenant/page.tsx` | Fetches rentals for logged-in user |
| `/api/rentals/:id/status`| `PATCH` | `components/rental/LandlordRequestsTable.tsx`| Landlord approves/rejects a request |

### 💳 Payments (`/api/payments`)

| Endpoint | Method | Frontend Component | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/payments/create` | `POST` | `components/rental/RequestsTable.tsx` | Initiates Stripe checkout session |
| `/api/payments/confirm`| `POST` | `app/payment/success/page.tsx` | Validates session & confirms payment |
| `/api/payments` | `GET` | `app/dashboard/tenant/page.tsx` | Fetches tenant's payment history |

### 👑 Admin Dashboard (`/api/admin`)

| Endpoint | Method | Frontend Component | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/admin/users` | `GET` | `app/dashboard/admin/page.tsx` | Fetches all platform users |
| `/api/admin/users/:id/status`| `PATCH` | `app/dashboard/admin/page.tsx` | Bans or unbans a specific user |
| `/api/admin/properties`| `GET` | `app/dashboard/admin/page.tsx` | Fetches all platform properties |
| `/api/admin/rentals` | `GET` | `app/dashboard/admin/page.tsx` | Fetches all rental requests |

> **Note:** Global API error handling is abstracted within `lib/api.ts`. Any backend errors (400, 401, 500) automatically trigger user-friendly toast notifications via `sonner` across the platform.

---

## 📄 License & Author

- **Author**: Asif Shahriar Tauhid
- **License**: [ISC](LICENSE)
