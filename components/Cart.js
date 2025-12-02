function Cart({ cart, onClose, onUpdateCart, activeSale = null }) {
  const safeItems = React.useMemo(() => {
    if (!cart) return [];
    if (!Array.isArray(cart)) return [];
    return cart.filter(item => item && typeof item === 'object');
  }, [cart]);
    
    React.useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);
    
    const calculateItemPrice = (item) => {
      const originalPrice = parseFloat(item.price) || 0;
      const effectiveDiscount = item.discount > 0 ? item.discount : (activeSale && activeSale.active ? activeSale.discount : 0);
      if (effectiveDiscount > 0) {
        return Math.round(originalPrice * (1 - effectiveDiscount / 100));
      }
      return originalPrice;
    };
    
    const total = React.useMemo(() => {
      return safeItems.reduce((sum, item) => {
        const price = calculateItemPrice(item);
        const qty = parseInt(item.quantity) || 0;
        return sum + (price * qty);
      }, 0);
    }, [safeItems, activeSale]);
    
    const originalTotal = React.useMemo(() => {
      return safeItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const qty = parseInt(item.quantity) || 0;
        return sum + (price * qty);
      }, 0);
    }, [safeItems]);

    const handleOrder = (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      
      if (safeItems.length === 0) {
        alert('Корзина пуста');
        return;
      }

      const order = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        items: safeItems.map(item => ({
          name: item.name,
          article: item.article || 'Н/Д',
          size: item.selectedSize || 'не выбран',
          quantity: item.quantity,
          price: calculateItemPrice(item)
        })),
        total: total,
        status: 'pending'
      };

      try {
        const savedOrders = localStorage.getItem('molove_orders');
        const orders = savedOrders ? JSON.parse(savedOrders) : [];
        orders.unshift(order);
        localStorage.setItem('molove_orders', JSON.stringify(orders));
      } catch (error) {
        console.error('Error saving order:', error);
      }
      
      const orderItems = safeItems.map((item, index) => {
        const itemTotal = calculateItemPrice(item) * item.quantity;
        return `${index + 1}. ${item.name}\n   Артикул: ${item.article || 'Н/Д'}\n   Размер: ${item.selectedSize || 'не выбран'}\n   Количество: ${item.quantity} шт.\n   Цена: ${calculateItemPrice(item).toLocaleString('ru-RU')} ₽\n   Сумма: ${itemTotal.toLocaleString('ru-RU')} ₽`;
      }).join('\n\n');
      
      const orderMessage = `🛍️ НОВЫЙ ЗАКАЗ #${order.id.slice(0, 8)}\n\n${orderItems}\n\n━━━━━━━━━━━━━━━━\n💰 ИТОГО: ${total.toLocaleString('ru-RU')} ₽\n\n📱 Пожалуйста, свяжитесь со мной для подтверждения заказа`;
      
      const telegramUrl = `https://t.me/neurocraftsru?text=${encodeURIComponent(orderMessage)}`;
      
      localStorage.removeItem('molove_cart');
      window.location.href = telegramUrl;
    };
    
    const handleWhatsAppOrder = (e) => {
      e?.preventDefault();
      e?.stopPropagation();
      
      const orderItems = safeItems.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        return `${index + 1}. ${item.name}\n   Артикул: ${item.article || 'Н/Д'}\n   Размер: ${item.selectedSize || 'не выбран'}\n   Количество: ${item.quantity} шт.\n   Цена: ${item.price.toLocaleString('ru-RU')} ₽\n   Сумма: ${itemTotal.toLocaleString('ru-RU')} ₽`;
      }).join('\n\n');
      
      const orderMessage = `🛍️ НОВЫЙ ЗАКАЗ MOLOVE\n\n${orderItems}\n\n━━━━━━━━━━━━━━━━\n💰 ИТОГО: ${total.toLocaleString('ru-RU')} ₽\n\n📱 Пожалуйста, свяжитесь со мной для подтверждения заказа`;
      
      const whatsappUrl = `https://wa.me/79123456789?text=${encodeURIComponent(orderMessage)}`;
      window.location.href = whatsappUrl;
    };

    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="fixed right-0 top-0 h-full w-full sm:max-w-md md:max-w-lg bg-white shadow-xl flex flex-col">
          <div className="p-4 sm:p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-light" style={{fontFamily: "'Cormorant Garamond', serif"}}>Корзина</h2>
              <div className="flex items-center gap-2">
                {safeItems.length > 0 && (
                  <button 
                    onClick={() => onUpdateCart([])}
                    className="p-2 hover:bg-red-50 rounded-full touch-manipulation text-red-600"
                    title="Очистить корзину"
                  >
                    <div className="icon-trash-2 text-lg sm:text-xl"></div>
                  </button>
                )}
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full touch-manipulation">
                  <div className="icon-x text-xl sm:text-2xl"></div>
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {safeItems.length === 0 ? (
              <p className="text-center text-gray-500 text-sm sm:text-base">Корзина пуста</p>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {safeItems.map(item => {
                  const itemPrice = calculateItemPrice(item);
                  const hasDiscount = activeSale && activeSale.active && itemPrice < item.price;
                  return (
                  <div key={item.cartId || item.id || `item-${Date.now()}`} className="relative pb-2">
                    <button 
                      onClick={() => {
                        const newCart = safeItems.filter(i => i.cartId !== item.cartId);
                        onUpdateCart(newCart);
                      }}
                      className="absolute top-0 right-0 z-10 w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 active:scale-95 transition-all touch-manipulation shadow-lg"
                      title="Удалить товар"
                    >
                      <div className="icon-trash-2 text-xs"></div>
                    </button>
                    <div className="flex space-x-3 sm:space-x-4 pr-9">
                      <img 
                        src={item.image || (item.images && item.images[0]) || ''} 
                        alt={item.name || 'Товар'} 
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm sm:text-base truncate pr-2">{item.name}</h3>
                        <div className="flex items-center gap-2">
                          <p className={`text-sm sm:text-base ${hasDiscount ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                            {itemPrice.toLocaleString('ru-RU')} ₽
                          </p>
                          {hasDiscount && (
                            <p className="text-xs text-gray-400 line-through">{item.price.toLocaleString('ru-RU')} ₽</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3 mt-2 sm:mt-3">
                          <button onClick={() => {
                            const newCart = safeItems.map(i => 
                              i.cartId === item.cartId 
                                ? {...i, quantity: Math.max(1, i.quantity - 1)}
                                : i
                            );
                            onUpdateCart(newCart);
                          }} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-50 active:scale-95 transition-all touch-manipulation">
                            <div className="icon-minus text-sm sm:text-base"></div>
                          </button>
                          <span className="w-10 text-center font-medium text-base sm:text-lg">{item.quantity}</span>
                          <button onClick={() => {
                            const maxStock = item.sizes?.[item.selectedSize] || 99;
                            const newCart = safeItems.map(i => 
                              i.cartId === item.cartId 
                                ? {...i, quantity: Math.min(maxStock, i.quantity + 1)}
                                : i
                            );
                            onUpdateCart(newCart);
                          }} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-50 active:scale-95 transition-all touch-manipulation">
                            <div className="icon-plus text-sm sm:text-base"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
          {safeItems.length > 0 && (
            <div className="p-4 sm:p-6 border-t space-y-2">
              {activeSale && activeSale.active && total < originalTotal && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-red-700 font-medium">Скидка {activeSale.discount}%</span>
                    <span className="text-red-700">-{(originalTotal - total).toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-baseline mb-4 sm:mb-6">
                <span className="text-base sm:text-lg font-medium">Итого:</span>
                <div className="text-right">
                  {activeSale && activeSale.active && total < originalTotal && (
                    <div className="text-sm text-gray-400 line-through mb-1">{originalTotal.toLocaleString('ru-RU')} ₽</div>
                  )}
                  <span className={`text-xl sm:text-2xl md:text-3xl font-light ${activeSale && activeSale.active && total < originalTotal ? 'text-red-600' : ''}`} style={{fontFamily: "'Cormorant Garamond', serif"}}>{total.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
              <button onClick={handleOrder} className="w-full py-2.5 sm:py-3 bg-black text-white text-xs sm:text-sm font-medium uppercase rounded-lg hover:bg-gray-800 active:scale-95 transition-all touch-manipulation flex items-center justify-center gap-1.5">
                <div className="icon-send text-base sm:text-lg"></div>
                Оформить заказ в Telegram
              </button>
              <button onClick={handleWhatsAppOrder} className="w-full py-2.5 sm:py-3 border-2 border-black text-black text-xs sm:text-sm font-medium uppercase rounded-lg hover:bg-black hover:text-white active:scale-95 transition-all touch-manipulation flex items-center justify-center gap-1.5">
                <div className="icon-message-circle text-base sm:text-lg"></div>
                Оформить заказ в WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    );
}