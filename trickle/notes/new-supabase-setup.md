# Настройка новой базы данных Supabase

## Информация о подключении

- **URL:** `https://fngttfhmoudouzorzszr.supabase.co`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Дата подключения:** 2 декабря 2025

## SQL скрипт для настройки таблиц

Выполните следующий SQL скрипт в Supabase SQL Editor:

```sql
-- 1. Таблица товаров (products)
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    article TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    images TEXT[] NOT NULL,
    description TEXT,
    sizes JSONB DEFAULT '{"XS": 0, "S": 0, "M": 0, "L": 0, "XL": 0}'::jsonb,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Таблица заказов (orders)
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT,
    items JSONB NOT NULL,
    total_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Таблица галереи lookbook
CREATE TABLE IF NOT EXISTS lookbook (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Таблица настроек акций
CREATE TABLE IF NOT EXISTS promo_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    enabled BOOLEAN DEFAULT false,
    title TEXT NOT NULL,
    description TEXT,
    button_text TEXT,
    button_link TEXT,
    image_url TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(published);
CREATE INDEX IF NOT EXISTS idx_products_article ON products(article);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lookbook_order ON lookbook(order_index);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lookbook_updated_at BEFORE UPDATE ON lookbook
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promo_settings_updated_at BEFORE UPDATE ON promo_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Row Level Security (RLS) политики

```sql
-- Включаем RLS для всех таблиц
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_settings ENABLE ROW LEVEL SECURITY;

-- Политики для products
CREATE POLICY "Публичный доступ на чтение опубликованных товаров"
    ON products FOR SELECT
    USING (published = true);

CREATE POLICY "Полный доступ для аутентифицированных пользователей"
    ON products FOR ALL
    USING (auth.role() = 'authenticated');

-- Политики для orders
CREATE POLICY "Полный доступ для аутентифицированных пользователей"
    ON orders FOR ALL
    USING (auth.role() = 'authenticated');

-- Политики для lookbook
CREATE POLICY "Публичный доступ на чтение опубликованных изображений"
    ON lookbook FOR SELECT
    USING (published = true);

CREATE POLICY "Полный доступ для аутентифицированных пользователей"
    ON lookbook FOR ALL
    USING (auth.role() = 'authenticated');

-- Политики для promo_settings
CREATE POLICY "Публичный доступ на чтение активных акций"
    ON promo_settings FOR SELECT
    USING (enabled = true);

CREATE POLICY "Полный доступ для аутентифицированных пользователей"
    ON promo_settings FOR ALL
    USING (auth.role() = 'authenticated');
```

## Инструкции по настройке

1. **Откройте Supabase Dashboard** → ваш проект `fngttfhmoudouzorzszr`
2. Перейдите в **SQL Editor**
3. Создайте **New query**
4. Скопируйте и вставьте весь SQL скрипт выше
5. Нажмите **Run** для выполнения
6. Проверьте в разделе **Table Editor**, что все 4 таблицы созданы:
   - products
   - orders
   - lookbook
   - promo_settings

## Миграция данных из старой БД (опционально)

Если нужно перенести существующие товары из localStorage:
1. Откройте админ-панель `/admin.html`
2. Нажмите "Экспорт товаров" → сохраните JSON файл
3. После настройки новой БД используйте "Импорт товаров"

## Проверка подключения

После выполнения SQL скрипта:
1. Откройте главную страницу сайта
2. Проверьте консоль браузера на наличие ошибок
3. Попробуйте добавить тестовый товар в админ-панели
4. Убедитесь, что товар отображается на главной странице

## Важно

- ✅ Подключение обновлено в `utils/supabase.js`
- ⚠️ Необходимо выполнить SQL скрипт в Supabase Dashboard
- ⚠️ После выполнения SQL проверьте работу сайта
- 💾 Рекомендуется сделать бэкап данных перед миграцией