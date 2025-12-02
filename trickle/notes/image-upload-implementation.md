# Загрузка изображений в WebP формате

## Реализованный функционал

В админ-панели добавлена возможность загрузки изображений товаров с автоматической конвертацией в WebP формат.

### Возможности

- ✅ Drag & Drop загрузка изображений
- ✅ Выбор файла через диалог
- ✅ Автоматическая конвертация в WebP
- ✅ Оптимизация размера (макс 1200x1200px)
- ✅ Предпросмотр загруженного изображения
- ✅ Индикатор загрузки
- ✅ Хранение в Supabase Storage

### Технические детали

**Конвертация:**
- Максимальный размер: 1200x1200 пикселей
- Качество WebP: 90%
- Автоматическое масштабирование при превышении размера

**Хранилище:**
- Bucket: `product-images`
- URL формат: `https://vwvvloewmsgnnoyekwhg.supabase.co/storage/v1/object/public/product-images/[filename].webp`
- Уникальные имена файлов: timestamp + random string

### Настройка Supabase Storage

Необходимо создать публичный bucket `product-images` в Supabase Dashboard:

1. Storage → Create bucket
2. Name: `product-images`
3. Public: Yes
4. File size limit: 5MB

**Политики доступа:**

```sql
-- Разрешить загрузку
CREATE POLICY "Allow public upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'product-images');

-- Разрешить чтение
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
```

### Использование

В форме товара вместо поля "URL изображения" теперь доступна зона загрузки:

1. Перетащите изображение в зону загрузки
2. Или нажмите "Выбрать файл"
3. Дождитесь завершения загрузки
4. Изображение появится в предпросмотре
5. При необходимости можно удалить и загрузить другое

Создано: 2025-11-29