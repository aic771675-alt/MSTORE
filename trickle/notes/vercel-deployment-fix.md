# Исправление развёртывания на Vercel

## Проблема

При развёртывании на Vercel возникала ошибка инициализации Supabase из-за неправильного порядка загрузки скриптов и отсутствия механизма ожидания готовности клиента.

## Решение

### 1. Порядок загрузки скриптов

В `index.html` скрипт `utils/supabase.js` теперь загружается первым перед всеми другими компонентами:

```html
<!-- Load Supabase initialization FIRST -->
<script type="text/babel" src="utils/supabase.js"></script>
<!-- Wait for Supabase to initialize -->
<script>
    window.addEventListener('supabaseReady', function() {
        console.log('✅ Supabase initialized successfully');
    });
    window.addEventListener('supabaseFallback', function() {
        console.warn('⚠️ Using localStorage fallback');
    });
</script>
```

### 2. Функция ожидания инициализации

В `utils/supabase.js` добавлена функция `waitForSupabase()`:

```javascript
window.waitForSupabase = async (timeout = 5000) => {
  return new Promise((resolve) => {
    if (window.supabaseClient) {
      resolve(true);
      return;
    }
    
    const checkInterval = setInterval(() => {
      if (window.supabaseClient) {
        clearInterval(checkInterval);
        resolve(true);
      }
    }, 100);
    
    setTimeout(() => {
      clearInterval(checkInterval);
      resolve(false);
    }, timeout);
  });
};
```

### 3. Асинхронная инициализация приложения

В `app.js` используем async/await для ожидания готовности Supabase:

```javascript
useEffect(() => {
  const initApp = async () => {
    try {
      // Wait for Supabase to be ready
      const supabaseReady = await window.waitForSupabase();
      
      if (!supabaseReady || !window.supabaseClient) {
        console.error('Supabase failed to initialize');
        setLoading(false);
        hideLoadingScreen();
        return;
      }
      
      // Now load data
      await loadProducts();
      loadCart();
      hideLoadingScreen();
    } catch (error) {
      console.error('Initialization error:', error);
      setLoading(false);
      hideLoadingScreen();
    }
  };
  
  initApp();
}, []);
```

### 4. Улучшенная обработка ошибок

Добавлены понятные сообщения об ошибках и автоматический fallback на localStorage:

```javascript
const loadProducts = async () => {
  try {
    setLoading(true);
    
    if (!window.supabaseClient || typeof window.supabaseClient.getPublishedProducts !== 'function') {
      console.error('Supabase client not properly initialized');
      setProducts([]);
      return;
    }
    
    console.log('Loading products from Supabase...');
    const allProducts = await window.supabaseClient.getPublishedProducts();
    
    if (!allProducts || allProducts.length === 0) {
      console.warn('No products found in database');
      setProducts([]);
    } else {
      console.log(`Loaded ${allProducts.length} products from database`);
      setProducts(allProducts);
    }
  } catch (error) {
    console.error('Error loading products:', error.message || error);
    setProducts([]);
  } finally {
    setLoading(false);
  }
};
```

## События

Приложение теперь генерирует события для отслеживания состояния Supabase:

- `supabaseReady` - Supabase успешно инициализирован
- `supabaseFallback` - Используется fallback на localStorage

## Результат

✅ Корректная инициализация Supabase на Vercel
✅ Graceful fallback на localStorage при проблемах с подключением
✅ Понятные сообщения об ошибках в консоли
✅ Плавная загрузка приложения

Дата создания: 2 декабря 2025