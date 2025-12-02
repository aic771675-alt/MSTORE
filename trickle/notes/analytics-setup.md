# Настройка аналитики

## Google Analytics

### Получение ID счётчика

1. Перейдите на [Google Analytics](https://analytics.google.com/)
2. Создайте аккаунт и ресурс (если ещё не создан)
3. Получите измерительный ID (формат: `G-XXXXXXXXXX`)

### Замена в коде

Найдите и замените `GA_MEASUREMENT_ID` на ваш реальный ID во всех HTML файлах:
- `index.html`
- `about.html`
- `admin.html`
- И других страницах

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Яндекс.Метрика

### Получение ID счётчика

1. Перейдите на [Яндекс.Метрика](https://metrika.yandex.ru/)
2. Создайте счётчик для вашего сайта
3. Получите номер счётчика (формат: `12345678`)

### Замена в коде

Найдите и замените `YANDEX_COUNTER_ID` на ваш номер счётчика:

```javascript
ym(12345678, "init", { ... });
```

И в URL изображения:
```html
<img src="https://mc.yandex.ru/watch/12345678" ... />
```

## Отслеживаемые события

Система автоматически отслеживает:

### Google Analytics
- `page_view` - просмотры страниц
- `view_item` - просмотр товара
- `add_to_cart` - добавление в корзину
- `purchase` - оформление заказа

### Яндекс.Метрика
- Карта кликов (clickmap)
- Вебвизор (webvisor)
- Отслеживание ссылок (trackLinks)
- Точный показатель отказов (accurateTrackBounce)
- E-commerce события

## Использование в коде

```javascript
// Просмотр страницы
Analytics.trackPageView('Главная страница');

// Просмотр товара
Analytics.trackProductView(product);

// Добавление в корзину
Analytics.trackAddToCart(product, quantity, size);

// Оформление заказа
Analytics.trackPurchase({
    id: orderId,
    total: totalAmount,
    items: cartItems
});
```

## Проверка работы

После настройки:

1. **Google Analytics**: Откройте Realtime отчёты, проверьте активных пользователей
2. **Яндекс.Метрика**: Перейдите в счётчик, проверьте онлайн посетителей

Создано: 2025-11-30