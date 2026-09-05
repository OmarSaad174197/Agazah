# Agazah – Employee & Vacation Management System

Agazah is a full-stack employee and vacation management system built with **ASP.NET Core Web API** and **Angular**.

The system provides a clean and user-friendly interface for managing employees, viewing employee details, and managing their vacation records.

The project was developed with a focus on **Clean Code, separation of concerns, maintainability, validation, error handling, responsive UI/UX, and RESTful API design**.

---

## Features

### Employee Management

* View employees in a paginated table.
* Add a new employee.
* Edit employee information.
* View employee details.
* Delete employees.
* Display employee qualification.
* Display total vacation days.
* Prevent duplicate employee numbers.
* Frontend and backend validation.
* Loading and empty states.
* Arabic user interface.

### Vacation Management

* View employee vacation records.
* Add vacation records.
* Edit vacation records.
* Delete vacation records.
* Display vacation information within the employee details.
* Validate vacation data.

### User Experience

* Fully Arabic interface.
* RTL (Right-to-Left) layout.
* Arabic Angular Material paginator.
* Responsive design.
* Clear success and error messages.
* Confirmation dialogs for destructive operations.
* Loading indicators.
* Empty-state messages.
* User-friendly validation messages.

---

# Architecture

The backend follows a layered architecture with clear separation of responsibilities.

```text
Agazah
│
├── Backend
│   │
│   ├── Agazah.API
│   │   └── Controllers
│   │
│   ├── Agazah.Application
│   │   ├── DTOs
│   │   ├── Services
│   │   ├── Interfaces
│   │   ├── Validators
│   │   └── Mapping
│   │
│   ├── Agazah.Domain
│   │   ├── Entities
│   │   └── Enums
│   │
│   └── Agazah.Infrastructure
│       ├── Persistence
│       ├── Repositories
│       └── UnitOfWork
│
└── Frontend
    │
    └── Agazah
        ├── core
        ├── shared
        └── features
            ├── employees
            └── vacations
```

---

# Technology Stack

## Backend

* C#
* ASP.NET Core Web API
* .NET 8
* Entity Framework Core
* SQL Server
* AutoMapper
* FluentValidation
* Repository Pattern
* Unit of Work
* RESTful APIs
* Swagger / OpenAPI
* Global Exception Handling
* CORS

## Frontend

* Angular 19
* TypeScript
* Angular Material
* RxJS
* HTML5
* CSS3
* Reactive Forms
* HTTP Interceptors
* RTL / Arabic UI

## Database

* Microsoft SQL Server

---

# Validation & Error Handling

The application validates data at both frontend and backend levels.

Examples include:

* Required fields.
* Invalid employee data.
* Invalid qualification values.
* Invalid vacation data.
* Duplicate employee numbers.
* Invalid employee IDs.
* Invalid vacation IDs.
* Invalid pagination parameters.
* API errors.
* Unexpected server errors.

The backend exposes meaningful HTTP status codes and error responses, while the frontend converts API errors into user-friendly Arabic messages.

---

# API Endpoints

## Employees

### Create Employee

```http
POST /api/employees
```

### Get Employee

```http
GET /api/employees/{id}
```

### Get Employees

```http
GET /api/employees?pageNumber=1&pageSize=5
```

### Update Employee

```http
PUT /api/employees/{id}
```

### Delete Employee

```http
DELETE /api/employees/{id}
```

---

## Vacations

Vacation endpoints follow the same RESTful approach for creating, retrieving, updating, and deleting vacation records.

---

# Employee Data

An employee contains information such as:

* Employee Number
* Employee Name
* Birth Date
* Qualification
* Total Vacation Days
* Vacation Records

### Qualifications

```text
High School
Diploma
Bachelor
Master
PhD
```

---

# Getting Started

## Prerequisites

Make sure the following are installed:

* .NET 8 SDK
* Node.js 22.x
* npm
* Angular CLI 19
* SQL Server
* Git

Verify your installations:

```bash
dotnet --version
node --version
npm --version
ng version
```

---

# Clone the Repository

```bash
git clone <https://github.com/OmarSaad174197/Agazah>
```

Then:

```bash
cd Agazah
```

---

# Backend Setup

Navigate to the backend:

```bash
cd Backend
```

Restore dependencies:

```bash
dotnet restore
```

Build the solution:

```bash
dotnet build
```

---

## Database Configuration

Configure the SQL Server connection string in the backend configuration.

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=AgazahDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

---

## Database Migration

If migrations are available, apply them using:

```bash
dotnet ef database update
```

If Entity Framework CLI is not installed:

```bash
dotnet tool install --global dotnet-ef
```

Then run:

```bash
dotnet ef database update
```

---

# Run the Backend

From the `Backend` directory, run the API project:

```bash
dotnet run --project Agazah.API
```

Swagger will be available through the URL shown in the terminal.

For example:

```text
https://localhost:<port>/swagger/index.html
```

---

# Frontend Setup

Open another terminal and navigate to:

```bash
cd Frontend/Agazah
```

Install dependencies:

```bash
npm install
```

Run the Angular application:

```bash
ng serve
```

Then open:

```text
http://localhost:4200
```

---

# Frontend ↔ Backend

The Angular application communicates with the ASP.NET Core API through HTTP services.

The API URL is configured through the Angular environment configuration.

Make sure the backend is running before using the frontend.

The expected flow is:

```text
Angular
   │
   │ HTTP
   ▼
ASP.NET Core API
   │
   ▼
Application Services
   │
   ▼
Repositories / Unit of Work
   │
   ▼
Entity Framework Core
   │
   ▼
SQL Server
```

---

# Testing the Application

Before considering the application ready, verify the following scenarios.

## Employee

* [ ] Create employee with valid data.
* [ ] Create employee with missing required data.
* [ ] Create employee with duplicate employee number.
* [ ] View employee details.
* [ ] Edit employee.
* [ ] Delete employee.
* [ ] Try deleting an invalid employee.
* [ ] Verify pagination.
* [ ] Verify empty employee list.
* [ ] Verify loading state.

## Vacation

* [ ] Create vacation.
* [ ] Edit vacation.
* [ ] Delete vacation.
* [ ] View vacation records.
* [ ] Validate vacation dates.
* [ ] Test invalid employee/vacation IDs.
* [ ] Test relevant edge cases.

## UI

* [ ] Arabic text displayed correctly.
* [ ] RTL layout works correctly.
* [ ] Validation messages are Arabic.
* [ ] Error messages are Arabic.
* [ ] Confirmation dialogs are Arabic.
* [ ] Paginator is Arabic.
* [ ] Loading states work.
* [ ] Empty states work.
* [ ] Responsive layout works.

---

# Git Workflow

The repository uses the following branch strategy:

```text
main
  │
  └── Production / Stable Version

develop
  │
  ├── feature/*
  ├── bugfix/*
  └── hotfix/*
```

For new development:

```bash
git checkout develop
git pull origin develop
```

Create a feature branch:

```bash
git checkout -b feature/my-feature
```

After completing the work:

```bash
git add .
git commit -m "feat: implement my feature"
git push -u origin feature/my-feature
```

Then create a Pull Request:

```text
feature/my-feature
        ↓
      develop
```

After review and testing, merge the Pull Request into `develop`.

---

# Commit Convention

The project follows conventional commit-style messages.

Examples:

```text
feat: add employee creation
feat: implement vacation management
fix: handle duplicate employee number
fix: resolve paginator localization
refactor: improve employee service
style: improve employee table layout
docs: update project documentation
```

Keep commits:

* Small
* Focused
* Descriptive
* Related to one logical change

---

# Clean Code & Best Practices

The project follows several development practices:

* Separation of concerns.
* Dependency Injection.
* DTOs instead of exposing domain entities directly.
* Repository Pattern.
* Unit of Work.
* Service layer.
* FluentValidation.
* AutoMapper.
* Async programming.
* CancellationToken support.
* Centralized exception handling.
* Consistent API responses.
* Strong typing in Angular.
* Reactive Forms.
* Centralized HTTP error handling.
* Reusable Angular components.
* Reusable shared helpers.
* Environment-based configuration.
* Meaningful naming.
* Avoiding unnecessary duplication.

---

# Important Files

### Backend

```text
Backend/
├── Agazah.API/
├── Agazah.Application/
├── Agazah.Domain/
└── Agazah.Infrastructure/
```

### Frontend

```text
Frontend/Agazah/
├── src/
│   └── app/
│       ├── core/
│       ├── shared/
│       └── features/
│           ├── employees/
│           └── vacations/
├── angular.json
├── package.json
└── tsconfig.json
```

---

# Security Notes

Never commit:

* Database passwords.
* API keys.
* Access tokens.
* JWT secrets.
* Production credentials.
* Environment secrets.
* `node_modules`.
* Build output.
* `bin` / `obj`.

Use environment variables, User Secrets, or an appropriate secret-management solution for sensitive configuration.

---

# Project Purpose

Agazah was built as a practical full-stack application demonstrating how a modern business application can be structured using:

**ASP.NET Core + Entity Framework Core + SQL Server + Angular + Angular Material**

The project focuses not only on implementing CRUD operations, but also on maintainability, validation, error handling, user experience, clean architecture principles, and professional Git workflow.

---

# Current Status

The project contains:

* Employee management.
* Vacation management.
* RESTful backend APIs.
* Angular frontend.
* Server-side pagination.
* Frontend validation.
* Backend validation.
* Arabic RTL interface.
* Error handling.
* Loading and empty states.
* Employee details.
* Git-based development workflow.

---

# License

This project is intended for demonstration, learning, and portfolio purposes.
