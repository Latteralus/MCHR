/**
 * Mountain Care HR - Dashboard JavaScript
 * 
 * This file contains JavaScript functionality specific to the dashboard page,
 * including chart initialization, data loading, and interactive elements.
 */

// Add dashboard functionality to the MountainCare namespace
MountainCare.pages.dashboard = {
    // Chart instances
    charts: {
        attendance: null,
        departments: null,
        employeeGrowth: null
    },
    
    // Dashboard data
    data: {
        stats: {},
        licenses: [],
        activities: [],
        attendance: {},
        departments: {},
        employeeGrowth: {},
        events: []
    },
    
    /**
     * Initialize the dashboard
     */
    init: function() {
        console.log('Initializing dashboard...');
        
        // Load dashboard data
        this.loadDashboardData();
        
        // Initialize charts
        this.initCharts();
        
        // Initialize interactive elements
        this.initInteractiveElements();
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('Dashboard initialized');
    },
    
    /**
     * Load dashboard data from API or mock data
     */
    loadDashboardData: function() {
        // In a real application, this would fetch from an API
        // For now, we'll use mock data
        
        // Show loading states
        this.showLoadingStates();
        
        // Simulate API delay
        setTimeout(() => {
            // Load mock data
            this.loadMockData();
            
            // Update UI with data
            this.updateDashboardUI();
            
            // Hide loading states
            this.hideLoadingStates();
        }, 800);
    },
    
    /**
     * Show loading states for dashboard widgets
     */
    showLoadingStates: function() {
        // Add loading state to stats cards
        document.querySelectorAll('.stat-card .stat-value').forEach(el => {
            el.innerHTML = '<div class="skeleton-loader" style="width: 80%; height: 30px;"></div>';
        });
        
        // Add loading state to chart containers
        document.querySelectorAll('.chart-container').forEach(container => {
            const loadingEl = document.createElement('div');
            loadingEl.className = 'chart-loading';
            loadingEl.innerHTML = '<div class="chart-loading-spinner"></div>';
            container.appendChild(loadingEl);
        });
    },
    
    /**
     * Hide loading states for dashboard widgets
     */
    hideLoadingStates: function() {
        // Remove chart loading indicators
        document.querySelectorAll('.chart-loading').forEach(el => {
            el.remove();
        });
    },
    
    /**
     * Load mock data for the dashboard
     */
    loadMockData: function() {
        // Stats data
        this.data.stats = {
            employees: {
                total: 198,
                trend: 3.2,
                trendDirection: 'up'
            },
            attendance: {
                rate: 96.5,
                trend: 1.8,
                trendDirection: 'up'
            },
            leaveRequests: {
                total: 12,
                trend: 2.5,
                trendDirection: 'down'
            },
            compliance: {
                rate: 98.2,
                trend: 0.7,
                trendDirection: 'up'
            }
        };
        
        // License expiry data
        this.data.licenses = [
            {
                id: 1,
                name: 'James Kirk',
                type: 'Pharmacist License',
                daysLeft: 7,
                status: 'danger',
                avatar: 'JK'
            },
            {
                id: 2,
                name: 'Leonard McCoy',
                type: 'Pharmacy Tech License',
                daysLeft: 14,
                status: 'warning',
                avatar: 'LM'
            },
            {
                id: 3,
                name: 'Nyota Uhura',
                type: 'Controlled Substance License',
                daysLeft: 21,
                status: 'warning',
                avatar: 'NU'
            },
            {
                id: 4,
                name: 'William Manager',
                type: '90 Day Review',
                daysLeft: 23,
                status: 'warning',
                avatar: 'WM'
            },
            {
                id: 5,
                name: 'Washington State',
                type: 'State License Renewal',
                daysLeft: 25,
                status: 'warning',
                avatar: 'WS'
            }
        ];
        
        // Recent activity data
        this.data.activities = [
            {
                id: 1,
                user: 'Sarah Johnson',
                action: 'approved time off request for Emily Chen',
                timestamp: 'Today, 10:30 AM'
            },
            {
                id: 2,
                user: 'David Wilson',
                action: 'uploaded a new document to the compliance portal',
                timestamp: 'Today, 9:45 AM'
            },
            {
                id: 3,
                user: 'Lisa Patel',
                action: 'completed onboarding for Mark Thompson',
                timestamp: 'Today, 8:15 AM'
            },
            {
                id: 4,
                user: 'James Rodriguez',
                action: 'updated the employee handbook',
                timestamp: 'Yesterday, 4:30 PM'
            },
            {
                id: 5,
                user: 'Maria Garcia',
                action: 'added 3 new training modules to the compliance system',
                timestamp: 'Yesterday, 2:15 PM'
            }
        ];
        
        // Attendance data
        this.data.attendance = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'],
            datasets: [
                {
                    label: 'Present',
                    data: [185, 188, 187, 184, 180, 25, 20, 190, 191, 188, 186, 182, 24, 22, 190, 192, 188, 185, 180, 23, 20, 188, 190, 185, 183, 178, 22, 20, 190, 188],
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'Absent',
                    data: [8, 5, 6, 9, 13, 2, 1, 3, 2, 5, 7, 11, 1, 0, 3, 1, 5, 8, 13, 2, 1, 5, 3, 8, 10, 15, 2, 1, 3, 5],
                    backgroundColor: 'rgba(244, 67, 54, 0.2)',
                    borderColor: 'rgba(244, 67, 54, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'Leave',
                    data: [5, 5, 5, 5, 5, 0, 0, 5, 5, 5, 5, 5, 0, 0, 5, 5, 5, 5, 5, 0, 0, 5, 5, 5, 5, 5, 0, 0, 5, 5],
                    backgroundColor: 'rgba(255, 152, 0, 0.2)',
                    borderColor: 'rgba(255, 152, 0, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        };
        
        // Department data
        this.data.departments = {
            labels: ['Administration', 'Pharmacy', 'Nursing', 'Physicians', 'Technicians', 'Support Staff'],
            datasets: [{
                data: [15, 42, 58, 30, 45, 28],
                backgroundColor: [
                    'rgba(0, 121, 107, 0.8)',
                    'rgba(0, 188, 212, 0.8)',
                    'rgba(77, 182, 172, 0.8)',
                    'rgba(0, 150, 136, 0.8)',
                    'rgba(38, 166, 154, 0.8)',
                    'rgba(128, 203, 196, 0.8)'
                ],
                borderWidth: 1
            }]
        };
        
        // Upcoming events
        this.data.events = [
            {
                id: 1,
                title: 'Department Head Meeting',
                date: 'Mar 27, 2025',
                time: '10:00 AM',
                location: 'Conference Room A',
                attendees: 12
            },
            {
                id: 2,
                title: 'Quarterly Review',
                date: 'Mar 28, 2025',
                time: '2:00 PM',
                location: 'Conference Room B',
                attendees: 8
            },
            {
                id: 3,
                title: 'New Employee Orientation',
                date: 'Apr 1, 2025',
                time: '9:00 AM',
                location: 'Training Room',
                attendees: 5
            }
        ];
    },
    
    /**
     * Update dashboard UI with loaded data
     */
    updateDashboardUI: function() {
        // Update stats cards
        this.updateStatsCards();
        
        // Update license items
        this.updateLicenseItems();
        
        // Update activity feed
        this.updateActivityFeed();
        
        // Update charts
        this.updateCharts();
        
        // Update upcoming events
        this.updateUpcomingEvents();
    },
    
    /**
     * Update stats cards with the latest data
     */
    updateStatsCards: function() {
        const stats = this.data.stats;
        
        // Update employee count
        const employeeStatEl = document.querySelector('.stat-card:nth-child(1) .stat-value');
        if (employeeStatEl) {
            employeeStatEl.textContent = stats.employees.total;
            
            const trendEl = employeeStatEl.parentNode.querySelector('.stat-trend');
            if (trendEl) {
                trendEl.className = `stat-trend trend-${stats.employees.trendDirection}`;
                trendEl.innerHTML = `<i class="fas fa-arrow-${stats.employees.trendDirection}"></i> ${stats.employees.trend}%`;
            }
        }
        
        // Update attendance rate
        const attendanceStatEl = document.querySelector('.stat-card:nth-child(2) .stat-value');
        if (attendanceStatEl) {
            attendanceStatEl.textContent = `${stats.attendance.rate}%`;
            
            const trendEl = attendanceStatEl.parentNode.querySelector('.stat-trend');
            if (trendEl) {
                trendEl.className = `stat-trend trend-${stats.attendance.trendDirection}`;
                trendEl.innerHTML = `<i class="fas fa-arrow-${stats.attendance.trendDirection}"></i> ${stats.attendance.trend}%`;
            }
        }
        
        // Update leave requests
        const leaveStatEl = document.querySelector('.stat-card:nth-child(3) .stat-value');
        if (leaveStatEl) {
            leaveStatEl.textContent = stats.leaveRequests.total;
            
            const trendEl = leaveStatEl.parentNode.querySelector('.stat-trend');
            if (trendEl) {
                trendEl.className = `stat-trend trend-${stats.leaveRequests.trendDirection}`;
                trendEl.innerHTML = `<i class="fas fa-arrow-${stats.leaveRequests.trendDirection}"></i> ${stats.leaveRequests.trend}%`;
            }
        }
        
        // Update compliance rate
        const complianceStatEl = document.querySelector('.stat-card:nth-child(4) .stat-value');
        if (complianceStatEl) {
            complianceStatEl.textContent = `${stats.compliance.rate}%`;
            
            const trendEl = complianceStatEl.parentNode.querySelector('.stat-trend');
            if (trendEl) {
                trendEl.className = `stat-trend trend-${stats.compliance.trendDirection}`;
                trendEl.innerHTML = `<i class="fas fa-arrow-${stats.compliance.trendDirection}"></i> ${stats.compliance.trend}%`;
            }
        }
    },
    
    /**
     * Update license items with the latest data
     */
    updateLicenseItems: function() {
        const licenseContainer = document.querySelector('.card-header:contains("License Operations")').parentNode.querySelector('.card-body');
        if (!licenseContainer) return;
        
        let licenseHTML = '';
        
        this.data.licenses.forEach(license => {
            licenseHTML += `
                <div class="license-item" data-id="${license.id}">
                    <div class="avatar">${license.avatar}</div>
                    <div class="license-item-info">
                        <div class="license-item-name">${license.name}</div>
                        <div class="license-item-detail">${license.type}</div>
                    </div>
                    <div class="status status-${license.status}">${license.daysLeft} days</div>
                </div>
            `;
        });
        
        licenseContainer.innerHTML = licenseHTML;
        
        // Add click handlers
        licenseContainer.querySelectorAll('.license-item').forEach(item => {
            item.addEventListener('click', () => {
                const licenseId = parseInt(item.getAttribute('data-id'));
                const license = this.data.licenses.find(l => l.id === licenseId);
                
                if (license) {
                    // Navigate to license detail page
                    // In a real app, this would go to a specific license page
                    window.location.href = `/pages/compliance/licenses.html?id=${licenseId}`;
                }
            });
        });
    },
    
    /**
     * Update activity feed with the latest data
     */
    updateActivityFeed: function() {
        const activityContainer = document.querySelector('.activity-feed');
        if (!activityContainer) return;
        
        let activityHTML = '';
        
        this.data.activities.forEach(activity => {
            activityHTML += `
                <div class="activity-item">
                    <div class="activity-badge"></div>
                    <div class="activity-time">${activity.timestamp}</div>
                    <div class="activity-description">
                        <span class="activity-user">${activity.user}</span> ${activity.action}
                    </div>
                </div>
            `;
        });
        
        activityContainer.innerHTML = activityHTML;
    },
    
    /**
     * Update upcoming events table
     */
    updateUpcomingEvents: function() {
        const eventsTable = document.querySelector('.card-header:contains("Upcoming Events")').parentNode.querySelector('tbody');
        if (!eventsTable) return;
        
        let eventsHTML = '';
        
        this.data.events.forEach(event => {
            eventsHTML += `
                <tr>
                    <td>${event.date}</td>
                    <td>${event.title}</td>
                    <td>${event.time}</td>
                    <td>${event.location}</td>
                    <td>${event.attendees}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-icon" data-tooltip="View Details" data-event-id="${event.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon" data-tooltip="Edit Event" data-event-id="${event.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        eventsTable.innerHTML = eventsHTML;
        
        // Initialize tooltips
        MountainCare.initTooltips();
        
        // Add event handlers
        eventsTable.querySelectorAll('.btn-icon').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const eventId = parseInt(btn.getAttribute('data-event-id'));
                const event = this.data.events.find(ev => ev.id === eventId);
                
                if (event) {
                    if (btn.querySelector('.fa-eye')) {
                        // View event details
                        this.viewEventDetails(event);
                    } else if (btn.querySelector('.fa-edit')) {
                        // Edit event
                        this.editEvent(event);
                    }
                }
                
                e.stopPropagation();
            });
        });
    },
    
    /**
     * View event details
     */
    viewEventDetails: function(event) {
        // In a real app, this would show a modal with event details
        MountainCare.showToast(`Viewing details for: ${event.title}`, 'info');
        console.log('Event details:', event);
    },
    
    /**
     * Edit event
     */
    editEvent: function(event) {
        // In a real app, this would navigate to an edit form or show a modal
        MountainCare.showToast(`Editing event: ${event.title}`, 'info');
        console.log('Edit event:', event);
    },
    
    /**
     * Initialize charts on the dashboard
     */
    initCharts: function() {
        // Get chart contexts
        const attendanceCtx = document.getElementById('attendance-chart');
        const departmentsCtx = document.getElementById('departments-chart');
        
        if (attendanceCtx) {
            // Initialize attendance chart
            this.charts.attendance = new Chart(attendanceCtx, {
                type: 'line',
                data: this.data.attendance,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        },
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            stacked: false
                        }
                    }
                }
            });
        }
        
        if (departmentsCtx) {
            // Initialize departments chart
            this.charts.departments = new Chart(departmentsCtx, {
                type: 'doughnut',
                data: this.data.departments,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        }
                    }
                }
            });
        }
    },
    
    /**
     * Update charts with new data
     */
    updateCharts: function() {
        // Update attendance chart
        if (this.charts.attendance) {
            this.charts.attendance.data = this.data.attendance;
            this.charts.attendance.update();
        }
        
        // Update departments chart
        if (this.charts.departments) {
            this.charts.departments.data = this.data.departments;
            this.charts.departments.update();
        }
    },
    
    /**
     * Initialize interactive elements on the dashboard
     */
    initInteractiveElements: function() {
        // Time period selector for attendance chart
        const timePeriodSelect = document.getElementById('chart-time-period');
        if (timePeriodSelect) {
            timePeriodSelect.addEventListener('change', () => {
                this.changeAttendanceChartTimePeriod(timePeriodSelect.value);
            });
        }
        
        // Module card hover effects
        const moduleCards = document.querySelectorAll('.module-card');
        moduleCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = 'var(--shadow-md)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
    },
    
    /**
     * Set up event listeners for dashboard elements
     */
    setupEventListeners: function() {
        // Module card click
        document.querySelectorAll('.module-card').forEach(card => {
            const link = card.querySelector('a.action-link');
            if (link) {
                card.addEventListener('click', function() {
                    window.location.href = link.href;
                });
            }
        });
        
        // Refresh button (if present)
        const refreshBtn = document.getElementById('refresh-dashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshDashboard();
            });
        }
    },
    
    /**
     * Change the time period for the attendance chart
     */
    changeAttendanceChartTimePeriod: function(period) {
        console.log(`Changing chart time period to: ${period}`);
        
        // In a real app, this would fetch new data from the server
        // For now, we'll just update the chart with slightly different data
        
        // Show loading indicator
        const chartContainer = document.getElementById('attendance-chart').parentNode;
        const loadingEl = document.createElement('div');
        loadingEl.className = 'chart-loading';
        loadingEl.innerHTML = '<div class="chart-loading-spinner"></div>';
        chartContainer.appendChild(loadingEl);
        
        // Simulate API call delay
        setTimeout(() => {
            // Generate different data based on the selected period
            let newData = { ...this.data.attendance };
            
            switch(period) {
                case 'week':
                    newData.labels = newData.labels.slice(0, 7);
                    newData.datasets.forEach(dataset => {
                        dataset.data = dataset.data.slice(0, 7);
                    });
                    break;
                case 'month':
                    // Already has monthly data, no change needed
                    break;
                case 'quarter':
                    // Expand data to represent a quarter (90 days)
                    // This is a simplified version for the example
                    newData.labels = Array.from({ length: 90 }, (_, i) => `Day ${i + 1}`);
                    newData.datasets.forEach(dataset => {
                        const baseData = dataset.data.slice(0, 30);
                        const expandedData = [];
                        for (let i = 0; i < 3; i++) {
                            expandedData.push(...baseData.map(val => val + Math.floor(Math.random() * 10 - 5)));
                        }
                        dataset.data = expandedData;
                    });
                    break;
                case 'year':
                    // Simplify data to represent months in a year
                    newData.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    newData.datasets.forEach(dataset => {
                        const monthlyAverages = [];
                        for (let i = 0; i < 12; i++) {
                            const monthData = dataset.data.slice(i * 2, (i + 1) * 2);
                            const avg = monthData.reduce((a, b) => a + b, 0) / monthData.length;
                            monthlyAverages.push(Math.round(avg));
                        }
                        dataset.data = monthlyAverages;
                    });
                    break;
            }
            
            // Update chart with new data
            if (this.charts.attendance) {
                this.charts.attendance.data = newData;
                this.charts.attendance.update();
            }
            
            // Remove loading indicator
            loadingEl.remove();
            
            // Show toast notification
            MountainCare.showToast(`Chart updated to show ${period} data`, 'success');
        }, 800);
    },
    
    /**
     * Refresh the entire dashboard
     */
    refreshDashboard: function() {
        console.log('Refreshing dashboard...');
        
        // Show loading state
        this.showLoadingStates();
        
        // Simulate API delay
        setTimeout(() => {
            // Reload data
            this.loadMockData();
            
            // Update UI with new data
            this.updateDashboardUI();
            
            // Show toast notification
            MountainCare.showToast('Dashboard refreshed successfully', 'success');
        }, 1000);
    }
};

// Utility function to find elements by text content
jQuery.expr[':'].contains = function(a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Dashboard will be initialized through the main.js init process
    // This is just a fallback in case it wasn't already initialized
    if (MountainCare.initialized && !MountainCare.pages.dashboard.initialized) {
        MountainCare.pages.dashboard.init();
    }
});
