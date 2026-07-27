# Campus Companion - Development Guide

## Quick Start

### 1. Run Setup Script (Windows)
```bash
./setup.bat
```

### 2. Manual Setup (All Platforms)

#### Install Dependencies
```bash
# Root dependencies
npm install

# Client dependencies
cd client && npm install

# Server dependencies
cd ../server && npm install
```

#### Start Development Servers
```bash
# Start both client and server (from root)
npm run dev

# OR start individually:

# Terminal 1: Server
cd server && npm run dev

# Terminal 2: Client  
cd client && npm run dev
```

## Project Structure

```
campus_companion/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
├── server/                # Node.js backend
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database schemas
│   ├── routes/           # API routes
│   └── utils/            # Server utilities
├── package.json          # Root package file
└── README.md            # This file
```

## Environment Variables

### Server (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campus_companion
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Core Features

### 1. Authentication System
- User registration and login
- JWT token-based authentication
- Role-based access control (student, admin, moderator)
- Password reset functionality

### 2. Event Management
- Create, view, and manage campus events
- Event registration and attendance tracking
- Category-based filtering
- Real-time event updates

### 3. Lost & Found System
- Report lost or found items
- AI-powered item matching
- Image upload support
- Comment system for coordination

### 4. Community Forum
- Create and share posts
- Like and comment system
- Sentiment analysis
- User interaction tracking

### 5. Placement Portal
- Latest placement news and updates
- Company visit information
- Placement statistics
- Web scraping for automated updates

### 6. Resume Analyzer
- AI-powered resume analysis
- Skill recommendations
- Job matching scores
- PDF/Word document support

## API Documentation

### Authentication Endpoints
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
GET  /api/auth/me          # Get current user
PUT  /api/auth/profile     # Update profile
POST /api/auth/refresh     # Refresh token
```

### Event Endpoints
```
GET    /api/events         # Get all events
POST   /api/events         # Create event
GET    /api/events/:id     # Get event by ID
PUT    /api/events/:id     # Update event
DELETE /api/events/:id     # Delete event
POST   /api/events/:id/register  # Register for event
```

### Lost & Found Endpoints
```
GET    /api/lost-found     # Get all items
POST   /api/lost-found     # Report item
GET    /api/lost-found/:id # Get item by ID
PUT    /api/lost-found/:id # Update item
DELETE /api/lost-found/:id # Delete item
```

## Development Workflow

### 1. Adding New Features

#### Frontend (React)
1. Create component in `client/src/components/`
2. Add page in `client/src/pages/`
3. Create service in `client/src/services/`
4. Update routing in `App.jsx`

#### Backend (Node.js)
1. Create model in `server/models/`
2. Add controller in `server/controllers/`
3. Define routes in `server/routes/`
4. Register routes in `server/app.js`

### 2. Database Schema Design
- Use Mongoose for MongoDB integration
- Define schemas with validation
- Add indexes for performance
- Include virtual fields and methods

### 3. API Design
- RESTful endpoint structure
- Consistent response format
- Proper HTTP status codes
- Error handling middleware

### 4. Frontend State Management
- React hooks for local state
- Context API for global state
- API services for data fetching
- Loading and error states

## Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## Deployment

### Build for Production
```bash
# Build client
cd client && npm run build

# Start production server
cd ../server && npm start
```

### Docker Deployment
```bash
docker-compose up --build
```

## Common Issues & Solutions

### 1. MongoDB Connection
- Ensure MongoDB is running
- Check connection string in .env
- Verify database permissions

### 2. CORS Issues
- Configure CORS_ORIGIN in server .env
- Check client API URL configuration

### 3. File Upload Issues
- Verify Cloudinary credentials
- Check file size limits
- Validate file types

### 4. JWT Token Issues
- Ensure JWT_SECRET is set
- Check token expiration
- Verify token format

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## Support

For issues and questions:
- Check documentation first
- Search existing issues
- Create new issue with details
- Contact: support@campuscompanion.com

## License

MIT License - see LICENSE file for details.