# Software Development Documentation
## Campus Companion - AI-Powered Campus Management Platform

**Version:** 1.0  
**Date:** November 3, 2025  
**Prepared by:** Sakshya Sinha  

---

## Table of Contents

1. [Development Overview](#1-development-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Development Environment Setup](#4-development-environment-setup)
5. [Code Structure](#5-code-structure)
6. [API Documentation](#6-api-documentation)
7. [Database Schema](#7-database-schema)
8. [Development Workflow](#8-development-workflow)
9. [Deployment](#9-deployment)

---

## 1. Development Overview

### 1.1 Project Information

- **Project Name**: Campus Companion
- **Version**: 1.0.0
- **Development Model**: Agile / Iterative
- **Repository**: Git-based version control
- **License**: MIT

### 1.2 Development Team Roles

- **Full-Stack Developer**: Sakshya Sinha
- **UI/UX Designer**: Integrated within development
- **Project Manager**: Integrated within development
- **QA/Tester**: Integrated within development

### 1.3 Development Timeline

| Phase | Duration | Description |
|-------|----------|-------------|
| Planning & Design | Week 1-2 | Requirements, wireframes, architecture |
| Backend Development | Week 3-5 | API, database, authentication |
| Frontend Development | Week 6-8 | UI components, pages, integration |
| AI Integration | Week 9-10 | OpenAI features, resume analyzer |
| Testing & QA | Week 11-12 | Unit, integration, user testing |
| Deployment | Week 13 | Production deployment, documentation |

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT TIER                           │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         React Application (Vite)                 │  │
│  │  - Components (Reusable UI)                      │  │
│  │  - Pages (Route components)                      │  │
│  │  - Services (API calls)                          │  │
│  │  - State Management (Context API)                │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ HTTPS/REST API
                     │
┌────────────────────▼─────────────────────────────────────┐
│                  APPLICATION TIER                         │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Node.js/Express Server                   │  │
│  │  - Routes (API endpoints)                        │  │
│  │  - Controllers (Business logic)                  │  │
│  │  - Middleware (Auth, validation, error handling) │  │
│  │  - Utils (Helper functions, AI services)         │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└────────────┬──────────────────────┬──────────────────────┘
             │                      │
             │                      │
┌────────────▼─────────┐  ┌────────▼──────────────┐
│    DATA TIER         │  │   EXTERNAL SERVICES   │
│                      │  │                       │
│  ┌────────────────┐ │  │  ┌─────────────────┐ │
│  │   MongoDB      │ │  │  │  OpenAI API     │ │
│  │   Database     │ │  │  │  (AI Features)  │ │
│  │                │ │  │  └─────────────────┘ │
│  │  Collections:  │ │  │                       │
│  │  - Users       │ │  │  ┌─────────────────┐ │
│  │  - Events      │ │  │  │  Cloudinary     │ │
│  │  - Items       │ │  │  │  (File Storage) │ │
│  │  - Posts       │ │  │  └─────────────────┘ │
│  │  - Jobs        │ │  │                       │
│  │  - Resumes     │ │  │  ┌─────────────────┐ │
│  └────────────────┘ │  │  │  Email Service  │ │
│                      │  │  │  (Nodemailer)   │ │
└──────────────────────┘  │  └─────────────────┘ │
                          │                       │
                          └───────────────────────┘
```

### 2.2 Architecture Pattern

**Pattern**: MVC (Model-View-Controller) with REST API

- **Model**: MongoDB schemas (Mongoose models)
- **View**: React components (client-side rendering)
- **Controller**: Express route controllers

### 2.3 Communication Flow

1. **Client Request**: React app sends HTTP request
2. **API Gateway**: Express server receives request
3. **Authentication**: JWT middleware validates token
4. **Controller**: Processes business logic
5. **Database**: Queries/updates MongoDB
6. **External APIs**: Calls OpenAI/Cloudinary if needed
7. **Response**: JSON data sent back to client
8. **Rendering**: React updates UI

---

## 3. Technology Stack

### 3.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| Vite | 4.x | Build tool & dev server |
| React Router | 6.x | Client-side routing |
| Axios | 1.x | HTTP client |
| Tailwind CSS | 3.x | Styling framework |
| Lucide React | Latest | Icons library |

### 3.2 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.x | Web framework |
| Mongoose | 7.x | MongoDB ODM |
| JSON Web Token | 9.x | Authentication |
| Bcrypt | 5.x | Password hashing |
| Multer | 1.x | File upload handling |

### 3.3 Database & Storage

| Technology | Purpose |
|------------|---------|
| MongoDB | NoSQL database |
| Cloudinary | Cloud file storage |

### 3.4 Security & Middleware

| Package | Purpose |
|---------|---------|
| Helmet.js | Security headers |
| CORS | Cross-origin resource sharing |
| Express Rate Limit | API rate limiting |
| Express Mongo Sanitize | NoSQL injection prevention |
| XSS | Cross-site scripting protection |
| HPP | HTTP parameter pollution prevention |

### 3.5 External APIs

| API | Purpose |
|-----|---------|
| OpenAI GPT-4 | Resume analysis, AI matching |
| Cloudinary | Image/file upload & storage |
| Nodemailer | Email notifications |

---

## 4. Development Environment Setup

### 4.1 Prerequisites

```bash
# Required installations
Node.js >= 18.0.0
npm >= 8.0.0
MongoDB >= 4.4
Git
```

### 4.2 Installation Steps

**Step 1: Clone Repository**
```bash
git clone <repository-url>
cd campus_companion
```

**Step 2: Install Dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

**Step 3: Environment Configuration**

Create `server/.env`:
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/campus_companion

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=24h

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OpenAI
OPENAI_API_KEY=sk-your_openai_api_key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

**Step 4: Start Development Servers**

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start backend server (from root)
cd server
npm run dev

# Terminal 3: Start frontend (from root)
cd client
npm run dev
```

**Step 5: Access Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## 5. Code Structure

### 5.1 Project Directory Structure

```
campus_companion/
│
├── client/                      # Frontend React application
│   ├── public/                  # Static files
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── common/          # Common UI components
│   │   │   ├── EventCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── LostFound.jsx
│   │   │   ├── Community.jsx
│   │   │   ├── PlacementNews.jsx
│   │   │   └── ResumeAnalyzer.jsx
│   │   │
│   │   ├── services/            # API service layer
│   │   │   ├── api.js           # Axios instance
│   │   │   ├── authService.js
│   │   │   ├── eventService.js
│   │   │   └── ...
│   │   │
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── App.css              # Global styles
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Backend Node.js application
│   ├── controllers/             # Request handlers
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── lostFoundController.js
│   │   ├── communityController.js
│   │   ├── placementController.js
│   │   └── resumeController.js
│   │
│   ├── models/                  # Mongoose models
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── LostItem.js
│   │   ├── CommunityPost.js
│   │   ├── PlacementNews.js
│   │   └── Resume.js
│   │
│   ├── routes/                  # API routes
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── lostFound.js
│   │   ├── community.js
│   │   ├── placement.js
│   │   └── resume.js
│   │
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js              # JWT authentication
│   │   ├── upload.js            # File upload (Multer)
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   │
│   ├── utils/                   # Utility functions
│   │   ├── aiService.js         # OpenAI integration
│   │   ├── sentiment.js         # Sentiment analysis
│   │   └── scraper.js           # Web scraping
│   │
│   ├── app.js                   # Express app setup
│   ├── package.json
│   └── .env
│
├── docs/                        # Documentation
│   ├── SRS.md
│   ├── DFD.md
│   ├── UI_DOCUMENTATION.md
│   ├── DEVELOPMENT.md
│   └── TESTING.md
│
├── package.json                 # Root package.json
├── README.md
└── .gitignore
```

### 5.2 Code Organization Principles

**1. Separation of Concerns**
- Routes: Define endpoints only
- Controllers: Business logic
- Models: Data structure and validation
- Middleware: Reusable functions

**2. Modularity**
- Each feature in separate files
- Reusable components
- Service layer for API calls

**3. DRY (Don't Repeat Yourself)**
- Utility functions for common tasks
- Reusable React components
- Shared middleware

**4. Clear Naming Conventions**
- camelCase for variables and functions
- PascalCase for components and classes
- UPPER_SNAKE_CASE for constants
- Descriptive names

---

## 6. API Documentation

### 6.1 Base URL

```
Development: http://localhost:5000/api
Production: https://campus-companion-api.vercel.app/api
```

### 6.2 Authentication

All protected routes require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

### 6.3 API Endpoints

#### Authentication Endpoints

**POST `/api/auth/register`**
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "rollNumber": "12345678",
  "department": "Computer Science",
  "year": 3
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**POST `/api/auth/login`**
```json
Request:
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### Event Endpoints

**GET `/api/events`** - Get all events
```json
Query Parameters:
?category=technical
&search=tech fest
&page=1
&limit=10

Response: 200 OK
{
  "success": true,
  "count": 25,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  },
  "data": [
    {
      "_id": "...",
      "title": "Tech Fest 2025",
      "description": "...",
      "date": "2025-11-15T00:00:00.000Z",
      "location": "Main Auditorium",
      "capacity": 100,
      "registered": ["userId1", "userId2"],
      "image": "https://res.cloudinary.com/..."
    }
  ]
}
```

**POST `/api/events`** - Create event (Auth required)
```json
Request:
{
  "title": "Tech Fest 2025",
  "description": "Annual technology festival",
  "date": "2025-11-15",
  "time": "10:00 AM",
  "location": "Main Auditorium",
  "category": "technical",
  "capacity": 100,
  "image": "base64_or_url"
}

Response: 201 Created
{
  "success": true,
  "data": { ... }
}
```

**POST `/api/events/:id/register`** - Register for event
```json
Response: 200 OK
{
  "success": true,
  "message": "Successfully registered for event"
}
```

#### Lost & Found Endpoints

**GET `/api/lost-found`** - Get all items
```json
Query Parameters:
?type=lost
&category=electronics
&search=laptop

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "type": "lost",
      "itemName": "Dell Laptop",
      "description": "Black Dell Inspiron laptop",
      "category": "electronics",
      "location": "Library",
      "image": "https://...",
      "reportedBy": { ... },
      "status": "open"
    }
  ]
}
```

**POST `/api/lost-found`** - Report item
```json
Request:
{
  "type": "lost",
  "itemName": "Dell Laptop",
  "description": "Black Dell Inspiron",
  "category": "electronics",
  "location": "Library",
  "date": "2025-11-01",
  "image": "..."
}

Response: 201 Created
{
  "success": true,
  "data": { ... },
  "matches": [
    {
      "item": { ... },
      "similarity": 0.87
    }
  ]
}
```

#### Community Endpoints

**GET `/api/community/posts`** - Get posts
**POST `/api/community/posts`** - Create post
**POST `/api/community/posts/:id/comment`** - Add comment
**PUT `/api/community/posts/:id/like`** - Like post

#### Placement Endpoints

**GET `/api/placement/jobs`** - Get job listings
**POST `/api/placement/jobs`** - Post job (Faculty/Admin)

#### Resume Analyzer Endpoints

**POST `/api/resume/analyze`** - Analyze resume
```json
Request: multipart/form-data
- file: resume.pdf

Response: 200 OK
{
  "success": true,
  "data": {
    "score": 78,
    "strengths": [
      "Clear formatting",
      "Quantified achievements"
    ],
    "improvements": [
      "Add technical certifications",
      "Include more action verbs"
    ],
    "skillGaps": [
      "Docker",
      "Kubernetes"
    ],
    "recommendations": [...]
  }
}
```

### 6.4 Error Responses

```json
400 Bad Request:
{
  "success": false,
  "error": "Validation error message"
}

401 Unauthorized:
{
  "success": false,
  "error": "Not authorized to access this route"
}

404 Not Found:
{
  "success": false,
  "error": "Resource not found"
}

500 Server Error:
{
  "success": false,
  "error": "Server error"
}
```

---

## 7. Database Schema

### 7.1 User Schema

```javascript
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    default: 'student'
  },
  profilePicture: String,
  bio: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

### 7.2 Event Schema

```javascript
const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: String,
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['technical', 'cultural', 'sports', 'academic', 'other'],
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  registered: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

### 7.3 Indexes

```javascript
// User indexes
UserSchema.index({ email: 1 });
UserSchema.index({ rollNumber: 1 });

// Event indexes
EventSchema.index({ date: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ title: 'text', description: 'text' });

// Lost Item indexes
LostItemSchema.index({ type: 1, status: 1 });
LostItemSchema.index({ category: 1 });
```

---

## 8. Development Workflow

### 8.1 Git Workflow

```bash
# Feature development
git checkout -b feature/event-management
# ... make changes ...
git add .
git commit -m "feat: add event registration functionality"
git push origin feature/event-management
# Create pull request for review

# Bug fixes
git checkout -b fix/event-capacity-bug
# ... fix bug ...
git commit -m "fix: correct event capacity calculation"
```

### 8.2 Commit Message Convention

```
feat: new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semicolons, etc.
refactor: code restructuring
test: adding tests
chore: updating build tasks, etc.
```

### 8.3 Code Review Process

1. Create feature branch
2. Implement feature
3. Write tests
4. Create pull request
5. Code review
6. Address feedback
7. Merge to main

---

## 9. Deployment

### 9.1 Deployment Architecture

**Frontend**: Vercel
**Backend**: Railway / Render
**Database**: MongoDB Atlas
**Storage**: Cloudinary

### 9.2 Deployment Steps

**Frontend (Vercel)**
```bash
cd client
npm run build
# Deploy dist/ folder to Vercel
```

**Backend (Railway)**
```bash
# Connect Railway to GitHub repository
# Set environment variables in Railway dashboard
# Automatic deployment on git push
```

### 9.3 Environment Variables (Production)

Update all `.env` files with production values:
- Database URLs (MongoDB Atlas)
- API keys
- Frontend URLs
- Security keys

---

**Document Control**

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | Nov 3, 2025 | Sakshya Sinha | Initial development documentation |

