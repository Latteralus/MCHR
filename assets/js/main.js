/**
 * Mountain Care HR - Main JavaScript Utilities
 * 
 * This file contains common utility functions and initializations
 * that are used across the entire HR Management application.
 */

// Global namespace for our application
const MountainCare = {
    // Current user information (would typically come from an API)
    currentUser: {
        id: 1,
        name: 'Faith Calkins',
        role: 'HR Director',
        email: 'faith.calkins@mountaincare.com',
        avatar: '/assets/img/user-avatars/default.png'
    },
    
    // Application-wide settings
    settings: {
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h', // '12h' or '24h'
        firstDayOfWeek: 0, // 0 = Sunday, 1 = Monday
        defaultPageSize: 10,
        theme: 'light', // 'light' or 'dark'
        animations: true,
        sidebarCollapsed: false
    },
    
    // Module initialization status
    initialized: {
        components: false,
        handlers: false
    },
    
    /**
     * Initialize the application
     */
    init: function() {
        // Load components
        this.loadComponents();
        
        // Initialize event handlers
        this.initEventHandlers();
        
        // Load user info
        this.loadUserInfo();
        
        // Initialize page-specific code
        this.initCurrentPage();
        
        console.log('Mountain Care HR Management initialized');
    },
    
    /**
     * Load HTML components (header, sidebar, footer)
     */
    loadComponents: function() {
        if (this.initialized.components) return;
        
        const componentsToLoad = [
            { id: 'sidebar-container', file: '/components/sidebar.html' },
            { id: 'header-container', file: '/components/header.html' },
            { id: 'footer-container', file: '/components/footer.html' }
        ];
        
        componentsToLoad.forEach(component => {
            const container = document.getElementById(component.id);
            if (container) {
                this.loadComponent(container, component.file);
            }
        });
        
        this.initialized.components = true;
    },
    
    /**
     * Load a single HTML component
     */
    loadComponent: function(container, file) {
        fetch(file)
            .then(response => response.text())
            .then(html => {
                container.innerHTML = html;
                // Trigger an event to notify that the component is loaded
                const event = new CustomEvent('component:loaded', { 
                    detail: { container, file } 
                });
                document.dispatchEvent(event);
            })
            .catch(error => {
                console.error(`Error loading component ${file}:`, error);
                container.innerHTML = `<div class="error-message">Failed to load component</div>`;
            });
    },
    
    /**
     * Initialize global event handlers
     */
    initEventHandlers: function() {
        if (this.initialized.handlers) return;
        
        // Listen for component loaded events
        document.addEventListener('component:loaded', this.handleComponentLoaded.bind(this));
        
        // Handle theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }
        
        // Initialize tooltips
        this.initTooltips();
        
        this.initialized.handlers = true;
    },
    
    /**
     * Handle component loaded event
     */
    handleComponentLoaded: function(event) {
        const { container, file } = event.detail;
        
        // If sidebar was loaded, update active menu item
        if (file.includes('sidebar.html')) {
            this.updateActiveMenuItem();
        }
        
        // If header was loaded, update page title and action button
        if (file.includes('header.html')) {
            this.updatePageHeader();
        }
    },
    
    /**
     * Update the active menu item in the sidebar
     */
    updateActiveMenuItem: function() {
        const currentPath = window.location.pathname;
        const navItems = document.querySelectorAll('.sidebar .menu-item');
        
        navItems.forEach(item => {
            item.classList.remove('active');
            
            const href = item.getAttribute('href');
            // Remove the domain part if present
            const itemPath = href ? href.replace(/^https?:\/\/[^\/]+/, '') : '';
            
            // Check if current path contains this nav item's path
            if (currentPath.includes(itemPath) && itemPath !== '/' && itemPath !== '/index.html') {
                item.classList.add('active');
            } else if ((currentPath === '/' || currentPath === '/index.html') && 
                      (itemPath === '/' || itemPath === '/index.html')) {
                item.classList.add('active');
            }
        });
    },
    
    /**
     * Update page header title and action button
     */
    updatePageHeader: function() {
        // Get page info from data attributes or defaults
        const pageHeading = document.querySelector('meta[name="page-heading"]')?.getAttribute('content') || 'Dashboard';
        const pageSubtitle = document.querySelector('meta[name="page-subtitle"]')?.getAttribute('content') || '';
        const primaryAction = document.querySelector('meta[name="primary-action"]')?.getAttribute('content') || '';
        const primaryActionIcon = document.querySelector('meta[name="primary-action-icon"]')?.getAttribute('content') || 'fa-plus';
        const primaryActionUrl = document.querySelector('meta[name="primary-action-url"]')?.getAttribute('content') || '#';
        
        // Update the DOM
        const headingEl = document.getElementById('page-heading');
        const subtitleEl = document.getElementById('page-subtitle');
        const actionBtnEl = document.getElementById('primary-action-btn');
        const actionTextEl = document.getElementById('primary-action-text');
        
        if (headingEl) headingEl.textContent = pageHeading;
        if (subtitleEl) subtitleEl.textContent = pageSubtitle;
        
        if (actionBtnEl && primaryAction) {
            actionBtnEl.style.display = 'inline-flex';
            if (actionTextEl) actionTextEl.textContent = primaryAction;
            
            // Update icon if specified
            const iconEl = actionBtnEl.querySelector('i');
            if (iconEl) {
                iconEl.className = `fas ${primaryActionIcon}`;
            }
            
            // Add click handler to navigate or trigger modal
            actionBtnEl.onclick = function() {
                if (primaryActionUrl.startsWith('#modal-')) {
                    // It's a modal trigger
                    const modalId = primaryActionUrl.replace('#', '');
                    MountainCare.openModal(modalId);
                } else {
                    // It's a navigation link
                    window.location.href = primaryActionUrl;
                }
            };
        } else if (actionBtnEl) {
            actionBtnEl.style.display = 'none';
        }
    },
    
    /**
     * Load user information
     */
    loadUserInfo: function() {
        // In a real application, this would fetch from an API or local storage
        // For now, we'll use the static data in currentUser
        
        // Update user info in the sidebar
        const userNameEl = document.getElementById('user-name');
        const userRoleEl = document.getElementById('user-role');
        const userAvatarEl = document.getElementById('user-avatar');
        
        if (userNameEl) userNameEl.textContent = this.currentUser.name;
        if (userRoleEl) userRoleEl.textContent = this.currentUser.role;
        if (userAvatarEl) userAvatarEl.src = this.currentUser.avatar;
    },
    
    /**
     * Initialize page-specific code
     */
    initCurrentPage: function() {
        // Get the current page identifier from a meta tag
        const pageId = document.querySelector('meta[name="page-id"]')?.getAttribute('content');
        
        if (!pageId) return;
        
        // Call the appropriate initialization function based on the page
        switch(pageId) {
            case 'dashboard':
                if (typeof this.pages?.dashboard?.init === 'function') {
                    this.pages.dashboard.init();
                }
                break;
            case 'employees':
                if (typeof this.pages?.employees?.init === 'function') {
                    this.pages.employees.init();
                }
                break;
            case 'attendance':
                if (typeof this.pages?.attendance?.init === 'function') {
                    this.pages.attendance.init();
                }
                break;
            case 'leave':
                if (typeof this.pages?.leave?.init === 'function') {
                    this.pages.leave.init();
                }
                break;
            // Add other pages as needed
        }
    },
    
    /**
     * Toggle between light and dark themes
     */
    toggleTheme: function() {
        const currentTheme = this.settings.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Update setting
        this.settings.theme = newTheme;
        
        // Update DOM
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Store preference
        localStorage.setItem('mc-theme', newTheme);
        
        console.log(`Theme switched to ${newTheme}`);
    },
    
    /**
     * Initialize tooltips on elements with data-tooltip attribute
     */
    initTooltips: function() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        
        tooltips.forEach(el => {
            // Add event listeners for tooltip display
            el.addEventListener('mouseenter', function() {
                const tooltipText = this.getAttribute('data-tooltip');
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = tooltipText;
                
                // Position the tooltip
                const rect = this.getBoundingClientRect();
                tooltip.style.top = `${rect.top - 30}px`;
                tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
                
                // Add to DOM
                document.body.appendChild(tooltip);
                
                // Store reference to the tooltip
                this._tooltip = tooltip;
                
                // Animate in
                setTimeout(() => {
                    tooltip.style.opacity = '1';
                    tooltip.style.transform = 'translateY(0)';
                }, 10);
            });
            
            el.addEventListener('mouseleave', function() {
                if (this._tooltip) {
                    const tooltip = this._tooltip;
                    
                    // Animate out
                    tooltip.style.opacity = '0';
                    tooltip.style.transform = 'translateY(-10px)';
                    
                    // Remove after animation
                    setTimeout(() => {
                        if (tooltip.parentNode) {
                            tooltip.parentNode.removeChild(tooltip);
                        }
                    }, 200);
                    
                    this._tooltip = null;
                }
            });
        });
    },
    
    /**
     * Open a modal by ID
     */
    openModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // Add active class to modal
        modal.classList.add('active');
        
        // Create overlay if it doesn't exist
        let overlay = document.querySelector('.modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            document.body.appendChild(overlay);
        }
        
        // Show overlay
        overlay.classList.add('active');
        
        // Disable scrolling on body
        document.body.style.overflow = 'hidden';
        
        // Add event listener to close modal
        const closeButtons = modal.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal(modalId));
        });
        
        // Close on overlay click
        overlay.addEventListener('click', () => this.closeModal(modalId));
        
        // Escape key to close
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                MountainCare.closeModal(modalId);
            }
        });
    },
    
    /**
     * Close a modal by ID
     */
    closeModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // Remove active class
        modal.classList.remove('active');
        
        // Hide overlay
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                if (overlay.parentNode && !overlay.classList.contains('active')) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
        
        // Re-enable scrolling
        document.body.style.overflow = '';
    },
    
    /**
     * Format a date according to user preferences
     */
    formatDate: function(date) {
        if (!date) return '';
        
        const d = new Date(date);
        
        // Check if date is valid
        if (isNaN(d.getTime())) {
            return 'Invalid date';
        }
        
        const format = this.settings.dateFormat;
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        
        let formattedDate = format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year);
            
        return formattedDate;
    },
    
    /**
     * Format a time according to user preferences
     */
    formatTime: function(date) {
        if (!date) return '';
        
        const d = new Date(date);
        
        // Check if date is valid
        if (isNaN(d.getTime())) {
            return 'Invalid time';
        }
        
        let hours = d.getHours();
        const minutes = d.getMinutes().toString().padStart(2, '0');
        
        if (this.settings.timeFormat === '12h') {
            const period = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // Convert to 12-hour format
            return `${hours}:${minutes} ${period}`;
        } else {
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
        }
    },
    
    /**
     * Show a toast notification
     */
    showToast: function(message, type = 'info', duration = 3000) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Create icon based on type
        let icon;
        switch(type) {
            case 'success':
                icon = 'fa-check-circle';
                break;
            case 'error':
                icon = 'fa-exclamation-circle';
                break;
            case 'warning':
                icon = 'fa-exclamation-triangle';
                break;
            default:
                icon = 'fa-info-circle';
        }
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="toast-content">${message}</div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to DOM
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        toastContainer.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Close button handler
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            closeToast(toast);
        });
        
        // Auto close after duration
        if (duration) {
            setTimeout(() => {
                closeToast(toast);
            }, duration);
        }
        
        function closeToast(toastEl) {
            toastEl.classList.remove('show');
            setTimeout(() => {
                if (toastEl.parentNode) {
                    toastEl.parentNode.removeChild(toastEl);
                }
                
                // Remove container if empty
                if (toastContainer.children.length === 0) {
                    toastContainer.parentNode.removeChild(toastContainer);
                }
            }, 300);
        }
    },
    
    /**
     * Form validation utilities
     */
    validation: {
        /**
         * Validate a form by ID
         */
        validateForm: function(formId) {
            const form = document.getElementById(formId);
            if (!form) return true; // No form to validate
            
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            // Reset all errors
            form.querySelectorAll('.form-error').forEach(el => {
                el.remove();
            });
            form.querySelectorAll('.input-error').forEach(el => {
                el.classList.remove('input-error');
            });
            
            // Check required fields
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    this.showError(field, 'This field is required');
                    isValid = false;
                }
            });
            
            // Check email fields
            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                if (field.value.trim() && !this.isValidEmail(field.value.trim())) {
                    this.showError(field, 'Please enter a valid email address');
                    isValid = false;
                }
            });
            
            // Check password match
            const password = form.querySelector('input[name="password"]');
            const confirmPassword = form.querySelector('input[name="confirm_password"]');
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                this.showError(confirmPassword, 'Passwords do not match');
                isValid = false;
            }
            
            return isValid;
        },
        
        /**
         * Show an error message for a form field
         */
        showError: function(field, message) {
            field.classList.add('input-error');
            
            const errorEl = document.createElement('div');
            errorEl.className = 'form-error';
            errorEl.textContent = message;
            
            const parent = field.parentNode;
            parent.appendChild(errorEl);
            
            // Focus the first field with an error
            if (!document.querySelector('.input-error:focus')) {
                field.focus();
            }
        },
        
        /**
         * Validate email format
         */
        isValidEmail: function(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
    },
    
    /**
     * Data handling utilities
     */
    data: {
        /**
         * Cache for loaded data
         */
        cache: {},
        
        /**
         * Load data from a JSON file or API
         */
        load: function(url, forceRefresh = false) {
            if (!forceRefresh && this.cache[url]) {
                return Promise.resolve(this.cache[url]);
            }
            
            return fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    this.cache[url] = data;
                    return data;
                })
                .catch(error => {
                    console.error(`Error loading data from ${url}:`, error);
                    throw error;
                });
        },
        
        /**
         * Save data to localStorage
         */
        saveLocal: function(key, data) {
            try {
                localStorage.setItem(`mc-${key}`, JSON.stringify(data));
                return true;
            } catch (error) {
                console.error(`Error saving data to localStorage:`, error);
                return false;
            }
        },
        
        /**
         * Load data from localStorage
         */
        loadLocal: function(key) {
            try {
                const data = localStorage.getItem(`mc-${key}`);
                return data ? JSON.parse(data) : null;
            } catch (error) {
                console.error(`Error loading data from localStorage:`, error);
                return null;
            }
        }
    },
    
    /**
     * Page-specific code
     */
    pages: {
        // Will be populated by page-specific JS files
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    MountainCare.init();
});