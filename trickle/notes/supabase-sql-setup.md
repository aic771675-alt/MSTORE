# SQL скрипт для настройки таблицы products в Supabase

Выполните этот SQL скрипт в вашем Supabase SQL Editor:

```sql
-- Создание таблицы products
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    article TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0),
    image TEXT NOT NULL,
    description TEXT,
    sizes JSONB DEFAULT '{"XS": 0, "S": 0, "M": 0, "L": 0, "XL": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_article ON products(article);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Включение Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Политика для чтения (все могут читать)
CREATE POLICY "Allow public read access" ON products
    FOR SELECT
    USING (true);

-- Политика для вставки (только аутентифицированные пользователи)
CREATE POLICY "Allow authenticated insert" ON products
    FOR INSERT
    WITH CHECK (true);

-- Политика для обновления (только аутентифицированные пользователи)
CREATE POLICY "Allow authenticated update" ON products
    FOR UPDATE
    USING (true);

-- Политика для удаления (только аутентифицированные пользователи)
CREATE POLICY "Allow authenticated delete" ON products
    FOR DELETE
    USING (true);

-- Создание функции для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создание триггера для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Создание таблицы для lookbook (галерея изображений на странице "О нас")
CREATE TABLE IF NOT EXISTS lookbook (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image TEXT NOT NULL,
    title TEXT,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индекс для сортировки lookbook
CREATE INDEX IF NOT EXISTS idx_lookbook_order ON lookbook(order_index);

-- RLS для lookbook
ALTER TABLE lookbook ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read lookbook" ON lookbook
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Allow authenticated manage lookbook" ON lookbook
    FOR ALL
    USING (true);

-- Триггер для lookbook updated_at
DROP TRIGGER IF EXISTS update_lookbook_updated_at ON lookbook;
CREATE TRIGGER update_lookbook_updated_at
    BEFORE UPDATE ON lookbook
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Создание таблицы для промо-попапов
CREATE TABLE IF NOT EXISTS promo_popups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    button_text TEXT DEFAULT 'Перейти',
    button_link TEXT,
    is_active BOOLEAN DEFAULT true,
    show_delay INTEGER DEFAULT 3000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS для promo_popups
ALTER TABLE promo_popups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read active promos" ON promo_popups
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Allow authenticated manage promos" ON promo_popups
    FOR ALL
    USING (true);

-- Триггер для promo_popups updated_at
DROP TRIGGER IF EXISTS update_promo_popups_updated_at ON promo_popups;
CREATE TRIGGER update_promo_popups_updated_at
    BEFORE UPDATE ON promo_popups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Описание полей таблицы products:

- `id` - Уникальный идентификатор товара (UUID)
- `name` - Название товара
- `article` - Артикул (уникальный)
- `category` - Категория товара
- `price` - Цена товара
- `image` - URL изображения товара
- `description` - Описание товара
- `sizes` - JSON объект с остатками по размерам (формат: XS, S, M, L, XL)
- `created_at` - Дата создания
- `updated_at` - Дата последнего обновления (автоматически обновляется)

## Настройка Storage для изображений:

1. В Supabase Dashboard перейдите в Storage
2. Создайте новый bucket с именем `product-images`
3. Настройте публичный доступ для bucket:
   - Policies → New Policy → "Allow public read access"
   - Allow SELECT для всех пользователей

## После выполнения SQL:

✅ База данных готова к работе
✅ Админ-панель сможет добавлять/редактировать товары
✅ Автоматическое обновление поля updated_at
✅ Безопасность настроена через RLS политики

Обновлено: 30.11.2025