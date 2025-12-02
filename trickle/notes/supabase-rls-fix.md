# Исправление ошибки RLS Policy в Supabase

## Проблема
Ошибка: `new row violates row-level security policy for table "products"`

Это означает, что включена Row Level Security (RLS), но нет политики, разрешающей вставку данных.

## Решение 1: Создать политику INSERT (Рекомендуется)

Откройте **SQL Editor** в Supabase Dashboard и выполните:

```sql
-- Разрешить публичную вставку данных
CREATE POLICY "Allow public insert" 
ON products 
FOR INSERT 
WITH CHECK (true);

-- Разрешить публичное обновление данных
CREATE POLICY "Allow public update" 
ON products 
FOR UPDATE 
USING (true);

-- Разрешить публичное удаление данных
CREATE POLICY "Allow public delete" 
ON products 
FOR DELETE 
USING (true);
```

## Решение 2: Временно отключить RLS (Для тестирования)

```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE lookbook DISABLE ROW LEVEL SECURITY;
ALTER TABLE promo_settings DISABLE ROW LEVEL SECURITY;
```

⚠️ **Внимание**: Отключение RLS делает таблицу полностью публичной!

## Решение 3: Настроить правильные политики безопасности

```sql
-- Разрешить всем читать опубликованные товары
CREATE POLICY "Allow read published products" 
ON products 
FOR SELECT 
USING (published = true);

-- Разрешить администраторам все операции
CREATE POLICY "Allow admin all operations" 
ON products 
FOR ALL 
USING (auth.role() = 'authenticated');
```

## Проверка статуса RLS

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('products', 'orders', 'lookbook', 'promo_settings');
```

Дата создания: 2 декабря 2025