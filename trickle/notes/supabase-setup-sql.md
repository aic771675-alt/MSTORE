# SQL скрипт для создания таблицы products в Supabase

## Шаг 1: Создание таблицы products

Откройте SQL Editor в вашем проекте Supabase и выполните следующий скрипт:

```sql
-- Создание таблицы products
CREATE TABLE IF NOT EXISTS public.products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    article TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    sizes JSONB DEFAULT '{"XS": 0, "S": 0, "M": 0, "L": 0, "XL": 0}'::jsonb,
    total_stock INTEGER GENERATED ALWAYS AS (
        COALESCE((sizes->>'XS')::integer, 0) +
        COALESCE((sizes->>'S')::integer, 0) +
        COALESCE((sizes->>'M')::integer, 0) +
        COALESCE((sizes->>'L')::integer, 0) +
        COALESCE((sizes->>'XL')::integer, 0)
    ) STORED,
    gallery JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_article ON public.products(article);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для обновления updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Шаг 2: Настройка Row Level Security (RLS)

```sql
-- Включаем RLS для таблицы products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Политика: Все могут читать товары
CREATE POLICY "Allow public read access"
ON public.products
FOR SELECT
TO public
USING (true);

-- Политика: Любой может добавлять товары (для админ-панели)
CREATE POLICY "Allow public insert access"
ON public.products
FOR INSERT
TO public
WITH CHECK (true);

-- Политика: Любой может обновлять товары (для админ-панели)
CREATE POLICY "Allow public update access"
ON public.products
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Политика: Любой может удалять товары (для админ-панели)
CREATE POLICY "Allow public delete access"
ON public.products
FOR DELETE
TO public
USING (true);
```

## Шаг 3: Проверка таблицы

```sql
-- Проверить структуру таблицы
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'products';

-- Проверить политики RLS
SELECT * FROM pg_policies WHERE tablename = 'products';
```

## Шаг 4: Добавление тестовых данных (опционально)

```sql
-- Добавить несколько тестовых товаров
INSERT INTO public.products (name, article, category, price, image, description, sizes, gallery)
VALUES 
(
    'Белая рубашка оверсайз',
    'MOL001',
    'Рубашки',
    4500.00,
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990',
    'Стильная белая рубашка оверсайз из натурального хлопка',
    '{"XS": 5, "S": 10, "M": 15, "L": 10, "XL": 5}'::jsonb,
    '[]'::jsonb
),
(
    'Черное пальто',
    'MOL002',
    'Верхняя одежда',
    12000.00,
    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3',
    'Элегантное черное пальто прямого кроя',
    '{"XS": 3, "S": 8, "M": 12, "L": 8, "XL": 3}'::jsonb,
    '[]'::jsonb
);

-- Проверить добавленные данные
SELECT * FROM public.products;
```

## Важные замечания

⚠️ **Безопасность**: Текущие настройки RLS разрешают публичный доступ для всех операций. Это сделано для упрощения разработки. В production среде рекомендуется:

1. Создать authentication для админов
2. Ограничить INSERT, UPDATE, DELETE только для авторизованных пользователей
3. Оставить публичный доступ только для SELECT (чтение)

## Пример безопасных политик для production:

```sql
-- Удалить существующие политики
DROP POLICY IF EXISTS "Allow public insert access" ON public.products;
DROP POLICY IF EXISTS "Allow public update access" ON public.products;
DROP POLICY IF EXISTS "Allow public delete access" ON public.products;

-- Новые политики только для авторизованных пользователей
CREATE POLICY "Allow authenticated insert"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update"
ON public.products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete"
ON public.products
FOR DELETE
TO authenticated
USING (true);
```

## Проверка подключения

После выполнения SQL скриптов:
1. Обновите страницу админ-панели
2. Проверьте консоль браузера на наличие ошибок
3. Все галочки в статусе должны быть зелеными ✅

Дата создания: 2025-11-30