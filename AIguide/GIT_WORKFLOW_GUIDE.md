# 🌿 Git Workflow Guide - Drug Prevention Support System

## 📋 Project Structure
```
drug-use-prevention-support-system/
├── backend/          # Spring Boot API (Your responsibility)
├── frontend/         # React/Vue app (Frontend team responsibility)  
├── frontend-test/    # Test frontend (can be removed)
└── README.md
```

## 🚀 Team Workflow

### 🎯 Branch Strategy
```
main                  # Production-ready code
├── backend-dev       # Backend development
├── frontend-dev      # Frontend development  
├── feature/xxx       # Specific features
└── hotfix/xxx        # Emergency fixes
```

## 🔧 Backend Developer Workflow (You)

### 1. 🏗️ Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd drug-use-prevention-support-system

# Create and switch to backend branch
git checkout -b backend-dev
git push -u origin backend-dev
```

### 2. 📝 Daily Development
```bash
# Start work on backend
git checkout backend-dev
git pull origin backend-dev

# Make changes to backend/
# Edit Spring Boot files, add APIs, etc.

# Commit your changes
git add backend/
git commit -m "feat: add assessment result analytics API"
git push origin backend-dev
```

### 3. 🔄 Feature Development
```bash
# Create feature branch from backend-dev
git checkout backend-dev
git checkout -b feature/user-analytics

# Develop feature
# Work on backend/ files only

# Commit and push
git add backend/
git commit -m "feat: implement user analytics dashboard API"
git push origin feature/user-analytics

# Create Pull Request: feature/user-analytics → backend-dev
```

### 4. 🎉 Release Process
```bash
# Merge to main when ready
git checkout main
git pull origin main
git merge backend-dev
git push origin main

# Tag version
git tag -a v1.0.0 -m "Backend v1.0.0 - Assessment system complete"
git push origin v1.0.0
```

## 🎨 Frontend Team Workflow

### 1. 🏗️ Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd drug-use-prevention-support-system

# Create frontend branch
git checkout -b frontend-dev
git push -u origin frontend-dev
```

### 2. 📝 Daily Development
```bash
# Work on frontend
git checkout frontend-dev
git pull origin frontend-dev

# Make changes to frontend/
# React components, styles, etc.

# Commit changes
git add frontend/
git commit -m "feat: add assessment results visualization"
git push origin frontend-dev
```

### 3. 🔄 API Integration
```bash
# Make sure backend APIs are ready
# Check backend/BACKEND_README.md for API docs

# Integrate with backend APIs
# Update frontend/ to call http://localhost:8080/api/

# Test integration
git add frontend/
git commit -m "feat: integrate with backend assessment APIs"
git push origin frontend-dev
```

## 🤝 Team Collaboration

### 📋 Communication Protocol
1. **Backend changes** → Notify frontend team
2. **API changes** → Update documentation
3. **Database changes** → Share migration scripts
4. **New endpoints** → Update API documentation

### 🔄 Integration Workflow
```bash
# When both backend and frontend are ready
git checkout main
git pull origin main

# Merge backend first
git merge backend-dev
git push origin main

# Merge frontend  
git merge frontend-dev
git push origin main

# Tag release
git tag -a v1.0.0 -m "Full stack release v1.0.0"
git push origin v1.0.0
```

## 🛠️ Development Setup

### 🗄️ Backend Setup (Port 8080)
```bash
cd backend/
./mvnw spring-boot:run
# API available at: http://localhost:8080
```

### 🎨 Frontend Setup (Port 3000/5173)
```bash
cd frontend/
npm install
npm run dev
# Frontend available at: http://localhost:3000 or http://localhost:5173
```

### 🔗 API Integration Points
- **Backend API**: `http://localhost:8080/api/`
- **Swagger Docs**: `http://localhost:8080/swagger-ui.html`
- **Health Check**: `http://localhost:8080/api/health`

## 📋 Commit Message Standards

### 🎯 Format
```
type(scope): description

feat(backend): add user profile management API
fix(frontend): resolve login form validation issue
docs(api): update assessment endpoints documentation
style(frontend): improve responsive design for mobile
refactor(backend): optimize database queries
test(backend): add unit tests for assessment service
```

### 📝 Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Code style/formatting
- **refactor**: Code refactoring
- **test**: Adding tests
- **chore**: Maintenance tasks

## 🚨 Conflict Resolution

### 🔧 Backend-Frontend Conflicts
```bash
# If both teams edit same files
git checkout main
git pull origin main

# Resolve conflicts manually
git mergetool

# Commit resolution
git commit -m "resolve: merge backend and frontend changes"
git push origin main
```

### 📞 Communication Channels
- **Slack/Discord**: Daily updates
- **GitHub Issues**: Bug reports
- **Pull Requests**: Code reviews
- **Wiki/Docs**: API documentation

## 📊 Branch Protection Rules

### 🛡️ Main Branch
- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ✅ Restrict pushes to main
- ✅ Require up-to-date branches

### 🔄 Development Branches
- ✅ Allow direct pushes for faster development
- ✅ Regular merges to main
- ✅ Feature branches for major changes

## 🎯 Quick Commands

### 📋 Backend Developer Daily Commands
```bash
git checkout backend-dev
git pull origin backend-dev
# Work on backend/
git add backend/
git commit -m "feat: your changes"
git push origin backend-dev
```

### 🎨 Frontend Developer Daily Commands  
```bash
git checkout frontend-dev
git pull origin frontend-dev
# Work on frontend/
git add frontend/
git commit -m "feat: your changes"
git push origin frontend-dev
```

### 🔍 Check Integration
```bash
# Backend running?
curl http://localhost:8080/api/health

# Frontend connecting to backend?
# Check browser network tab for API calls
```

---

**🎯 Happy Coding!** This workflow ensures smooth collaboration between backend and frontend teams. 