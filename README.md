# SkillSwap

Live URL: http://skill-swap.social/

Jitsi Meet URL: https://skillswap-meeting.social/

A peer-to-peer skill exchange platform where users trade skills instead of money. User A teaches User B something they know; User B teaches User A something they know. The platform handles matching, scheduling, meeting rooms, and reminders.

---

## How It Works

1. Users register and set their **skills they have** and **skills they want**, plus weekly availability
2. The **matching system** finds other users with mutual or partial skill overlap
3. User A sends a **swap request** selecting a skill pair and time slots from User B's availability
4. User B accepts → a **Session** is created with UTC-stored time slots
5. Both users receive **email reminders** 5 minutes before each session
6. At scheduled time, a **Jitsi meeting room** opens at `/meeting/:sessionId/:slotIndex`
7. Sessions auto-expire via a **BullMQ job** when all scheduled slots have passed

---

## Architecture

```
client/ (React + Vite)
    │
    ├── Axios → server/ (Express)
    │               ├── MongoDB Atlas (users, sessions, messages)
    │               ├── Redis (skill autocomplete cache, search cache, BullMQ)
    │               └── External APIs:
    │                     Lightcast Skills API  (skill autocomplete & categorization)
    │                     Google OAuth          (authentication)
    │                     Zoho Mail             (email verification & session reminders)
    │                     Cloudinary            (profile image uploads)
    │                     Jitsi Meet            (meeting rooms, client-side only)
    └──
```

Docker Compose runs three services: `api` (Express on :5000), `frontend` (Vite dev server on :5173), `redis` (:6379). MongoDB stays external on Atlas.

---

## Project Structure

Only the files that matter for understanding the code:

### Server

```
server/
├── server.js                   # Entry point: MongoDB connect, starts Express,
│                               # initializes session reminders + BullMQ worker
├── app.js                      # Express setup: CORS, middleware, route mounting
│
├── models/
│   ├── User.js                 # Core schema. Includes skillsHave/skillsWant
│   │                           # (with Lightcast category), availability slots
│   │                           # (stored with both original timezone + UTC),
│   │                           # swapRequests + requestsSent subdocuments,
│   │                           # JWT + Google auth fields, email verification
│   ├── Session.js              # Session schema. scheduledTime is UTC strings
│   │                           # ("Monday 14:00-15:00"). Has isMeetingAccessible()
│   │                           # and getNextSlotOccurrence() instance methods
│   │                           # for time-based meeting room access control
│   ├── Refreshtoken.js         # Stores refresh token UUIDs with userId + expiry
│   ├── Message.js              # Chat message: sender, text, timestamp
│   └── Chat.js                 # Chat room: array of users + messages
│
├── controllers/
│   ├── authController.js       # Register (email verify flow), login, Google OAuth,
│   │                           # refresh token, logout, change password
│   ├── userController.js       # Profile CRUD, availability (local→UTC conversion),
│   │                           # swap request send/get/reject, getUserById,
│   │                           # getUserImage, match endpoints delegate to matchController
│   ├── matchController.js      # Three match types via MongoDB aggregation:
│   │                           # getSkillMatches (mutual), getPartialSkillMatches
│   │                           # (one-way), getCategorySkillMatches (category-level)
│   ├── scheduleController.js   # createSession: reads UTC slots from request's
│   │                           # stored availability lookup, schedules reminders
│   │                           # and BullMQ expiry job. getUserSessions.
│   ├── meetingController.js    # getMeetingAccess: validates user is participant,
│   │                           # session is active, calls isMeetingAccessible(),
│   │                           # returns Jitsi config. validateMeetingAccess (lightweight check).
│   ├── searchController.js     # Search by skill name, category, or user name.
│   │                           # Results cached in Redis (5–10 min TTL)
│   ├── skillfinderController.js# Proxies Lightcast autocomplete. Called on skill search input.
│   ├── skillController.js      # setSkills (legacy, skills now saved via updateUserProfile)
│   └── chatController.js       # sendMessage, getConversation (polling, not WebSocket)
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js           # All /api/users/* — profile, availability,
│   │                           # swap requests, sessions, matches, meeting
│   ├── skillRoutes.js          # /api/skills/set + /api/skills/find (Lightcast autocomplete)
│   ├── searchRoutes.js         # /api/search/skill|category|name
│   ├── chatRoutes.js
│   └── matchRoutes.js          # Standalone match route (not mounted in app.js;
│                               # match endpoints are on /api/users via userRoutes)
│
├── middleware/
│   └── authMiddleware.js       # verifyToken: extracts Bearer JWT, attaches req.userId
│
└── services/
    ├── lightcast.js            # Lightcast Skills API client. Two functions:
    │                           # autocompleteSkills (search, 1hr Redis cache),
    │                           # fetchSkill (get subcategory by ID, 24hr cache)
    ├── emailService.js         # Nodemailer + Zoho. sendVerificationEmail,
    │                           # sendSessionReminderEmail (with UTC→user-timezone conversion)
    ├── reminderService.js      # node-cron-based reminders. Schedules a cron job per
    │                           # UTC time slot, 5 min before each session slot.
    │                           # activeReminders Map tracks jobs for cleanup.
    │                           # initializeAllReminders runs on server start.
    ├── sessionQueue.js         # BullMQ queue ('session-expiry'). scheduleSessionExpiry
    │                           # adds a delayed job; worker marks session 'completed'
    │                           # and clears its reminders on fire.
    ├── sessionsService.js      # getLastSlotDate: calculates session expiry date
    │                           # from UTC time slots + duration (weeks)
    └── redisClient.js          # ioredis client. Connects to REDIS_HOST env var.
```

**Not worth looking at:** `server/services/cron.js` (commented out in app.js, superseded by BullMQ), `server/test-week-handling.js` (one-off test script), `server/scripts/clearDatabase.js` (dev utility for wiping data).

### Client

```
client/src/
├── main.jsx                    # Entry point: wraps App in Redux Provider
├── App.jsx                     # BrowserRouter + AuthProvider + routes.
│                               # Public routes: /, /login, /register, /search, /verify-email
│                               # Protected routes (PrivateRoute + Layout): dashboard,
│                               # profile, swap-requests, active-requests, meeting
│
├── api/
│   ├── axios.js                # Axios instance. baseURL = VITE_API_URL. withCredentials
│   │                           # for HTTP-only refresh token cookie.
│   └── auth.js                 # All API calls: auth, user, skills, matches,
│                               # swap requests, sessions, search, meeting access.
│                               # sendSwapRequest sends selectedAvailabilityIds (slot IDs)
│                               # rather than raw times; backend resolves to UTC.
│
├── context/
│   └── AuthContext.jsx         # On mount, tries POST /auth/refresh-token to restore
│                               # session from cookie. Stores accessToken + userId in memory.
│
├── store/
│   ├── configureStore.jsx      # Redux store with 5 slices
│   ├── animationSlice.jsx      # Landing page icon animation: shared iconIndices [left, right],
│   │                           # prepareSwap/clearSwapCommunication for the swap sequence
│   ├── circleAnimationSlice.jsx# Circle intersection animation on landing page section 2:
│   │                           # phase state machine (idle→moving→intersected→letterAnimation
│   │                           # →fading→completed), lettersVisible counter, showContent flag
│   ├── lockSlice.jsx           # SwapCard skill animation lock: only one card animates at a
│   │                           # time via activeCardId + requestQueue
│   ├── popupSlice.jsx          # Controls WeekBar (availability editor) popup visibility
│   └── sidebarSlice.jsx        # Controls mobile sidebar open/close state (used by Nav
│                               # to change background color when sidebar is open)
│
├── animations/
│   ├── animationstroke.jsx     # GSAP SVG stroke animation between the two circles on
│   │                           # landing page. On complete, dispatches setIconAnimationActive.
│   └── iconAnimation.jsx       # FontAwesome icon swap animation inside the circles.
│                               # LEFT component controls the full sequence (pop out → swap
│                               # in Redux → pop in → swipe out → new random icons → swipe in).
│                               # RIGHT component only renders; never controls timing.
│
├── components/
│   ├── LandingPage.jsx         # Two-section landing. Section 1: hero with icon animation.
│   │                           # Section 2: CircleIntersectionAnimation + content that fades
│   │                           # in after circles disappear + TestUserLogin button
│   ├── CircleIntersectionAnimation.jsx  # Canvas animation: two circles move inward to 20%
│   │                           # intersection (computed via lens formula), SKILLSWAP letters
│   │                           # appear in intersection, then everything pops out to reveal
│   │                           # page content. Uses IntersectionObserver to trigger on scroll.
│   ├── LoginForm.jsx           # Email/password login + GoogleAuthButton
│   ├── SignupForm.jsx          # Registration + Google OAuth. Shows "check email" message
│   │                           # instead of redirecting (email verification required)
│   ├── EmailVerification.jsx   # Reads ?token= param, calls verifyEmail, redirects to /login
│   ├── TestUserLogin.jsx       # One-click login using VITE_TEST_USER_EMAIL/PASSWORD env vars
│   ├── GoogleAuthButton.jsx    # Loads Google GSI script, renders Google button,
│   │                           # calls /auth/google on response
│   ├── Dashboard.jsx           # Fetches all 3 match types in parallel. Shows them in
│   │                           # horizontal-scroll carousels (3 SwapCard rows)
│   ├── SwapCard.jsx            # Individual match card. Animates skills via lockSlice
│   │                           # (only one card animates at a time). Opens SwapRequest on click.
│   ├── SwapRequest.jsx         # Popup for sending a swap request. Shows target user's
│   │                           # availability in viewer's timezone (UTC→local conversion).
│   │                           # Sends selectedAvailabilityIds (real slot IDs, not times).
│   ├── ProfileUpdate.jsx       # Profile edit: image upload (Cloudinary), skill search
│   │                           # (Lightcast via SkillSearch), availability via WeekBar popup
│   ├── ProfilePage.jsx         # View another user's profile. Has "Request Swap" button
│   │                           # that opens SwapRequest with their data
│   ├── RequestsPage.jsx        # Received/sent swap requests. Accept creates a Session.
│   ├── RequestCard.jsx         # Individual swap request card. Accept calls createSession,
│   │                           # reject calls rejectSwapRequest. Converts UTC slots to local.
│   ├── SessionsPage.jsx        # Active/completed sessions list. Active ones show
│   │                           # "Join Session" link when meeting is currently ongoing.
│   ├── SessionCard.jsx         # Individual session card. Calls isMeetingOngoing() to
│   │                           # conditionally show join link.
│   ├── MeetingRoom.jsx         # Calls getMeetingAccess, loads Jitsi external API script,
│   │                           # creates Jitsi room with config from backend response.
│   │                           # Navigates to /active-requests on call end.
│   ├── SearchPage.jsx          # Reads ?type=&query= from URL, calls appropriate search
│   │                           # endpoint, renders SearchResultCard list
│   ├── SearchResultCard.jsx    # User card in search results. Horizontal-scroll skills
│   │                           # on desktop, wrapping on mobile. Navigates to ProfilePage.
│   ├── Nav.jsx                 # Sticky nav: SearchBar (desktop only), Logo, UserProfile
│   ├── Sidebar.jsx             # Slide-in sidebar for mobile + always-visible on desktop.
│   │                           # Dispatches sidebarSlice actions to coordinate Nav color change.
│   ├── SearchBar.jsx           # Expand-on-hover search bar with skill/category/name type toggle.
│   │                           # Navigates to /search?type=&query= on submit.
│   ├── WeekBar.jsx             # Availability editor. Select day → add time slots.
│   │                           # Changes are held in ProfileUpdate state until "Save Profile".
│   ├── SkillSelection.jsx      # Debounced Lightcast autocomplete input with selected tags.
│   │                           # 150ms debounce, min 3 chars to search.
│   ├── ImageUploader.jsx       # File picker → Cloudinary upload → returns URL.
│   │                           # Max 5MB, images only.
│   ├── Layout.jsx              # Wraps protected pages with Footer
│   ├── Footer.jsx              # Footer with nav links + logout button
│   ├── Logo.jsx                # SKILL SWAP text link, routes to dashboard if logged in
│   ├── UserProfile.jsx         # Nav avatar — fetches user image, navigates to /profile
│   ├── PrivateRoute.jsx        # Redirects to /login if no accessToken in context
│   └── Info.jsx                # Name/bio/contact form fields (used inside ProfileUpdate)
│
└── utils/
    ├── timeUtils.js            # convertTimeSlotToLocal: UTC "Monday 14:00-15:00" → user's
    │                           # timezone using moment-timezone. isMeetingOngoing: checks if
    │                           # current time is within ±5min of a UTC slot (used in SessionCard).
    └── cloudinary.js           # uploadToCloudinary: multipart POST to Cloudinary API.
                                # Uses VITE_CLOUDINARY_CLOUD_NAME + hardcoded preset 'skillswap-users'.
```

**Not worth looking at:** `client/src/components/functionalSessions.jsx` (unused alternate SessionsPage, not imported anywhere), `client/src/components/Availablility.jsx` (empty file), `client/src/calculation.txt` (internal math notes for the circle animation), `client/src/App.css` (Vite boilerplate, unused), `client/src/lib/utils.js` (trivial shadcn cn helper).

**Internal dev docs not relevant to the codebase:** `ANIMATION_FIXES_EXPLANATION.md` (documents a past bug fix), `DEPLOYMENT_ORACLE_CLOUD.md` (Oracle Cloud deployment guide, superseded by `render.yaml`).

---

## Key Design Decisions

**Timezone handling — all times stored in UTC**
Availability slots store both the original (user's local day/time + their timezone) and the converted UTC fields. When User A browses User B's availability in SwapRequest.jsx, the frontend converts UTC→viewer's local timezone using moment-timezone. When a session is created, `scheduleController.js` reads the UTC times directly from the stored availability slots — no client-submitted times are trusted.

**Swap request slot ID approach**
Instead of sending time strings in the swap request, the frontend sends `selectedAvailabilityIds` (the slot's `id` field from User B's availability). The backend (`sendSwapRequest` in userController.js) looks up the actual UTC times from the database. This ensures the stored request always reflects the canonical UTC time from the availability record.

**Left-controls-right animation pattern**
In `iconAnimation.jsx`, only the LEFT component ever runs the animation sequence and dispatches Redux actions. The RIGHT component only reads state and renders. This prevents duplicate sequences and race conditions. GSAP targets `.icon-animation` CSS class to animate both simultaneously.

**BullMQ + cron dual system**
Sessions get two expiry/reminder mechanisms: node-cron jobs (in `reminderService.js`) fire 5 minutes before each time slot to send emails; a BullMQ delayed job (in `sessionQueue.js`) marks the session `completed` when `expiresAt` is reached. `server/services/cron.js` is an older cron-based expiry approach that was commented out in `app.js` when BullMQ was introduced.

**`matchRoutes.js` is not mounted**
`server/routes/matchRoutes.js` exists but is not imported in `app.js`. The match endpoints (`/api/users/matches`, `/partial-matches`, `/category-matches`) are registered in `userRoutes.js` instead.

---

## Routes

### Auth (`/api/auth`)
| Method | Path | Description |
|---|---|---|
| POST | `/register` | Register; sends verification email; returns `requiresVerification: true` |
| POST | `/login` | Email/password login; blocks unverified non-Google users |
| POST | `/google` | Google OAuth — creates or updates user, returns tokens |
| POST | `/refresh-token` | Exchange HTTP-only refresh cookie for new access token |
| POST | `/logout` | Delete refresh token from DB, clear cookie |
| GET | `/verify-email?token=` | Verify email address from link |
| PUT | `/change-password` | Protected; requires current password |

### Users (`/api/users`)
| Method | Path | Description |
|---|---|---|
| GET | `/profile/:id` | Own profile only (403 if not self) |
| PUT | `/profile/:id` | Update profile; converts availability to UTC; enriches skills with Lightcast category |
| POST | `/availability` | Set availability standalone (also supported via profile update) |
| POST | `/swap-request` | Send swap request using `selectedAvailabilityIds`; resolves UTC from DB |
| GET | `/swap-requests` | Get received + sent requests (populated) |
| POST | `/swap-requests/:id/reject` | Reject a received request |
| POST | `/create-session` | Accept request; creates Session; schedules reminders + BullMQ expiry |
| GET | `/sessions` | Get user's sessions (populated with userA/B names) |
| GET | `/matches` | Mutual skill matches |
| GET | `/partial-matches` | One-directional matches |
| GET | `/category-matches` | Category-level matches |
| GET | `/meeting/:sessionId/:slotIndex` | Get Jitsi config (validates time window) |
| GET | `/meeting/:sessionId/:slotIndex/validate` | Lightweight access check |
| GET | `/profile/show/:id` | View any user's profile (protected) |
| GET | `/all` | All users (name + imageUrl only, unprotected) |
| GET | `/:id/image` | Profile image URL (unprotected) |

### Skills (`/api/skills`)
| Method | Path | Description |
|---|---|---|
| POST | `/set` | Set skills (legacy) |
| GET | `/find?query=` | Lightcast skill autocomplete (min 3 chars) |

### Search (`/api/search`) — unprotected
| Method | Path | Description |
|---|---|---|
| GET | `/skill/:skillName` | Users who have a matching skill (Redis-cached 10 min) |
| GET | `/category/:category` | Users in matching skill category (Redis-cached 10 min) |
| GET | `/name/:name` | Users by name (Redis-cached 5 min) |

### Chat (`/api/chat`)
| Method | Path | Description |
|---|---|---|
| POST | `/send` | Send a message |
| GET | `/conversation/:otherUserId` | Get message history |

---

## Data Models

### User (key fields)
```javascript
skillsHave: [{ name, id, category }]   // category enriched from Lightcast
skillsWant: [{ name, id, category }]
categoriesHave/Want: [String]          // for category-level matching

availability: [{
  id: String,                          // used as stable reference in swap requests
  originalDay/StartTime/EndTime,       // user's local time (display)
  utcDay/StartTime/EndTime,            // UTC (stored, used for session creation)
  userTimezone: String
}]

swapRequests: [{ from, to, offerSkill, wantSkill, days,
  timeSlots: [String],                 // UTC time strings (resolved from availability)
  selectedAvailabilityIds: [String],   // original slot IDs for traceability
  status: 'pending'|'accepted'|'rejected' }]
```

### Session (key fields)
```javascript
userA, userB: ObjectId refs
skillFromA, skillFromB: Mixed          // skill objects
scheduledTime: [String]                // UTC: "Monday 14:00-15:00"
duration: Number                       // in weeks
expiresAt: Date                        // computed from last slot + duration
status: 'active'|'completed'|'cancelled'|'expired'
```

---

## Environment Variables

### Server (`server/.env`)
```env
MONGO_URI=mongodb+srv://...
ACCESS_TOKEN_SECRET=
JWT_SECRET=
JWT_REFRESH_SECRET=
REFRESH_TOKEN_EXPIRY_DAYS=7
GOOGLE_CLIENT_ID=
LIGHTCAST_CLIENT_ID=
LIGHTCAST_CLIENT_SECRET=
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
SENDER_NAME=SkillSwap
SENDER_EMAIL=
REDIS_HOST=redis        # 'redis' in Docker, 'localhost' locally
REDIS_PORT=6379
REDIS_URL=redis://redis:6379
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_TEST_USER_EMAIL=     # credentials for the landing page test login button
VITE_TEST_USER_PASSWORD=
```

---

## Getting Started

**Prerequisites:** Node.js 22, Docker + Docker Compose, MongoDB Atlas account

```bash
# 1. Clone and enter
git clone <repo-url> && cd skillswap

# 2. Create server/.env with the variables above

# 3. In Cloudinary: create an upload preset named 'skillswap-users'

# 4. Start everything
docker compose up --build

# Frontend → http://localhost:5173
# API      → http://localhost:5000
```

**Without Docker:**
```bash
# Terminal 1
redis-server

# Terminal 2
cd server && npm install && npm run dev

# Terminal 3
cd client && npm install && npm run dev
```

**Reset database (dev only):**
```bash
cd server && npm run clear:all
```

---

## Deployment

The repo includes `render.yaml` for Render.com (two services: static frontend + Node backend). For Docker-based deployment to a VM, see `DEPLOYMENT_ORACLE_CLOUD.md` in the repo root.

---

## Known Issues

- Chat (`/api/chat`) is polling-based, not real-time (no WebSocket)
- `MeetingRoom.jsx` uses the public Jitsi Meet instance (`skillswap-meeting.social`) — no private server configured
- `server/routes/matchRoutes.js` exists but is not mounted in `app.js`; match routes live in `userRoutes.js`
- `client/src/components/Availablility.jsx` is an empty file
