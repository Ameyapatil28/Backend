CREATE DATABASE student_course_db;
USE student_course_db;

CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_duration INT NOT NULL
);

CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    student_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student') DEFAULT 'student',
    course_id INT,
    FOREIGN KEY (course_id)
    REFERENCES courses(course_id)
);

ALTER USER 'root'@'localhost' IDENTIFIED BY 'Ameya@123';

FLUSH PRIVILEGES;

SHOW TABLES;
