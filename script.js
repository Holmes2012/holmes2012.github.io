// Load configuration
// Supabase client is initialized in config.js

// Admin password (in production, use proper authentication)
const ADMIN_PASSWORD = 'school2025';

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Navigation functionality
function showSection(targetId) {
    sections.forEach(section => section.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));
    
    const targetSection = document.getElementById(targetId);
    const targetLink = document.querySelector(`[href="#${targetId}"]`);
    
    if (targetSection) targetSection.classList.add('active');
    if (targetLink) targetLink.classList.add('active');
}

// Event listeners for navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        showSection(targetId);
        navMenu.classList.remove('active');
    });
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    loadNews();
    loadEvents();
    setupNavigation();
});

// Load news from Supabase
async function loadNews() {
    const newsContainer = document.getElementById('news-container');
    
    try {
        const { data: news, error } = await window.supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(6);
        
        let allNews = [];
        
        if (error && error.message.includes('Mock client')) {
            // Load from local storage
            allNews = JSON.parse(localStorage.getItem('localNews') || '[]').slice(0, 6);
        } else if (!error && news) {
            // Combine database and local news
            const localNews = JSON.parse(localStorage.getItem('localNews') || '[]');
            allNews = [...news, ...localNews].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 6);
        } else {
            // Fallback to local storage
            allNews = JSON.parse(localStorage.getItem('localNews') || '[]').slice(0, 6);
        }
        
        if (allNews && allNews.length > 0) {
            newsContainer.innerHTML = allNews.map(item => `
                <div class="news-item">
                    <h4><a href="article.html?id=${item.id}" class="news-link">${item.title}</a></h4>
                    <div class="article-meta-home">
                        <span class="article-author">By ${item.author || 'Anonymous'}</span>
                        <span class="news-date">${formatDate(item.created_at || item.published_at)}</span>
                    </div>
                    ${item.tags ? `<div class="article-tags-home">${item.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}</div>` : ''}
                    <p>${truncateContent(item.content, 150)}</p>
                    <a href="article.html?id=${item.id}" class="read-more">Read More</a>
                </div>
            `).join('');
        } else {
            newsContainer.innerHTML = `
                <div class="news-item">
                    <h4>Welcome to Catherine Cook School!</h4>
                    <div class="news-date">Today</div>
                    <p>This is a demo news item. Add news through the admin panel to see real content here!</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading news:', error);
        // Try loading from local storage as final fallback
        const localNews = JSON.parse(localStorage.getItem('localNews') || '[]').slice(0, 6);
        if (localNews.length > 0) {
            newsContainer.innerHTML = localNews.map(item => `
                <div class="news-item">
                    <h4><a href="article.html?id=${item.id}" class="news-link">${item.title}</a></h4>
                    <div class="article-meta-home">
                        <span class="article-author">By ${item.author || 'Anonymous'}</span>
                        <span class="news-date">${formatDate(item.created_at || item.published_at)}</span>
                    </div>
                    ${item.tags ? `<div class="article-tags-home">${item.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}</div>` : ''}
                    <p>${truncateContent(item.content, 150)}</p>
                    <a href="article.html?id=${item.id}" class="read-more">Read More</a>
                </div>
            `).join('');
        } else {
            newsContainer.innerHTML = `
                <div class="news-item">
                    <h4>Welcome to Catherine Cook School!</h4>
                    <div class="news-date">Today</div>
                    <p>This website is running in offline mode. Add news through the admin panel to see content here!</p>
                </div>
            `;
        }
    }
}

// Load events from Supabase
async function loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    
    try {
        const { data: events, error } = await window.supabase
            .from('events')
            .select('*')
            .gte('event_date', new Date().toISOString().split('T')[0])
            .order('event_date', { ascending: true })
            .limit(6);
        
        let allEvents = [];
        
        if (error && error.message.includes('Mock client')) {
            // Load from local storage
            const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]');
            const today = new Date().toISOString().split('T')[0];
            allEvents = localEvents.filter(event => event.event_date >= today).slice(0, 6);
        } else if (!error && events) {
            // Combine database and local events
            const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]');
            const today = new Date().toISOString().split('T')[0];
            const filteredLocal = localEvents.filter(event => event.event_date >= today);
            allEvents = [...events, ...filteredLocal].sort((a, b) => new Date(a.event_date) - new Date(b.event_date)).slice(0, 6);
        } else {
            // Fallback to local storage
            const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]');
            const today = new Date().toISOString().split('T')[0];
            allEvents = localEvents.filter(event => event.event_date >= today).slice(0, 6);
        }
        
        if (allEvents && allEvents.length > 0) {
            eventsContainer.innerHTML = allEvents.map(event => `
                <div class="event-item">
                    <div class="event-date">${formatDate(event.event_date)} ${event.event_time || ''}</div>
                    <h4>${event.title}</h4>
                    <p>${event.description || 'No description available.'}</p>
                </div>
            `).join('');
        } else {
            eventsContainer.innerHTML = `
                <div class="event-item">
                    <div class="event-date">Coming Soon</div>
                    <h4>School Events</h4>
                    <p>No upcoming events scheduled. Check back later or add events through the admin panel!</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading events:', error);
        // Try loading from local storage as fallback
        const localEvents = JSON.parse(localStorage.getItem('localEvents') || '[]');
        const today = new Date().toISOString().split('T')[0];
        const upcomingEvents = localEvents.filter(event => event.event_date >= today).slice(0, 6);
        
        if (upcomingEvents.length > 0) {
            eventsContainer.innerHTML = upcomingEvents.map(event => `
                <div class="event-item">
                    <div class="event-date">${formatDate(event.event_date)} ${event.event_time || ''}</div>
                    <h4>${event.title}</h4>
                    <p>${event.description || 'No description available.'}</p>
                </div>
            `).join('');
        } else {
            eventsContainer.innerHTML = `
                <div class="event-item">
                    <div class="event-date">Coming Soon</div>
                    <h4>School Events</h4>
                    <p>Website is running in offline mode. Add events through the admin panel to see them here!</p>
                </div>
            `;
        }
    }
}

// Format date function
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Truncate content function
function truncateContent(content, maxLength) {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength).trim() + '...';
}

// Setup navigation
function setupNavigation() {
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// Show success/error messages
function showMessage(text, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Insert at the top of the active section
    const activeSection = document.querySelector('.section.active');
    activeSection.insertBefore(message, activeSection.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Database setup instructions
function showDatabaseSetupInstructions() {
    console.log(`
=== SUPABASE DATABASE SETUP INSTRUCTIONS ===

1. Create a new Supabase project at https://supabase.com

2. Go to the SQL Editor and run these commands to create your tables:

-- News table
CREATE TABLE news (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table  
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

3. Update the SUPABASE_URL and SUPABASE_ANON_KEY variables in this file with your project's credentials.

4. Go to Settings > API to find your URL and anon key.

5. (Optional) Set up Row Level Security policies for your tables in the Authentication section.

=== END SETUP INSTRUCTIONS ===
    `);
}

// Show setup instructions when page loads
showDatabaseSetupInstructions();

// Global functions
window.showMessage = showMessage;
