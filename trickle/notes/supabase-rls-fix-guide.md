# Решение проблемы RLS в Supabase

## Проблема
При добавлении/редактировании товаров появляется ошибка:
```
new row violates row-level security policy for table "products"
```

## Решение

### Вариант 1: Отключить RLS (быстро, для разработки)

Выполните в **SQL Editor** Supabase Dashboard:

```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE lookbook DISABLE ROW LEVEL SECURITY;
ALTER TABLE promo_settings DISABLE ROW LEVEL SECURITY;
```

### Вариант 2: Создать политики (рекомендуется для продакшена)

```sql
-- Политики для products
CREATE POLICY "Allow public read published products" 
ON products FOR SELECT 
USING (published = true);

CREATE POLICY "Allow all operations" 
ON products FOR ALL 
USING (true) 
WITH CHECK (true);

-- Политики для orders
CREATE POLICY "Allow public insert orders" 
ON orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public read own orders" 
ON orders FOR SELECT 
USING (true);

-- Политики для lookbook
CREATE POLICY "Allow public read lookbook" 
ON lookbook FOR SELECT 
USING (true);

CREATE POLICY "Allow all operations lookbook" 
ON lookbook FOR ALL 
USING (true) 
WITH CHECK (true);

-- Политики для promo_settings
CREATE POLICY "Allow public read promo" 
ON promo_settings FOR SELECT 
USING (true);

CREATE POLICY "Allow all operations promo" 
ON promo_settings FOR ALL 
USING (true) 
WITH CHECK (true);
```

### Вариант 3: Полное удаление существующих политик и создание новых

```sql
-- Удалить все существующие политики
DROP POLICY IF EXISTS "Allow public read published products" ON products;
DROP POLICY IF EXISTS "Allow all operations" ON products;

-- Отключить RLS
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE lookbook DISABLE ROW LEVEL SECURITY;
ALTER TABLE promo_settings DISABLE ROW LEVEL SECURITY;
```

## Проверка статуса RLS

```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## Текущая дата обновления
2 декабря 2025