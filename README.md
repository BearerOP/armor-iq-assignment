# 🏢 Multi-Organization Task Management API

A robust, scalable REST API built with **NestJS**, **TypeScript**, **PostgreSQL**, and **Prisma** for managing tasks across multiple organizations with role-based access control.

## 🛠️ Tech Stack

### **Backend Framework**
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Express** - Web application framework

### **Database & ORM**
- **PostgreSQL** - Relational database
- **Prisma** - Type-safe database ORM
- **UUID** - Globally unique identifiers

### **Authentication**
- **JWT** - JSON Web Tokens
- **Passport.js** - Authentication middleware
- **bcrypt** - Password hashing

### **Validation & Transformation**
- **class-validator** - DTO validation
- **class-transformer** - Object transformation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v13 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd armor-iq-assignment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/task_management_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"

# Server Configuration
PORT=3000
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"

# Environment
NODE_ENV="development"
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

### 5. Start the Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api`

## 🔧 Environment Setup

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-super-secret-key` |
| `PORT` | Server port | `3000` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | `development` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CORS_ORIGIN` | CORS allowed origins | `*` |
| `PORT` | Server port | `3000` |

## 🗄️ Database Setup

### Prisma Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Reset database (development only)
npx prisma migrate reset

# View database in Prisma Studio
npm run prisma:studio

# Seed database with sample data
npm run prisma:seed
```

### Database Schema

The application uses three main entities:

#### **Organizations**
- `id` (UUID, Primary Key)
- `name` (String)
- `createdAt`, `updatedAt` (DateTime)

#### **Users**
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `firstName`, `lastName` (String)
- `role` (Enum: ADMIN, USER)
- `organizationId` (UUID, Foreign Key)
- `createdAt`, `updatedAt` (DateTime)

#### **Tasks**
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (String, Optional)
- `status` (Enum: PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- `priority` (Enum: LOW, MEDIUM, HIGH, URGENT)
- `dueDate` (DateTime, Optional)
- `createdById` (UUID, Foreign Key)
- `organizationId` (UUID, Foreign Key)
- `createdAt`, `updatedAt` (DateTime)

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🔐 Authentication Flow

### 1. User Registration

**Create New Organization + Admin User:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User",
  "organizationName": "My Company"
}
```

**Register User in Existing Organization:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "user123",
  "firstName": "Regular",
  "lastName": "User",
  "organizationId": "uuid-of-existing-org"
}
```

### 2. User Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@company.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN",
    "organizationId": "uuid"
  }
}
```

## 👥 Role-Based Access Control

### **ADMIN Role**
- Can view all users in their organization
- Can view all tasks in their organization
- Can create, read, update, and delete any task in their organization
- Can access organization statistics

### **USER Role**
- Can only view their own profile
- Can only view tasks they created
- Can create, read, update, and delete only their own tasks
- Cannot access other users' data

### **Organization Isolation**
- Users can only access data within their organization
- Cross-organization access is strictly forbidden
- Each organization's data is completely isolated

## 📁 Project Structure

```
server/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── decorators/          # Custom decorators
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── strategies/          # Passport strategies
│   │   └── types/               # Type definitions
│   ├── organizations/           # Organization management
│   ├── prisma/                  # Database configuration
│   ├── tasks/                   # Task management
│   │   └── dto/                 # Task DTOs
│   ├── users/                   # User management
│   ├── app.module.ts            # Root module
│   └── main.ts                  # Application entry point
├── prisma/
│   ├── migrations/              # Database migrations
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seeding
├── test/                        # Test files
├── dist/                        # Compiled JavaScript
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🌐 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |

### User Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/users/profile` | Get current user profile | Yes | Any |
| GET | `/users` | Get all users in organization | Yes | ADMIN |
| GET | `/users/:id` | Get specific user | Yes | ADMIN or Self |

### Task Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/tasks` | Create new task | Yes | Any |
| GET | `/tasks` | Get tasks | Yes | Any |
| GET | `/tasks/:id` | Get specific task | Yes | ADMIN or Owner |
| PATCH | `/tasks/:id` | Update task | Yes | ADMIN or Owner |
| DELETE | `/tasks/:id` | Delete task | Yes | ADMIN or Owner |

### Organization Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/organizations/current` | Get current organization | Yes | Any |

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Description | Example |
|------|-------------|---------|
| 200 | Success | Task retrieved successfully |
| 201 | Created | User registered successfully |
| 400 | Bad Request | Invalid UUID format |
| 401 | Unauthorized | Invalid or missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Email already exists |
| 500 | Internal Server Error | Database connection error |

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Invalid UUID format",
  "error": "Bad Request"
}
```

## 🛡️ Security Features

### **Authentication Security**
- JWT tokens with 7-day expiration
- Secure password hashing with bcrypt (10 salt rounds)
- Token validation on every protected request

### **Authorization Security**
- Role-based access control (RBAC)
- Organization-based data isolation
- User can only access their own data (unless admin)

### **Input Validation**
- DTO-based request validation
- UUID format validation
- Enum validation for status and priority
- SQL injection prevention via Prisma

### **Data Security**
- Password exclusion from all responses
- Sensitive field filtering
- Cross-organization access prevention
- Request sanitization

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Docker Deployment

```bash
# Build Docker image
npm run docker:build

# Run Docker container
npm run docker:run
```

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:pass@prod-db:5432/task_management"
JWT_SECRET="your-production-secret-key"
NODE_ENV="production"
PORT=3000
CORS_ORIGIN="https://yourdomain.com"
```

### Database Migration in Production

```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## 📊 Sample Data

The seed script creates:

- **2 Organizations**: Alpha Org, Beta Org
- **2 Admin Users**: One per organization
- **4 Regular Users**: Two per organization
- **12 Sample Tasks**: Distributed across users and organizations

### Sample Users

| Email | Password | Role | Organization |
|-------|----------|------|--------------|
| adminA@example.com | AdminPass123 | ADMIN | Alpha Org |
| adminB@example.com | AdminPass123 | ADMIN | Beta Org |
| userA1@example.com | UserPass123 | USER | Alpha Org |
| userA2@example.com | UserPass123 | USER | Alpha Org |
| userB1@example.com | UserPass123 | USER | Beta Org |
| userB2@example.com | UserPass123 | USER | Beta Org |

## 🔧 Development Commands

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging

# Building
npm run build              # Build for production
npm run start:prod         # Start production build

# Database
npm run prisma:generate     # Generate Prisma client
npm run prisma:migrate      # Run migrations
npm run prisma:seed         # Seed database
npm run prisma:studio       # Open Prisma Studio

# Docker
npm run docker:build       # Build Docker image
npm run docker:run         # Run Docker container

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

## 🙏 Tech

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [PostgreSQL](https://www.postgresql.org/) - Powerful database
- [JWT](https://jwt.io/) - JSON Web Tokens
- [Passport.js](http://www.passportjs.org/) - Authentication middleware

---

**Built with ❤️ using NestJS, TypeScript, and PostgreSQL**