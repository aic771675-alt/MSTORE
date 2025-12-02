window.SearchOverlay = ({ onClose, onProductSelect }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [products, setProducts] = React.useState([]);
    const inputRef = React.useRef(null);

    React.useEffect(() => {
        const loadProducts = async () => {
            try {
                const allProducts = await window.supabaseClient.getProducts();
                setProducts(allProducts.filter(p => p.published === true));
            } catch (error) {
                console.error('Error loading products:', error);
            }
        };
        loadProducts();
    }, []);

    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        setTimeout(() => inputRef.current?.focus(), 100);
        
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    const filteredProducts = React.useMemo(() => {
        if (!searchQuery.trim()) return [];
        const query = searchQuery.toLowerCase();
        return products.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.article.toLowerCase().includes(query)
        ).slice(0, 12);
    }, [searchQuery, products]);

    const handleProductClick = React.useCallback((product) => {
        console.log('Search: Product clicked:', product.name);
        if (onProductSelect) {
            onProductSelect(product);
        }
        onClose();
    }, [onProductSelect, onClose]);

    return (
        <div 
            className="fixed inset-0 z-[99999] animate-fade-in"
            style={{ 
                background: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(10px)',
                touchAction: 'none'
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 md:top-8 md:right-8 z-10 text-white hover:text-gray-300 transition-colors p-2"
                aria-label="Закрыть поиск"
            >
                <div className="icon-x text-3xl md:text-4xl"></div>
            </button>

            <div className="h-full flex flex-col pt-20 md:pt-24">
                <div className="max-w-3xl w-full mx-auto px-4 md:px-8 mb-8">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Поиск товаров..."
                            className="w-full px-6 py-5 bg-white text-black text-lg md:text-xl rounded-lg focus:ring-2 focus:ring-gray-300 outline-none transition-all shadow-2xl"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <div className="icon-search text-2xl"></div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-4 md:px-8 pb-12" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <div className="max-w-6xl mx-auto">
                        {searchQuery.trim() === '' ? (
                            <div className="text-center py-20">
                                <div className="icon-sparkles text-6xl text-white text-opacity-20 mb-6"></div>
                                <p className="text-white text-opacity-60 text-lg">
                                    Начните вводить для поиска товаров
                                </p>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
                                {filteredProducts.map((product, index) => (
                                    <button
                                        key={product.id}
                                        onClick={() => handleProductClick(product)}
                                        className="group text-left animate-fade-up touch-manipulation"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="relative aspect-[3/4] mb-3 overflow-hidden">
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        </div>
                                        <h3 className="text-white text-sm md:text-base font-light mb-1 group-hover:text-gray-300 transition-colors line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-white text-opacity-60 text-xs mb-2">{product.article}</p>
                                        <p className="text-white font-medium">{product.price.toLocaleString('ru-RU')} ₽</p>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="icon-search-x text-6xl text-white text-opacity-20 mb-6"></div>
                                <p className="text-white text-opacity-60 text-lg mb-2">
                                    Ничего не найдено
                                </p>
                                <p className="text-white text-opacity-40 text-sm">
                                    Попробуйте изменить запрос
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};