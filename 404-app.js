class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Что-то пошло не так</h1>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Перезагрузить
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function NotFoundApp() {
  try {
    return (
      <div className="min-h-screen bg-white flex flex-col" data-name="404-app" data-file="404-app.js">
        <Header cartItemsCount={0} onCartClick={() => window.location.href = 'index.html'} />
        
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-2xl">
            <div className="mb-8">
              <div className="icon-search text-7xl text-[var(--accent-color)] mb-6"></div>
            </div>
            
            <h1 className="text-8xl md:text-9xl font-light mb-4" style={{fontFamily: "'Cormorant Garamond', serif"}}>
              404
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-light mb-6 tracking-wide" style={{fontFamily: "'Cormorant Garamond', serif"}}>
              Страница не найдена
            </h2>
            
            <p className="text-[var(--text-secondary)] mb-10 leading-relaxed">
              К сожалению, страница которую вы ищете не существует или была перемещена.
              Возможно, она была удалена или вы перешли по устаревшей ссылке.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="index.html" className="btn-primary inline-block">
                На главную
              </a>
              <a href="index.html" className="px-8 py-4 border-2 border-[var(--primary-color)] text-[var(--primary-color)] rounded-none transition-all duration-500 hover:bg-[var(--primary-color)] hover:text-white tracking-wider text-sm uppercase inline-block" style={{letterSpacing: '0.15em'}}>
                В каталог
              </a>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  } catch (error) {
    console.error('NotFoundApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <NotFoundApp />
  </ErrorBoundary>
);