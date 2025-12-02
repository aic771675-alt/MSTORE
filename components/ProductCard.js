const ProductCard = React.memo(({ product, onClick, style }) => {
  try {
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);

    const primaryImage = product.images?.[0] || '';
    const optimizedUrl = primaryImage ? window.imageOptimizer?.optimize(primaryImage, 'card') : '';

    const totalStock = React.useMemo(() => {
      if (!product.sizes || typeof product.sizes !== 'object') return 0;
      return Object.values(product.sizes).reduce((sum, qty) => sum + (parseInt(qty) || 0), 0);
    }, [product.sizes]);


    const hasDiscount = product.discount && product.discount > 0;
    const discountedPrice = hasDiscount ? Math.round(product.price * (1 - product.discount / 100)) : product.price;

    return (
      <div
        onClick={onClick}
        className="group cursor-pointer animate-fade-in"
        style={style}
        data-name="product-card"
        data-file="components/ProductCard.js"
      >
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
          {!imageError && optimizedUrl ? (
            <img
              src={optimizedUrl}
              alt={product.name}
              loading="lazy"
              className={`w-full h-full object-cover transition-all duration-700 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } group-hover:scale-110`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{ contentVisibility: 'auto' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="icon-image text-4xl text-gray-400"></div>
            </div>
          )}
          
          {hasDiscount && (
            <div className="absolute top-2 left-2 w-12 h-12 sm:w-14 sm:h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg animate-pulse-badge">
              <div className="text-center">
                <div className="text-white font-bold text-xs sm:text-base leading-none">-{product.discount}%</div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          {product.article && (
            <p className="text-[10px] sm:text-xs text-gray-500 tracking-wide uppercase font-medium">
              {product.article}
            </p>
          )}
          
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <p className="text-base sm:text-lg font-semibold text-red-600 tracking-tight">
                  {discountedPrice.toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-xs sm:text-sm text-gray-400 line-through font-normal">
                  {product.price?.toLocaleString('ru-RU')} ₽
                </p>
              </>
            ) : (
              <p className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight">
                {product.price?.toLocaleString('ru-RU')} ₽
              </p>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ProductCard error:', error);
    return null;
  }
});