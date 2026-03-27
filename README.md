# SkillSwap - Peer-to-Peer Skill Exchange Platform

## 🎯 Project Overview

SkillSwap is a full-stack web application that enables users to exchange skills with each other. Users can offer skills they have and request skills they want to learn, then get matched with compatible partners for skill-swapping sessions. The platform handles user matching, scheduling, session management, and real-time meeting coordination.

### Core Concept
- **User A** has skill X and wants to learn skill Y
- **User B** has skill Y and wants to learn skill X  
- The platform matches them and facilitates skill exchange sessions

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         SKILLSWAP                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │   Client    │────▶│   Server    │────▶│  MongoDB    │       │
│  │  (React)    │     │  (Express)  │     │  (Atlas)    │       │
│  │  Port 5173  │     │  Port 5000  │     │             │       │
│  └─────────────┘     └──────┬──────┘     └─────────────┘       │
│                             │                                   │
│                             ▼                                   │
│                      ┌─────────────┐                           │
│                      │    Redis    │                           │
│                      │  Port 6379  │                           │
│                      │ (Caching +  │                           │
│                      │  BullMQ)    │                           │
│                      └─────────────┘                           │
│                                                                 │
│  External APIs:                                                │
│  - Lightcast Skills API (skill autocomplete & categorization) │
│  - Google OAuth (authentication)                               │
│  - Zoho Mail (email verification & reminders)                 │
│  - Cloudinary (image uploads)                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
skillswap/
├── docker-compose.yml          # Docker orchestration (3 services)
├── render.yaml                 # Render.com deployment config
├── package.json                # Root package (shared dependencies)
│
├── client/                     # Frontend React Application
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js          # Vite bundler configuration
│   ├── tailwind.config.js      # TailwindCSS configuration
│   ├── index.html              # Entry HTML
│   └── src/
│       ├── App.jsx             # Main React app with routing
│       ├── main.jsx            # React entry point
│       ├── index.css           # Global styles
│       ├── api/                # API client functions
│       │   ├── axios.js        # Axios instance configuration
│       │   └── auth.js         # All API calls (auth, users, skills, etc.)
│       ├── context/
│       │   └── AuthContext.jsx # Authentication state management
│       ├── store/              # Redux store (animation states)
│       │   ├── configureStore.jsx
│       │   ├── animationSlice.jsx
│       │   └── ...
│       ├── components/         # React components
│       │   ├── LandingPage.jsx
│       │   ├── LoginForm.jsx
│       │   ├── SignupForm.jsx
│       │   ├── Dashboard.jsx
│       │   ├── ProfileUpdate.jsx
│       │   ├── RequestsPage.jsx
│       │   ├── SessionsPage.jsx
│       │   ├── MeetingRoom.jsx
│       │   ├── SwapCard.jsx
│       │   ├── SwapRequest.jsx
│       │   └── ...
│       └── utils/
│           ├── cloudinary.js   # Image upload utility
│           └── timeUtils.js    # Timezone utilities
│
└── server/                     # Backend Node.js Application
    ├── Dockerfile
    ├── package.json
    ├── server.js               # Entry point (MongoDB connection)
    ├── app.js                  # Express app configuration
    │
    ├── models/                 # Mongoose schemas
    │   ├── user.js             # User model (skills, availability, requests)
    │   ├── Session.js          # Skill swap session model
    │   ├── Chat.js             # Chat room model
    │   ├── Message.js          # Chat message model
    │   └── Refreshtoken.js     # JWT refresh token model
    │
    ├── controllers/            # Request handlers
    │   ├── authController.js   # Registration, login, Google OAuth, email verification
    │   ├── userController.js   # Profile, availability, swap requests
    │   ├── matchController.js  # Skill matching algorithms
    │   ├── scheduleController.js # Session creation and management
    │   ├── meetingController.js  # Meeting room access validation
    │   ├── searchController.js   # User search functionality
    │   ├── skillController.js    # Skill management
    │   ├── skillfinderController.js # Lightcast API integration
    │   └── chatController.js     # Messaging system
    │
    ├── routes/                 # Express routes
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── skillRoutes.js
    │   ├── searchRoutes.js
    │   └── chatRoutes.js
    │
    ├── middleware/
    │   └── authMiddleware.js   # JWT verification middleware
    │
    ├── services/               # Business logic services
    │   ├── emailService.js     # Email sending (Nodemailer + Zoho)
    │   ├── reminderService.js  # Session reminder scheduling (node-cron)
    │   ├── sessionQueue.js     # Session expiry worker (BullMQ)
    │   ├── sessionsService.js  # Session utility functions
    │   ├── lightcast.js        # Lightcast Skills API client
    │   ├── redisClient.js      # Redis connection
    │   └── cron.js             # Scheduled tasks
    │
    └── scripts/
        └── clearDatabase.js    # Database cleanup utility
```

---

## 🔐 Authentication System

### Flow
1. **Email/Password Registration**
   - User registers with email, name, password
   - Password hashed with Argon2
   - Verification email sent via Zoho Mail
   - User must verify email before logging in

2. **Google OAuth**
   - User clicks "Sign in with Google"
   - Google credential verified server-side
   - User auto-created/logged in (no email verification needed)

3. **JWT Token System**
   - **Access Token**: Short-lived (15 minutes), stored in memory
   - **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookie
   - Automatic token refresh on 401 responses

### Key Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Email/password registration |
| `/api/auth/login` | POST | Email/password login |
| `/api/auth/google` | POST | Google OAuth login |
| `/api/auth/refresh-token` | POST | Get new access token |
| `/api/auth/logout` | POST | Invalidate refresh token |
| `/api/auth/verify-email` | GET | Email verification |

---

## 👤 User Model

```javascript
{
  name: String,
  email: String (unique),
  passwordHash: String,              // Argon2 hash
  isGoogleUser: Boolean,
  googleId: String,
  imageUrl: String,                  // Profile picture (Cloudinary)
  bio: String,
  contact: String,
  isEmailVerified: Boolean,
  
  // Skills
  skillsHave: [{                     // Skills user can teach
    name: String,
    id: String,                      // Lightcast skill ID
    category: String                 // Auto-fetched from Lightcast
  }],
  skillsWant: [{                     // Skills user wants to learn
    name: String,
    id: String,
    category: String
  }],
  categoriesHave: [String],          // Skill categories for matching
  categoriesWant: [String],
  
  // Availability (stored in UTC)
  availability: [{
    id: String,                      // Unique slot ID
    originalDay: String,             // User's local day
    originalStartTime: String,       // User's local time
    originalEndTime: String,
    utcDay: String,                  // Converted to UTC
    utcStartTime: String,
    utcEndTime: String,
    userTimezone: String             // e.g., "America/New_York"
  }],
  timezone: String,
  
  // Sessions & Requests
  sessions: [ObjectId],              // References to Session model
  swapRequests: [{...}],             // Incoming requests
  requestsSent: [{...}],             // Outgoing requests
  
  ratings: [Number]                  // 1-5 star ratings
}
```

---

## 🔄 Skill Matching System

### Three Types of Matches

1. **Perfect Matches (Mutual)**
   - User A's `skillsHave` ∩ User B's `skillsWant` ≠ ∅
   - AND User A's `skillsWant` ∩ User B's `skillsHave` ≠ ∅

2. **Partial Matches (One-way)**
   - Only one of the above conditions is true

3. **Category Matches**
   - User A's `categoriesHave` ∩ User B's `categoriesWant` ≠ ∅
   - Falls back to category-level matching when exact skills don't match

### Matching Algorithm
Located in `matchController.js`, uses MongoDB aggregation pipelines:
- `$setIntersection` for finding common skills
- `$match` to filter valid matches
- Excludes already-shown users from lower-priority match types

---

## 📅 Session & Scheduling System

### Swap Request Flow
1. User A browses matches on Dashboard
2. User A sends swap request with:
   - Skill to offer
   - Skill they want
   - Duration (in days)
   - Selected availability slot IDs (from target user's availability)

3. User B receives request in "Requests" page
4. User B can accept or reject
5. On accept → Session is created

### Session Model
```javascript
{
  userA: ObjectId,
  userB: ObjectId,
  skillFromA: { name, id, category },
  skillFromB: { name, id, category },
  scheduledTime: [String],           // UTC time slots: ["Monday 14:00-15:00"]
  duration: Number,                  // Days the session runs
  expiresAt: Date,
  status: 'active' | 'completed' | 'cancelled' | 'expired',
  meetingRooms: [{
    slotIndex: Number,
    roomId: String,
    timeSlot: String,
    isActive: Boolean
  }]
}
```

### Meeting Room Access
- Meeting rooms are accessible 5 minutes before and after scheduled time
- Access validated via `isMeetingAccessible()` method
- Room IDs generated as: `skillswap_session_{sessionId}_slot_{slotIndex}`

---

## 📧 Email System

### Email Service (Zoho Mail via Nodemailer)
Located in `emailService.js`

### Email Types
1. **Verification Email** - Sent on registration
2. **Session Reminders** - Sent 5 minutes before each scheduled slot
3. **Swap Request Notifications** (can be added)

### Reminder System
- Uses `node-cron` for scheduling
- Reminders stored in memory (`activeReminders` Map)
- On session creation, cron jobs scheduled for each time slot
- Jobs run in UTC, email content converted to user's timezone

---

## ⏱️ Background Jobs (BullMQ + Redis)

### Session Expiry Worker
Located in `sessionQueue.js`

```javascript
// Queue: 'session-expiry'
// Job: 'expire-session'
// Behavior: When session.expiresAt is reached:
//   1. Update session status to 'completed'
//   2. Clear scheduled reminders
```

---

## 🔍 Search & Skills API

### Lightcast Skills API Integration
Located in `lightcast.js`

- **Autocomplete**: Search skills by query
- **Skill Details**: Fetch skill category/subcategory by ID
- Results cached in Redis (1 hour for search, 24 hours for skill details)

### Search Endpoints
| Endpoint | Description |
|----------|-------------|
| `/api/skills/find?query=` | Autocomplete skills |
| `/api/search/skill/:skillName` | Search users by skill |
| `/api/search/category/:category` | Search users by category |
| `/api/search/name/:name` | Search users by name |

---

## 🌐 API Endpoints Reference

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login with email/password
POST   /api/auth/google            - Google OAuth login
POST   /api/auth/refresh-token     - Refresh access token
POST   /api/auth/logout            - Logout (invalidate refresh token)
GET    /api/auth/verify-email      - Verify email with token
PUT    /api/auth/change-password   - Change password (protected)
```

### Users (Protected)
```
GET    /api/users/profile/:id       - Get own profile
PUT    /api/users/profile/:id       - Update profile
POST   /api/users/availability      - Set availability
POST   /api/users/swap-request      - Send swap request
GET    /api/users/swap-requests     - Get all incoming requests
POST   /api/users/swap-requests/:id/reject - Reject request
POST   /api/users/create-session    - Accept request & create session
GET    /api/users/sessions          - Get user's sessions
GET    /api/users/matches           - Get perfect matches
GET    /api/users/partial-matches   - Get partial matches
GET    /api/users/category-matches  - Get category matches
GET    /api/users/meeting/:sessionId/:slotIndex - Get meeting access
```

### Skills
```
POST   /api/skills/set              - Set user's skills (protected)
GET    /api/skills/find?query=      - Autocomplete skills
```

### Search
```
GET    /api/search/skill/:skillName
GET    /api/search/category/:category
GET    /api/search/name/:name
```

### Chat (Protected)
```
POST   /api/chat/send               - Send message
GET    /api/chat/conversation/:otherUserId - Get conversation
```

---

## 🐳 Docker Configuration

### docker-compose.yml
```yaml
services:
  api:              # Backend Express server
    - Port: 5000
    - Depends on: redis
    - Environment: REDIS_HOST=redis, REDIS_PORT=6379
    
  frontend:         # React Vite dev server
    - Port: 5173
    - Depends on: api
    - Command: npm run dev -- --host
    
  redis:            # Redis for caching & BullMQ
    - Port: 6379
    - Volume: redis_data (persistent)

networks:
  skillswap (bridge)
```

### Running with Docker
```bash
# Development
docker-compose up --build

# Production (modify docker-compose for production builds)
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔧 Environment Variables

### Server (.env)
```env
# Database
MONGO_URI=mongodb+srv://...

# Authentication
ACCESS_TOKEN_SECRET=your_secret_key
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY_DAYS=7

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Lightcast Skills API
LIGHTCAST_CLIENT_ID=your_lightcast_id
LIGHTCAST_CLIENT_SECRET=your_lightcast_secret

# Email (Zoho)
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=587
EMAIL_USER=your_email@zoho.com
EMAIL_PASS=your_email_password
SENDER_NAME=SkillSwap
SENDER_EMAIL=your_email@zoho.com

# Redis
REDIS_HOST=redis          # Use 'localhost' for local dev, 'redis' for Docker
REDIS_PORT=6379
REDIS_URL=redis://redis:6379

# Client URL (for CORS & email links)
CLIENT_URL=http://localhost:5173

# Server
PORT=5000
NODE_ENV=development
```

### Client (Vite uses VITE_ prefix)
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 20+ (22 recommended)
- Docker & Docker Compose
- MongoDB Atlas account (or local MongoDB)
- Redis (or use Docker)

### Option 1: With Docker (Recommended)
```bash
# 1. Clone the repository
git clone <repo-url>
cd skillswap

# 2. Create environment files
cp server/.env.example server/.env
# Edit server/.env with your credentials

# 3. Start all services
docker-compose up --build

# 4. Access the app
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
```

### Option 2: Without Docker
```bash
# 1. Start Redis locally
redis-server

# 2. Start the backend
cd server
npm install
npm run dev

# 3. Start the frontend (new terminal)
cd client
npm install
npm run dev
```

---

## 📦 Key Dependencies

### Server
| Package | Purpose |
|---------|---------|
| express | Web framework |
| mongoose | MongoDB ODM |
| jsonwebtoken | JWT authentication |
| argon2 | Password hashing |
| google-auth-library | Google OAuth verification |
| nodemailer | Email sending |
| node-cron | Scheduled tasks |
| bullmq | Background job queue |
| ioredis | Redis client |
| moment-timezone | Timezone handling |
| axios | HTTP client (Lightcast API) |

### Client
| Package | Purpose |
|---------|---------|
| react | UI framework |
| react-router-dom | Routing |
| @reduxjs/toolkit | State management |
| axios | HTTP client |
| framer-motion | Animations |
| gsap | Advanced animations |
| tailwindcss | Styling |
| lucide-react | Icons |
| moment-timezone | Timezone handling |

---

## ⚠️ Known Issues & TODOs

1. **Hardcoded URLs**: Client has hardcoded `localhost:5000` in AuthContext - should use environment variable
2. **No WebSocket**: Chat is polling-based, not real-time
3. **Meeting Room**: Placeholder implementation - needs actual video integration (e.g., Jitsi, WebRTC)
4. **Production Dockerfiles**: Current Dockerfiles run in dev mode

---

## 🔒 Security Notes

- Passwords hashed with Argon2
- JWT tokens with short expiry (15 min access, 7 day refresh)
- HTTP-only cookies for refresh tokens
- CORS configured for specific origin
- Email verification required for non-Google users
- Protected routes use `verifyToken` middleware

---

## 📊 Database Indexes (Recommended)

```javascript
// User collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ "skillsHave.id": 1 })
db.users.createIndex({ "skillsWant.id": 1 })
db.users.createIndex({ categoriesHave: 1 })
db.users.createIndex({ categoriesWant: 1 })

// Session collection
db.sessions.createIndex({ userA: 1 })
db.sessions.createIndex({ userB: 1 })
db.sessions.createIndex({ status: 1 })
db.sessions.createIndex({ expiresAt: 1 })
```

---

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Clear database (development only)
npm run clear:all
```

---

## 📝 For AI Assistants Working on This Project

### Key Files to Understand
1. `server/models/user.js` - Core user schema with all fields
2. `server/controllers/matchController.js` - Matching algorithm
3. `server/controllers/userController.js` - Main user operations
4. `server/services/reminderService.js` - Cron-based reminders
5. `client/src/context/AuthContext.jsx` - Auth state
6. `client/src/api/auth.js` - All API calls

### Common Modification Points
- **Add new API endpoint**: Create controller → Add route → Update client API
- **Modify user fields**: Update `user.js` schema → Update controllers → Update frontend forms
- **Change matching logic**: Edit `matchController.js` aggregation pipelines
- **Modify scheduling**: Edit `scheduleController.js` and `reminderService.js`

### Timezone Handling
- All times stored in UTC in database
- Availability slots store both original (user local) and UTC times
- Conversion happens on save (`updateUserProfile`, `setAvailability`)
- Email reminders convert back to user's timezone for display

---

## 📄 License

ISC License
