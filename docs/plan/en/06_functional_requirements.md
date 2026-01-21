# WKU Software Crew Project - Functional Requirements Specification

## 1. Document Overview

### 1.1 Purpose
This document specifies the functional requirements for the WKU Software Crew platform, detailing what the system must do to meet user needs and business objectives.

### 1.2 Scope
Covers all functional requirements for:
- Learning Management System (LMS)
- Cloud IDE
- Deployment System
- Community & Social Features
- Mentoring System
- Startup Incubation Features

### 1.3 Audience
- Product Managers
- Engineers (Frontend, Backend, DevOps)
- QA Team
- Designers
- Stakeholders

---

## 2. Requirements Overview

### 2.1 Feature Priorities

| Priority | Description | Examples |
|----------|-------------|----------|
| **P0** | Must-have for MVP launch | Authentication, Basic LMS, Cloud IDE |
| **P1** | Important for complete user experience | Real-time collaboration, Deployment |
| **P2** | Nice-to-have, enhances platform | AI assistant, Advanced analytics |
| **P3** | Future enhancements | Mobile app, VR learning |

### 2.2 Requirements Summary

| Module | P0 | P1 | P2 | P3 | Total |
|--------|----|----|----|----|-------|
| **Authentication & User Management** | 8 | 3 | 2 | 1 | 14 |
| **Learning Management System** | 12 | 8 | 5 | 3 | 28 |
| **Cloud IDE** | 10 | 7 | 6 | 4 | 27 |
| **Deployment System** | 6 | 5 | 4 | 2 | 17 |
| **Community & Social** | 7 | 6 | 4 | 3 | 20 |
| **Mentoring System** | 3 | 5 | 3 | 2 | 13 |
| **Startup Resources** | 2 | 4 | 3 | 3 | 12 |
| **Admin & Analytics** | 5 | 5 | 5 | 2 | 17 |
| **Total** | **53** | **43** | **32** | **20** | **148** |

---

## 3. FR-1: Authentication & User Management

### FR-1.1: User Registration [P0]

**Description**: New users can create an account to access the platform.

**User Story**:
> As a **new student**, I want to **create an account with my university email**, so that **I can start learning on the platform**.

**Acceptance Criteria**:
- [x] User can sign up with email and password
- [x] Password must be 8+ characters with 1 uppercase, 1 number
- [x] Email verification sent within 1 minute
- [x] University email (.edu domain) recognized and verified
- [x] User directed to onboarding flow after signup
- [x] Error messages clear and actionable
- [x] CAPTCHA to prevent bot signups
- [x] GDPR-compliant consent checkboxes

**UI Requirements**:
- Clean signup form (3 fields: name, email, password)
- Real-time password strength indicator
- Progress indicator (Step 1 of 3)
- Mobile responsive

**API Endpoints**:
```
POST /api/auth/register
Body: { name, email, password, agreedToTerms }
Response: { userId, emailSent: true }
```

**Edge Cases**:
- Email already registered → "Email already in use. Login?"
- Invalid email domain → "Please use university email"
- Network error → Retry logic with exponential backoff

---

### FR-1.2: User Login [P0]

**Description**: Registered users can log into their accounts.

**User Story**:
> As a **returning user**, I want to **log in with my email and password**, so that **I can access my account and continue learning**.

**Acceptance Criteria**:
- [x] Login with email and password
- [x] "Remember me" option (30-day session)
- [x] Incorrect credentials show generic error (security)
- [x] Account locked after 5 failed attempts (15-min lockout)
- [x] Redirect to last visited page after login
- [x] Loading state during authentication

**API Endpoints**:
```
POST /api/auth/login
Body: { email, password, rememberMe }
Response: { accessToken, refreshToken, user: {...} }
```

---

### FR-1.3: Social Authentication [P1]

**Description**: Users can sign up/login with social providers.

**Supported Providers**:
- [x] Google OAuth 2.0
- [x] GitHub OAuth
- [ ] Kakao Login (P2)
- [ ] Naver Login (P2)

**User Story**:
> As a **new user**, I want to **sign up with my Google account**, so that **I don't have to remember another password**.

**Acceptance Criteria**:
- [x] "Continue with Google" button prominent
- [x] OAuth flow completes without manual input
- [x] User profile auto-populated from provider
- [x] Link social account to existing email if match

---

### FR-1.4: Password Reset [P0]

**Description**: Users can reset their password if forgotten.

**User Story**:
> As a **user who forgot my password**, I want to **reset it via email**, so that **I can regain access to my account**.

**Acceptance Criteria**:
- [x] "Forgot password?" link on login page
- [x] Reset email sent within 2 minutes
- [x] Reset link valid for 1 hour
- [x] New password requirements enforced
- [x] Confirmation email after password change

---

### FR-1.5: User Profile Management [P0]

**Description**: Users can view and edit their profile information.

**Editable Fields**:
- Name, profile photo, bio
- University, major, graduation year
- Skills (tags)
- Social links (GitHub, LinkedIn, portfolio)
- Privacy settings

**User Story**:
> As a **user**, I want to **update my profile with my skills and projects**, so that **others in the community can see my background**.

**Acceptance Criteria**:
- [x] Profile page shows all user information
- [x] Edit mode with inline editing
- [x] Profile photo upload (max 5MB, JPG/PNG)
- [x] Auto-save draft changes
- [x] Preview before publishing
- [x] Unique username (used in URLs)

---

## 4. FR-2: Learning Management System (LMS)

### FR-2.1: Course Catalog [P0]

**Description**: Users can browse available courses organized by categories.

**User Story**:
> As a **student**, I want to **browse courses by topic**, so that **I can find content relevant to my learning goals**.

**Acceptance Criteria**:
- [x] Grid view of all courses
- [x] Filter by: Category, Level (Junior/Senior/Master), Duration
- [x] Sort by: Popularity, Recent, Rating
- [x] Search by keyword
- [x] Course card shows: Title, Thumbnail, Duration, Level, Rating
- [x] "Enrolled" badge if user is taking course
- [x] Pagination (20 courses per page)

**Categories**:
- Web Development
- Python Programming
- Data Structures & Algorithms
- Databases
- DevOps & Cloud
- Mobile Development
- AI & Machine Learning
- Cybersecurity
- Game Development
- Startup Fundamentals

---

### FR-2.2: Course Details Page [P0]

**Description**: Users can view detailed information about a course.

**User Story**:
> As a **prospective student**, I want to **see what a course covers**, so that **I can decide if it's right for me**.

**Content**:
- Course description and learning outcomes
- Instructor bio and rating
- Syllabus (chapters and lessons)
- Prerequisites
- Estimated time to complete
- Student reviews and ratings
- Similar courses recommendations

**Acceptance Criteria**:
- [x] "Enroll Now" CTA prominent
- [x] Video preview (first lesson sample)
- [x] Syllabus expandable/collapsible
- [x] Social proof (X students enrolled)
- [x] FAQ section
- [x] Share course button (social media)

---

### FR-2.3: Course Enrollment [P0]

**Description**: Users can enroll in courses to start learning.

**User Story**:
> As a **student**, I want to **enroll in a course**, so that **I can access lessons and track my progress**.

**Acceptance Criteria**:
- [x] One-click enrollment for free courses
- [x] Enrollment confirmation message
- [x] Course added to "My Courses" dashboard
- [x] Welcome email sent with first lesson link
- [x] Access control: Free tier courses for all, Premium for subscribers

**API Endpoints**:
```
POST /api/courses/{courseId}/enroll
Response: { enrolled: true, nextLesson: {...} }
```

---

### FR-2.4: Video Player [P0]

**Description**: Users can watch video lectures with playback controls.

**User Story**:
> As a **student**, I want to **watch video lessons with controls**, so that **I can learn at my own pace**.

**Features**:
- [x] Play, pause, seek
- [x] Playback speed (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
- [x] Fullscreen mode
- [x] Volume control
- [x] Subtitles (Korean, English)
- [x] Picture-in-picture mode
- [x] Keyboard shortcuts (Space: play/pause, ←→: skip 5s, ↑↓: volume)
- [x] Auto-play next lesson

**Progress Tracking**:
- Video marked complete when 90% watched
- Resume from last position
- Progress bar shows watched portions

**Quality Settings**:
- 360p, 480p, 720p, 1080p
- Auto quality based on connection speed

---

### FR-2.5: Interactive Quizzes [P0]

**Description**: Lessons include quizzes to test understanding.

**Question Types**:
- Multiple choice
- Multiple select
- True/False
- Fill in the blank
- Code snippet (what's the output?)

**User Story**:
> As a **student**, I want to **take quizzes after lessons**, so that **I can verify my understanding**.

**Acceptance Criteria**:
- [x] Quiz appears after video lesson
- [x] Immediate feedback (correct/incorrect)
- [x] Explanation for each answer
- [x] Score displayed (e.g., 8/10)
- [x] Must pass (70%) to proceed
- [x] Unlimited retries
- [x] Time spent tracked

---

### FR-2.6: Coding Exercises [P0]

**Description**: Hands-on coding challenges within lessons.

**User Story**:
> As a **student**, I want to **practice coding in the browser**, so that **I can apply what I learned immediately**.

**Acceptance Criteria**:
- [x] Embedded code editor (Monaco)
- [x] Problem description and examples
- [x] Test cases (some visible, some hidden)
- [x] Run code and see output
- [x] Submit for auto-grading
- [x] Hints available (reveal progressively)
- [x] Solution revealed after 3 attempts or request

**Supported Languages**:
- JavaScript, Python, Java, C++, SQL

**Feedback**:
- Test cases pass/fail
- Execution time and memory usage
- Code quality suggestions (linting)

---

### FR-2.7: Progress Tracking [P0]

**Description**: Users can see their learning progress across courses.

**User Story**:
> As a **student**, I want to **see my learning progress**, so that **I stay motivated and know what to do next**.

**Dashboard Metrics**:
- Courses in progress (% complete)
- Courses completed
- Total learning time (this week, all time)
- Current streak (consecutive days)
- XP/Points earned
- Badges/Achievements unlocked
- Next lesson recommendation

**Visual Elements**:
- Progress bars
- Streak calendar (GitHub-style)
- Achievement badges
- Level indicator

---

### FR-2.8: Certificates [P1]

**Description**: Users receive certificates upon course completion.

**User Story**:
> As a **student**, I want to **earn a certificate for completing a course**, so that **I can showcase my skills to employers**.

**Acceptance Criteria**:
- [x] Certificate auto-generated on course completion
- [x] Includes: Student name, Course name, Completion date, Certificate ID
- [x] Downloadable as PDF
- [x] Shareable link (LinkedIn, portfolio)
- [x] Verifiable via certificate ID lookup
- [x] Digital signature to prevent forgery

**Design**:
- Professional layout
- WKU Software Crew branding
- Instructor signature

---

### FR-2.9: Learning Paths [P1]

**Description**: Curated sequences of courses for specific goals.

**Example Paths**:
- "Full-Stack Web Developer" (10 courses, 6 months)
- "Data Scientist" (8 courses, 5 months)
- "DevOps Engineer" (6 courses, 4 months)
- "Mobile App Developer" (7 courses, 5 months)
- "Startup Founder" (Master Class, 12 months)

**User Story**:
> As a **beginner**, I want to **follow a structured learning path**, so that **I don't have to guess what to learn next**.

**Acceptance Criteria**:
- [x] Browse learning paths
- [x] Enroll in path (enrolls in all courses)
- [x] Path progress dashboard
- [x] Recommended next course highlighted
- [x] Estimated completion time
- [x] Path certificate upon completion

---

## 5. FR-3: Cloud IDE

### FR-3.1: Code Editor [P0]

**Description**: Browser-based code editor for writing and editing code.

**User Story**:
> As a **developer**, I want to **write code in my browser**, so that **I don't need to install local tools**.

**Features**:
- [x] Syntax highlighting (20+ languages)
- [x] Auto-completion / IntelliSense
- [x] Code formatting (Prettier)
- [x] Linting (ESLint, Pylint)
- [x] Error/warning indicators
- [x] Find and replace
- [x] Multi-cursor editing
- [x] Code folding
- [x] Minimap
- [x] Keyboard shortcuts (VS Code compatible)

**Supported Languages**:
- JavaScript, TypeScript, Python, Java, C++, HTML, CSS, SQL, Ruby, Go, Rust, PHP, etc.

**Themes**:
- Light, Dark, High Contrast
- VS Code themes compatible

---

### FR-3.2: File Explorer [P0]

**Description**: File tree for navigating and managing project files.

**User Story**:
> As a **developer**, I want to **navigate my project files**, so that **I can organize and edit them**.

**Features**:
- [x] Tree view of files and folders
- [x] Create, rename, delete files/folders
- [x] Drag-and-drop to move files
- [x] Right-click context menu
- [x] File search (Cmd+P / Ctrl+P)
- [x] File icons by type
- [x] Expand/collapse folders
- [x] Sort by name, date modified

**Acceptance Criteria**:
- [x] Shows .gitignore respecting hidden files
- [x] Max 1000 files per project (free tier)
- [x] Max 10,000 files (Pro tier)

---

### FR-3.3: Integrated Terminal [P0]

**Description**: Command-line terminal within the IDE.

**User Story**:
> As a **developer**, I want to **run commands in a terminal**, so that **I can execute scripts and use CLI tools**.

**Features**:
- [x] Bash/Zsh shell
- [x] Multiple terminal tabs
- [x] Split terminal view
- [x] Command history (up/down arrows)
- [x] Copy/paste support
- [x] Customizable font size
- [x] Terminal themes

**Available Tools**:
- Node.js, npm, yarn
- Python, pip
- Git
- curl, wget
- Database clients (psql, mongosh)

**Limitations**:
- 10-minute max execution time (free)
- 30-minute max (Premium)
- Unlimited (Pro)

---

### FR-3.4: Real-time Collaboration [P1]

**Description**: Multiple users can edit the same file simultaneously.

**User Story**:
> As a **student working on a team project**, I want to **code with teammates in real-time**, so that **we can collaborate effectively**.

**Features**:
- [x] Live cursors (see where teammates are editing)
- [x] Color-coded by user
- [x] User presence indicators
- [x] Chat sidebar
- [x] Follow mode (follow teammate's cursor)
- [x] Conflict-free (CRDT via Y.js)

**Acceptance Criteria**:
- [x] Changes synced within 100ms
- [x] Max 10 concurrent users per project
- [x] Presence shown in user list
- [x] Offline changes synced when reconnected

---

### FR-3.5: Git Integration [P1]

**Description**: Version control features within the IDE.

**User Story**:
> As a **developer**, I want to **use Git without leaving the IDE**, so that **I can manage version control efficiently**.

**Features**:
- [x] Git status (modified, staged, untracked files)
- [x] Commit with message
- [x] Push, pull, fetch
- [x] Branch management (create, switch, delete)
- [x] Merge conflicts resolution UI
- [x] Commit history view
- [x] Diff view (side-by-side)
- [x] Clone repository

**UI**:
- Source control sidebar
- Visual indicators (file colors: red, yellow, green)
- Commit input field
- Branch dropdown

---

### FR-3.6: Debugging [P2]

**Description**: Interactive debugging with breakpoints and inspection.

**Supported**: JavaScript/Node.js, Python

**Features**:
- [ ] Set breakpoints (click line number)
- [ ] Step over, step into, step out
- [ ] Variable inspection
- [ ] Watch expressions
- [ ] Call stack view
- [ ] Console output

**User Story**:
> As a **developer**, I want to **debug my code with breakpoints**, so that **I can find and fix bugs efficiently**.

---

### FR-3.7: Live Preview [P1]

**Description**: Real-time preview of web applications.

**User Story**:
> As a **web developer**, I want to **see live updates as I code**, so that **I can see changes immediately without refreshing**.

**Features**:
- [x] Hot reload (changes appear instantly)
- [x] Split screen (code + preview)
- [x] Responsive preview (mobile, tablet, desktop)
- [x] Device frame emulation
- [x] Console log forwarding
- [x] Network inspector

**Supported**:
- HTML/CSS/JavaScript
- React, Vue, Angular
- Static site generators (Next.js, Gatsby)

---

## 6. FR-4: Deployment System

### FR-4.1: One-Click Deployment [P0]

**Description**: Deploy projects to production with one click.

**User Story**:
> As a **developer**, I want to **deploy my project with one click**, so that **I can share it with the world without DevOps knowledge**.

**Acceptance Criteria**:
- [x] "Deploy" button in IDE
- [x] Auto-detect project type (Next.js, React, Node.js, Python, etc.)
- [x] Build process runs automatically
- [x] Deployment completes within 5 minutes
- [x] Live URL provided (e.g., https://project-name.wkucrew.com)
- [x] HTTPS enabled by default
- [x] Deployment logs visible

**Supported Project Types**:
- Static sites (HTML/CSS/JS)
- React (Create React App, Vite)
- Next.js (SSR/SSG)
- Node.js (Express, NestJS)
- Python (Flask, FastAPI, Django)

---

### FR-4.2: Custom Domains [P1]

**Description**: Use custom domain names for deployed projects.

**User Story**:
> As a **Pro user**, I want to **use my own domain name**, so that **my project looks professional**.

**Acceptance Criteria**:
- [x] Add custom domain in project settings
- [x] DNS configuration instructions provided
- [x] SSL certificate auto-provisioned (Let's Encrypt)
- [x] Domain verification via DNS or file upload
- [x] Domain works within 24 hours (DNS propagation)

**Limitations**:
- Free: wkucrew.com subdomain only
- Premium: 1 custom domain per project
- Pro: Unlimited custom domains

---

### FR-4.3: Environment Variables [P1]

**Description**: Securely manage environment variables for deployments.

**User Story**:
> As a **developer**, I want to **set environment variables**, so that **I can configure my app without hardcoding secrets**.

**Features**:
- [x] Add/edit/delete environment variables
- [x] Variables encrypted at rest
- [x] Separate variables for development/production
- [x] Auto-suggest common variables (PORT, DB_URL, etc.)
- [x] Redeploy on variable change

**Security**:
- Variables never shown in logs
- API keys masked in UI

---

### FR-4.4: Deployment History [P1]

**Description**: View and rollback to previous deployments.

**User Story**:
> As a **developer**, I want to **see deployment history**, so that **I can rollback if something breaks**.

**Features**:
- [x] List of all deployments (timestamp, commit hash, status)
- [x] Deployment logs for each deployment
- [x] Rollback to previous deployment (1-click)
- [x] Compare changes between deployments
- [x] Build time and size

**Acceptance Criteria**:
- [x] Keep last 10 deployments (Free)
- [x] Keep last 50 deployments (Premium)
- [x] Keep unlimited (Pro)

---

### FR-4.5: Preview Deployments [P2]

**Description**: Automatic preview deployments for branches/PRs.

**User Story**:
> As a **developer**, I want to **preview changes before merging**, so that **I can catch issues early**.

**Features**:
- [ ] Auto-deploy every Git branch
- [ ] Unique URL per branch (e.g., https://feature-x.project.wkucrew.com)
- [ ] Comment on PR with preview link
- [ ] Auto-delete preview after branch merge

---

## 7. FR-5: Community & Social Features

### FR-5.1: Q&A Forum [P0]

**Description**: Stack Overflow-style Q&A for students.

**User Story**:
> As a **student stuck on a problem**, I want to **ask a question and get answers**, so that **I can unblock myself**.

**Features**:
- [x] Post question with title, body, tags
- [x] Markdown editor with preview
- [x] Code blocks with syntax highlighting
- [x] Attach images/screenshots
- [x] Answers can be posted by anyone
- [x] Upvote/downvote questions and answers
- [x] Accept best answer (question author)
- [x] Comment on questions/answers
- [x] Search questions
- [x] Filter by tags, status (answered/unanswered)

**Gamification**:
- Earn XP for: asking questions, answering, upvotes received
- Badges: "First Question", "Helpful", "Expert"

**Moderation**:
- Flag inappropriate content
- Moderator review queue

---

### FR-5.2: Study Groups [P1]

**Description**: Students can form study groups to learn together.

**User Story**:
> As a **student**, I want to **join a study group**, so that **I can learn with peers and stay motivated**.

**Features**:
- [x] Browse public study groups
- [x] Create new study group
- [x] Set group name, description, topic, meeting schedule
- [x] Invite members (by email or link)
- [x] Group chat
- [x] Shared workspace (group projects)
- [x] Schedule meetings/sessions
- [x] Max 10 members per group (Free), 30 (Premium)

**Discovery**:
- Recommended groups based on courses enrolled
- Filter by topic, level, meeting time

---

### FR-5.3: Project Showcase [P1]

**Description**: Students can share their projects publicly.

**User Story**:
> As a **student**, I want to **showcase my projects**, so that **I can get feedback and build my portfolio**.

**Project Card**:
- Project name, description
- Screenshot/demo GIF
- Tech stack tags
- Live demo link
- GitHub repository link
- Author profile link
- Likes and views count

**Features**:
- [x] Public project gallery
- [x] Like and comment on projects
- [x] Share on social media
- [x] Filter by tech stack, topic
- [x] Featured projects (curated)

---

### FR-5.4: User Profiles [P0]

**Description**: Public profile pages for students.

**URL**: `https://wkucrew.com/@username`

**Content**:
- Profile photo, bio
- Skills (tags)
- Projects (grid view)
- Courses completed
- Certificates
- GitHub, LinkedIn links
- Community contributions (Q&A stats)
- Member since date

**Privacy**:
- Toggle public/private profile
- Hide specific sections

---

### FR-5.5: Leaderboard [P2]

**Description**: Competitive leaderboard to motivate users.

**User Story**:
> As a **competitive student**, I want to **see how I rank against peers**, so that **I stay motivated to learn more**.

**Leaderboards**:
- Overall (all-time XP)
- This week (weekly XP)
- Course-specific (by course)
- Class-specific (Junior, Senior, Master)

**XP Sources**:
- Complete lessons: 10 XP
- Pass quiz: 5 XP
- Complete course: 100 XP
- Answer question: 15 XP (+ upvotes × 2)
- Login streak bonus: 5 XP/day

**Display**:
- Top 100 users
- User's rank and XP
- Next rank threshold

---

## 8. FR-6: Mentoring System

### FR-6.1: Mentor Matching [P1]

**Description**: Students can be matched with mentors.

**User Story**:
> As a **student**, I want to **get matched with a mentor in my field**, so that **I can get guidance from an experienced professional**.

**Matching Criteria**:
- Student's interests and goals
- Mentor's expertise
- Availability (time zones, schedule)
- Language preference

**Process**:
1. Student fills out mentorship request form
2. Algorithm suggests 3-5 potential mentors
3. Student sends request to mentor
4. Mentor accepts/declines
5. Kickoff meeting scheduled

---

### FR-6.2: 1:1 Mentoring Sessions [P1]

**Description**: Schedule and conduct video mentoring sessions.

**User Story**:
> As a **student**, I want to **have video calls with my mentor**, so that **I can get personalized guidance**.

**Features**:
- [x] Integrated video conferencing (Zoom/Google Meet integration)
- [x] Calendar scheduling
- [x] Session notes (shared doc)
- [x] Pre-session questionnaire
- [x] Post-session feedback
- [x] Recording option (consent required)

**Limits**:
- Premium: 1 session/month (30 min)
- Pro: 2 sessions/month (60 min each)

---

### FR-6.3: Mentor Dashboard [P1]

**Description**: Dashboard for mentors to manage mentees.

**Features**:
- [x] List of mentees
- [x] Upcoming sessions
- [x] Session history
- [x] Mentee progress tracking
- [x] Communication (messages)
- [x] Earnings tracker (if paid)

---

## 9. FR-7: Startup Resources (Master Class)

### FR-7.1: Startup Program Application [P1]

**Description**: Students can apply to the Master Class startup incubation program.

**Application Form**:
- Personal information
- Startup idea description
- Problem and solution
- Target market
- Team members
- Current stage (idea, MVP, launched)
- Why you need the program

**Review Process**:
- Admin reviews applications
- Accept/reject with feedback
- Accepted students notified via email

---

### FR-7.2: Business Plan Templates [P2]

**Description**: Templates and guides for creating business documents.

**Templates**:
- [ ] Business Model Canvas
- [ ] Pitch Deck (15 slides)
- [ ] Financial projections (Excel)
- [ ] One-pager
- [ ] Executive summary

**User Story**:
> As an **aspiring entrepreneur**, I want to **use business plan templates**, so that **I can create professional documents quickly**.

---

### FR-7.3: Demo Day [P2]

**Description**: Virtual demo day event for startups to pitch.

**Features**:
- [ ] Event registration
- [ ] Pitch submission (video or live)
- [ ] Attendee registration (investors, mentors, students)
- [ ] Live streaming
- [ ] Q&A session
- [ ] Voting and awards

---

### FR-7.4: Investor Directory [P3]

**Description**: Database of investors open to student startups.

**Listing**:
- Investor name and firm
- Investment focus (sectors, stage)
- Ticket size
- Contact information
- Portfolio companies

**User Story**:
> As an **entrepreneur**, I want to **find investors interested in my sector**, so that **I can reach out for funding**.

---

## 10. FR-8: Admin & Analytics

### FR-10.1: Admin Dashboard [P0]

**Description**: Admin interface for managing the platform.

**Features**:
- [x] User management (view, edit, delete, ban)
- [x] Course management (create, edit, publish, unpublish)
- [x] Content moderation (review flagged posts)
- [x] Analytics dashboard
- [x] System health monitoring
- [x] Announcement system

---

### FR-8.2: Analytics Dashboard [P1]

**Description**: Real-time analytics for business metrics.

**Metrics**:
- DAU, MAU, WAU
- User growth (new signups)
- Engagement (avg session time, pages per session)
- Course completion rates
- Revenue (MRR, ARR)
- Churn rate
- Top courses
- Geographic distribution

**Visualizations**:
- Line charts (trends over time)
- Pie charts (distribution)
- Funnels (conversion rates)
- Cohort retention tables

---

### FR-8.3: User Feedback System [P1]

**Description**: Collect and manage user feedback.

**Channels**:
- In-app feedback widget
- NPS surveys (quarterly)
- Feature requests (voting)
- Bug reports

**Admin View**:
- Feedback inbox
- Categorization (bug, feature request, complaint)
- Status tracking (new, in progress, resolved)
- Reply to user

---

## 11. Non-Functional Requirements

### 11.1 Performance

- **Page Load Time**: < 2 seconds (p95)
- **API Response Time**: < 500ms (p95)
- **Video Streaming**: Start within 3 seconds
- **IDE Response**: < 100ms for typing
- **Concurrent Users**: Support 1,000 simultaneous users

### 11.2 Security

- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Encryption**: At rest (AES-256) and in transit (TLS 1.3)
- **SQL Injection**: Parameterized queries
- **XSS Protection**: Content Security Policy (CSP)
- **Rate Limiting**: 100 requests/min per user
- **GDPR Compliance**: Data export, deletion, consent

### 11.3 Scalability

- **Horizontal Scaling**: Stateless architecture
- **Database**: Read replicas for scaling reads
- **CDN**: Static assets served via CloudFront
- **Caching**: Redis for session and query caching
- **Queue**: Bull/RabbitMQ for background jobs

### 11.4 Availability

- **Uptime Target**: 99.9% (< 9 hours downtime/year)
- **Backup**: Daily automated backups
- **Disaster Recovery**: RTO 4 hours, RPO 1 hour
- **Monitoring**: Real-time alerts (PagerDuty)

### 11.5 Accessibility

- **WCAG 2.1 AA Compliance**: All pages
- **Screen Reader**: Compatible (ARIA labels)
- **Keyboard Navigation**: Full support
- **Color Contrast**: Minimum 4.5:1 ratio
- **Captions**: All videos

### 11.6 Localization

- **Languages**: Korean (default), English
- **Future**: Japanese, Chinese, Vietnamese
- **Currency**: Korean Won (₩)
- **Date/Time**: Localized formats
- **Timezone**: UTC with user timezone support

---

## 12. API Requirements

### 12.1 RESTful API Standards

**Base URL**: `https://api.wkucrew.com/v1`

**Authentication**: Bearer token in Authorization header

**Response Format**:
```json
{
  "success": true,
  "data": {...},
  "error": null,
  "meta": {
    "timestamp": "2026-01-22T10:30:00Z",
    "requestId": "abc123"
  }
}
```

**Error Format**:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Email is required",
    "details": {...}
  }
}
```

**Status Codes**:
- 200 OK: Success
- 201 Created: Resource created
- 400 Bad Request: Invalid input
- 401 Unauthorized: Authentication required
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Server error

### 12.2 API Versioning

- URL versioning: `/v1/`, `/v2/`
- Deprecation warnings in headers
- Maintain v1 for minimum 12 months after v2 release

### 12.3 Rate Limiting

| Tier | Rate Limit |
|------|------------|
| **Anonymous** | 20 requests/min |
| **Free** | 100 requests/min |
| **Premium** | 300 requests/min |
| **Pro** | 1000 requests/min |

---

## 13. Testing Requirements

### 13.1 Unit Tests

- **Coverage**: Minimum 80%
- **Framework**: Jest (backend), Vitest (frontend)
- **Mocking**: Database, external APIs
- **Run**: On every commit (CI/CD)

### 13.2 Integration Tests

- **Coverage**: Critical user flows
- **Framework**: Supertest (API)
- **Database**: Test database with seed data
- **Run**: On every PR

### 13.3 E2E Tests

- **Framework**: Playwright
- **Scenarios**:
  - User registration → onboarding → first lesson
  - Course enrollment → video → quiz → completion
  - Code in IDE → deployment → live site
- **Run**: Nightly

### 13.4 Performance Tests

- **Tool**: k6, Lighthouse
- **Scenarios**: Peak load (1000 concurrent users)
- **Metrics**: Response time, throughput, error rate
- **Run**: Weekly

---

## 14. Requirements Traceability Matrix

| Requirement ID | Priority | Target Phase | Dependencies | Assigned To | Status |
|----------------|----------|--------------|--------------|-------------|--------|
| FR-1.1 | P0 | MVP (Phase 1) | None | Auth Team | ✅ Complete |
| FR-1.2 | P0 | MVP | FR-1.1 | Auth Team | ✅ Complete |
| FR-1.3 | P1 | Phase 2 | FR-1.1 | Auth Team | 🔄 In Progress |
| FR-1.4 | P0 | MVP | FR-1.1 | Auth Team | ✅ Complete |
| FR-2.1 | P0 | MVP | None | Frontend Team | ✅ Complete |
| FR-2.4 | P0 | MVP | FR-2.3 | Frontend Team | ✅ Complete |
| FR-3.1 | P0 | MVP | None | IDE Team | ✅ Complete |
| FR-3.4 | P1 | Phase 2 | FR-3.1 | IDE Team | 📋 Planned |
| FR-4.1 | P0 | MVP | FR-3.1 | DevOps Team | ✅ Complete |
| ... | ... | ... | ... | ... | ... |

---

**Document Version**: v1.0
**Date**: 2026-01-22
**Author**: WKU Software Crew Product Team
**Reviewers**: Engineering, Design, QA
**Next Review**: 2026-03-01
**Status**: Approved - Ready for Implementation
