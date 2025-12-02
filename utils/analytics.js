// Analytics utility for tracking user events
const Analytics = {
    // Track page view
    trackPageView: (pageName) => {
        try {
            // Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_view', {
                    page_title: pageName,
                    page_location: window.location.href,
                    page_path: window.location.pathname
                });
            }
            
            // Yandex.Metrika
            if (typeof ym !== 'undefined') {
                ym(window.YANDEX_COUNTER_ID || 0, 'hit', window.location.href, {
                    title: pageName
                });
            }
        } catch (error) {
            console.error('Analytics tracking error:', error);
        }
    },
    
    // Track product view
    trackProductView: (product) => {
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'view_item', {
                    items: [{
                        item_id: product.id,
                        item_name: product.name,
                        item_category: product.category,
                        price: product.price
                    }]
                });
            }
            
            if (typeof ym !== 'undefined') {
                ym(window.YANDEX_COUNTER_ID || 0, 'reachGoal', 'product_view', {
                    product_id: product.id,
                    product_name: product.name
                });
            }
        } catch (error) {
            console.error('Analytics tracking error:', error);
        }
    },
    
    // Track add to cart
    trackAddToCart: (product, quantity, size) => {
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'add_to_cart', {
                    items: [{
                        item_id: product.id,
                        item_name: product.name,
                        item_category: product.category,
                        price: product.price,
                        quantity: quantity
                    }]
                });
            }
            
            if (typeof ym !== 'undefined') {
                ym(window.YANDEX_COUNTER_ID || 0, 'reachGoal', 'add_to_cart', {
                    product_id: product.id,
                    size: size,
                    quantity: quantity
                });
            }
        } catch (error) {
            console.error('Analytics tracking error:', error);
        }
    },
    
    // Track order
    trackPurchase: (orderData) => {
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'purchase', {
                    transaction_id: orderData.id,
                    value: orderData.total,
                    currency: 'RUB',
                    items: orderData.items.map(item => ({
                        item_id: item.id,
                        item_name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    }))
                });
            }
            
            if (typeof ym !== 'undefined') {
                ym(window.YANDEX_COUNTER_ID || 0, 'reachGoal', 'purchase', {
                    order_id: orderData.id,
                    revenue: orderData.total
                });
            }
        } catch (error) {
            console.error('Analytics tracking error:', error);
        }
    }
};

window.Analytics = Analytics;