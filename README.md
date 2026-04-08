# ReactCampus

A full-stack college discovery and comparison platform built with React, Node.js, Express, and MongoDB. Features rich, dynamic college detail pages inspired by CampusOption — with admin-managed content blocks, dynamic tabs, placement stats, cutoff tables, and more.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query
- **Backend**: Node.js, Express, Mongoose, JWT Authentication
- **Database**: MongoDB

## Features

- **Public College Pages** — CampusOption-style detail pages with hero section, info grid (accreditation, affiliation, ranking, fees), facilities tags, and dynamic tab bar
- **Dynamic Content Tabs** — Overview, Placements, Admission, Cutoff, Courses, Reviews — all auto-generated from admin-managed content sections
- **Rich Content Types** — Richtext (HTML), tables with striped rows, FAQ accordions, bullet lists, image galleries
- **Admin Panel** — Full CRUD for colleges, courses, exams, content sections, reviews, leads, SEO, and pages
- **Content Section Management** — Tab-grouped UI with collapsible panels, predefined tab options, support for multiple blocks per tab ordered by priority
- **College Management** — Create/edit colleges with accreditation, affiliation, facilities, fees, rankings, and location data
- **Course & Exam Management** — Associate courses and exams with colleges
- **Review System** — Public review submission with star ratings, admin moderation (approve/reject)
- **Lead Management** — Customizable forms for lead capture with status tracking and priority levels
- **SEO Management** — Per-entity meta tags for colleges, courses, exams, and pages
- **Role-Based Access Control** — Permissions and roles system with granular access control
- **Responsive Design** — Mobile-first layout with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/avinrique/reactcampus.git
cd reactcampus
npm install
cd client && npm install && cd ..
```

### Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/reactcampus
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
PORT=5050
ADMIN_EMAIL=admin@reactcampus.com
ADMIN_PASSWORD=Admin@123456
```

### Seed Database

```bash
npm run seed
```

This seeds permissions, roles, admin user, 50 colleges (with accreditation, affiliation, facilities), 37 rich content sections across 7 colleges, and static pages.

### Run Development Servers

```bash
# Backend (port 5050)
npm run dev

# Frontend (port 3000)
cd client && npm run dev
```

### Build for Production

```bash
cd client && npm run build
```

## Project Structure

```
reactcampus/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/ui/      # Reusable UI components
│   │   ├── config/             # Constants, query keys
│   │   ├── features/           # Feature modules
│   │   │   ├── colleges/       # Admin college management
│   │   │   ├── content-sections/ # Admin content sections (tab-grouped)
│   │   │   ├── public-colleges/  # Public college pages
│   │   │   ├── public-courses/   # Public course pages
│   │   │   └── ...
│   │   ├── router/             # Route definitions
│   │   └── types/              # TypeScript interfaces
│   └── ...
├── server/                     # Express backend
│   ├── src/
│   │   ├── config/             # DB, logger, env config
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/          # Auth, validation, error handling
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # API routes
│   │   ├── seeds/              # Database seeders
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Constants, helpers
│   │   └── validations/        # Joi schemas
│   └── ...
├── .env                        # Environment variables (not committed)
├── .gitignore
└── package.json
```

## API Overview

| Endpoint | Description |
|---|---|
| `GET /api/public/colleges` | List published colleges |
| `GET /api/public/colleges/:slug` | College detail by slug |
| `GET /api/public/colleges/:slug/sections` | Content sections for a college |
| `GET /api/public/colleges/:slug/reviews` | Approved reviews for a college |
| `POST /api/public/reviews` | Submit a public review |
| `GET/POST/PUT/DELETE /api/colleges` | Admin college CRUD |
| `GET/POST/PUT/DELETE /api/content-sections` | Admin content section CRUD |
| `GET/POST/PUT/DELETE /api/courses` | Admin course CRUD |
| `GET/POST/PUT/DELETE /api/exams` | Admin exam CRUD |

## License

MIT
