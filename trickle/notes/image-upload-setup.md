# Настройка загрузки изображений

## Supabase Storage Setup

Для работы функционала загрузки изображений необходимо настроить хранилище в Supabase:

### 1. Создание Bucket

1. Откройте проект в Supabase Dashboard
2. Перейдите в раздел **Storage**
3. Создайте новый bucket с именем `product-images`
4. Настройте публичный доступ:
   - Public bucket: **Yes**
   - File size limit: 5MB
   - Allowed MIME types: `image/*`

### 2. Политики доступа (RLS)

Создайте следующие политики для bucket `product-images`:

**Политика для загрузки (INSERT):**
```sql
CREATE POLICY "Allow public upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'product-images');
```

**Политика для чтения (SELECT):**
```sql
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
```

**Политика для удаления (DELETE):**
```sql
CREATE POLICY "Allow public delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'product-images');
```

### 3. Функционал

- ✅ Автоматическая конвертация в WebP
- ✅ Drag & Drop загрузка
- ✅ Предпросмотр изображения
- ✅ Оптимизация размера (качество 90%)
- ✅ Уникальные имена файлов

### 4. Использование

В админ-панели при добавлении/редактировании товара:
1. Перетащите изображение в зону загрузки
2. Или нажмите "Выбрать файл"
3. Изображение автоматически загрузится и конвертируется в WebP
4. URL изображения сохранится в базе данных

Создано: 2025-11-29