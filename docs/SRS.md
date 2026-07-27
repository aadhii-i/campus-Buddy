# Software Requirements Specification (SRS)
## Campus Companion - AI-Powered Campus Management Platform

**Version:** 1.0  
**Date:** November 3, 2025  
**Prepared by:** Sakshya Sinha  

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Specific Requirements](#3-specific-requirements)
4. [System Features](#4-system-features)
5. [External Interface Requirements](#5-external-interface-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Other Requirements](#7-other-requirements)

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for Campus Companion, an AI-powered campus management platform designed to streamline campus operations, enhance student engagement, and provide intelligent services for academic institutions.

### 1.2 Scope
Campus Companion is a comprehensive web application that provides:
- Event management and registration system
- Lost & Found tracking with AI matching
- Community discussion forums
- Placement news and career services
- AI-powered resume analysis
- User authentication and role-based access control

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS**: Software Requirements Specification
- **UI**: User Interface
- **API**: Application Programming Interface
- **AI**: Artificial Intelligence
- **JWT**: JSON Web Token
- **CRUD**: Create, Read, Update, Delete
- **DFD**: Data Flow Diagram
- **MERN**: MongoDB, Express.js, React, Node.js

### 1.4 References
- MongoDB Documentation
- React.js Documentation
- Node.js Documentation
- OpenAI API Documentation
- Cloudinary API Documentation

### 1.5 Overview
This SRS describes the functional and non-functional requirements, system features, interfaces, and constraints for the Campus Companion platform.

---

## 2. Overall Description

### 2.1 Product Perspective
Campus Companion is a standalone web application built on the MERN stack that integrates with:
- MongoDB for data persistence
- OpenAI API for AI-powered features
- Cloudinary for file storage
- Email services for notifications

### 2.2 Product Functions
The major functions include:

**F1. User Management**
- User registration and authentication
- Profile management
- Role-based access (Student, Faculty, Admin)
- Department and year classification

**F2. Event Management**
- Event creation and publishing
- Event browsing and search
- Registration and capacity tracking
- Category-based filtering

**F3. Lost & Found**
- Report lost items with images
- Browse and search found items
- AI-powered item matching
- Category and location tracking

**F4. Community Hub**
- Create and share posts
- Comment and engage
- Content moderation
- Real-time updates

**F5. Placement Services**
- Job posting and announcements
- Company visit schedules
- Placement statistics
- Career resources

**F6. Resume Analyzer**
- Upload and parse resumes
- AI-powered analysis
- Skill gap identification
- Personalized recommendations

### 2.3 User Classes and Characteristics

**Student Users**
- Primary users of the platform
- Access all features (events, lost & found, community, placement, resume analyzer)
- Can create posts, register for events, report items

**Faculty Users**
- Can create and manage events
- Moderate community posts
- Post placement opportunities
- Access student engagement metrics

**Admin Users**
- Full system access
- User management capabilities
- Content moderation
- System configuration
- Analytics and reporting

**Guest Users**
- Limited read-only access
- Can view public events and announcements
- Must register to access full features

### 2.4 Operating Environment
- **Client-side**: Modern web browsers (Chrome, Firefox, Safari, Edge)
- **Server-side**: Node.js runtime environment
- **Database**: MongoDB (local or cloud-hosted)
- **Storage**: Cloudinary cloud storage
- **Deployment**: Vercel (frontend), Railway/Render (backend)

### 2.5 Design and Implementation Constraints
- Must comply with data privacy regulations
- Limited to web platform (no native mobile apps initially)
- Dependent on third-party APIs (OpenAI, Cloudinary)
- Browser compatibility requirements
- Network connectivity required

### 2.6 Assumptions and Dependencies
- Users have internet access
- Users have modern web browsers
- MongoDB database is available
- Third-party APIs (OpenAI, Cloudinary) are operational
- Email service is configured

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 User Authentication and Authorization

**FR-1.1: User Registration**
- **Description**: System shall allow new users to register
- **Input**: Name, email, password, roll number, department, year
- **Processing**: Validate data, hash password, create user account
- **Output**: User account created, welcome email sent
- **Priority**: High

**FR-1.2: User Login**
- **Description**: Registered users can log in
- **Input**: Email/roll number and password
- **Processing**: Validate credentials, generate JWT token
- **Output**: Authentication token, user session
- **Priority**: High

**FR-1.3: Password Reset**
- **Description**: Users can reset forgotten passwords
- **Input**: Email address
- **Processing**: Generate reset token, send email
- **Output**: Password reset link
- **Priority**: Medium

**FR-1.4: Profile Management**
- **Description**: Users can update their profiles
- **Input**: Profile data (name, bio, photo, preferences)
- **Processing**: Validate and update user information
- **Output**: Updated profile
- **Priority**: Medium

#### 3.1.2 Event Management

**FR-2.1: Create Event**
- **Description**: Authorized users can create events
- **Input**: Title, description, date, time, location, capacity, category, image
- **Processing**: Validate data, upload image, save event
- **Output**: Event created and published
- **Priority**: High

**FR-2.2: Browse Events**
- **Description**: Users can browse all events
- **Input**: Optional filters (category, date, search query)
- **Processing**: Query database with filters
- **Output**: List of events
- **Priority**: High

**FR-2.3: Register for Event**
- **Description**: Users can register for events
- **Input**: Event ID, user ID
- **Processing**: Check capacity, add registration
- **Output**: Registration confirmation
- **Priority**: High

**FR-2.4: Event Notifications**
- **Description**: Send reminders to registered users
- **Input**: Event details, registered users
- **Processing**: Generate notification, send email
- **Output**: Notification sent
- **Priority**: Low

#### 3.1.3 Lost & Found

**FR-3.1: Report Lost Item**
- **Description**: Users can report lost items
- **Input**: Item name, description, category, location, date, image
- **Processing**: Validate data, upload image, save item
- **Output**: Lost item reported
- **Priority**: High

**FR-3.2: Report Found Item**
- **Description**: Users can report found items
- **Input**: Item details, current location, image
- **Processing**: Save item, run AI matching algorithm
- **Output**: Found item reported, potential matches shown
- **Priority**: High

**FR-3.3: AI Item Matching**
- **Description**: System matches lost and found items
- **Input**: Item descriptions
- **Processing**: AI analysis for similarity
- **Output**: Match suggestions
- **Priority**: Medium

**FR-3.4: Search Items**
- **Description**: Users can search lost/found items
- **Input**: Search query, filters (category, date)
- **Processing**: Query database
- **Output**: Filtered results
- **Priority**: High

#### 3.1.4 Community Hub

**FR-4.1: Create Post**
- **Description**: Users can create community posts
- **Input**: Title, content, category, optional images
- **Processing**: Validate content, save post
- **Output**: Post published
- **Priority**: High

**FR-4.2: Comment on Posts**
- **Description**: Users can comment on posts
- **Input**: Post ID, comment text
- **Processing**: Validate and save comment
- **Output**: Comment added
- **Priority**: Medium

**FR-4.3: Sentiment Analysis**
- **Description**: Analyze post sentiment
- **Input**: Post content
- **Processing**: AI sentiment analysis
- **Output**: Sentiment score and label
- **Priority**: Low

**FR-4.4: Content Moderation**
- **Description**: Admins can moderate posts
- **Input**: Post ID, action (approve/delete)
- **Processing**: Update post status
- **Output**: Post moderated
- **Priority**: Medium

#### 3.1.5 Placement Services

**FR-5.1: Post Job Opportunities**
- **Description**: Faculty/Admin can post jobs
- **Input**: Company, position, requirements, deadline
- **Processing**: Validate and save posting
- **Output**: Job posted
- **Priority**: High

**FR-5.2: Web Scraping**
- **Description**: Automatically scrape placement news
- **Input**: Target websites
- **Processing**: Scrape and parse data
- **Output**: Latest opportunities added
- **Priority**: Low

**FR-5.3: Browse Opportunities**
- **Description**: Students can view job listings
- **Input**: Optional filters (company, role, date)
- **Processing**: Query database
- **Output**: Filtered job listings
- **Priority**: High

#### 3.1.6 Resume Analyzer

**FR-6.1: Upload Resume**
- **Description**: Users can upload resumes
- **Input**: PDF/DOCX file
- **Processing**: Parse and extract text
- **Output**: Resume uploaded
- **Priority**: High

**FR-6.2: AI Analysis**
- **Description**: Analyze resume using AI
- **Input**: Resume text
- **Processing**: OpenAI API analysis
- **Output**: Analysis report with score and recommendations
- **Priority**: High

**FR-6.3: Skill Gap Analysis**
- **Description**: Identify missing skills
- **Input**: Resume data, job requirements
- **Processing**: Compare and identify gaps
- **Output**: Skill gap report
- **Priority**: Medium

**FR-6.4: Download Report**
- **Description**: Users can download analysis
- **Input**: Resume ID
- **Processing**: Generate PDF report
- **Output**: Downloadable report
- **Priority**: Low

---

## 4. System Features

### 4.1 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- XSS protection
- NoSQL injection prevention
- CSRF protection
- Rate limiting
- Helmet.js security headers

### 4.2 Performance Features
- Response compression
- Database indexing
- Caching strategies
- Lazy loading
- Code splitting
- Image optimization

### 4.3 Scalability Features
- Stateless API design
- Cloud-based file storage
- Horizontal scaling capability
- Load balancing support
- Microservices-ready architecture

---

## 5. External Interface Requirements

### 5.1 User Interfaces
- Responsive web design
- Mobile-first approach
- Intuitive navigation
- Accessible UI (WCAG 2.1 compliant)
- Modern, clean design with Tailwind CSS

### 5.2 Hardware Interfaces
- No specific hardware requirements
- Standard web server infrastructure

### 5.3 Software Interfaces

**SI-1: MongoDB Database**
- Type: NoSQL Database
- Purpose: Data persistence
- Interface: Mongoose ODM

**SI-2: OpenAI API**
- Type: External REST API
- Purpose: AI-powered features
- Interface: HTTP/HTTPS

**SI-3: Cloudinary API**
- Type: Cloud Storage Service
- Purpose: Image/file storage
- Interface: REST API

**SI-4: Email Service**
- Type: SMTP/Email API
- Purpose: Notifications and alerts
- Interface: Nodemailer

### 5.4 Communications Interfaces
- HTTPS protocol for secure communication
- RESTful API architecture
- JSON data format
- WebSocket for real-time features (future)

---

## 6. Non-Functional Requirements

### 6.1 Performance Requirements
- **NFR-1**: Page load time < 3 seconds
- **NFR-2**: API response time < 500ms (95th percentile)
- **NFR-3**: Support 1000+ concurrent users
- **NFR-4**: Database query optimization (indexed fields)

### 6.2 Safety Requirements
- **NFR-5**: Regular automated backups
- **NFR-6**: Data encryption at rest and in transit
- **NFR-7**: Disaster recovery plan
- **NFR-8**: Error logging and monitoring

### 6.3 Security Requirements
- **NFR-9**: HTTPS only in production
- **NFR-10**: Strong password policy (min 8 chars, mixed case, numbers)
- **NFR-11**: JWT token expiration (24 hours)
- **NFR-12**: Rate limiting (100 requests/15 min per IP)
- **NFR-13**: Input validation and sanitization
- **NFR-14**: Regular security audits

### 6.4 Software Quality Attributes

**Availability**
- **NFR-15**: 99.5% uptime
- **NFR-16**: Graceful degradation on errors

**Maintainability**
- **NFR-17**: Modular code architecture
- **NFR-18**: Comprehensive code documentation
- **NFR-19**: Follow coding standards (ESLint)

**Usability**
- **NFR-20**: Intuitive UI requiring no training
- **NFR-21**: Responsive design (mobile, tablet, desktop)
- **NFR-22**: Accessibility compliance

**Scalability**
- **NFR-23**: Horizontal scaling capability
- **NFR-24**: Cloud deployment ready

**Reliability**
- **NFR-25**: Error handling on all endpoints
- **NFR-26**: Transaction rollback on failures

---

## 7. Other Requirements

### 7.1 Legal Requirements
- Comply with data protection regulations (GDPR, etc.)
- User consent for data collection
- Clear terms of service and privacy policy
- Copyright compliance for uploaded content

### 7.2 Database Requirements
- MongoDB 4.4 or higher
- Proper indexing for performance
- Regular backups (daily recommended)
- Data retention policies

### 7.3 Internationalization
- Support for multiple languages (future)
- UTC time zone handling
- Locale-specific date/time formats

### 7.4 Documentation Requirements
- API documentation (Swagger/OpenAPI)
- User guide
- Admin manual
- Deployment guide
- Code documentation

---

## Appendix A: Glossary

- **Campus Companion**: The name of the platform
- **Event**: A campus activity or gathering
- **Lost & Found**: System for tracking lost and found items
- **Community Post**: User-generated content in discussion forums
- **Resume Analyzer**: AI-powered resume evaluation tool
- **Placement**: Job placement and career services

---

## Appendix B: Analysis Models

Refer to separate documents:
- Data Flow Diagrams (DFD.md)
- Entity Relationship Diagrams
- Use Case Diagrams
- System Architecture

---

**Document Control**

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | Nov 3, 2025 | Sakshya Sinha | Initial SRS document |

---

**Approval**

This document has been prepared for academic presentation purposes.
