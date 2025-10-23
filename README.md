# CleanCity - Community Issue Reporting Platform

<div align="center">

![CleanCity Logo](client/public/favicon.png)

**A modern, full-stack web application for reporting and tracking community issues**

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📖 Overview

**CleanCity** is a civic engagement platform designed to empower communities in Zimbabwe (and beyond) to report and track local infrastructure issues like waste management, water leaks, and road problems. The application provides transparency, accountability, and a clear communication channel between citizens and administrators.

Built with modern web technologies and strong architectural principles, CleanCity demonstrates professional software design patterns including:
- **Modular Monolith Architecture** for easy maintenance and future scalability
- **RESTful API Design** following industry best practices
- **Separation of Concerns** with dedicated layers for routes, controllers, models, and config
- **JWT-based Authentication** for stateless, secure user sessions
- **Responsive UI/UX** optimized for both mobile and desktop experiences

---

## 🎯 Problem Statement

Communities often struggle with:
- **Lack of transparency** in how local issues are handled
- **No centralized system** for reporting infrastructure problems
- **Limited communication** between citizens and local authorities
- **Difficulty tracking** the progress of reported issues

**CleanCity solves these problems** by providing a user-friendly platform where anyone can report issues, track their status, and see real community impact.

---

## ✨ Core Features

### For Citizens
- 🔐 **User Registration & Login** - Secure JWT-based authentication
- 📝 **Submit Reports** - Report waste, water, or road issues with photos, descriptions, and location
- 👀 **Browse Reports** - View all community reports with advanced filtering (category, status, search)
- 📊 **Track Progress** - Monitor report status updates (Pending → In Progress → Resolved)

### For Administrators
- 📈 **Admin Dashboard** - Comprehensive overview with real-time statistics
- ✏️ **Update Status** - Change report status to reflect resolution progress
- 🔍 **Advanced Management** - Search and filter reports for efficient processing
- 📉 **Analytics** - View key metrics (total reports, pending, in-progress, resolved)

### Technical Features
- 🌓 **Dark Mode** - Full theme support with persistent user preference
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- 🖼️ **Image Upload** - Local file storage with 5MB size limit
- 🔒 **Input Validation** - Comprehensive validation on both client and server
- ⚡ **Performance Optimized** - Efficient MongoDB queries with indexing
- 🎨 **Modern UI** - Clean, accessible interface using shadcn/ui components

---

## 🏗️ Architecture & Design Decisions

### Technology Stack

#### Backend
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **Node.js + Express** | Server runtime and framework | Fast, scalable, widely supported |
| **MongoDB + Mongoose** | Database and ODM | Flexible schema for rapid iteration, excellent for document-based data |
| **TypeScript** | Type safety | Catch errors early, better IDE support, improved maintainability |
| **JWT** | Authentication | Stateless, scalable, industry standard |
| **Multer** | File uploads | Reliable, well-maintained, simple to configure |
| **Express-Validator** | Input validation | Comprehensive validation with clear error messages |

#### Frontend
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **React** | UI library | Component-based architecture, huge ecosystem |
| **TypeScript** | Type safety | Same benefits as backend TypeScript |
| **TailwindCSS** | Styling | Utility-first, highly customizable, responsive-friendly |
| **shadcn/ui** | Component library | Beautiful, accessible, customizable components |
| **Axios** | HTTP client | Interceptors for auth, better error handling than fetch |
| **React Query** | State management | Automatic caching, background refetching, optimistic updates |
| **Wouter** | Routing | Lightweight alternative to React Router |

### Architectural Patterns

#### 1. Modular Monolith

**Decision**: Organize the backend into clear modules (Auth, Reports, Upload) with dedicated folders for models, controllers, routes, and config.

**Trade-off**:
- ✅ **Pro**: Easy to understand, maintain, and extend. All code in one place for rapid development.
- ⚠️ **Con**: Not as scalable as microservices for massive traffic (acceptable for MVP and medium-scale deployments).

**Rationale**: For a community platform, a modular monolith provides the best balance of simplicity and maintainability. It can easily be split into microservices later if needed.

#### 2. Separation of Concerns

**Decision**: Separate routes (HTTP handling), controllers (business logic), and models (data layer).

**Trade-off**:
- ✅ **Pro**: Testable code, clear responsibilities, easier debugging.
- ⚠️ **Con**: More files and indirection compared to putting everything in routes.

**Rationale**: The small overhead of extra files pays off massively in maintainability and testability. Controllers can be unit tested independently of HTTP concerns.

#### 3. JWT Authentication

**Decision**: Use stateless JWT tokens stored in localStorage.

**Trade-off**:
- ✅ **Pro**: Scalable (no session store needed), works well with API-first architecture.
- ⚠️ **Con**: Can't invalidate tokens server-side (they expire after 7 days).

**Rationale**: For a community platform without financial transactions, the simplicity and scalability of JWT outweigh the inability to revoke tokens. Token expiry provides reasonable security.

#### 4. Local File Storage

**Decision**: Use Multer for local file storage instead of cloud storage (Cloudinary).

**Trade-off**:
- ✅ **Pro**: Simpler setup, no external dependencies, free.
- ⚠️ **Con**: Not horizontally scalable (files stored on one server).

**Rationale**: For MVP and Replit deployment, local storage is adequate. Can easily migrate to S3/Cloudinary in production.

#### 5. In-Memory MongoDB

**Decision**: Use local MongoDB for development (not cloud MongoDB Atlas).

**Trade-off**:
- ✅ **Pro**: Faster iteration, no network latency, free.
- ⚠️ **Con**: Data is lost on restart, not suitable for production.

**Rationale**: Perfect for development and demonstration. Production deployment would use MongoDB Atlas or similar managed database.

---

## 🚀 Getting Started on Replit

### Prerequisites
- Replit account (free)
- Basic understanding of JavaScript/TypeScript

### Installation

1. **Fork/Clone this Repl**
   - Click "Fork" in Replit to create your own copy

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Seed the Database** (Optional but recommended)
   ```bash
   npx tsx server/scripts/seed.ts
   ```
   This creates:
   - Admin user: `admin@cleancity.com` / `password123`
   - Regular user: `john@example.com` / `password123`
   - 6 sample reports with various statuses

4. **Start the Application**
   - Click the "Run" button in Replit, or run:
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Open the URL provided by Replit (usually `https://<your-repl-name>.<your-username>.repl.co`)

### Environment Variables

The application works out-of-the-box with sensible defaults. For production, you would configure:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/cleancity

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-key-here

# Node Environment
NODE_ENV=development

# Server Port
PORT=5000
```

**Note**: In Replit, environment variables are managed through Secrets (use the lock icon in the sidebar).

---

## 📂 Project Structure

```
cleancity/
├── client/                      # Frontend React application
│   ├── public/                  # Static assets
│   │   └── uploads/            # User-uploaded images
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── ReportCard.tsx
│   │   │   └── ...
│   │   ├── contexts/          # React contexts (Auth)
│   │   ├── lib/               # Utilities and API client
│   │   │   ├── api.ts        # Axios API client
│   │   │   └── queryClient.ts
│   │   ├── pages/             # Route components
│   │   │   ├── Home.tsx
│   │   │   ├── Reports.tsx
│   │   │   ├── Submit.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Admin.tsx
│   │   ├── App.tsx            # Main app component
│   │   └── index.css          # Global styles
│   └── index.html
├── server/                      # Backend Express application
│   ├── config/                 # Configuration modules
│   │   ├── database.ts        # MongoDB connection
│   │   └── jwt.ts             # JWT configuration
│   ├── controllers/            # Business logic layer
│   │   ├── authController.ts  # Authentication logic
│   │   └── reportController.ts # Report CRUD logic
│   ├── middleware/             # Express middleware
│   │   ├── auth.ts            # JWT verification
│   │   ├── errorHandler.ts    # Centralized error handling
│   │   └── validation.ts      # Input validation
│   ├── models/                 # Mongoose data models
│   │   ├── User.ts            # User schema & model
│   │   └── Report.ts          # Report schema & model
│   ├── routes/                 # Route definitions
│   │   ├── authRoutes.ts      # /api/auth routes
│   │   ├── reportRoutes.ts    # /api/reports routes
│   │   └── uploadRoutes.ts    # /api/upload route
│   ├── scripts/               # Utility scripts
│   │   └── seed.ts            # Database seeding
│   ├── index.ts               # Server entry point
│   └── routes.ts              # Route registration
├── shared/                     # Shared types/schemas
│   └── schema.ts
├── .env.example                # Example environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md                   # This file
```

### Key Files Explained

#### Backend
- **`server/models/User.ts`** - Defines user schema with password hashing
- **`server/models/Report.ts`** - Defines report schema with validation
- **`server/controllers/authController.ts`** - Handles registration, login, JWT generation
- **`server/controllers/reportController.ts`** - Handles all report CRUD operations
- **`server/middleware/auth.ts`** - Protects routes, verifies JWT tokens
- **`server/middleware/validation.ts`** - Validates request bodies using express-validator
- **`server/routes/authRoutes.ts`** - Defines auth endpoints (POST /register, POST /login, GET /me)
- **`server/routes/reportRoutes.ts`** - Defines report endpoints (GET/POST /reports, PUT /reports/:id, etc.)

#### Frontend
- **`client/src/contexts/AuthContext.tsx`** - Global authentication state
- **`client/src/lib/api.ts`** - Axios API client with auth interceptors
- **`client/src/pages/Home.tsx`** - Landing page with hero and features
- **`client/src/pages/Reports.tsx`** - Browse all reports with filtering
- **`client/src/pages/Submit.tsx`** - Submit new report form
- **`client/src/pages/Admin.tsx`** - Admin dashboard with stats and management

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Reports

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/reports` | Get all reports (with filters) | No | No |
| POST | `/api/reports` | Create new report | Yes | No |
| GET | `/api/reports/:id` | Get single report | No | No |
| PUT | `/api/reports/:id` | Update report status | Yes | Yes |
| DELETE | `/api/reports/:id` | Delete report | Yes | No* |
| GET | `/api/reports/my/reports` | Get user's own reports | Yes | No |
| GET | `/api/reports/admin/stats` | Get statistics | Yes | Yes |

*Users can only delete their own reports; admins can delete any report.

### Upload

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/upload` | Upload image file | Yes |

---

## 🧪 Testing

### Manual Testing Guide

1. **Register a new user**
   - Navigate to `/register`
   - Fill in name, email, password
   - Verify redirect to home with authenticated state

2. **Submit a report**
   - Navigate to `/submit` (must be logged in)
   - Fill in title, description, category, location
   - Upload an image (optional)
   - Submit and verify redirect to `/reports`

3. **Browse reports**
   - Navigate to `/reports`
   - Test search functionality
   - Test category and status filters

4. **Admin functions**
   - Login as admin (`admin@cleancity.com` / `password123`)
   - Navigate to `/admin`
   - Verify statistics display correctly
   - Change a report status
   - Verify status updates

### Test Accounts (After Seeding)

**Admin Account**
- Email: `admin@cleancity.com`
- Password: `password123`

**Regular User Account**
- Email: `john@example.com`
- Password: `password123`

---

## 🎨 Design Philosophy

### User Experience
- **Mobile-First**: Designed primarily for mobile users who report issues on-site
- **Minimal Clicks**: Core actions (submit, browse, login) are always 1-2 clicks away
- **Visual Hierarchy**: Important information (status, category) uses color coding
- **Feedback**: Toast notifications for all user actions
- **Accessibility**: ARIA labels, keyboard navigation, high contrast

### Visual Design
- **Color Scheme**: Trustworthy blue for primary actions, green/amber/red for status
- **Typography**: Inter for clean, professional readability
- **Spacing**: Consistent 8px grid system
- **Components**: shadcn/ui for accessible, customizable components
- **Dark Mode**: Full support with auto-switch capability

---

## 🔒 Security Considerations

### Implemented
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token expiration (7 days)
- ✅ Input validation on both client and server
- ✅ CORS configuration
- ✅ File upload size limits (5MB)
- ✅ File type restrictions (images only)
- ✅ SQL injection protection (MongoDB doesn't use SQL)
- ✅ Role-based access control (user vs admin)

### Production Recommendations
- 🔐 Use HTTPS (SSL/TLS)
- 🔐 Implement rate limiting
- 🔐 Add CSRF protection
- 🔐 Use helmet.js for security headers
- 🔐 Move JWT secret to environment variable
- 🔐 Implement password strength requirements
- 🔐 Add email verification
- 🔐 Implement account lockout after failed login attempts

---

## 📈 Performance Optimizations

### Backend
- **MongoDB Indexing**: Compound indexes on `status + createdAt` and `userId + createdAt`
- **Lean Queries**: Using `.lean()` for read-only operations (faster)
- **Selective Population**: Only populating necessary fields (`name`, `email`)
- **Connection Pooling**: Mongoose manages connection pool automatically

### Frontend
- **Code Splitting**: Automatic with Vite
- **Lazy Loading**: Images load on-demand
- **React Query Caching**: Automatic query caching and background refetching
- **Optimistic Updates**: UI updates before server confirmation
- **Memoization**: Strategic use of `useMemo` and `useCallback`

---

## 🚧 Future Enhancements

### Phase 2 (Next Steps)
- [ ] Interactive map view with geolocation
- [ ] Real-time notifications (WebSockets)
- [ ] Email notifications for status changes
- [ ] User profile management
- [ ] Report history and analytics per user
- [ ] Comment system on reports
- [ ] Upvoting/prioritization system

### Phase 3 (Advanced)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with local government APIs
- [ ] Multi-language support (i18n)
- [ ] Advanced image processing (compression, thumbnails)
- [ ] Report clustering (grouping similar issues)
- [ ] Public API for third-party integrations

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Developer

**Developed by**: Computer Science Student, University of Zimbabwe

**Purpose**: Software Architecture Portfolio Project

**Focus Areas**: 
- Clean code architecture
- RESTful API design
- Modern full-stack development
- Performance optimization
- User-centered design

---

## 🤝 Contributing

While this is primarily a portfolio project, contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact

For questions, feedback, or collaboration opportunities, please reach out through:
- GitHub Issues
- Replit Comments

---

<div align="center">

**Built with ❤️ for cleaner communities in Zimbabwe**

[View Demo](https://your-repl-url.repl.co) • [Report Bug](https://github.com/your-repo/issues) • [Request Feature](https://github.com/your-repo/issues)

</div>
