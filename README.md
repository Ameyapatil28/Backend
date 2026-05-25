# Student and Course Management System

## Project Overview
This project is a backend-based Student and Course Management System developed using Node.js, Express.js, and MySQL. The system allows admins to manage courses and students, while students can view their course-related information.

The project demonstrates:
- Backend API development
- SQL database design
- JWT Authentication
- Role-Based Access Control (RBAC)
- CRUD Operations
- MySQL Relationships & JOIN Queries

---

# Tech Stack

## Backend
- Node.js
- Express.js

## Database
- MySQL

## Authentication
- JWT (JSON Web Token)
- bcryptjs

## API Testing
- Postman / Thunder Client

## Frontend (Optional Bonus)
- React.js
- Bootstrap

---

# Features

## Authentication
- User Registration
- User Login
- JWT Authentication
- Password Hashing
- Role-Based Authorization

## Course Management
- Add Course
- View Courses
- Update Course
- Delete Course

## Student Management
- Add Student
- Assign Course
- Update Student Course
- Delete Student
- Fetch Students with Course Information

## Security
- Protected Routes
- Admin-only Operations
- Password Encryption

---

# Folder Structure

```
Backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── studentController.js
│   └── courseController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── studentModel.js
│   └── courseModel.js
│
├── routes/
│   ├── authRoutes.js
│   ├── studentRoutes.js
│   └── courseRoutes.js
│
├── .env
├── server.js
└── package.json
```

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
```

## 2. Navigate to Project Folder
```bash
cd Backend
```

## 3. Install Dependencies
```bash
npm install
```

## 4. Create .env File

Create a `.env` file inside the `Backend` folder and add:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_course_db

JWT_SECRET=mysecretkey
```

## 5. Start Server
```bash
npm run dev
```

Server will run on:
`http://localhost:5000`

---

# Database Schema

### Create Database
```sql
CREATE DATABASE student_course_db;

USE student_course_db;
```

### Courses Table
```sql
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_duration INT NOT NULL
);
```

### Students Table
```sql
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    student_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student') DEFAULT 'student',
    course_id INT,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE SET NULL
);
```

---

# API Endpoints

### Authentication APIs
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |

### Course APIs
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/courses` | Add Course |
| GET | `/api/courses` | Get All Courses |
| GET | `/api/courses/:id` | Get Single Course |
| PUT | `/api/courses/:id` | Update Course |
| DELETE | `/api/courses/:id` | Delete Course |

### Student APIs
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/students` | Add Student |
| GET | `/api/students` | Get All Students |
| GET | `/api/courses/:id/students` | Get Students by Course |
| PUT | `/api/students/:id` | Update Student |
| DELETE | `/api/students/:id` | Delete Student |

---

# Authentication

Protected APIs require JWT token.

Example:
`Authorization: Bearer YOUR_TOKEN`

---

# Sample Postman Testing

### Register User
* **POST** `/api/auth/register`
```json
{
  "student_name": "Ameya",
  "email": "ameya@gmail.com",
  "password": "123456",
  "role": "admin"
}
```

### Login User
* **POST** `/api/auth/login`
```json
{
  "email": "ameya@gmail.com",
  "password": "123456"
}
```

### Add Course
* **POST** `/api/courses`
```json
{
  "course_name": "AI Engineering",
  "course_code": "AI101",
  "course_duration": 12
}
```

---

# Future Improvements
* Frontend Dashboard
* Swagger Documentation
* Docker Deployment
* File Uploads
* Advanced Analytics
* Email Notifications

---

# Best Practices Followed
* MVC Architecture
* Clean Code Structure
* Environment Variables
* Password Hashing
* JWT Authentication
* SQL Relationships
* Input Validation
* Error Handling

---

## Author
**Ameya Patil**
