# AWER HR Management System

A comprehensive, full-stack Human Resource Management System (HRMS) built for modern organizations. This system streamlines employee tracking, attendance, leave management, and organizational hierarchy with a premium, high-performance user interface.

## Overview

AWER HR is designed to provide a seamless experience for both employees and administrators. It features a robust Express.js API backend powered by Prisma & PostgreSQL, and a stunning Next.js 15 frontend using Tailwind CSS 4 and Shadcn UI.

---

## Role-Based Functionality and Dependencies

The system operates on a multi-tier authorization model where functionality is tailored to specific roles and data integrity is maintained through cross-module dependencies.

### User Roles and Permissions

#### Admin
- System Oversight: Full access to all administrative panels and configuration settings.
- User Management: Ability to create, edit, disable, or delete any user account.
- Department Architecture: Responsible for creating departments, defining department-specific roles, and assigning managers.
- Security: Enforces global access rules and manages the highest level of system data.

#### HR
- Personnel Management: Full visibility into all employee profiles and organizational statistics.
- Leave Workflow: Sole authority (alongside Admin) to approve or reject leave requests across the company.
- Attendance Monitoring: Real-time tracking of employee presence and historical data analysis.
- Department Support: Managing employee assignments and role transitions within departments.

#### Employee
- Self-Service: Access to personal profile management and history.
- Time Tracking: Ability to check-in and check-out to log attendance.
- Leave Requests: Initiating leave applications and tracking their approval status.
- Collaboration: Viewing department colleagues and manager information.

### System Dependencies

- Attendance Analytics: The dashboard charts and presence lists are directly dependent on the real-time check-in/out events triggered by employees.
- Hierarchy Integrity: Department managers are linked to the User module; a department cannot have a manager assigned unless that user exists in the system.
- Salary Compliance: Salary data is strictly dependent on a user having an active department assignment. The system prevents salary updates for users without a designated department.
- Authorization Logic: Access to specific endpoints depends on the JWT role claims. For example, personal data access for employees is granted via a self-check middleware that compares the authenticated user ID with the requested resource ID.

---

## Route and Page Functionalities

This section details the specific operations available on each route based on the authenticated user's role.

### Authentication Routes

#### Login (/login)
- **All Roles**: Entry point to the application. Authenticates credentials and issues a JWT.
- **Unauthenticated**: Redirects to the dashboard if a valid session is already present.

#### Sign Up (/signup)
- **Public**: Allows new individuals to register themselves as Employees in the system.
- **Logic**: Self-registered accounts are restricted to the Employee role by default for security.

### Dashboard Routes

#### Overview (/)
- **Admin/HR**: Displays organizational "North Star" metrics (Total Employees, Presence %, Pending Leaves). Includes weekly attendance charts and a live list of currently checked-in staff.
- **Employee**: Shows a personal greeting and a simplified overview of their own current day's attendance status.

### Employee & Profile Routes

#### Employee Management (/employees)
- **Admin/HR**: Central hub for personnel management. Provides a searchable, filterable table with full CRUD capabilities. Access to "Register Employee" modal.
- **Employee**: Can view a list of colleagues but administrative actions (Edit/Delete/Disable) are hidden.

#### Individual Profile (/employees/[id])
- **Admin/HR**: Deep-dive into any employee's records, including full attendance history, leave history, and contact info. Access to account management buttons.
- **Employee**: When viewing their **own** ID, they see full personal history. When viewing others, they see a limited public profile. Administrative buttons are hidden for all Employees.

### Department Routes

#### Departments (/departments)
- **Admin/HR**: Overview of all organization units. Create and manage departments.
- **Employee**: View-only access to see the list of active departments and their respective managers.

#### Department Details (/departments/[id])
- **Admin/HR**: Manage the department manager (indicated with a star icon), add/remove members, and define specific roles within the department.
- **Employee**: View list of colleagues within the same department and department-specific contact info.

### Workflow Routes

#### Leaves (/leaves)
- **Admin/HR**: Global leave management table. Can review all incoming requests and execute "Approve" or "Reject" actions.
- **Employee**: Personal leave portal. Submit new leave requests and track the status of pending applications.

#### Attendance History (/attendance)
- **Admin/HR**: Full organizational audit trail. Filter by date range or specific employee to monitor compliance and presence.
- **Employee**: Personal attendance log. Review their own check-in/out times and daily durations.

---

## Key Features

### Advanced Authentication & Security
- Role-Based Access Control (RBAC): Distinct permissions for Admin, HR, and Employee roles.
- Public Registration: New employees can sign up directly.
- Self-Service Protection: Employees can access their own data while admins maintain full oversight via authorizeSelfOrAdmin middleware.
- Premium Auth UI: Professional glassmorphism login/signup pages with dynamic floating feature cards.

### Performance Dashboard
- Real-time Stats: Track total employees, attendance percentages, and pending leaves at a glance.
- Attendance Analytics: Weekly visual charts showing check-in trends.
- Live Presence: A "Checked In Today" list that updates in real-time.
- Sticky Navigation: A modern, sticky header that keeps context as you scroll.

---

## Tech Stack

### Frontend
- Framework: Next.js 16.1.7 (App Router)
- Library: React 19.2.4
- Styling: Tailwind CSS 4.2.1
- UI Components: Shadcn UI 4.3.1
- State Management: Zustand 5.0.12
- Data Fetching: TanStack React Query 5.99.2
- Icons: Lucide React 1.8.0
- Form Management: React Hook Form 7.73.1
- API Client: Axios 1.15.2
- Animations: Framer Motion & CSS Keyframes

### Backend
- Framework: Express 5.2.1
- Database: PostgreSQL (via pg 8.20.0)
- ORM: Prisma 7.7.0
- Authentication: JSON Web Tokens (jsonwebtoken 9.0.3)
- Security: Bcrypt 6.0.0
- Development Tooling: TypeScript 6.0.3, Nodemon 3.1.14

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- pnpm (recommended) or npm


### Frontend Setup (hr-system-test)
1. Navigate to the frontend directory:
   ```bash
   cd hr-system-test
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Configure your .env.local:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3002"
   ```
4. Start the development server:
   ```bash
   pnpm run dev
   ```

---

## Architecture Highlights

### The AppAvatar System
A centralized avatar component that handles:
- User-uploaded images.
- DiceBear-generated unique avatars based on usernames.
- Initials fallback with consistent color palettes.

### Persistent Navigation
The sidebar is optimized to use Next.js Link components, ensuring that navigation between dashboard pages is instantaneous and does not trigger expensive layout rerenders.

### Middleware Security
Custom middleware layers like authorizeSelfOrAdmin.ts ensure that a user can only edit their own profile or view their own attendance, while still allowing HR and Admins to manage the entire workforce.

---

## License

This project is licensed under the MIT License.

---

Developed for efficient workforce management.
