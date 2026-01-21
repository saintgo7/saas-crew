# WKU Software Crew Project - Development Roadmap

## 1. Overview

### 1.1 Timeline Summary

**Total Duration**: 12 months (January 2026 - December 2026)
**Phases**: 4 major phases
**Team Size**: 10 (start) → 20 (end)

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 0: Planning** | Month 1 (Jan) | Architecture, designs, team setup |
| **Phase 1: MVP** | Months 2-4 (Feb-Apr) | Core features, beta launch |
| **Phase 2: Growth** | Months 5-8 (May-Aug) | Feature expansion, user acquisition |
| **Phase 3: Scale** | Months 9-12 (Sep-Dec) | Advanced features, regional expansion |

---

## 2. Phase 0: Planning & Setup (Month 1 - January 2026)

### 2.1 Week 1: Foundation

**Goals**:
- Finalize technical architecture
- Set up development environment
- Establish team processes

**Tasks**:
- [x] Hire core team (5 engineers, 1 designer, 1 PM)
- [x] Set up AWS infrastructure
- [x] Create GitHub organization and repositories
- [x] Set up project management (Linear/Jira)
- [x] Establish coding standards and git workflow
- [x] Set up CI/CD pipeline (GitHub Actions)

**Deliverables**:
- Technical architecture document
- Infrastructure as Code (Terraform)
- Development environment setup guide

### 2.2 Week 2: Design System

**Goals**:
- Create comprehensive design system
- Build component library

**Tasks**:
- [ ] Design system (colors, typography, spacing)
- [ ] Wireframes for all major pages
- [ ] Interactive prototypes (Figma)
- [ ] Component library (Shadcn/ui + custom)
- [ ] Accessibility audit

**Deliverables**:
- Figma design file
- Component library (React + Storybook)
- Design documentation

### 2.3 Week 3: Database & API Design

**Goals**:
- Finalize database schema
- Design API contracts

**Tasks**:
- [ ] Prisma schema design
- [ ] Database migrations
- [ ] API endpoint design (REST + GraphQL)
- [ ] Authentication flow design
- [ ] Data seeding scripts

**Deliverables**:
- Database schema (Prisma)
- API documentation (Swagger/OpenAPI)
- Seed data

### 2.4 Week 4: Sprint Planning

**Goals**:
- Break down MVP into sprints
- Begin development

**Tasks**:
- [ ] User story mapping
- [ ] Sprint backlog creation
- [ ] Estimation (story points)
- [ ] Risk assessment
- [ ] First sprint kickoff

**Deliverables**:
- Product backlog (100+ user stories)
- Sprint plan (8 sprints for Phase 1)
- Risk register

---

## 3. Phase 1: MVP Development (Months 2-4 - February-April 2026)

### 3.1 Sprint 1 (Week 5-6): Authentication & User Management

**Goals**: Users can sign up, log in, and manage profiles

**Frontend Tasks**:
- [ ] Sign up page
- [ ] Login page
- [ ] Password reset flow
- [ ] User profile page
- [ ] Profile editing
- [ ] OAuth integration (Google, GitHub)

**Backend Tasks**:
- [ ] User model and database
- [ ] JWT authentication
- [ ] Email verification
- [ ] Password hashing (bcrypt)
- [ ] OAuth providers setup
- [ ] Session management (Redis)

**Testing**:
- [ ] Unit tests (80% coverage)
- [ ] Integration tests (auth flows)
- [ ] Security audit

**Acceptance Criteria**:
- [x] User can sign up with email
- [x] Email verification works
- [x] User can log in and stay logged in
- [x] OAuth works for Google and GitHub
- [x] Profile editing works

### 3.2 Sprint 2 (Week 7-8): LMS Foundation

**Goals**: Course catalog and course details pages

**Frontend Tasks**:
- [ ] Course catalog page (grid view)
- [ ] Course detail page
- [ ] Course enrollment flow
- [ ] Filtering and search
- [ ] My Courses dashboard

**Backend Tasks**:
- [ ] Course model and API
- [ ] Enrollment system
- [ ] Search implementation (OpenSearch)
- [ ] Course content management
- [ ] Admin panel (course creation)

**Content**:
- [ ] Create 10 Junior Class courses
- [ ] Record 5 video lectures per course (50 total)
- [ ] Write course descriptions
- [ ] Create quizzes

**Acceptance Criteria**:
- [x] Catalog shows 10 courses
- [x] Search and filters work
- [x] Users can enroll in courses
- [x] My Courses dashboard displays enrolled courses

### 3.3 Sprint 3 (Week 9-10): Video Player & Progress Tracking

**Goals**: Users can watch videos and track progress

**Frontend Tasks**:
- [ ] Custom video player (HTML5 + controls)
- [ ] Playback speed controls
- [ ] Subtitles support
- [ ] Progress bar
- [ ] Auto-play next lesson

**Backend Tasks**:
- [ ] Video hosting setup (S3 + CloudFront)
- [ ] Progress tracking API
- [ ] Video analytics
- [ ] Resume functionality
- [ ] Certificate generation (on completion)

**Testing**:
- [ ] Video playback across browsers
- [ ] Mobile video playback
- [ ] Progress sync accuracy

**Acceptance Criteria**:
- [x] Videos play smoothly
- [x] Progress is saved and synced
- [x] Users can resume from last position
- [x] Certificate generated on course completion

### 3.4 Sprint 4 (Week 11-12): Cloud IDE - Part 1

**Goals**: Basic code editor and file management

**Frontend Tasks**:
- [ ] Monaco Editor integration
- [ ] File tree component
- [ ] File CRUD operations
- [ ] Syntax highlighting (20+ languages)
- [ ] Code autocompletion

**Backend Tasks**:
- [ ] Project model and API
- [ ] File storage (S3)
- [ ] File versioning
- [ ] Project templates (React, Node.js, Python)
- [ ] File size limits

**Testing**:
- [ ] Editor performance (large files)
- [ ] File operations
- [ ] Auto-save functionality

**Acceptance Criteria**:
- [x] Users can create projects
- [x] Editor works smoothly
- [x] Files auto-save
- [x] Syntax highlighting works

### 3.5 Sprint 5 (Week 13-14): Cloud IDE - Part 2 & Deployment

**Goals**: Terminal and deployment system

**Frontend Tasks**:
- [ ] Integrated terminal (xterm.js)
- [ ] Live preview panel
- [ ] Deploy button and status
- [ ] Deployment logs viewer

**Backend Tasks**:
- [ ] Terminal session management (WebSocket)
- [ ] Code execution sandboxing (Docker)
- [ ] Build system (Dockerfile for each project type)
- [ ] Deployment to AWS (ECS/Lambda)
- [ ] Custom subdomain generation

**Testing**:
- [ ] Terminal commands execution
- [ ] Deployment success rate
- [ ] Build time optimization

**Acceptance Criteria**:
- [x] Terminal works (npm, git commands)
- [x] One-click deployment works
- [x] Projects deploy within 5 minutes
- [x] Live URL is generated

### 3.6 Sprint 6 (Week 15-16): Community Q&A

**Goals**: Q&A forum for students

**Frontend Tasks**:
- [ ] Question feed
- [ ] Ask question form (Markdown editor)
- [ ] Question detail page
- [ ] Answer submission
- [ ] Upvote/downvote
- [ ] Comment threads

**Backend Tasks**:
- [ ] Question/Answer models
- [ ] Vote system
- [ ] Search questions
- [ ] Tag system
- [ ] Notification system (email)

**Testing**:
- [ ] Markdown rendering
- [ ] Vote accuracy
- [ ] Search relevance

**Acceptance Criteria**:
- [x] Users can ask questions
- [x] Users can answer questions
- [x] Voting works correctly
- [x] Notifications sent

### 3.7 Sprint 7 (Week 17-18): Gamification & Polish

**Goals**: Add gamification and polish UI

**Frontend Tasks**:
- [ ] Progress dashboard
- [ ] Badge system
- [ ] XP and levels
- [ ] Streak tracker (calendar view)
- [ ] Leaderboard
- [ ] Achievement pop-ups

**Backend Tasks**:
- [ ] XP calculation logic
- [ ] Badge definitions and awarding
- [ ] Leaderboard API
- [ ] Achievement system

**Polish**:
- [ ] Loading states everywhere
- [ ] Error boundaries
- [ ] Toast notifications
- [ ] Animations (Framer Motion)
- [ ] Mobile responsiveness

**Acceptance Criteria**:
- [x] Users earn XP for actions
- [x] Badges are awarded correctly
- [x] Leaderboard updates in real-time
- [x] UI is polished and responsive

### 3.8 Sprint 8 (Week 19-20): Testing & Beta Launch

**Goals**: Comprehensive testing and launch to beta users

**Tasks**:
- [ ] E2E testing (Playwright)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Bug fixes
- [ ] Documentation (user guide)
- [ ] Onboarding tutorial

**Beta Launch**:
- [ ] Recruit 50 beta testers (Wonkwang students)
- [ ] Onboarding emails
- [ ] Weekly feedback surveys
- [ ] Bug tracking and fixes

**Acceptance Criteria**:
- [x] All critical bugs fixed
- [x] Performance meets targets (< 2s load)
- [x] 50 beta users onboarded
- [x] NPS > 50

**Milestone**: **MVP BETA LAUNCH** (End of April 2026)

---

## 4. Phase 2: Growth & Feature Expansion (Months 5-8 - May-August 2026)

### 4.1 Month 5 (May 2026): Real-time Collaboration

**Goals**: Multi-user editing in IDE

**Tasks**:
- [ ] Y.js CRDT integration
- [ ] WebRTC connection
- [ ] Live cursors
- [ ] User presence indicators
- [ ] Chat sidebar
- [ ] Conflict-free merging

**Testing**:
- [ ] Latency (< 100ms)
- [ ] Sync accuracy
- [ ] Connection reliability

### 4.2 Month 6 (June 2026): Senior Class Launch

**Goals**: Expand content to intermediate level

**Content Creation**:
- [ ] 15 Senior Class courses
- [ ] 75 video lectures
- [ ] Advanced projects (full-stack apps)
- [ ] Coding challenges

**Features**:
- [ ] Learning paths (curated course sequences)
- [ ] Project showcases
- [ ] Code review system

### 4.3 Month 7 (July 2026): Marketing & Growth

**Goals**: User acquisition campaign

**Marketing**:
- [ ] Launch marketing website
- [ ] SEO optimization
- [ ] Content marketing (blog)
- [ ] Social media campaigns
- [ ] University partnerships (2-3 schools)

**Growth Features**:
- [ ] Referral program (invite friends)
- [ ] Affiliate program
- [ ] Free trial (Premium for 7 days)

**Target**: 1,000 total users, 50 paying users

### 4.4 Month 8 (August 2026): Iteration & Optimization

**Goals**: Improve based on user feedback

**Tasks**:
- [ ] User research (20 interviews)
- [ ] A/B testing (pricing, CTAs)
- [ ] Performance optimization
- [ ] UI/UX improvements
- [ ] Bug fixes

---

## 5. Phase 3: Scale & Advanced Features (Months 9-12 - September-December 2026)

### 5.1 Month 9 (September 2026): Master Class Launch

**Goals**: Launch entrepreneurship program

**Content**:
- [ ] 8 Master Class courses (business, fundraising)
- [ ] Startup resources (templates, guides)
- [ ] Pitch deck builder tool

**Mentoring**:
- [ ] Mentor matching algorithm
- [ ] 1:1 video sessions (Zoom integration)
- [ ] Session scheduling
- [ ] Feedback system

### 5.2 Month 10 (October 2026): Advanced IDE Features

**Goals**: AI-powered coding assistance

**Features**:
- [ ] AI code completion (GPT-4 integration)
- [ ] Code explanations
- [ ] Bug detection
- [ ] Debugging tools (breakpoints, inspection)

### 5.3 Month 11 (November 2026): B2B Features

**Goals**: Enterprise features for universities

**Features**:
- [ ] Admin dashboard (professors)
- [ ] Student analytics
- [ ] Assignment creation and grading
- [ ] Plagiarism detection
- [ ] Custom branding (white-label)

**Sales**:
- [ ] Close 1 university contract (₩30M+)
- [ ] Pipeline of 5+ prospects

### 5.4 Month 12 (December 2026): Year-End Push

**Goals**: Hit annual targets and plan Series A

**Tasks**:
- [ ] Feature freeze (polish existing)
- [ ] Year-end metrics analysis
- [ ] User testimonials and case studies
- [ ] Series A pitch deck
- [ ] Investor meetings

**Targets**:
- [x] 1,000 total users
- [x] 100 paying users
- [x] ₩327M revenue
- [x] 1 university contract
- [x] NPS > 70

**Milestone**: **OFFICIAL V1.0 LAUNCH** + **Series A Raise** (₩500M)

---

## 6. Resource Allocation

### 6.1 Team Growth

| Month | Engineers | Designers | PM | Content | Marketing | Total |
|-------|-----------|-----------|-----|---------|-----------|-------|
| **1** | 5 | 1 | 1 | 1 | 1 | 9 |
| **2-4** | 6 | 1 | 1 | 2 | 1 | 11 |
| **5-8** | 8 | 2 | 1 | 2 | 2 | 15 |
| **9-12** | 10 | 2 | 2 | 3 | 3 | 20 |

### 6.2 Budget Allocation

**Year 1 Total**: ₩400M

| Phase | Personnel | Infrastructure | Marketing | Operations | Total |
|-------|-----------|----------------|-----------|------------|-------|
| **Phase 0 (M1)** | ₩20M | ₩5M | ₩5M | ₩3M | ₩33M |
| **Phase 1 (M2-4)** | ₩75M | ₩15M | ₩10M | ₩10M | ₩110M |
| **Phase 2 (M5-8)** | ₩100M | ₩20M | ₩30M | ₩12M | ₩162M |
| **Phase 3 (M9-12)** | ₩55M | ₩10M | ₩15M | ₩15M | ₩95M |
| **Total** | ₩250M | ₩50M | ₩60M | ₩40M | ₩400M |

---

## 7. Risk Management

### 7.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **IDE Performance Issues** | Medium | High | Load testing, optimization sprints |
| **Deployment Failures** | Medium | Medium | Robust error handling, rollback system |
| **Security Breach** | Low | Critical | Security audits, penetration testing |
| **Scalability Problems** | Low | High | Horizontal scaling, load balancers |

### 7.2 Timeline Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Feature Creep** | High | High | Strict scope management, MVP focus |
| **Hiring Delays** | Medium | Medium | Start recruiting early, use contractors |
| **Content Creation Delays** | Medium | High | Hire part-time instructors, outsource |
| **Beta Feedback Requires Pivot** | Low | Critical | Build in buffer time, prioritize feedback |

---

## 8. Success Metrics by Phase

### 8.1 Phase 1 (MVP) Success Criteria

- [x] 50 beta users onboarded
- [x] Week 1 retention > 40%
- [x] Average session time > 20 minutes
- [x] At least 5 courses completed
- [x] NPS > 50

### 8.2 Phase 2 (Growth) Success Criteria

- [x] 500 total users
- [x] 50 paying users (10% conversion)
- [x] Week 4 retention > 25%
- [x] 2 university partnerships
- [x] ₩5M MRR

### 8.3 Phase 3 (Scale) Success Criteria

- [x] 1,000 total users
- [x] 100 paying users
- [x] ₩27M MRR (₩327M ARR)
- [x] 1 university contract signed
- [x] NPS > 70
- [x] Series A term sheet

---

## 9. Dependencies & Critical Path

```
Month 1 (Planning) → MUST complete before development
    ↓
Month 2-3 (Auth + LMS) → Blocks IDE work (users need accounts)
    ↓
Month 3-4 (IDE + Deploy) → Blocks collaboration features
    ↓
Month 4 (Beta Launch) → Blocks user feedback loop
    ↓
Month 5-8 (Growth) → Blocks profitability
    ↓
Month 9-12 (Scale) → Blocks Series A fundraising
```

**Critical Path**:
1. Team hiring (Week 1) - CRITICAL
2. Infrastructure setup (Week 1-2) - CRITICAL
3. Authentication (Sprint 1) - BLOCKS everything
4. LMS (Sprint 2-3) - BLOCKS content delivery
5. IDE (Sprint 4-5) - BLOCKS hands-on learning
6. Beta launch (Month 4) - BLOCKS user feedback
7. Series A raise (Month 12) - BLOCKS 2027 growth

---

## 10. Monthly Check-ins

### 10.1 Agenda

**Every month**:
1. Review previous month's goals
2. Demo new features
3. Review metrics (users, engagement, revenue)
4. Discuss blockers and risks
5. Plan next month

### 10.2 Reporting

**Weekly**: Team standup (Monday), Sprint review (Friday)
**Monthly**: All-hands meeting, investor update
**Quarterly**: Board meeting, strategic planning

---

**Document Version**: v1.0
**Date**: 2026-01-22
**Author**: WKU Software Crew Product & Engineering
**Next Review**: Monthly (during Phase execution)
