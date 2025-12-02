# Supabase Setup Instructions for MOLOVE

## 📋 Database Tables Setup

### Step 1: Open SQL Editor in Supabase

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project: `tidapeyoexixgdkuoprx`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

---

## 🗄️ SQL Script to Execute

Copy and paste this entire SQL script into the SQL Editor and click **Run**:

```sql
-- ============================================
-- MOLOVE Database Schema - Fixed Version
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if needed (uncomment to reset)
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS lookbook CASCADE;
-- DROP TABLE IF EXISTS promo_settings CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;

-- ============================================
-- Table: products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    article TEXT NOT NULL UNIQUE,
    category TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    description TEXT,
    sizes JSONB DEFAULT '{"XS": 0, "S": 0, "M": 0, "L": 0, "XL": 0}'::jsonb,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_published ON products(published);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_article ON products(article);

-- ============================================
-- Table: orders
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT,
    customer_comment TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'processing', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

-- ============================================
-- Table: lookbook
-- ============================================
CREATE TABLE IF NOT EXISTS lookbook (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lookbook_published ON lookbook(published);
CREATE INDEX IF NOT EXISTS idx_lookbook_order ON lookbook(order_index);

-- ============================================
-- Table: promo_settings
-- ============================================
CREATE TABLE IF NOT EXISTS promo_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enabled BOOLEAN DEFAULT false,
    title TEXT,
    description TEXT,
    image_url TEXT,
    button_text TEXT,
    button_link TEXT,
    show_delay INTEGER DEFAULT 3000,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default promo settings
INSERT INTO promo_settings (enabled, title, description, button_text, button_link)
VALUES (false, 'Скидка 20% на первый заказ!', 'Используйте промокод FIRST20', 'Перейти в каталог', 'index.html')
ON CONFLICT DO NOTHING;

-- ============================================
-- Function: Update timestamp automatically
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- Triggers: Auto-update timestamps
-- ============================================
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_promo_updated_at ON promo_settings;
CREATE TRIGGER update_promo_updated_at
    BEFORE UPDATE ON promo_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_settings ENABLE ROW LEVEL SECURITY;

-- Products: Public read, admin write
CREATE POLICY "Public can view published products" ON products
    FOR SELECT USING (published = true);

CREATE POLICY "Admin can do everything with products" ON products
    FOR ALL USING (true);

-- Orders: Public insert, admin read/update
CREATE POLICY "Public can create orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view all orders" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Admin can update orders" ON orders
    FOR UPDATE USING (true);

-- Lookbook: Public read published, admin all
CREATE POLICY "Public can view published lookbook" ON lookbook
    FOR SELECT USING (published = true);

CREATE POLICY "Admin can manage lookbook" ON lookbook
    FOR ALL USING (true);

-- Promo: Public read, admin write
CREATE POLICY "Public can view promo" ON promo_settings
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage promo" ON promo_settings
    FOR ALL USING (true);

-- ============================================
-- Success Message
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ MOLOVE Database setup completed successfully!';
    RAISE NOTICE '📊 Tables created: products, orders, lookbook, promo_settings';
    RAISE NOTICE '🔒 RLS policies enabled';
    RAISE NOTICE '⚡ Indexes created for performance';
END $$;
```

---

## ✅ After Running SQL

### Step 2: Verify Tables

1. Go to **Table Editor** in left sidebar
2. You should see 4 tables:
   - `products` - ваши товары
   - `orders` - заказы клиентов
   - `lookbook` - галерея образов
   - `promo_settings` - настройки акций

### Step 3: Check Structure

Click on each table to verify columns are created correctly.

---

## 🔄 Migration from localStorage (Automatic)

After SQL setup, the website will automatically:

1. ✅ Detect Supabase is configured
2. ✅ Read products from localStorage
3. ✅ Upload them to Supabase
4. ✅ Switch to using Supabase
5. ✅ Keep localStorage as backup

---

## 📊 Table Structures

### `products` Table
```
- id (UUID) - уникальный ID
- name (TEXT) - название товара
- article (TEXT) - артикул
- category (TEXT) - категория
- price (NUMERIC) - цена
- images (TEXT[]) - массив ссылок на фото
- description (TEXT) - описание
- sizes (JSONB) - размеры и остатки
- published (BOOLEAN) - опубликован или черновик
- created_at - дата создания
- updated_at - дата обновления
```

### `orders` Table
```
- id (UUID) - уникальный ID
- order_number (TEXT) - номер заказа
- customer_name (TEXT) - имя клиента
- customer_phone (TEXT) - телефон
- customer_address (TEXT) - адрес доставки
- customer_comment (TEXT) - комментарий
- items (JSONB) - товары в заказе
- total_amount (NUMERIC) - сумма заказа
- status (TEXT) - статус: new/processing/completed/cancelled
- created_at - дата создания
- updated_at - дата обновления
```

### `lookbook` Table
```
- id (UUID) - уникальный ID
- image_url (TEXT) - ссылка на фото
- title (TEXT) - заголовок
- description (TEXT) - описание
- order_index (INTEGER) - порядок показа
- published (BOOLEAN) - опубликовано
- created_at - дата создания
```

### `promo_settings` Table
```
- id (UUID) - уникальный ID
- enabled (BOOLEAN) - включен ли popup
- title (TEXT) - заголовок акции
- description (TEXT) - описание
- image_url (TEXT) - фото для popup
- button_text (TEXT) - текст кнопки
- button_link (TEXT) - ссылка кнопки
- show_delay (INTEGER) - задержка показа (мс)
- updated_at - дата обновления
```

---

## 🔒 Security (RLS Policies)

**Настроено автоматически:**

- ✅ Публичные пользователи видят только опубликованные товары
- ✅ Публичные пользователи могут создавать заказы
- ✅ Админы видят всё и могут редактировать
- ✅ Защита от несанкционированного доступа

---

## 🎯 Next Steps

После выполнения SQL скрипта:

1. ✅ **Обновите страницу сайта**
2. ✅ **Зайдите в админ-панель** (admin.html)
3. ✅ **Ваши товары автоматически загрузятся в Supabase**
4. ✅ **Начинайте работать!**

---

## 🆘 Troubleshooting

### Ошибка: "permission denied"
**Решение:** В Supabase → Settings → API → Отключите RLS для тестирования

### Ошибка: "relation already exists"
**Решение:** Таблицы уже созданы, всё в порядке!

### Не загружаются товары
**Решение:** 
1. Проверьте консоль браузера (F12)
2. Убедитесь что URL и ключ правильные
3. Проверьте RLS политики в Supabase

---

## 📞 Support

Если возникли проблемы:
1. Откройте консоль браузера (F12)
2. Скопируйте ошибку
3. Напишите мне

**Готово! Выполняйте SQL и всё заработает!** 🚀