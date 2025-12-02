function Header({ cartCount = 0, cartItemsCount = 0, onCartClick, editMode = false, onToggleEditMode, searchQuery = '', onSearchChange, onProductSelect }) {
  try {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 bg-black border-b border-white/10 ${
          scrolled ? 'shadow-2xl' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6" style={{ height: 'var(--header-height)' }}>
          <div className="flex items-center justify-between h-full">
            <a href="index.html" className="group">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.5em] transition-all duration-700 group-hover:tracking-[0.6em] text-white" style={{fontFamily: "'Cormorant Garamond', serif"}}>
                MOLOVE
              </h1>
            </a>

            <nav className="hidden md:flex items-center gap-8 lg:gap-12">
              {[
                { href: 'index.html', label: 'Каталог' },
                { href: 'about.html', label: 'О бренде' },
                { href: 'contacts.html', label: 'Контакты' }
              ].map((item) => (
                <a 
                  key={item.href}
                  href={item.href} 
                  className="group relative text-[11px] uppercase tracking-[0.2em] transition-all duration-500 hover:tracking-[0.25em] text-white/80 hover:text-white"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-500 group-hover:w-full"></span>
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 sm:p-2 transition-all duration-500 hover:scale-110 active:scale-95"
                aria-label="Меню"
              >
                <div className={`icon-${mobileMenuOpen ? 'x' : 'menu'} text-lg sm:text-xl text-white transition-all duration-500 ${
                  mobileMenuOpen ? 'rotate-180' : 'rotate-0'
                }`}></div>
              </button>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsSearchOpen(true);
                }}
                className="p-1.5 sm:p-2 transition-all duration-500 hover:scale-110 active:scale-95 group"
                aria-label="Поиск"
                type="button"
              >
                <div className="icon-search text-lg sm:text-xl text-white transition-all duration-500 group-hover:rotate-90"></div>
              </button>
              
              <button 
                onClick={onCartClick}
                className="relative p-1.5 sm:p-2 transition-all duration-500 hover:scale-110 active:scale-95 group"
              >
                <div className="icon-shopping-bag text-lg sm:text-xl text-white transition-all duration-500 group-hover:-rotate-12"></div>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] px-1 bg-white text-black text-[8px] sm:text-[9px] font-semibold flex items-center justify-center rounded-full shadow-lg">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className={`md:hidden overflow-hidden transition-all duration-700 ease-in-out bg-black ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="border-t mt-4 pt-4 border-white/10 bg-black">
              <nav className="flex flex-col gap-1 pb-4 bg-black">
                {[
                  { href: 'index.html', label: 'Каталог' },
                  { href: 'about.html', label: 'О бренде' },
                  { href: 'contacts.html', label: 'Контакты' }
                ].map((item) => (
                  <a 
                    key={item.href}
                    href={item.href} 
                    className="group flex items-center justify-between px-4 py-4 text-sm uppercase tracking-[0.2em] transition-all duration-500 hover:translate-x-2 text-white/80 hover:text-white"
                  >
                    <span>{item.label}</span>
                    <div className="icon-arrow-right text-base opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0"></div>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {isSearchOpen && window.SearchOverlay && (
          <window.SearchOverlay 
            onClose={() => setIsSearchOpen(false)}
            onProductSelect={onProductSelect}
          />
        )}
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}
