# Requirements Document

## Introduction

The Narxoz College Management System is a web-based platform designed to facilitate academic operations for Narxoz College. The system provides role-based access for three user types: Administrators, Teachers, and Students. It enables real-time data synchronization across all users, ensuring that schedule changes, grade submissions, news updates, and resource availability are immediately reflected for all relevant parties. The system integrates multiple modules including news management, scheduling, grading, shop management, library management, and file exchange capabilities.

## Glossary

- **System**: The Narxoz College Management System
- **Administrator**: A user with full system access and management capabilities
- **Teacher**: A user who can view subjects, submit grades, and manage teaching materials
- **Student**: A user who can view schedules, grades, news, and upload assignments
- **Grade_Submission_Window**: The time period during which teachers are allowed to submit grades
- **Real_Time_Sync**: Automatic data synchronization across all connected users without manual refresh
- **Narxoz_Shop**: The college shop module displaying products and availability
- **Library**: The college library module displaying books and their availability status
- **Materials_Exchange**: The file upload/download system for teachers and students
- **RBAC**: Role-Based Access Control system
- **Supabase**: The backend database and authentication service

## Requirements

### Requirement 1: User Authentication and Authorization

**User Story:** As a system user, I want to securely authenticate and access features appropriate to my role, so that I can perform my designated tasks while maintaining system security.

#### Acceptance Criteria

1. WHEN a user attempts to log in with valid credentials, THE System SHALL authenticate the user and grant access to role-appropriate features
2. WHEN a user attempts to log in with invalid credentials, THE System SHALL reject the authentication attempt and display an error message
3. WHEN a user requests password recovery, THE System SHALL send a password reset link to the registered email address
4. THE System SHALL maintain separate authentication sessions for Administrator, Teacher, and Student roles
5. WHEN a user's session expires, THE System SHALL require re-authentication before allowing further access
6. THE System SHALL enforce role-based access control for all protected resources

### Requirement 2: Administrator User Management

**User Story:** As an Administrator, I want to manage all system users, so that I can control who has access to the system and what roles they have.

#### Acceptance Criteria

1. WHEN an Administrator adds a new user, THE System SHALL create the user account with the specified role (Student, Teacher, or Administrator)
2. WHEN an Administrator removes a user, THE System SHALL deactivate the user account and revoke all access permissions
3. WHEN an Administrator assigns a role to a user, THE System SHALL update the user's permissions to match the assigned role
4. WHEN an Administrator changes a user's role, THE System SHALL immediately update the user's access permissions
5. THE System SHALL display a list of all users with their current roles and status to Administrators
6. WHEN an Administrator blocks a user, THE System SHALL prevent that user from logging in until unblocked

### Requirement 3: Schedule Management

**User Story:** As an Administrator, I want to create and edit schedules, so that teachers and students can view their class timetables.

#### Acceptance Criteria

1. WHEN an Administrator creates a schedule entry, THE System SHALL store the schedule with date, time, subject, teacher, and group information
2. WHEN an Administrator edits a schedule entry, THE System SHALL update the schedule and synchronize changes to all affected users in real-time
3. WHEN an Administrator deletes a schedule entry, THE System SHALL remove the entry and notify affected users in real-time
4. WHEN a Teacher views the schedule, THE System SHALL display only classes assigned to that teacher
5. WHEN a Student views the schedule, THE System SHALL display only classes for that student's group
6. THE System SHALL organize schedule entries by date and time in chronological order

### Requirement 4: News Management

**User Story:** As an Administrator, I want to publish news articles, so that all users can stay informed about college announcements and events.

#### Acceptance Criteria

1. WHEN an Administrator creates a news article, THE System SHALL store the article with title, content, author, and publication date
2. WHEN an Administrator publishes a news article, THE System SHALL make it visible to all users in real-time
3. WHEN an Administrator edits a news article, THE System SHALL update the content and synchronize changes to all users in real-time
4. WHEN an Administrator deletes a news article, THE System SHALL remove it from all user views in real-time
5. THE System SHALL display news articles sorted by publication date with newest first
6. WHEN any user views the news section, THE System SHALL display all published news articles

### Requirement 5: Grade Management

**User Story:** As a Teacher, I want to submit grades for my students, so that students can track their academic performance.

#### Acceptance Criteria

1. WHEN a Teacher submits a grade for a student, THE System SHALL store the grade with subject, student, date, and grade value
2. WHEN a Teacher submits a grade, THE System SHALL synchronize the grade to the student's gradebook in real-time
3. WHEN the Grade_Submission_Window is closed by an Administrator, THE System SHALL prevent teachers from submitting or editing grades
4. WHEN the Grade_Submission_Window is open, THE System SHALL allow teachers to submit and edit grades for their assigned subjects
5. WHEN a Student views their grades, THE System SHALL display all grades organized by subject and date
6. THE System SHALL display only grades for subjects that the Teacher is assigned to teach

### Requirement 6: Grade Submission Time Control

**User Story:** As an Administrator, I want to control when teachers can submit grades, so that I can enforce grading deadlines and policies.

#### Acceptance Criteria

1. WHEN an Administrator sets a grade submission deadline, THE System SHALL store the deadline configuration
2. WHEN the current time exceeds the grade submission deadline, THE System SHALL prevent all teachers from submitting or editing grades
3. WHEN an Administrator reopens the Grade_Submission_Window, THE System SHALL allow teachers to submit grades again
4. WHEN a Teacher attempts to submit a grade outside the Grade_Submission_Window, THE System SHALL reject the submission and display an error message
5. THE System SHALL display the current grade submission status to teachers (open or closed)

### Requirement 7: Narxoz Shop Management

**User Story:** As an Administrator, I want to manage shop products, so that users can view available items and their availability status.

#### Acceptance Criteria

1. WHEN an Administrator adds a product to Narxoz_Shop, THE System SHALL store the product with name, description, price, and availability status
2. WHEN an Administrator updates product availability, THE System SHALL synchronize the availability status to all users in real-time
3. WHEN an Administrator edits product information, THE System SHALL update the product details and synchronize changes to all users in real-time
4. WHEN an Administrator deletes a product, THE System SHALL remove it from the shop display for all users in real-time
5. WHEN any user views Narxoz_Shop, THE System SHALL display all products with their current availability status
6. THE System SHALL organize products by category or name for easy browsing

### Requirement 8: Library Management

**User Story:** As an Administrator, I want to manage library books, so that users can view available books and their occupancy status.

#### Acceptance Criteria

1. WHEN an Administrator adds a book to the Library, THE System SHALL store the book with title, author, ISBN, and availability status
2. WHEN an Administrator updates book availability status, THE System SHALL synchronize the status to all users in real-time
3. WHEN an Administrator edits book information, THE System SHALL update the book details and synchronize changes to all users in real-time
4. WHEN an Administrator deletes a book, THE System SHALL remove it from the library display for all users in real-time
5. WHEN any user views the Library, THE System SHALL display all books with their current status (available or occupied)
6. THE System SHALL organize books by title, author, or category for easy searching

### Requirement 9: Materials Exchange System

**User Story:** As a Teacher, I want to upload teaching materials and view student submissions, so that I can share resources and collect assignments.

#### Acceptance Criteria

1. WHEN a Teacher uploads a file, THE System SHALL store the file with metadata (filename, upload date, uploader, subject)
2. WHEN a Teacher uploads a file, THE System SHALL make it visible to students in the assigned group in real-time
3. WHEN a Student uploads a file, THE System SHALL store the file and make it visible to the assigned teacher in real-time
4. THE System SHALL organize uploaded files by subject and upload date
5. WHEN a Teacher views student materials, THE System SHALL display all files uploaded by students in their assigned groups
6. THE System SHALL support common file formats (PDF, DOCX, PPTX, images)

### Requirement 10: Student Materials Submission

**User Story:** As a Student, I want to upload homework and projects, so that my teachers can review my work.

#### Acceptance Criteria

1. WHEN a Student uploads a file, THE System SHALL store the file with metadata (filename, upload date, student name, subject)
2. WHEN a Student uploads a file, THE System SHALL make it visible to the assigned teacher in real-time
3. WHEN a Student views teacher materials, THE System SHALL display all files uploaded by teachers for their subjects
4. THE System SHALL allow students to upload multiple files for different assignments
5. THE System SHALL display upload confirmation to the student after successful file upload

### Requirement 11: Real-Time Data Synchronization

**User Story:** As a system user, I want to see updates immediately without refreshing, so that I always have the most current information.

#### Acceptance Criteria

1. WHEN any data is created, updated, or deleted by any user, THE System SHALL propagate changes to all connected users within 2 seconds
2. WHEN a Student is viewing grades and a Teacher submits a new grade, THE System SHALL display the new grade without requiring a page refresh
3. WHEN a user is viewing the schedule and an Administrator makes changes, THE System SHALL update the displayed schedule without requiring a page refresh
4. WHEN a user is viewing news and an Administrator publishes a new article, THE System SHALL display the new article without requiring a page refresh
5. WHEN a user is viewing Narxoz_Shop or Library and availability changes, THE System SHALL update the status without requiring a page refresh
6. THE System SHALL maintain real-time synchronization using Supabase real-time subscriptions

### Requirement 12: Teacher Subject and Group Assignment

**User Story:** As a Teacher, I want to view my assigned subjects and groups, so that I know which classes I am responsible for.

#### Acceptance Criteria

1. WHEN a Teacher logs in, THE System SHALL display all subjects assigned to that teacher
2. WHEN a Teacher logs in, THE System SHALL display all student groups assigned to that teacher
3. WHEN an Administrator assigns a subject to a Teacher, THE System SHALL update the teacher's subject list in real-time
4. WHEN an Administrator assigns a group to a Teacher, THE System SHALL update the teacher's group list in real-time
5. THE System SHALL only allow teachers to submit grades for students in their assigned groups and subjects

### Requirement 13: Multi-Language Support

**User Story:** As a system user, I want to use the system in my preferred language, so that I can understand all content and interface elements.

#### Acceptance Criteria

1. THE System SHALL support Kazakh and Russian languages
2. WHEN a user selects a language preference, THE System SHALL display all interface elements in the selected language
3. WHEN a user changes language preference, THE System SHALL update the interface language without requiring logout
4. THE System SHALL persist the user's language preference across sessions
5. THE System SHALL display content (news, materials) in the language it was created in

### Requirement 14: Data Protection and Security

**User Story:** As a system administrator, I want user data to be protected, so that sensitive information remains secure and private.

#### Acceptance Criteria

1. THE System SHALL encrypt all passwords using industry-standard hashing algorithms
2. THE System SHALL transmit all data over HTTPS connections
3. THE System SHALL enforce role-based access control for all data operations
4. WHEN a user attempts to access unauthorized resources, THE System SHALL deny access and log the attempt
5. THE System SHALL store uploaded files securely with access restricted to authorized users
6. THE System SHALL comply with data protection regulations for educational institutions

### Requirement 15: Action Logging and Audit Trail

**User Story:** As an Administrator, I want to view system activity logs, so that I can monitor usage and investigate issues.

#### Acceptance Criteria

1. WHEN any user performs a significant action, THE System SHALL log the action with timestamp, user, and action details
2. THE System SHALL log user authentication attempts (successful and failed)
3. THE System SHALL log data modifications (create, update, delete operations)
4. WHEN an Administrator views the audit log, THE System SHALL display all logged actions with filtering and search capabilities
5. THE System SHALL retain audit logs for a minimum of 90 days
6. THE System SHALL protect audit logs from unauthorized modification or deletion

### Requirement 16: User Interface and Experience

**User Story:** As a system user, I want an intuitive and visually appealing interface, so that I can efficiently complete my tasks.

#### Acceptance Criteria

1. THE System SHALL provide a responsive design that works on desktop and mobile devices
2. THE System SHALL use a consistent colorful gradient design system across all pages
3. THE System SHALL provide clear navigation between different modules and features
4. WHEN a user performs an action, THE System SHALL provide immediate visual feedback
5. THE System SHALL display loading indicators during data operations
6. THE System SHALL organize information in a clear and logical hierarchy

### Requirement 17: Administrator Panel

**User Story:** As an Administrator, I want a centralized admin panel, so that I can efficiently manage all system aspects.

#### Acceptance Criteria

1. THE System SHALL provide an admin panel with access to all management functions
2. THE System SHALL organize admin functions into logical categories (users, schedule, news, shop, library, settings)
3. WHEN an Administrator accesses the admin panel, THE System SHALL display summary statistics and recent activity
4. THE System SHALL provide quick access to frequently used admin functions
5. THE System SHALL display admin-specific notifications and alerts

### Requirement 18: Error Handling and User Feedback

**User Story:** As a system user, I want clear error messages and feedback, so that I understand what went wrong and how to fix it.

#### Acceptance Criteria

1. WHEN an error occurs, THE System SHALL display a user-friendly error message in the user's selected language
2. WHEN a user submits invalid data, THE System SHALL highlight the specific fields with errors and provide correction guidance
3. WHEN a user successfully completes an action, THE System SHALL display a confirmation message
4. WHEN a system error occurs, THE System SHALL log the error details for administrator review
5. THE System SHALL provide helpful tooltips and hints for complex operations

### Requirement 19: File Upload Validation

**User Story:** As a system administrator, I want uploaded files to be validated, so that the system remains secure and storage is used efficiently.

#### Acceptance Criteria

1. WHEN a user uploads a file, THE System SHALL validate the file type against allowed formats
2. WHEN a user uploads a file exceeding the size limit, THE System SHALL reject the upload and display an error message
3. THE System SHALL scan uploaded files for malicious content before storage
4. WHEN a user uploads a file with an invalid format, THE System SHALL reject the upload and display allowed formats
5. THE System SHALL enforce a maximum file size limit of 50MB per upload
6. THE System SHALL display upload progress for large files

### Requirement 20: Session Management

**User Story:** As a system user, I want my session to be managed securely, so that my account remains protected while providing convenient access.

#### Acceptance Criteria

1. THE System SHALL maintain user sessions for 24 hours of inactivity
2. WHEN a user closes the browser, THE System SHALL preserve the session for the configured duration
3. WHEN a user logs out, THE System SHALL immediately terminate the session and clear authentication tokens
4. WHEN a user's session expires, THE System SHALL redirect to the login page and display a session timeout message
5. THE System SHALL allow only one active session per user account
6. WHEN a user logs in from a new device, THE System SHALL optionally terminate previous sessions based on security settings
