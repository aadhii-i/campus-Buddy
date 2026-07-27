# Data Flow Diagrams (DFD)
## Campus Companion - AI-Powered Campus Management Platform

**Version:** 1.0  
**Date:** November 3, 2025  
**Prepared by:** Sakshya Sinha  

---

## Table of Contents
1. [Context Diagram (Level 0)](#1-context-diagram-level-0)
2. [Level 1 DFD - System Overview](#2-level-1-dfd---system-overview)
3. [Level 2 DFD - Detailed Processes](#3-level-2-dfd---detailed-processes)
4. [Data Dictionary](#4-data-dictionary)

---

## 1. Context Diagram (Level 0)

### Overview
The context diagram shows the Campus Companion system as a single process with external entities.

```
┌─────────────────┐
│                 │
│    STUDENTS     │
│                 │
└────────┬────────┘
         │
         │ User Data, Requests
         │ Events, Posts, Items
         ▼
┌────────────────────────────────────────────┐
│                                            │
│      CAMPUS COMPANION SYSTEM               │
│   (AI-Powered Campus Management)           │
│                                            │
└────────┬───────────────────────────────────┘
         │
         │ Responses, Notifications
         │ Analytics, Reports
         │
    ┌────┴─────┬──────────┬─────────┬────────────┐
    │          │          │         │            │
    ▼          ▼          ▼         ▼            ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐ ┌──────────┐
│FACULTY │ │ ADMIN  │ │OPENAI  │ │EMAIL │ │CLOUDINARY│
│        │ │        │ │  API   │ │SERVICE│ │ STORAGE  │
└────────┘ └────────┘ └────────┘ └──────┘ └──────────┘
```

### External Entities

1. **Students**
   - Primary users
   - Input: Registration data, event registrations, posts, lost items, resumes
   - Output: Event confirmations, AI analysis, notifications

2. **Faculty**
   - Secondary users
   - Input: Event creation, job postings, content moderation
   - Output: Analytics, reports

3. **Admin**
   - System administrators
   - Input: User management, system configuration
   - Output: System reports, logs

4. **OpenAI API**
   - External AI service
   - Input: Resume text, item descriptions
   - Output: AI analysis, recommendations, similarity scores

5. **Email Service**
   - Communication service
   - Input: Email requests (registration, notifications)
   - Output: Sent emails

6. **Cloudinary**
   - File storage service
   - Input: Images, documents
   - Output: File URLs, stored files

---

## 2. Level 1 DFD - System Overview

### Major Processes

```
                    ┌────────────────┐
                    │   STUDENTS     │
                    │   FACULTY      │
                    │   ADMIN        │
                    └───────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌──────────────┐   ┌──────────────┐
│  1.0          │   │  2.0         │   │  3.0         │
│  USER         │   │  EVENT       │   │  LOST &      │
│  MANAGEMENT   │   │  MANAGEMENT  │   │  FOUND       │
└───────┬───────┘   └──────┬───────┘   └──────┬───────┘
        │                  │                   │
        │         ┌────────┴────────┐          │
        │         │                 │          │
        ▼         ▼                 ▼          ▼
   ┌────────────────────────────────────────────┐
   │         DATABASE (MongoDB)                 │
   │  D1: Users   D2: Events   D3: Items       │
   │  D4: Posts   D5: Jobs     D6: Resumes     │
   └────────────────────────────────────────────┘
        │         │                 │          │
        │         │                 │          │
        ▼         ▼                 ▼          ▼
┌───────────────┐   ┌──────────────┐   ┌──────────────┐
│  4.0          │   │  5.0         │   │  6.0         │
│  COMMUNITY    │   │  PLACEMENT   │   │  RESUME      │
│  HUB          │   │  SERVICES    │   │  ANALYZER    │
└───────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  EXTERNAL    │
                    │  SERVICES    │
                    │  (AI, Email) │
                    └──────────────┘
```

### Process Descriptions

**Process 1.0: User Management**
- **Input**: Registration data, login credentials, profile updates
- **Process**: Authenticate, authorize, manage user data
- **Output**: User tokens, profile data, session information
- **Data Stores**: D1 (Users)

**Process 2.0: Event Management**
- **Input**: Event details, registration requests
- **Process**: Create events, manage registrations, track capacity
- **Output**: Event listings, registration confirmations
- **Data Stores**: D2 (Events)

**Process 3.0: Lost & Found**
- **Input**: Item reports (lost/found), search queries
- **Process**: Store items, AI matching, search processing
- **Output**: Item listings, match suggestions
- **Data Stores**: D3 (Items)

**Process 4.0: Community Hub**
- **Input**: Posts, comments, sentiment data
- **Process**: Publish posts, moderate content, analyze sentiment
- **Output**: Community feed, sentiment scores
- **Data Stores**: D4 (Posts)

**Process 5.0: Placement Services**
- **Input**: Job postings, company data
- **Process**: Publish jobs, scrape news, manage applications
- **Output**: Job listings, placement updates
- **Data Stores**: D5 (Jobs)

**Process 6.0: Resume Analyzer**
- **Input**: Resume files
- **Process**: Parse resume, AI analysis, generate report
- **Output**: Analysis reports, recommendations
- **Data Stores**: D6 (Resumes)

---

## 3. Level 2 DFD - Detailed Processes

### 3.1 Process 1.0: User Management (Detailed)

```
┌────────────┐
│   USER     │
└─────┬──────┘
      │
      │ Registration Data
      ▼
┌──────────────────┐
│  1.1             │      Validation
│  VALIDATE        │──────Results────┐
│  USER DATA       │                 │
└────────┬─────────┘                 │
         │                           │
         │ Valid Data                │
         ▼                           ▼
┌──────────────────┐           ┌──────────┐
│  1.2             │  Store    │  D1      │
│  CREATE USER     │──────────▶│  USERS   │
│  ACCOUNT         │◀──────────│          │
└────────┬─────────┘  Retrieve └──────────┘
         │
         │ User Created
         ▼
┌──────────────────┐
│  1.3             │      Email Request
│  SEND WELCOME    │──────────────────────▶ Email Service
│  EMAIL           │
└────────┬─────────┘
         │
         │ Confirmation
         ▼
┌────────────┐
│   USER     │
└────────────┘

Login Flow:
┌────────────┐
│   USER     │
└─────┬──────┘
      │ Credentials
      ▼
┌──────────────────┐
│  1.4             │      Query
│  AUTHENTICATE    │◀─────────────▶ D1: USERS
│  USER            │
└────────┬─────────┘
         │
         │ Validation
         ▼
┌──────────────────┐
│  1.5             │
│  GENERATE JWT    │
│  TOKEN           │
└────────┬─────────┘
         │
         │ Token
         ▼
┌────────────┐
│   USER     │
└────────────┘
```

### 3.2 Process 2.0: Event Management (Detailed)

```
┌────────────┐
│  FACULTY/  │
│  ADMIN     │
└─────┬──────┘
      │
      │ Event Data + Image
      ▼
┌──────────────────┐
│  2.1             │
│  VALIDATE        │
│  EVENT DATA      │
└────────┬─────────┘
         │
         │ Valid Data
         ▼
┌──────────────────┐      Upload
│  2.2             │──────────────▶ Cloudinary
│  UPLOAD IMAGE    │◀──────────────
└────────┬─────────┘      Image URL
         │
         │ Event with Image URL
         ▼
┌──────────────────┐      Store
│  2.3             │──────────────▶ D2: EVENTS
│  CREATE EVENT    │
└────────┬─────────┘
         │
         │ Event Created
         ▼
┌────────────┐
│  STUDENTS  │
└─────┬──────┘
      │
      │ Browse/Register
      ▼
┌──────────────────┐      Query
│  2.4             │◀──────────────▶ D2: EVENTS
│  BROWSE EVENTS   │
└────────┬─────────┘
         │
         │ Event List
         ▼
┌────────────┐
│  STUDENTS  │
└─────┬──────┘
      │
      │ Registration Request
      ▼
┌──────────────────┐
│  2.5             │      Check Capacity
│  PROCESS         │◀──────────────▶ D2: EVENTS
│  REGISTRATION    │
└────────┬─────────┘
         │
         │ Update Registration
         ▼
┌──────────────────┐      Update
│  2.6             │──────────────▶ D2: EVENTS
│  UPDATE          │◀──────────────
│  CAPACITY        │      Confirm
└────────┬─────────┘
         │
         │ Send Confirmation
         ▼
┌──────────────────┐
│  2.7             │──────────────▶ Email Service
│  NOTIFY USER     │
└────────┬─────────┘
         │
         ▼
┌────────────┐
│  STUDENTS  │
└────────────┘
```

### 3.3 Process 3.0: Lost & Found (Detailed)

```
┌────────────┐
│  STUDENTS  │
└─────┬──────┘
      │
      │ Lost Item Report
      ▼
┌──────────────────┐
│  3.1             │
│  VALIDATE ITEM   │
│  DATA            │
└────────┬─────────┘
         │
         │ Valid Data
         ▼
┌──────────────────┐      Upload
│  3.2             │──────────────▶ Cloudinary
│  UPLOAD IMAGE    │◀──────────────
└────────┬─────────┘      Image URL
         │
         │ Item with Image
         ▼
┌──────────────────┐      Store
│  3.3             │──────────────▶ D3: ITEMS
│  SAVE ITEM       │
└────────┬─────────┘
         │
         │ Item Saved
         ▼
┌──────────────────┐      Retrieve Found Items
│  3.4             │◀──────────────▶ D3: ITEMS
│  AI MATCHING     │
│  ALGORITHM       │      Item Descriptions
└────────┬─────────┘──────────────▶ OpenAI API
         │          ◀──────────────
         │               Similarity Scores
         │
         │ Match Results
         ▼
┌──────────────────┐
│  3.5             │
│  DISPLAY         │
│  MATCHES         │
└────────┬─────────┘
         │
         ▼
┌────────────┐
│  STUDENTS  │
└────────────┘

Search Flow:
┌────────────┐
│  STUDENTS  │
└─────┬──────┘
      │
      │ Search Query + Filters
      ▼
┌──────────────────┐
│  3.6             │      Query with Filters
│  SEARCH ITEMS    │◀──────────────▶ D3: ITEMS
└────────┬─────────┘
         │
         │ Search Results
         ▼
┌────────────┐
│  STUDENTS  │
└────────────┘
```

### 3.4 Process 4.0: Community Hub (Detailed)

```
┌────────────┐
│  STUDENTS  │
└─────┬──────┘
      │
      │ Post Content
      ▼
┌──────────────────┐
│  4.1             │
│  VALIDATE POST   │
│  CONTENT         │
└────────┬─────────┘
         │
         │ Valid Content
         ▼
┌──────────────────┐      Post Text
│  4.2             │──────────────▶ AI Sentiment
│  SENTIMENT       │◀──────────────  Analysis
│  ANALYSIS        │      Sentiment Score
└────────┬─────────┘
         │
         │ Post + Sentiment
         ▼
┌──────────────────┐      Store
│  4.3             │──────────────▶ D4: POSTS
│  PUBLISH POST    │
└────────┬─────────┘
         │
         │ Post Published
         ▼
┌────────────┐
│  STUDENTS  │
└─────┬──────┘
      │
      │ View Feed
      ▼
┌──────────────────┐      Retrieve
│  4.4             │◀──────────────▶ D4: POSTS
│  DISPLAY FEED    │
└────────┬─────────┘
         │
         │ Community Posts
         ▼
┌────────────┐
│  STUDENTS  │
└─────┬──────┘
      │
      │ Comment
      ▼
┌──────────────────┐      Update
│  4.5             │──────────────▶ D4: POSTS
│  ADD COMMENT     │
└──────────────────┘

Moderation Flow:
┌────────────┐
│   ADMIN    │
└─────┬──────┘
      │
      │ Moderation Action
      ▼
┌──────────────────┐      Retrieve
│  4.6             │◀──────────────▶ D4: POSTS
│  MODERATE        │      Update
│  CONTENT         │──────────────▶
└──────────────────┘
```

### 3.5 Process 5.0: Placement Services (Detailed)

```
┌────────────┐
│  FACULTY/  │
│  ADMIN     │
└─────┬──────┘
      │
      │ Job Details
      ▼
┌──────────────────┐
│  5.1             │
│  VALIDATE JOB    │
│  DATA            │
└────────┬─────────┘
         │
         │ Valid Data
         ▼
┌──────────────────┐      Store
│  5.2             │──────────────▶ D5: JOBS
│  PUBLISH JOB     │
└──────────────────┘

Automated Scraping:
┌──────────────────┐
│  5.3             │      Scrape
│  WEB SCRAPER     │──────────────▶ External Websites
│  (CRON JOB)      │◀──────────────
└────────┬─────────┘      Job Data
         │
         │ Parsed Data
         ▼
┌──────────────────┐      Store
│  5.4             │──────────────▶ D5: JOBS
│  SAVE SCRAPED    │
│  JOBS            │
└──────────────────┘

Student View:
┌────────────┐
│  STUDENTS  │
└─────┬──────┘
      │
      │ Browse/Filter
      ▼
┌──────────────────┐      Query
│  5.5             │◀──────────────▶ D5: JOBS
│  BROWSE JOBS     │
└────────┬─────────┘
         │
         │ Job Listings
         ▼
┌────────────┐
│  STUDENTS  │
└────────────┘
```

### 3.6 Process 6.0: Resume Analyzer (Detailed)

```
┌────────────┐
│  STUDENTS  │
└─────┬──────┘
      │
      │ Upload Resume (PDF/DOCX)
      ▼
┌──────────────────┐
│  6.1             │
│  VALIDATE FILE   │
│  FORMAT & SIZE   │
└────────┬─────────┘
         │
         │ Valid File
         ▼
┌──────────────────┐      Upload
│  6.2             │──────────────▶ Cloudinary
│  UPLOAD FILE     │◀──────────────
└────────┬─────────┘      File URL
         │
         │ File URL
         ▼
┌──────────────────┐
│  6.3             │
│  PARSE RESUME    │
│  (Extract Text)  │
└────────┬─────────┘
         │
         │ Extracted Text
         ▼
┌──────────────────┐      Resume Text
│  6.4             │──────────────▶ OpenAI API
│  AI ANALYSIS     │◀──────────────
└────────┬─────────┘      Analysis Results
         │
         │ Analysis + Score
         ▼
┌──────────────────┐
│  6.5             │      Analyze Skills
│  SKILL GAP       │──────────────▶ OpenAI API
│  ANALYSIS        │◀──────────────
└────────┬─────────┘      Skill Gaps
         │
         │ Complete Analysis
         ▼
┌──────────────────┐      Store
│  6.6             │──────────────▶ D6: RESUMES
│  SAVE ANALYSIS   │
└────────┬─────────┘
         │
         │ Generate Report
         ▼
┌──────────────────┐
│  6.7             │
│  CREATE          │
│  RECOMMENDATIONS │
└────────┬─────────┘
         │
         │ Full Report
         ▼
┌────────────┐
│  STUDENTS  │
└────────────┘
```

---

## 4. Data Dictionary

### Data Stores

**D1: USERS**
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| name | String | User's full name |
| email | String | Email address (unique) |
| password | String | Hashed password |
| rollNumber | String | Student roll number |
| department | String | Department name |
| year | Number | Academic year (1-4) |
| role | String | User role (student/faculty/admin) |
| profilePicture | String | Cloudinary URL |
| createdAt | Date | Account creation date |

**D2: EVENTS**
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| title | String | Event title |
| description | String | Event description |
| date | Date | Event date |
| time | String | Event time |
| location | String | Event location |
| category | String | Event category |
| capacity | Number | Maximum attendees |
| registered | Array | Registered user IDs |
| organizer | ObjectId | Creator user ID |
| image | String | Event image URL |
| createdAt | Date | Creation date |

**D3: ITEMS (Lost & Found)**
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| type | String | "lost" or "found" |
| itemName | String | Name of item |
| description | String | Item description |
| category | String | Item category |
| location | String | Location found/lost |
| date | Date | Date reported |
| image | String | Item image URL |
| reportedBy | ObjectId | User ID |
| status | String | "open" or "claimed" |
| contactInfo | String | Contact details |

**D4: POSTS (Community)**
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| title | String | Post title |
| content | String | Post content |
| category | String | Post category |
| author | ObjectId | User ID |
| images | Array | Image URLs |
| sentiment | Object | Sentiment analysis data |
| comments | Array | Comment objects |
| likes | Number | Like count |
| status | String | "published" or "moderated" |
| createdAt | Date | Creation date |

**D5: JOBS (Placement)**
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| company | String | Company name |
| position | String | Job title |
| description | String | Job description |
| requirements | Array | Required skills |
| salary | String | Salary range |
| deadline | Date | Application deadline |
| contactEmail | String | Contact email |
| source | String | "manual" or "scraped" |
| postedBy | ObjectId | User ID (if manual) |
| createdAt | Date | Posting date |

**D6: RESUMES**
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| userId | ObjectId | User ID |
| fileName | String | Original filename |
| fileUrl | String | Cloudinary URL |
| extractedText | String | Parsed resume text |
| analysis | Object | AI analysis results |
| score | Number | Overall score (0-100) |
| skillGaps | Array | Missing skills |
| recommendations | Array | Improvement suggestions |
| analyzedAt | Date | Analysis date |

### Data Flows

**DF1: User Registration Data**
- Name, Email, Password, Roll Number, Department, Year

**DF2: Authentication Token**
- JWT token containing user ID and role

**DF3: Event Details**
- Title, Description, Date, Time, Location, Category, Capacity, Image

**DF4: Item Report**
- Type, Item Name, Description, Category, Location, Date, Image

**DF5: Community Post**
- Title, Content, Category, Images

**DF6: Job Posting**
- Company, Position, Description, Requirements, Deadline

**DF7: Resume File**
- PDF/DOCX file, User ID

**DF8: AI Analysis Request**
- Text data for analysis

**DF9: AI Analysis Response**
- Analysis results, scores, recommendations

**DF10: Email Notification**
- Recipient, Subject, Message, Template

---

## 5. Process Specifications

### Process: 1.2 - Create User Account

**Input**: Validated user data (name, email, password, etc.)

**Process Logic**:
1. Hash password using bcrypt (10 salt rounds)
2. Create user document with default role "student"
3. Generate unique user ID
4. Store in Users database
5. Return user object (without password)

**Output**: User account object

**Error Handling**:
- Duplicate email → Return error "Email already exists"
- Database error → Return error "Account creation failed"

---

### Process: 2.5 - Process Registration

**Input**: Event ID, User ID

**Process Logic**:
1. Retrieve event from database
2. Check if user already registered
3. Check if capacity not exceeded
4. Add user to registered array
5. Increment registered count
6. Update event document
7. Trigger notification process

**Output**: Registration confirmation

**Error Handling**:
- Already registered → "Already registered for this event"
- Capacity full → "Event is full"
- Event not found → "Event does not exist"

---

### Process: 3.4 - AI Matching Algorithm

**Input**: Item description, item type

**Process Logic**:
1. Retrieve opposite type items (lost if found, found if lost)
2. Extract descriptions
3. Send to OpenAI API for similarity analysis
4. Receive similarity scores
5. Sort by score (threshold > 0.7)
6. Return top 5 matches

**Output**: Array of matched items with similarity scores

**API Call**:
```
OpenAI Embeddings API
Input: Item descriptions
Output: Similarity scores
```

---

### Process: 6.4 - AI Analysis

**Input**: Resume text

**Process Logic**:
1. Send resume text to OpenAI GPT-4
2. Request structured analysis:
   - Overall quality score
   - Strengths
   - Weaknesses
   - Missing sections
   - Formatting issues
   - ATS compatibility
3. Parse AI response
4. Structure into JSON format

**Output**: Analysis object

**AI Prompt Template**:
```
Analyze this resume and provide:
1. Overall score (0-100)
2. Key strengths (array)
3. Areas for improvement (array)
4. Missing important sections (array)
5. ATS optimization tips (array)
```

---

**Document Control**

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | Nov 3, 2025 | Sakshya Sinha | Initial DFD documentation |

---

This DFD documentation provides a comprehensive view of data flow in the Campus Companion system at multiple levels of abstraction.
