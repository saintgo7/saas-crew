# WKU Software Crew Project - Operations Plan

## 1. Organizational Structure

### 1.1 Team Hierarchy (Year 1)

**Total Team Size**: 20 members by end of Year 1

```
                    CEO
                     │
        ┌────────────┼────────────┬────────────┬────────────┐
        │            │            │            │            │
       CTO          CPO          CMO          COO        CFO (Part-time)
        │            │            │            │
   ┌────┴────┐  ┌───┴───┐   ┌────┴────┐  ┌───┴───┐
   │         │  │       │   │         │  │       │
Engineering Design  PM  Marketing Customer Ops
   (8)      (2) (2)     (3)    Success
                                  (2)
```

### 1.2 Key Roles & Responsibilities

| Role | Count | Key Responsibilities |
|------|-------|---------------------|
| **CEO** | 1 | Strategy, fundraising, partnerships, leadership |
| **CTO** | 1 | Technical vision, architecture, engineering management |
| **CPO** | 1 | Product strategy, roadmap, user research |
| **CMO** | 1 | Marketing strategy, brand, growth |
| **COO** | 1 | Operations, HR, finance, legal |
| **Frontend Engineers** | 3 | React/Next.js development |
| **Backend Engineers** | 3 | NestJS, databases, APIs |
| **DevOps Engineer** | 1 | Infrastructure, CI/CD, monitoring |
| **QA Engineer** | 1 | Testing, quality assurance |
| **Product Managers** | 2 | Feature planning, user stories, coordination |
| **UI/UX Designers** | 2 | Design system, wireframes, prototypes |
| **Content Creators** | 2 | Course development, video production |
| **Marketing Specialists** | 2 | Digital marketing, content marketing |
| **Customer Success** | 2 | User support, onboarding, retention |

---

## 2. Daily Operations

### 2.1 Work Schedule

**Core Hours**: 10:00 AM - 6:00 PM (flexible start/end)
**Remote-Friendly**: 3 days in office, 2 days remote
**Location**: Shared office space in Iksan

### 2.2 Daily Rituals

**9:30 AM - Check-in** (Async, Slack):
- What did you do yesterday?
- What will you do today?
- Any blockers?

**10:00 AM - Deep Work Block**:
- No meetings, focused coding/design time

**12:00 PM - Lunch**:
- Team lunch 2x/week (team bonding)

**2:00 PM - Collaboration Time**:
- Meetings, code reviews, discussions

**5:30 PM - End of Day Sync** (Async, Slack):
- Share wins and learnings

---

## 3. Weekly Routines

### 3.1 Monday

**10:00 AM - All-Hands Meeting** (30 min):
- CEO shares company updates
- Department heads share wins/challenges
- Q&A

**2:00 PM - Sprint Planning** (Engineering, 2 hours):
- Review backlog
- Estimate and commit to sprint goals
- Assign tasks

### 3.2 Wednesday

**2:00 PM - Product Sync** (1 hour):
- Review user feedback
- Prioritize features
- Design reviews

### 3.3 Friday

**4:00 PM - Sprint Review & Demo** (1 hour):
- Demo completed features
- Retrospective (what went well, what to improve)

**5:00 PM - Happy Hour** (Optional):
- Team bonding, casual conversations

---

## 4. Monthly Operations

### 4.1 First Week

- **Board Meeting** (CEO, investors): Strategic review
- **Financial Review** (COO, CFO): P&L, burn rate, runway
- **Hiring Pipeline Review**: Open positions, candidates

### 4.2 Mid-Month

- **Town Hall** (All team): Company metrics, AMA
- **Customer Advisory Board**: Meet with power users for feedback

### 4.3 End of Month

- **Metrics Review**: DAU, MAU, MRR, churn, NPS
- **OKR Check-in**: Progress on quarterly objectives
- **Team Social Event**: Dinner, activity (bowling, karaoke)

---

## 5. Customer Support Operations

### 5.1 Support Channels

| Channel | Availability | Response Time SLA | Use Case |
|---------|-------------|-------------------|----------|
| **Email** | 24/7 | < 24 hours | Non-urgent inquiries |
| **Live Chat** | Mon-Fri 9-18 | < 5 minutes | Urgent issues |
| **Q&A Forum** | Community-driven | < 2 hours (staff) | Technical questions |
| **Phone** (Pro only) | Mon-Fri 9-18 | < 15 minutes | VIP support |

### 5.2 Support Process

**Tier 1** (Customer Success team):
- Handle 80% of inquiries
- Common issues (password reset, billing)
- Escalate complex issues to Tier 2

**Tier 2** (Engineering):
- Technical bugs
- Feature requests
- Account issues

**Tier 3** (Leadership):
- Escalations, complaints
- Partnership inquiries

### 5.3 Support Tools

- **Intercom**: Live chat, email support
- **Zendesk**: Ticket management
- **Knowledge Base**: Self-service articles (100+ FAQs)

---

## 6. Product Development Process

### 6.1 Agile/Scrum Methodology

**Sprint Duration**: 2 weeks
**Sprint Capacity**: 80 story points (team of 8 engineers)

**Ceremonies**:
- Sprint Planning (Monday, 2 hours)
- Daily Standup (Async, Slack)
- Sprint Review (Friday, 1 hour)
- Retrospective (Friday, 30 min)

### 6.2 Feature Development Lifecycle

```
Idea → Research → Design → Develop → Test → Launch → Measure
  ↑                                                         ↓
  └────────────────────── Iterate ←───────────────────────┘
```

**1. Idea**:
- User feedback, team brainstorm, market research
- Document in product backlog

**2. Research**:
- User interviews (10-20)
- Competitive analysis
- Technical feasibility

**3. Design**:
- Wireframes (low-fi)
- Prototypes (high-fi, Figma)
- User testing (5-8 users)

**4. Develop**:
- Break into user stories
- Sprint planning
- Code, review, merge

**5. Test**:
- QA testing (manual + automated)
- Staging environment review
- Bug fixes

**6. Launch**:
- Feature flag rollout (10% → 50% → 100%)
- Monitor metrics, error rates
- Announcement (email, in-app, social media)

**7. Measure**:
- Usage analytics
- User feedback
- Success metrics (adoption rate, engagement)

---

## 7. Infrastructure Operations

### 7.1 Deployment Process

**Environments**:
- **Development**: Local machines
- **Staging**: staging.wkucrew.com (for QA)
- **Production**: wkucrew.com

**CI/CD Pipeline**:
```
Git Push → GitHub Actions → Tests → Build → Deploy to Staging
                                            ↓
                                   Manual Approval
                                            ↓
                                   Deploy to Production
```

**Deployment Frequency**: Daily (for minor updates), Weekly (for major features)

### 7.2 Monitoring & Alerting

**Tools**:
- **CloudWatch**: AWS infrastructure metrics
- **Sentry**: Error tracking
- **New Relic**: APM (application performance monitoring)
- **UptimeRobot**: Uptime monitoring

**Alerts**:
- **Critical** (PagerDuty, immediate): API down, database failure
- **High** (Slack, 15 min): Error rate > 5%, p95 latency > 2s
- **Medium** (Email, 1 hour): Disk usage > 80%, memory high

### 7.3 Incident Response

**Incident Severity**:
- **P0 (Critical)**: Service down, data loss
- **P1 (High)**: Major feature broken, payment issues
- **P2 (Medium)**: Minor bugs, performance degradation
- **P3 (Low)**: UI glitches, non-critical issues

**Response Time**:
| Severity | Acknowledgement | Resolution Target |
|----------|----------------|-------------------|
| P0 | 15 min | 4 hours |
| P1 | 1 hour | 24 hours |
| P2 | 4 hours | 1 week |
| P3 | 1 week | 1 month |

**Post-Mortem**: Conducted for all P0 and P1 incidents (root cause, timeline, action items)

---

## 8. Financial Operations

### 8.1 Budget Management

**Monthly Review**:
- Actual spend vs. budget
- Burn rate calculation
- Runway projection
- Adjust spending as needed

**Approval Process**:
- < ₩500K: Department head
- ₩500K - ₩5M: COO + CFO
- > ₩5M: CEO + Board

### 8.2 Invoicing & Payments

**B2C (Stripe)**:
- Automated monthly billing
- Payment retry logic (3 attempts)
- Dunning emails (payment failed notifications)

**B2B (Manual)**:
- Invoice sent via email
- Payment terms: Net 30
- Follow-up reminders (Day 15, Day 25, Day 30)

### 8.3 Accounting

**Tools**: QuickBooks or Xero
**Tasks**:
- Bookkeeping (monthly)
- Financial statements (quarterly)
- Tax filing (annual)
- Audit preparation (Series A and beyond)

---

## 9. Legal & Compliance

### 9.1 Contracts

**Employee Contracts**:
- Employment agreement
- NDA (Non-Disclosure Agreement)
- IP assignment

**Vendor Contracts**:
- SaaS subscriptions (AWS, Vercel, etc.)
- Service agreements (legal, accounting)

**Customer Agreements**:
- Terms of Service
- Privacy Policy
- SLA (Enterprise customers)

### 9.2 Compliance

**Data Protection**:
- GDPR compliance (for EU users)
- Personal Information Protection Act (Korea)
- Regular audits

**Legal Reviews**:
- Quarterly compliance check
- Annual legal audit
- Update T&C as needed

---

## 10. Hiring & Onboarding

### 10.1 Hiring Process

**Steps**:
1. Job posting (LinkedIn, wanted.co.kr, university job boards)
2. Resume screening (2-3 days)
3. Phone screen (30 min, cultural fit)
4. Technical interview (1-2 hours, coding/design challenge)
5. Final interview (CEO + Team, 1 hour)
6. Offer (2-3 days decision time)

**Timeline**: 2-3 weeks (from application to offer)

### 10.2 Onboarding

**Day 1**:
- Welcome package (laptop, swag)
- Accounts setup (email, Slack, GitHub, AWS)
- Team introductions
- Orientation (company mission, culture, processes)

**Week 1**:
- Onboarding buddy assigned
- Read documentation
- Set up development environment
- First small task/bug fix

**Month 1**:
- Regular 1:1s with manager
- Join team meetings
- Complete first feature

**Month 3**:
- Performance review
- Feedback session
- Goal setting

---

## 11. Performance Management

### 11.1 OKRs (Objectives & Key Results)

**Quarterly Goals**:
- Company OKRs (set by CEO + Leadership)
- Department OKRs (aligned with company goals)
- Individual OKRs (aligned with department goals)

**Example Company OKR (Q1 2026)**:
- **Objective**: Successfully launch MVP and acquire first users
- **Key Results**:
  1. Launch MVP by April 1 (on time)
  2. Acquire 500 users (50 paying)
  3. Achieve NPS > 60

### 11.2 Performance Reviews

**Frequency**: Quarterly

**Process**:
1. Self-assessment
2. Manager evaluation
3. 1:1 discussion
4. Goal setting for next quarter

**Criteria**:
- OKR achievement
- Quality of work
- Collaboration
- Growth mindset

### 11.3 Compensation & Promotions

**Salary Bands**:
- Junior Engineer: ₩35M-₩45M/year
- Mid-level Engineer: ₩45M-₩60M/year
- Senior Engineer: ₩60M-₩80M/year
- Engineering Manager: ₩70M-₩90M/year

**Equity**:
- Early employees: 0.5% - 2% (4-year vesting)
- Standard employees: 0.1% - 0.5%

**Promotions**:
- Annual review cycle
- Merit-based (performance, impact)
- Salary increase: 10%-30%

---

## 12. Tools & Systems

### 12.1 Core Tools

| Category | Tool | Use Case |
|----------|------|----------|
| **Communication** | Slack | Team chat |
| **Video Calls** | Zoom | Meetings |
| **Email** | Google Workspace | Email, Docs, Sheets |
| **Project Management** | Linear | Task tracking |
| **Design** | Figma | UI/UX design |
| **Code** | GitHub | Version control |
| **CI/CD** | GitHub Actions | Automation |
| **Monitoring** | Sentry, CloudWatch | Error tracking |
| **Analytics** | Mixpanel, Google Analytics | User analytics |
| **Customer Support** | Intercom | Support chat |
| **Accounting** | QuickBooks | Finances |

### 12.2 Tool Budget

**Total SaaS Spend**: ₩10M/year

- GitHub Team: ₩600K/year
- AWS: ₩30M/year (infrastructure, not SaaS)
- Figma Professional: ₩2M/year
- Linear: ₩600K/year
- Slack Pro: ₩1.2M/year
- Zoom Pro: ₩600K/year
- Intercom: ₩3M/year
- Others: ₩2M/year

---

**Document Version**: v1.0
**Date**: 2026-01-22
**Author**: WKU Software Crew Operations Team
**Next Review**: 2026-06-01
