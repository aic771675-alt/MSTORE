const SUPABASE_URL = 'https://fngttfhmoudouzorzszr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuZ3R0Zmhtb3Vkb3V6b3J6c3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MjU0NjYsImV4cCI6MjA4MDIwMTQ2Nn0.XZWWKMtoD0vC8L1tgWSuKJDv2mRHhAIYdqY4MS2z7tc';

let supabaseClient = null;
let supabaseInitialized = false;

window.waitForSupabase = function() {
  return new Promise((resolve) => {
    if (supabaseInitialized && supabaseClient) {
      resolve(true);
    } else {
      const checkInterval = setInterval(() => {
        if (supabaseInitialized && supabaseClient) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(false);
      }, 10000);
    }
  });
};

async function initializeSupabase() {
  try {
    if (!window.supabase || !window.supabase.createClient) {
      console.error('❌ Supabase library not loaded');
      throw new Error('Supabase library not loaded');
    }

    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    
    const { data: testData, error: countError } = await supabaseClient
      .from('products')
      .select('id', { count: 'exact', head: true })
      .limit(1);
    
    if (countError) {
      console.error('❌ Ошибка подключения к базе данных');
      console.error('Код ошибки:', countError.code);
      console.error('Сообщение:', countError.message);
      
      if (countError.code === '42P01') {
        console.error('⚠️ Таблица products не найдена в базе данных!');
      }
      
      window.supabaseInitError = `${countError.code}: ${countError.message}`;
    } else {
      console.log('✅ Supabase инициализирован успешно');
      
      const { count } = await supabaseClient
        .from('products')
        .select('*', { count: 'exact', head: true });
      console.log('📊 Товаров в базе:', count || 0);
    }
    
    window.supabaseClient = {
      getProducts: async function() {
        try {
          if (!supabaseClient) {
            console.error('❌ Supabase not initialized');
            return [];
          }
          
          console.log('🔄 Fetching products from Supabase...');
          const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error('⚠️ Supabase error:', error);
            throw error;
          }
          
          const products = Array.isArray(data) ? data : [];
          console.log('✅ Fetched products from Supabase:', products.length);
          
          return products.map(p => ({
            ...p,
            image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.image
          }));
        } catch (error) {
          console.error('❌ Supabase connection failed:', error);
          throw error;
        }
      },

      getPublishedProducts: async function() {
        try {
          if (!supabaseClient) {
            console.error('❌ Supabase not initialized');
            return [];
          }
          
          console.log('🔄 Fetching published products from Supabase...');
          const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error('⚠️ Supabase error:', error);
            throw error;
          }
          
          const products = Array.isArray(data) ? data : [];
          console.log('✅ Fetched published products from Supabase:', products.length);
          
          return products.map(p => ({
            ...p,
            image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : p.image
          }));
        } catch (error) {
          console.error('❌ Supabase connection failed:', error);
          throw error;
        }
      },

      createProduct: async function(product) {
        console.log('🔄 Creating product in Supabase:', product);
        
        if (!product.totalStock && product.sizes) {
          product.totalStock = Object.values(product.sizes).reduce((sum, qty) => sum + (qty || 0), 0);
        }
        
        const { data, error } = await supabaseClient
          .from('products')
          .insert([product])
          .select()
          .single();
        
        if (error) {
          console.error('❌ Supabase createProduct error:', error.message);
          
          if (error.code === '42501') {
            throw new Error('Недостаточно прав для добавления товара');
          }
          
          throw new Error(error.message || 'Не удалось создать товар');
        }
        
        console.log('✅ Product created successfully:', data);
        return data;
      },

      updateProduct: async function(id, updates) {
        console.log('🔄 Updating product in Supabase:', { id, updates });
        
        if (!updates.totalStock && updates.sizes) {
          updates.totalStock = Object.values(updates.sizes).reduce((sum, qty) => sum + (qty || 0), 0);
        }
        
        const { data, error } = await supabaseClient
          .from('products')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('❌ Supabase updateProduct error:', error.message);
          
          if (error.code === '42501') {
            throw new Error('Недостаточно прав для обновления товара');
          }
          
          throw new Error(error.message || 'Failed to update product');
        }
        
        console.log('✅ Product updated successfully:', data);
        return data;
      },

      deleteProduct: async function(id) {
        const { error } = await supabaseClient
          .from('products')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('❌ Supabase deleteProduct error:', error);
          
          if (error.code === '42501') {
            throw new Error('Недостаточно прав для удаления товара');
          }
          
          throw error;
        }
        return true;
      },

      getLookbookImages: async function() {
        const { data, error } = await supabaseClient
          .from('lookbook')
          .select('*')
          .order('position', { ascending: true });
        
        if (error) throw error;
        return data || [];
      },

      saveLookbookImages: async function(images) {
        const { error: deleteError } = await supabaseClient
          .from('lookbook')
          .delete()
          .neq('id', 0);
        
        if (deleteError) throw deleteError;
        
        const imagesWithPosition = images.map((img, index) => ({
          image_url: img,
          position: index
        }));
        
        const { data, error } = await supabaseClient
          .from('lookbook')
          .insert(imagesWithPosition)
          .select();
        
        if (error) throw error;
        return data;
      },

      getPromoSettings: async function() {
        const { data, error } = await supabaseClient
          .from('promo_settings')
          .select('enabled, title, message')
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data || { enabled: false };
      },

      savePromoSettings: async function(settings) {
        const { data: existing } = await supabaseClient
          .from('promo_settings')
          .select('id')
          .single();
        
        const payload = {
          enabled: settings.enabled,
          title: settings.title,
          message: settings.message
        };
        
        if (existing) {
          const { data, error } = await supabaseClient
            .from('promo_settings')
            .update(payload)
            .eq('id', existing.id)
            .select()
            .single();
          
          if (error) throw error;
          return data;
        } else {
          const { data, error } = await supabaseClient
            .from('promo_settings')
            .insert([payload])
            .select()
            .single();
          
          if (error) throw error;
          return data;
        }
      }
    };
    
    supabaseInitialized = true;
    window.dispatchEvent(new Event('supabaseReady'));
    
    } catch (error) {
        console.error('❌ Error loading products from Supabase:', error.message || error);
        console.log('🔄 Falling back to localStorage...');
        
        // Fallback to localStorage
        try {
            const localProducts = JSON.parse(localStorage.getItem('molove_products') || '[]');
            console.log(`✅ Loaded ${localProducts.length} products from localStorage`);
            return localProducts.filter(p => p.published !== false);
        } catch (localError) {
            console.error('❌ localStorage fallback also failed:', localError);
            return [];
        }
    }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSupabase);
} else {
  initializeSupabase();
}