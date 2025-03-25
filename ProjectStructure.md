# Mountain Care HR Management - Project Structure

```
mountain-care-hr/
│
├── assets/
│   ├── css/
│   │   ├── main.css            # Global styles
│   │   ├── dashboard.css       # Dashboard specific styles
│   │   ├── employees.css       # Employee management styles
│   │   ├── attendance.css      # Attendance tracking styles
│   │   ├── leave.css           # Leave management styles
│   │   ├── onboarding.css      # Onboarding process styles
│   │   ├── offboarding.css     # Offboarding process styles
│   │   ├── compliance.css      # Compliance tracking styles
│   │   ├── documents.css       # Document management styles
│   │   └── settings.css        # Settings page styles
│   │
│   ├── js/
│   │   ├── main.js             # Global JavaScript functions
│   │   ├── dashboard.js        # Dashboard specific functionality
│   │   ├── employees.js        # Employee management functionality
│   │   ├── attendance.js       # Attendance tracking functionality
│   │   ├── leave.js            # Leave management functionality
│   │   ├── onboarding.js       # Onboarding process functionality
│   │   ├── offboarding.js      # Offboarding process functionality
│   │   ├── compliance.js       # Compliance tracking functionality
│   │   ├── documents.js        # Document management functionality
│   │   ├── settings.js         # Settings functionality
│   │   └── charts.js           # Chart visualization functionality
│   │
│   ├── img/
│   │   ├── logo.png            # Company logo
│   │   ├── user-avatars/       # User profile pictures
│   │   ├── icons/              # Custom icons
│   │   └── backgrounds/        # Background images
│   │
│   └── fonts/                  # Custom font files
│
├── pages/
│   ├── index.html              # Dashboard/Home page (renamed from example.html)
│   ├── employees/
│   │   ├── index.html          # Employee list
│   │   ├── add.html            # Add new employee
│   │   ├── edit.html           # Edit employee details
│   │   ├── profile.html        # Employee profile view
│   │   └── departments.html    # Department management
│   │
│   ├── attendance/
│   │   ├── index.html          # Attendance overview
│   │   ├── tracking.html       # Daily attendance tracking
│   │   └── reports.html        # Attendance reports
│   │
│   ├── leave/
│   │   ├── index.html          # Leave management overview
│   │   ├── request.html        # Submit leave request
│   │   ├── calendar.html       # Leave calendar view
│   │   └── approval.html       # Leave approval workflow
│   │
│   ├── onboarding/
│   │   ├── index.html          # Onboarding overview
│   │   ├── checklist.html      # Onboarding checklist
│   │   └── status.html         # Onboarding status tracking
│   │
│   ├── offboarding/
│   │   ├── index.html          # Offboarding overview
│   │   ├── checklist.html      # Offboarding checklist
│   │   └── exit-interviews.html # Exit interview management
│   │
│   ├── compliance/
│   │   ├── index.html          # Compliance overview
│   │   ├── licenses.html       # License tracking
│   │   ├── certifications.html # Certification tracking
│   │   └── training.html       # Training compliance
│   │
│   ├── documents/
│   │   ├── index.html          # Document management overview
│   │   ├── templates.html      # Document templates
│   │   ├── upload.html         # Document upload interface
│   │   └── archive.html        # Document archive
│   │
│   └── settings/
│       ├── index.html          # Settings overview
│       ├── profile.html        # User profile settings
│       ├── company.html        # Company settings
│       ├── notifications.html  # Notification preferences
│       └── roles.html          # User roles and permissions
│
├── components/
│   ├── header.html             # Header component (to be included)
│   ├── sidebar.html            # Sidebar navigation (to be included)
│   ├── footer.html             # Footer component (to be included)
│   ├── cards/
│   │   ├── stat-card.html      # Statistics card component
│   │   ├── module-card.html    # Module card component
│   │   └── employee-card.html  # Employee card component
│   ├── forms/
│   │   ├── employee-form.html  # Employee data form
│   │   ├── leave-form.html     # Leave request form
│   │   └── search-form.html    # Search component
│   └── modals/
│       ├── confirm-modal.html  # Confirmation dialog
│       ├── alert-modal.html    # Alert dialog
│       └── form-modal.html     # Form dialog
│
└── db/                         # Mock database files (JSON) for development
    ├── employees.json          # Employee data
    ├── attendance.json         # Attendance records
    ├── leave-requests.json     # Leave request data
    ├── licenses.json           # License tracking data
    ├── activities.json         # Activity feed data
    └── settings.json           # System settings
```