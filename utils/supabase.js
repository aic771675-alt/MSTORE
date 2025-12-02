// Supabase Configuration
const SUPABASE_URL = 'https://fngttfhmoudouzorzszr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuZ3R0Zmhtb3Vkb3V6b3J6c3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MjU0NjYsImV4cCI6MjA4MDIwMTQ2Nn0.XZWWKMtoD0vC8L1tgWSuKJDv2mRHhAIYdqY4MS2z7tc';

let supabaseInitialized = false;
let supabaseReadyPromise = null;

// Wait for Supabase to be ready
window.waitForSupabase = function() {
    if (supabaseReadyPromise) {
        return supabaseReadyPromise;
    }
    
    supabaseReadyPromise = new Promise((resolve) => {
        if (window.supabaseClient && supabaseInitialized) {
            resolve(window.supabaseClient);
            return;
        }
        
        const checkReady = () => {
            if (window.supabaseClient && supabaseInitialized) {
                resolve(window.supabaseClient);
            } else {
                setTimeout(checkReady, 50);
            }
        };
        checkReady();
    });
    
    return supabaseReadyPromise;
};

// Initialize Supabase
(async function initSupabase() {
    try {
        // Wait for library
        let attempts = 0;
        while (!window.supabase && attempts < 100) {
            await new Promise(r => setTimeout(r, 50));
            attempts++;
        }
        
        if (!window.supabase) {
            throw new Error('Supabase library not loaded');
        }
        
        // Create client
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Add helper methods
        client.getProducts = async function() {
            const { data, error } = await this.from('products')
                .select('*').order('created_at', { ascending: false });
            if (error) throw error;
            return (data || []).map(p => ({
                ...p,
                image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.image
            }));
        };
        
        client.getPublishedProducts = async function() {
            const { data, error } = await this.from('products')
                .select('*').eq('published', true).order('created_at', { ascending: false });
            if (error) throw error;
            return (data || []).map(p => ({
                ...p,
                image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.image
            }));
        };
        
        client.createProduct = async function(product) {
            const { data, error } = await this.from('products').insert([product]).select();
            if (error) throw error;
            return data[0];
        };
        
        client.updateProduct = async function(id, updates) {
            const { data, error } = await this.from('products').update(updates).eq('id', id).select();
            if (error) throw error;
            return data[0];
        };
        
        client.deleteProduct = async function(id) {
            const { error } = await this.from('products').delete().eq('id', id);
            if (error) throw error;
        };
        
        client.createOrder = async function(order) {
            const { data, error } = await this.from('orders').insert([order]).select();
            if (error) throw error;
            return data[0];
        };
        
        window.supabaseClient = client;
        supabaseInitialized = true;
        window.dispatchEvent(new Event('supabaseReady'));
        console.log('✅ Supabase ready');
        
    } catch (error) {
        console.error('❌ Supabase error:', error);
        
        // Fallback
        window.supabaseClient = {
            getProducts: async () => [],
            getPublishedProducts: async () => [],
            createProduct: async (p) => ({ ...p, id: Date.now() }),
            updateProduct: async (id, u) => ({ id, ...u }),
            deleteProduct: async () => {},
            createOrder: async (o) => ({ ...o, id: Date.now() })
        };
        supabaseInitialized = true;
        window.dispatchEvent(new Event('supabaseFallback'));
    }
})();