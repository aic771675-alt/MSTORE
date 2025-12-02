# Настройка новой базы данных Supabase

## Данные подключения

- **URL**: `https://hdwlwcbhzyhcjytqdvlp.supabase.co`
- **Anon Key**: Настроен в `utils/supabase.js`
- **Дата настройки**: 30.11.2025

## Необходимые таблицы

Для работы приложения MOLOVE необходимо создать следующие таблицы в Supabase:

### 1. Таблица `products` (Товары)

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  article TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  images TEXT[] NOT NULL,
  description TEXT,
  sizes JSONB DEFAULT '{"XS": 0, "S": 0, "M": 0, "L": 0, "XL": 0}',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индекс для быстрого поиска опубликованных товаров
CREATE INDEX idx_products_published ON products(published);
CREATE INDEX idx_products_category ON products(category);
```

### 2. Таблица `orders` (Заказы)

```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_telegram TEXT,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индекс для сортировки по дате
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
```

### 3. Таблица `lookbook` (Галерея)

```sql
CREATE TABLE lookbook (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индекс для сортировки
CREATE INDEX idx_lookbook_sort ON lookbook(sort_order);
```

### 4. Таблица `promo_settings` (Промо попап)

```sql
CREATE TABLE promo_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  enabled BOOLEAN DEFAULT false,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  button_text TEXT DEFAULT 'Подробнее',
  button_link TEXT,
  show_delay INTEGER DEFAULT 3000,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Вставка дефолтной записи
INSERT INTO promo_settings (enabled, title, description, button_text)
VALUES (false, 'Специальное предложение', 'Скидка 20% на новую коллекцию', 'Смотреть коллекцию');
```

## Row Level Security (RLS)

После создания таблиц необходимо настроить политики безопасности:

```sql
-- Включаем RLS для всех таблиц
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lookbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_settings ENABLE ROW LEVEL SECURITY;

-- Публичный доступ на чтение опубликованных товаров
CREATE POLICY "Public can read published products"
ON products FOR SELECT
USING (published = true);

-- Публичный доступ на создание заказов
CREATE POLICY "Public can create orders"
ON orders FOR INSERT
WITH CHECK (true);

-- Публичный доступ на чтение lookbook
CREATE POLICY "Public can read lookbook"
ON lookbook FOR SELECT
USING (true);

-- Публичный доступ на чтение промо настроек
CREATE POLICY "Public can read promo settings"
ON promo_settings FOR SELECT
USING (true);
```

## Как применить SQL скрипты

1. Зайди в свой проект Supabase
2. Перейди в раздел **SQL Editor**
3. Создай новый запрос
4. Скопируй и вставь SQL код для каждой таблицы
5. Нажми **Run** для выполнения

## Миграция данных

Если у тебя есть существующие данные в localStorage или старой базе:

1. Экспортируй товары через админ-панель (кнопка "Экспорт товаров")
2. После создания таблиц импортируй через админ-панель (кнопка "Импорт товаров")

## Проверка подключения

После создания таблиц зайди в админ-панель и проверь:
- Загрузка товаров работает
- Создание новых товаров работает
- Нет ошибок в консоли браузера

Создано: 30.11.2025