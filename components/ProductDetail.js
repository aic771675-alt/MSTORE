function ProductDetail({ product, onClose, onAddToCart, allProducts = [], activeSale = null }) {
    if (!product || typeof product !== 'object') {
      console.error('Invalid product data in ProductDetail:', product);
      return null;
    }
    
    const [selectedSize, setSelectedSize] = React.useState('');
    const [quantity, setQuantity] = React.useState(1);
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [showSizeGuide, setShowSizeGuide] = React.useState(false);
    const [showDescription, setShowDescription] = React.useState(false);
    const [isZoomed, setIsZoomed] = React.useState(false);
    const swiperRef = React.useRef(null);
    
    const productImages = Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [
          product.image,
          product.image2,
          product.image3,
          product.image4,
          product.image5
        ].filter(Boolean);
    
    const hapticFeedback = () => {
      if ('vibrate' in navigator) navigator.vibrate(50);
    };
    
    React.useEffect(() => {
      document.body.style.overflow = 'hidden';
      
      const initSwiper = () => {
        if (window.Swiper && !swiperRef.current) {
          setTimeout(() => {
            swiperRef.current = new window.Swiper('.product-swiper', {
              slidesPerView: 1,
              spaceBetween: 0,
              loop: false,
              observer: true,
              observeParents: true,
              pagination: { el: '.swiper-pagination', clickable: true },
              on: { slideChange: (swiper) => setCurrentImageIndex(swiper.activeIndex) }
            });
          }, 100);
        }
      };
      
      if (window.Swiper) {
        initSwiper();
      } else {
        const checkSwiper = setInterval(() => {
          if (window.Swiper) {
            clearInterval(checkSwiper);
            initSwiper();
          }
        }, 50);
        setTimeout(() => clearInterval(checkSwiper), 2000);
      }
      
      return () => {
        document.body.style.overflow = 'auto';
        if (swiperRef.current) {
          swiperRef.current.destroy(true, true);
          swiperRef.current = null;
        }
      };
    }, []);
    
    const optimizeImageUrl = (url) => window.imageOptimizer?.optimize(url, 'thumbnail') || url;
    const sizes = React.useMemo(() => product.sizes || {}, [product.sizes]);
    const maxQuantity = React.useMemo(() => 
      selectedSize && sizes[selectedSize] ? sizes[selectedSize] : 0,
      [selectedSize, sizes]
    );
    
    const hasValidSizes = React.useMemo(() => 
      sizes && Object.keys(sizes).length > 0,
      [sizes]
    );

    const formatDescription = (text) => {
      if (!text) return [];
      if (typeof text !== 'string') return [];
      const sentences = text.split('.').filter(s => s.trim());
      return sentences.length > 0 ? sentences.map(s => s.trim() + '.') : [];
    };

    const handleAddToCart = () => {
      if (!selectedSize) {
        hapticFeedback();
        alert('Пожалуйста, выберите размер');
        return;
      }
      
      const sizeStock = product.sizes?.[selectedSize] || 0;
      if (quantity > sizeStock) {
        alert(`Доступно только ${sizeStock} шт.`);
        return;
      }
      
      hapticFeedback();
      const cartItem = {
        ...product,
        selectedSize: selectedSize,
        quantity: quantity,
        cartId: Date.now() + Math.random()
      };
      onAddToCart(cartItem);
      setTimeout(() => onClose(), 300);
    };
    
    const handleSizeSelect = (size, isAvailable) => {
      if (isAvailable) {
        hapticFeedback();
        setSelectedSize(size);
      }
    };

    const effectiveDiscount = product.discount > 0 ? product.discount : (activeSale ? activeSale.discount : 0);
    const discountedPrice = effectiveDiscount > 0 
      ? Math.round(product.price * (1 - effectiveDiscount / 100))
      : null;

    return React.createElement('div', { className: 'fixed inset-0 z-50' },
      React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-85', onClick: onClose }),
      React.createElement('div', { className: 'relative w-full h-full md:flex md:items-center md:justify-center md:p-4 lg:p-6 z-10' },
        React.createElement('div', { className: 'relative bg-white rounded-none md:rounded-xl w-full md:w-[90vw] md:max-w-[1000px] h-full md:h-auto md:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl z-20' },
          React.createElement('button', { onClick: onClose, className: 'absolute top-2 right-2 md:top-3 md:right-3 p-2 bg-white hover:bg-gray-100 rounded-full z-30 shadow-lg transition-all' },
            React.createElement('div', { className: 'icon-x text-base md:text-lg' })
          ),
          
          React.createElement('div', { 
            className: `flex-1 overflow-hidden flex flex-col md:grid ${
              productImages.length > 1 
                ? 'md:grid-cols-[100px_minmax(0,1fr)_minmax(0,0.85fr)] lg:grid-cols-[110px_minmax(0,1fr)_minmax(0,0.85fr)]' 
                : 'md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]'
            } md:gap-2 lg:gap-3` 
          },
            productImages.length > 1 && React.createElement('div', { className: 'hidden md:flex md:flex-col md:w-[100px] lg:w-[110px] md:overflow-y-auto md:p-1.5 md:gap-1.5 bg-gray-50 scrollbar-hide flex-shrink-0' },
              productImages.filter(img => img && img.trim()).map((img, idx) =>
                React.createElement('button', {
                  key: idx,
                  onClick: () => {
                    hapticFeedback();
                    if (swiperRef.current) {
                      const realIndex = productImages.indexOf(img);
                      swiperRef.current.slideTo(realIndex);
                      setCurrentImageIndex(realIndex);
                    }
                  },
                  className: `flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    currentImageIndex === productImages.indexOf(img) ? 'border-black scale-105' : 'border-gray-300 hover:border-gray-400'
                  }`,
                  style: {width: '100%', aspectRatio: '1/1'}
                },
                  React.createElement('img', { src: img, alt: `Миниатюра ${idx + 1}`, className: 'w-full h-full object-cover', loading: 'eager' })
                )
              )
            ),
            
            React.createElement('div', { className: 'flex-shrink-0 flex flex-col bg-gray-50 md:min-w-0 md:overflow-hidden' },
              React.createElement('div', { className: 'swiper product-swiper w-full flex items-center justify-center p-2 md:p-3' },
                React.createElement('div', { className: 'swiper-wrapper' },
                  productImages.map((img, idx) =>
                    React.createElement('div', { key: idx, className: 'swiper-slide flex items-center justify-center bg-gray-50 p-0' },
                      React.createElement('img', {
                        src: img,
                        alt: `${product.name} - фото ${idx + 1}`,
                        className: 'w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity',
                        loading: 'eager',
                        style: {width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center'},
                        onClick: () => window.innerWidth >= 768 && setIsZoomed(true)
                      })
                    )
                  )
                ),
                productImages.filter(img => img && img.trim()).length > 1 && React.createElement('div', { className: 'swiper-pagination' })
              ),
              
              productImages.filter(img => img && img.trim()).length > 1 && React.createElement('div', { className: 'md:hidden overflow-x-auto scrollbar-hide px-2 py-2 bg-white' },
                React.createElement('div', { className: 'flex gap-3' },
                  productImages.filter(img => img && img.trim()).map((img, idx) =>
                    React.createElement('button', {
                      key: idx,
                      onClick: () => {
                        hapticFeedback();
                        if (swiperRef.current) {
                          const realIndex = productImages.indexOf(img);
                          swiperRef.current.slideTo(realIndex);
                          setCurrentImageIndex(realIndex);
                        }
                      },
                      className: `flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        currentImageIndex === productImages.indexOf(img) ? 'border-black scale-105' : 'border-gray-300 hover:border-gray-400'
                      }`,
                      style: {width: '96px', height: '96px', minWidth: '96px'}
                    },
                      React.createElement('img', { src: img, alt: `Миниатюра ${idx + 1}`, className: 'w-full h-full object-cover', loading: 'eager' })
                    )
                  )
                )
              )
            ),
            
            React.createElement('div', { className: 'flex-1 flex flex-col overflow-y-auto px-4 py-3 md:px-4 md:py-4 lg:px-5 lg:py-5 pb-24 md:pb-4 md:min-w-0' },
              (product.discount > 0 || activeSale) && React.createElement('div', { className: 'inline-flex items-center gap-2 mb-2' },
                React.createElement('span', { className: 'text-gray-500 tracking-wide', style: {fontSize: 'clamp(0.625rem, 1vw, 0.75rem)'} }, `${product.discount > 0 ? 'СКИДКА' : activeSale.title}`),
                React.createElement('span', { className: 'px-2 py-1 bg-red-600 text-white rounded', style: {fontSize: 'clamp(0.625rem, 1vw, 0.6875rem)', letterSpacing: '0.05em'} }, `-${effectiveDiscount}%`)
              ),
              
              React.createElement('h1', { className: 'mb-2 font-normal tracking-wide', style: {fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)'} }, product.name),
              
              React.createElement('div', { className: 'mb-4' },
                React.createElement('div', { className: 'flex flex-col gap-2 mb-1' },
                  (product.discount > 0 || activeSale) && discountedPrice ? React.createElement(React.Fragment, null,
                    React.createElement('div', { className: 'flex items-baseline gap-3 mb-1' },
                      React.createElement('span', { className: 'font-normal text-[var(--text-primary)]', style: {fontSize: 'clamp(1.5rem, 3.5vw, 2rem)'} }, 
                        `${discountedPrice.toLocaleString('ru-RU')} ₽`
                      )
                    ),
                    React.createElement('div', { className: 'flex items-center gap-3' },
                      React.createElement('span', { className: 'text-gray-400', style: {fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', textDecoration: 'line-through', textDecorationColor: '#d1d5db', textDecorationThickness: '1px'} }, 
                        `${product.price.toLocaleString('ru-RU')} ₽`
                      ),
                      React.createElement('span', { className: 'text-green-700 font-medium', style: {fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'} }, 
                        `Экономия ${(product.price - discountedPrice).toLocaleString('ru-RU')} ₽`
                      )
                    )
                  ) : React.createElement('span', { className: 'font-light', style: {fontSize: 'clamp(1.25rem, 3vw, 1.75rem)'} }, 
                    `${product.price.toLocaleString('ru-RU')} ₽`
                  )
                ),
                React.createElement('p', { className: 'text-gray-500', style: {fontSize: 'clamp(0.625rem, 1vw, 0.75rem)'} }, 'Включая НДС / + стоимость доставки')
              ),
              
              hasValidSizes && React.createElement('div', { className: 'space-y-3 mb-4' },
                React.createElement('div', { className: 'flex items-center justify-between' },
                  React.createElement('label', { className: 'font-semibold', style: {fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'} }, 'Размер - Выберите размер'),
                  React.createElement('button', { onClick: () => setShowSizeGuide(true), className: 'hover:underline flex items-center gap-1 transition-colors', style: {fontSize: 'clamp(0.625rem, 1vw, 0.75rem)'} },
                    React.createElement('div', { className: 'icon-ruler', style: {fontSize: 'clamp(0.625rem, 1vw, 0.75rem)'} }),
                    React.createElement('span', null, 'Найти свой размер')
                  )
                ),
                React.createElement('div', { className: 'grid grid-cols-5 gap-2 mb-2' },
                  Object.keys(sizes).map(size => {
                    const stock = sizes[size];
                    const isAvailable = stock > 0;
                    const isSelected = selectedSize === size;
                    return React.createElement('button', {
                      key: size,
                      onClick: () => handleSizeSelect(size, isAvailable),
                      disabled: !isAvailable,
                      className: `w-full border-2 rounded font-bold transition-all touch-manipulation ${
                        isSelected ? 'border-black bg-black text-white shadow-md' : isAvailable ? 'border-gray-300 hover:border-black hover:shadow-sm active:scale-95' : 'border-gray-200 bg-gray-100 text-gray-400 opacity-50'
                      }`,
                      style: {
                        minHeight: 'clamp(40px, 8vw, 44px)',
                        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                        padding: 'clamp(0.375rem, 1vw, 0.5rem)'
                      }
                    },
                      React.createElement('span', { className: isAvailable ? '' : 'line-through' }, size)
                    );
                  })
                ),
                React.createElement('button', {
                  disabled: true,
                  className: 'w-full border-2 border-gray-200 bg-gray-50 text-gray-400 rounded flex items-center justify-center gap-1.5',
                  style: {
                    padding: 'clamp(0.5rem, 1.5vw, 0.625rem)',
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)'
                  }
                },
                  React.createElement('span', { className: 'font-medium' }, 'XXL'),
                  React.createElement('div', { className: 'icon-mail', style: {fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'} })
                ),
                selectedSize && sizes[selectedSize] !== undefined && React.createElement('div', { 
                  className: `text-xs px-3 py-2 rounded flex items-center gap-2 transition-all ${
                    sizes[selectedSize] <= 5 
                      ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`,
                  role: 'status',
                  'aria-live': 'polite'
                },
                  React.createElement('div', { className: `icon-${sizes[selectedSize] <= 5 ? 'alert-circle' : 'check-circle'} text-sm` }),
                  React.createElement('span', { className: 'font-medium' }, `Осталось ${sizes[selectedSize]} шт`)
                )
              ),
              
              React.createElement('button', {
                onClick: handleAddToCart,
                disabled: !selectedSize,
                className: `w-full mb-3 rounded font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedSize
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`,
                style: {
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'
                }
              },
                React.createElement('div', { className: 'icon-shopping-cart', style: {fontSize: 'clamp(1rem, 1.5vw, 1.125rem)'} }),
                React.createElement('span', { className: 'uppercase tracking-wider' }, 
                  selectedSize ? 'В КОРЗИНУ' : 'ВЫБЕРИТЕ РАЗМЕР'
                )
              ),

              product.description && React.createElement('div', { className: 'border border-gray-200 rounded-lg overflow-hidden mt-3' },
                React.createElement('button', { 
                  onClick: () => setShowDescription(!showDescription), 
                  className: 'w-full px-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors',
                  style: {padding: 'clamp(0.5rem, 1.5vw, 0.625rem) clamp(0.75rem, 2vw, 1rem)'}
                },
                  React.createElement('span', { className: 'font-medium', style: {fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'} }, 'Описание'),
                  React.createElement('div', { className: `icon-chevron-${showDescription ? 'up' : 'down'}`, style: {fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'} })
                ),
                showDescription && React.createElement('div', { className: 'px-3 text-gray-700', style: {lineHeight: '1.6', padding: 'clamp(0.5rem, 1.5vw, 0.625rem) clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'} },
                  formatDescription(product.description).map((line, idx) =>
                    React.createElement('div', { key: idx, className: 'flex items-start gap-2 mb-2' },
                      React.createElement('div', { className: 'icon-check text-green-600 text-xs mt-0.5 flex-shrink-0' }),
                      React.createElement('span', null, line)
                    )
                  )
                )
              )
            )
          ),

          showSizeGuide && React.createElement('div', { className: 'fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-80', onClick: () => setShowSizeGuide(false) },
            React.createElement('div', { className: 'bg-white rounded-xl max-w-md w-full shadow-2xl', style: {padding: 'clamp(1rem, 3vw, 1.5rem)'}, onClick: e => e.stopPropagation() },
              React.createElement('div', { className: 'flex items-center justify-between mb-3' },
                React.createElement('h3', { className: 'font-light', style: {fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1rem, 2vw, 1.25rem)'} }, 'Таблица размеров'),
                React.createElement('button', { onClick: () => setShowSizeGuide(false), className: 'p-1.5 hover:bg-gray-100 rounded-lg transition-colors' },
                  React.createElement('div', { className: 'icon-x', style: {fontSize: 'clamp(1rem, 1.5vw, 1.125rem)'} })
                )
              ),
              React.createElement('div', { className: 'overflow-x-auto' },
                React.createElement('table', { className: 'w-full', style: {fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'} },
                  React.createElement('thead', { className: 'bg-gray-100' },
                    React.createElement('tr', null,
                      React.createElement('th', { className: 'text-left font-semibold', style: {padding: 'clamp(0.375rem, 1vw, 0.5rem) clamp(0.5rem, 1.5vw, 0.75rem)'} }, 'Размер'),
                      React.createElement('th', { className: 'text-left font-semibold', style: {padding: 'clamp(0.375rem, 1vw, 0.5rem) clamp(0.5rem, 1.5vw, 0.75rem)'} }, 'Грудь (см)'),
                      React.createElement('th', { className: 'text-left font-semibold', style: {padding: 'clamp(0.375rem, 1vw, 0.5rem) clamp(0.5rem, 1.5vw, 0.75rem)'} }, 'Талия (см)'),
                      React.createElement('th', { className: 'text-left font-semibold', style: {padding: 'clamp(0.375rem, 1vw, 0.5rem) clamp(0.5rem, 1.5vw, 0.75rem)'} }, 'Бедра (см)')
                    )
                  ),
                  React.createElement('tbody', { className: 'divide-y divide-gray-200' },
                    React.createElement('tr', { className: 'hover:bg-gray-50' },
                      React.createElement('td', { className: 'px-3 py-2 font-medium' }, 'XS'),
                      React.createElement('td', { className: 'px-3 py-2' }, '82-86'),
                      React.createElement('td', { className: 'px-3 py-2' }, '62-66'),
                      React.createElement('td', { className: 'px-3 py-2' }, '88-92')
                    ),
                    React.createElement('tr', { className: 'hover:bg-gray-50' },
                      React.createElement('td', { className: 'px-3 py-2 font-medium' }, 'S'),
                      React.createElement('td', { className: 'px-3 py-2' }, '86-90'),
                      React.createElement('td', { className: 'px-3 py-2' }, '66-70'),
                      React.createElement('td', { className: 'px-3 py-2' }, '92-96')
                    ),
                    React.createElement('tr', { className: 'hover:bg-gray-50' },
                      React.createElement('td', { className: 'px-3 py-2 font-medium' }, 'M'),
                      React.createElement('td', { className: 'px-3 py-2' }, '90-94'),
                      React.createElement('td', { className: 'px-3 py-2' }, '70-74'),
                      React.createElement('td', { className: 'px-3 py-2' }, '96-100')
                    ),
                    React.createElement('tr', { className: 'hover:bg-gray-50' },
                      React.createElement('td', { className: 'px-3 py-2 font-medium' }, 'L'),
                      React.createElement('td', { className: 'px-3 py-2' }, '94-98'),
                      React.createElement('td', { className: 'px-3 py-2' }, '74-78'),
                      React.createElement('td', { className: 'px-3 py-2' }, '100-104')
                    ),
                    React.createElement('tr', { className: 'hover:bg-gray-50' },
                      React.createElement('td', { className: 'px-3 py-2 font-medium' }, 'XL'),
                      React.createElement('td', { className: 'px-3 py-2' }, '98-102'),
                      React.createElement('td', { className: 'px-3 py-2' }, '78-82'),
                      React.createElement('td', { className: 'px-3 py-2' }, '104-108')
                    )
                  )
                )
              )
            )
          ),

          isZoomed && React.createElement('div', {
            className: 'hidden md:flex fixed inset-0 bg-black bg-opacity-95 z-[60] items-center justify-center p-8 cursor-zoom-out',
            onClick: () => setIsZoomed(false)
          },
            React.createElement('button', {
              onClick: () => setIsZoomed(false),
              className: 'absolute top-4 right-4 p-2 bg-white hover:bg-gray-100 rounded-full z-30 shadow-lg transition-all'
            },
              React.createElement('div', { className: 'icon-x text-lg' })
            ),
            React.createElement('img', {
              src: productImages[currentImageIndex],
              alt: product.name,
              className: 'max-w-full max-h-full object-contain',
              style: {maxHeight: '90vh', maxWidth: '90vw'}
            })
          )
        )
      )
    );
}
