function Footer() {
  try {
    return (
      <footer className="bg-black text-white py-12 md:py-20 mt-16 md:mt-32">
        <div className="max-w-5xl mx-auto px-4">
          <div className="w-px h-16 bg-white mx-auto mb-12"></div>
          
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-light mb-8 tracking-[0.3em]" style={{fontFamily: "'Cormorant Garamond', serif"}}>
              MOLOVE
            </h3>
            <div className="w-16 h-px bg-white mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16 text-center">
            <div className="space-y-3">
              <a href="about.html" className="block text-gray-400 hover:text-white transition-colors text-sm">
                О нас
              </a>
              <a href="delivery.html" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Доставка
              </a>
            </div>

            <div className="space-y-3">
              <a href="return.html" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Возврат
              </a>
              <a href="size-guide.html" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Размеры
              </a>
            </div>

            <div className="space-y-3">
              <a href="care.html" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Уход
              </a>
              <a href="contacts.html" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Контакты
              </a>
            </div>

            <div className="space-y-3">
              <a href="privacy.html" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Конфиденциальность
              </a>
              <a href="terms.html" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Соглашение
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <a 
              href="admin-login.html" 
              className="text-gray-500 text-xs tracking-wider hover:text-white transition-colors inline-block"
            >
              © 2025 MOLOVE
            </a>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error('Footer component error:', error);
    return null;
  }
}
