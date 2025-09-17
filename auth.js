// Authentication utilities for Catherine Cook School portal

// Check if user is authenticated
function checkAuthentication() {
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    const userType = localStorage.getItem('userType');
    
    // Check if any authentication exists
    if (!userLoggedIn && !adminLoggedIn) {
        redirectToLogin();
        return false;
    }
    
    // Check session expiration
    const loginTimeKey = userType === 'admin' ? 'adminLoginTime' : 'userLoginTime';
    const loginTime = localStorage.getItem(loginTimeKey);
    const currentTime = new Date().getTime();
    
    // Session expires after 2 hours (7200000 ms)
    if (!loginTime || (currentTime - loginTime > 7200000)) {
        logout();
        return false;
    }
    
    return true;
}

// Redirect to appropriate login page
function redirectToLogin() {
    // Don't redirect if already on a login page
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'login.html' || currentPage === 'adminlogin.html') {
        return;
    }
    
    window.location.href = 'login.html';
}

// Logout function
function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// Check if user has admin privileges
function isAdmin() {
    return localStorage.getItem('adminLoggedIn') === 'true' && localStorage.getItem('userType') === 'admin';
}

// Check if user is regular user
function isUser() {
    return localStorage.getItem('userLoggedIn') === 'true' && localStorage.getItem('userType') === 'student';
}

// Require admin access for admin pages
function requireAdminAccess() {
    if (!isAdmin()) {
        window.location.href = 'adminlogin.html';
        return false;
    }
    return true;
}

// Show user info in navigation
function showUserInfo() {
    const userType = localStorage.getItem('userType');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (userType) {
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        
        let displayText = '';
        if (userType === 'admin') {
            displayText = 'Administrator';
        } else {
            displayText = `${userType.charAt(0).toUpperCase() + userType.slice(1)} Portal`;
        }
        
        if (currentUser.fullName) {
            displayText = `${currentUser.fullName} (${displayText})`;
        }
        
        userInfo.innerHTML = `<span class="user-welcome">Welcome, ${displayText}</span>`;
        
        const nav = document.querySelector('.nav-container');
        if (nav && !document.querySelector('.user-info')) {
            nav.appendChild(userInfo);
        }
    }
}

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Don't check auth on login pages
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'login.html' && currentPage !== 'adminlogin.html') {
        checkAuthentication();
        showUserInfo();
    }
});
