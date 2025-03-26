mountain-care/
├── components/
│   ├── common/
│   │   ├── Layout.jsx               // General layout (header, sidebar)
│   │   └── Navbar.jsx               // Top navigation bar
│   ├── auth/
│   │   └── AuthProvider.jsx         // React Context for session data
│   ├── dashboard/
│   │   ├── StatCard.jsx             // Reusable stats card
│   │   └── DashboardGrid.jsx        // Dashboard layout
│   ├── employee/
│   │   ├── EmployeeList.jsx
│   │   ├── EmployeeProfile.jsx
│   │   └── EmployeeForm.jsx
│   ├── attendance/
│   │   └── AttendanceLog.jsx
│   ├── leave/
│   │   ├── LeaveRequestForm.jsx
│   │   ├── LeaveList.jsx
│   │   └── LeaveCalendar.jsx
│   ├── compliance/
│   │   └── ComplianceCard.jsx
│   ├── onboarding/
│   │   └── OnboardingChecklist.jsx
│   └── documents/
│       └── DocumentManager.jsx
│
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].js     // NextAuth config
│   │   ├── employees/
│   │   │   ├── index.js             // GET, POST
│   │   │   └── [id].js              // GET, PUT, DELETE
│   │   ├── attendance.js
│   │   ├── leave.js
│   │   ├── onboarding.js
│   │   ├── compliance.js
│   │   └── documents.js
│   │
│   ├── _app.js                      // Global wrapper (includes AuthProvider, global CSS)
│   ├── index.js                     // Dashboard homepage
│   ├── login.js                     // Public login route
│   ├── employees/
│   │   ├── index.js                 // Employee management overview
│   │   └── [id].js                  // Individual employee profile
│   ├── attendance.js
│   ├── leave.js
│   ├── onboarding.js
│   ├── compliance.js
│   ├── documents.js
│   ├── settings.js
│   └── reports.js
│
├── entities/
│   ├── User.ts                      // TypeORM entity definitions
│   ├── Employee.ts
│   ├── Department.ts
│   ├── Attendance.ts
│   ├── Leave.ts
│   ├── Compliance.ts
│   └── Document.ts
├── ormconfig.js (or .ts)            // TypeORM config for connection, migrations
├── migrations/
│   └── <timestamp>-InitialSetup.ts  // Auto-generated or custom migrations
├── public/
│   └── images/
├── styles/
│   ├── globals.css
│   └── <module-specific>.module.css
├── utils/
│   ├── api.js
│   └── scheduler.js                 // Handling scheduled tasks
├── next.config.js
├── package.json
└── tsconfig.json (if using TypeScript)
