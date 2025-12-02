# Supabase Setup для MOLOVE

## Настройки подключения

- **Project URL:** `https://vwvvloewmsgnnoyekwhg.supabase.co`
- **Publishable Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3dnZsb2V3bXNnbm5veWVrd2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyODQ4MTQsImV4cCI6MjA3OTg2MDgxNH0.8unm1ItX6PiRqM3ufr9I9Jg3eSYTIMqkZFJIMfm_8XQ`

## Структура таблицы products

Необходимо создать таблицу `products` в Supabase со следующими полями:

```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  article TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Миграция данных

После создания таблицы нужно:
1. Экспортировать товары из Trickle Database
2. Импортировать их в Supabase через админ-панель

## Row Level Security (RLS)

Для публичного доступа к чтению товаров:

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);
```

Дата создания: 2025-11-26