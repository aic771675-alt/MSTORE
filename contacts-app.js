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

function ContactsApp() {
  try {
    const [scrollY, setScrollY] = React.useState(0);

    React.useEffect(() => {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <div className="min-h-screen bg-white flex flex-col" data-name="contacts-app" data-file="contacts-app.js">
        <Header cartItemsCount={0} onCartClick={() => window.location.href = 'index.html'} />
        
        <main className="flex-1 pt-16 md:pt-28 pb-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10 md:mb-20 min-h-[calc(100vh-4rem)] md:min-h-0 flex flex-col justify-center py-6 md:py-0">
              <div 
                className="mb-6 md:mb-8"
                style={{ transform: `translateY(${scrollY * 0.1}px)` }}
              >
                <div className="w-px h-10 md:h-20 bg-black mx-auto mb-4 md:mb-8"></div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-light tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-8" style={{fontFamily: 'Cormorant Garamond, serif'}}>
                  КОНТАКТЫ
                </h1>
                <div className="w-10 sm:w-12 md:w-20 h-px bg-black mx-auto"></div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto space-y-12 mb-20">
              <div className="text-center border-b border-gray-200 pb-10">
                <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center">
                  <div className="icon-send text-2xl"></div>
                </div>
                <h3 className="text-xl font-light mb-3 tracking-wide" style={{fontFamily: 'Cormorant Garamond, serif'}}>
                  Telegram
                </h3>
                <a href="https://t.me/neurocraftsru" target="_blank" rel="noopener noreferrer" className="text-lg text-gray-600 hover:text-black transition-colors">
                  @neurocraftsru
                </a>
              </div>

              <div className="text-center border-b border-gray-200 pb-10">
                <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center">
                  <div className="icon-phone text-2xl"></div>
                </div>
                <h3 className="text-xl font-light mb-3 tracking-wide" style={{fontFamily: 'Cormorant Garamond, serif'}}>
                  Телефон
                </h3>
                <a href="tel:+79000000000" className="text-lg text-gray-600 hover:text-black transition-colors">
                  +7 (900) 000-00-00
                </a>
              </div>

              <div className="text-center border-b border-gray-200 pb-10">
                <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center">
                  <div className="icon-instagram text-2xl"></div>
                </div>
                <h3 className="text-xl font-light mb-3 tracking-wide" style={{fontFamily: 'Cormorant Garamond, serif'}}>
                  Instagram
                </h3>
                <a href="https://www.instagram.com/molovedesign/" target="_blank" rel="noopener noreferrer" className="text-lg text-gray-600 hover:text-black transition-colors">
                  @molovedesign
                </a>
              </div>

              <div className="text-center pb-10">
                <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center">
                  <div className="icon-mail text-2xl"></div>
                </div>
                <h3 className="text-xl font-light mb-3 tracking-wide" style={{fontFamily: 'Cormorant Garamond, serif'}}>
                  Email
                </h3>
                <a href="mailto:info@molove.ru" className="text-lg text-gray-600 hover:text-black transition-colors">
                  info@molove.ru
                </a>
              </div>
            </div>

            <div className="max-w-2xl mx-auto text-center border-t border-gray-200 pt-12">
              <div className="w-12 h-px bg-black mx-auto mb-8"></div>
              <p className="text-base text-gray-600 leading-relaxed mb-8">
                Напишите нам в Telegram или позвоните<br/>
                Мы поможем подобрать идеальный образ
              </p>
              <a href="https://t.me/neurocraftsru" target="_blank" rel="noopener noreferrer" className="inline-block px-10 py-3 bg-black text-white tracking-widest uppercase text-xs hover:bg-gray-800 transition-colors">
                Написать
              </a>
            </div>
          </div>
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    );
  } catch (error) {
    console.error('ContactsApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <ContactsApp />
  </ErrorBoundary>
);