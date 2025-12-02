const { useState, useEffect, useCallback, useMemo } = React;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-light mb-4">Что-то пошло не так</h1>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Обновить страницу
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 20;
  
  const cartItemsCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Wait for Supabase to be ready
        const supabaseReady = await window.waitForSupabase();
        
        if (!supabaseReady || !window.supabaseClient) {
          console.error('Supabase failed to initialize');
          setLoading(false);
          hideLoadingScreen();
          return;
        }
        
        // Now load data
        await loadProducts();
        loadCart();
        hideLoadingScreen();
      } catch (error) {
        console.error('Initialization error:', error);
        setLoading(false);
        hideLoadingScreen();
      }
    };
    
    initApp();
  }, []);

  const hideLoadingScreen = () => {
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          document.body.classList.remove('loading');
        }, 600);
      }
    }, 1200);
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      if (!window.supabaseClient || typeof window.supabaseClient.getPublishedProducts !== 'function') {
        console.error('Supabase client not properly initialized');
        setProducts([]);
        return;
      }
      
      console.log('Loading products from Supabase...');
      const allProducts = await window.supabaseClient.getPublishedProducts();
      
      if (!allProducts || allProducts.length === 0) {
        console.warn('No products found in database');
        setProducts([]);
      } else {
        console.log(`Loaded ${allProducts.length} products from database`);
        setProducts(allProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error.message || error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('molove_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = useCallback((newCart) => {
    try {
      localStorage.setItem('molove_cart', JSON.stringify(newCart));
      setCart(newCart);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, page * itemsPerPage);
  }, [filteredProducts, page]);

  const loadMore = useCallback(() => {
    setPage(prev => prev + 1);
    setHasMore(displayedProducts.length < filteredProducts.length);
  }, [displayedProducts.length, filteredProducts.length]);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats.filter(Boolean);
  }, [products]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        <Header 
          cartCount={cart.length}
          cartItemsCount={cartItemsCount}
          onCartClick={() => setShowCart(true)}
          onProductSelect={(product) => setSelectedProduct(product)}
        />

        <main className="pt-[var(--header-height)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


            {loading ? (
              <div className="text-center py-20">
                <div className="animate-pulse text-gray-400">Загрузка...</div>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">Товары не найдены</p>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {displayedProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                      style={{
                        animationDelay: `${(index % itemsPerPage) * 50}ms`
                      }}
                    />
                  ))}
                </div>

                {displayedProducts.length < filteredProducts.length && (
                  <div className="text-center mt-12">
                    <button
                      onClick={loadMore}
                      className="btn-primary"
                    >
                      Загрузить ещё ({filteredProducts.length - displayedProducts.length})
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        <Footer />
        <ScrollToTop />

        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={(item) => {
              const newCart = [...cart, item];
              saveCart(newCart);
            }}
          />
        )}

        {showCart && (
          <Cart
            cart={cart}
            onClose={() => setShowCart(false)}
            onUpdateCart={saveCart}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);