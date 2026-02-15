# Branch Protection Rules Setup

## Overview

This document describes how to configure branch protection rules for the WKU Software Crew repository.

---

## GitHub Branch Protection Settings

Go to: GitHub Repository > Settings > Branches > Add branch protection rule

### Main Branch Protection

**Branch name pattern**: `main`

| Setting | Value | Description |
|---------|-------|-------------|
| Require a pull request before merging | On | All changes via PR |
| Require approvals | 1 | At least 1 review required |
| Dismiss stale PR approvals | On | Re-review after new commits |
| Require status checks to pass | On | CI must pass |
| Required status checks | `lint`, `test-api`, `test-web`, `build` | All CI jobs |
| Require branches to be up to date | On | Must be current with main |
| Require conversation resolution | On | All comments addressed |
| Do not allow bypassing | Off | Admins can bypass if needed |
| Restrict who can push | Optional | Limit push access |

### Develop Branch Protection

**Branch name pattern**: `develop`

| Setting | Value | Description |
|---------|-------|-------------|
| Require a pull request before merging | On | All changes via PR |
| Require approvals | 0-1 | Optional review |
| Require status checks to pass | On | CI must pass |
| Required status checks | `lint`, `test-api`, `build` | Basic checks |
| Require branches to be up to date | Off | Allow parallel PRs |

---

## Step-by-Step Setup

### 1. Main Branch Protection

1. Go to repository Settings
2. Click "Branches" in the left sidebar
3. Click "Add branch protection rule"
4. Enter `main` as branch name pattern
5. Configure:
   - [x] Require a pull request before merging
     - [x] Require approvals: 1
     - [x] Dismiss stale pull request approvals when new commits are pushed
   - [x] Require status checks to pass before merging
     - [x] Require branches to be up to date before merging
     - Search and add: `Lint & Type Check`, `API Tests`, `Frontend Tests`, `Build Check`
   - [x] Require conversation resolution before merging
6. Click "Create"

### 2. Develop Branch Protection

1. Click "Add branch protection rule"
2. Enter `develop` as branch name pattern
3. Configure:
   - [x] Require a pull request before merging
     - [ ] Require approvals (optional)
   - [x] Require status checks to pass before merging
     - Search and add: `Lint & Type Check`, `API Tests`, `Build Check`
4. Click "Create"

---

## Workflow After Setup

### Normal Feature Development

```
1. Create feature branch from develop
   git checkout develop
   git pull origin develop
   git checkout -b feature/my-feature

2. Develop and test locally
   pnpm test
   pnpm build

3. Push and create PR to develop
   git push -u origin feature/my-feature
   # Create PR via GitHub

4. Wait for CI checks to pass

5. Get review (if required) and merge

6. Delete feature branch
```

### Release to Production

```
1. Create PR from develop to main
   # Via GitHub: New Pull Request
   # base: main, compare: develop

2. Wait for all status checks

3. Get required approval

4. Merge PR

5. Automatic production deployment
```

### Hotfix

```
1. Create hotfix branch from main
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-fix

2. Fix and test

3. Create PR to main (with expedited review)

4. After merge to main, also merge to develop
   git checkout develop
   git pull origin develop
   git merge main
   git push origin develop
```

---

## Required Status Checks

These are the CI job names that should be added as required:

| Job Name | Workflow | Description |
|----------|----------|-------------|
| `Lint & Type Check` | ci.yml | Code quality |
| `API Tests` | ci.yml | Backend tests |
| `Frontend Tests` | ci.yml | Frontend E2E |
| `Build Check` | ci.yml | Build verification |
| `Security Scan` | ci.yml | Vulnerability check |

---

## Troubleshooting

### Status checks not appearing

- Push at least one commit to trigger CI
- Wait for first workflow run to complete
- Refresh the branch protection page

### PR blocked by "branch not up to date"

```bash
git checkout feature/my-feature
git fetch origin develop
git rebase origin/develop
git push --force-with-lease
```

### Admin bypass needed

Admins can click "Merge without waiting for requirements to be met" in emergency situations. Document the reason in the PR.
