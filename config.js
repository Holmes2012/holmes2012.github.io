// Supabase Configuration
// Replace with your actual Supabase URL and anon key
const SUPABASE_URL = 'https://yxpsfbtamiliynjtfwyz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cHNmYnRhbWlsaXluanRmd3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDgyODUsImV4cCI6MjA3MzcyNDI4NX0.kfG5BAa1AzmeJbGH50E9jo_C0gB78JabkTY2fEx6KyA';

// Initialize Supabase client
let supabase;

// Wait for Supabase library to load
function initSupabase() {
    try {
        if (window.supabase && window.supabase.createClient) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            window.supabase = supabase;
            console.log('Supabase client initialized successfully');
        } else {
            console.error('Supabase library not loaded');
            // Create a mock client for development
            window.supabase = createMockSupabase();
        }
    } catch (error) {
        console.error('Error initializing Supabase:', error);
        window.supabase = createMockSupabase();
    }
}

// Create mock Supabase client for development/testing
function createMockSupabase() {
    return {
        from: (table) => ({
            select: (columns = '*') => ({
                eq: (column, value) => ({
                    single: () => Promise.resolve({ data: null, error: { message: 'Mock client - no database connected' } }),
                    order: (column, options) => Promise.resolve({ data: [], error: { message: 'Mock client - no database connected' } }),
                    limit: (count) => Promise.resolve({ data: [], error: { message: 'Mock client - no database connected' } }),
                    gte: (column, value) => Promise.resolve({ data: [], error: { message: 'Mock client - no database connected' } }),
                    neq: (column, value) => Promise.resolve({ data: [], error: { message: 'Mock client - no database connected' } })
                }),
                order: (column, options) => Promise.resolve({ data: [], error: { message: 'Mock client - no database connected' } }),
                limit: (count) => Promise.resolve({ data: [], error: { message: 'Mock client - no database connected' } }),
                gte: (column, value) => Promise.resolve({ data: [], error: { message: 'Mock client - no database connected' } }),
                neq: (column, value) => Promise.resolve({ data: [], error: { message: 'Mock client - no database connected' } })
            }),
            insert: (data) => Promise.resolve({ data: null, error: { message: 'Mock client - no database connected. Data would be saved locally.' } }),
            delete: () => ({
                eq: (column, value) => Promise.resolve({ data: null, error: { message: 'Mock client - no database connected' } })
            }),
            select: (columns = '*', options) => {
                if (options && options.count) {
                    return Promise.resolve({ count: 0, error: null });
                }
                return Promise.resolve({ data: [], error: { message: 'Mock client - no database connected' } });
            }
        })
    };
}

// Initialize when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    // Small delay to ensure Supabase script has loaded
    setTimeout(initSupabase, 100);
}

// Configuration constants
const CONFIG = {
    ADMIN_PASSWORD: 'school2025',
    SESSION_DURATION: 7200000, // 2 hours in milliseconds
    ITEMS_PER_PAGE: 10,
    MAX_CONTENT_PREVIEW: 100
};

// Database setup instructions
function showDatabaseSetupInstructions() {
    console.log(`
=== SUPABASE DATABASE SETUP INSTRUCTIONS ===

1. Create a new Supabase project at https://supabase.com

2. Go to the SQL Editor and run these commands to create your tables:

-- News table (enhanced with author and tags)
CREATE TABLE news (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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

-- Users table (for user management)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'staff', 'admin')),
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

3. Update the SUPABASE_URL and SUPABASE_ANON_KEY variables in config.js with your project's credentials.

4. Go to Settings > API to find your URL and anon key.

5. (Optional) Set up Row Level Security policies for your tables in the Authentication section.

=== END SETUP INSTRUCTIONS ===
    `);
}

// Show setup instructions when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showDatabaseSetupInstructions);
} else {
    showDatabaseSetupInstructions();
}

// Export for use in other files
window.CONFIG = CONFIG;
