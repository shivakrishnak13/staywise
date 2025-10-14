# 🏨 StayWise

StayWise is a full-stack hotel booking platform built using **Next.js 14**, **TypeScript**, **Tailwind CSS v4**, **React Query**, and **JWT Authentication**.  
It allows users to explore properties, view details, make bookings, and manage their stays effortlessly.

---

## 🌐 Live Demo
👉 [https://staywise-delta.vercel.app/](https://staywise-delta.vercel.app/)

---

## 🚀 Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS v4
- React Query
- JWT Authentication (stored in `localStorage`)

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT for Authentication
- RESTful API Design

---

## 🔧 API Endpoints

### Auth APIs
| Method | Endpoint | Description |
|:-------|:----------|:-------------|
| **POST** | `/api/signup` | Registers a new user → body: `{ name, email, password }` → returns `{ message, token }` |
| **POST** | `/api/login` | Logs in a user → body: `{ email, password }` → returns `{ message, token }` |

### Property APIs
| Method | Endpoint | Description |
|:-------|:----------|:-------------|
| **GET** | `/api/properties` | Fetch all available properties |

### Booking APIs
| Method | Endpoint | Description |
|:-------|:----------|:-------------|
| **GET** | `/api/bookings` | Fetch user’s bookings *(requires auth)* |
| **POST** | `/api/bookings` | Create a booking *(requires auth)* → body: `{ propertyId, startDate, endDate }` |
| **DELETE** | `/api/bookings/:bookingId` | Cancel a booking *(requires auth)* |

---

## 🎨 Color Palette

| Name | Hex |
|------|-----|
| Primary | `#2563eb` |
| Secondary | `#f59e0b` |
| Background | `#f9fafb` |
| Text Primary | `#111827` |
| Text Secondary | `#6b7280` |
| Card Background | `#ffffff` |
| Error | `#dc2626` |

---

## 📑 Pages Implemented

| Page | Path | Description |
|------|------|-------------|
| **Home** | `/` | Hero section with carousel and CTA |
| **Login** | `/login` | Email & password authentication |
| **Signup** | `/signup` | User registration |
| **Properties** | `/properties` | Property listing cards |
| **Property Details** | `/properties/[id]` | Detailed view with booking option |
| **My Bookings** | `/bookings` | View and cancel user bookings |

---

## 🧠 Features
- User authentication with JWT (stored in localStorage)
- Protected routes for bookings
- API communication handled via React Query
- Responsive UI with Tailwind CSS v4 utilities
- Reusable components: Navbar, Footer, Buttons, Inputs, Cards
- Fully deployed frontend on **Vercel**

---

## 🖥️ Local Development

### Backend

cd backend
npm install
npm run dev

## Frontend
cd frontend
npm install
npm run dev
