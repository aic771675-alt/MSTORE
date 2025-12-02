function AdminHeader({ onNewProduct, productsCount }) {
  try {
    return (
      <header className="bg-[#1d2327] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-semibold">MOLOVE</h1>
              <div className="h-6 w-px bg-gray-600"></div>
              <nav className="flex items-center space-x-6">
                <a href="admin.html" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <div className="icon-package text-lg"></div>
                  <span className="text-sm">Товары</span>
                  <span className="ml-1 px-2 py-0.5 bg-gray-700 rounded-full text-xs">
                    {productsCount}
                  </span>
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onNewProduct}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <div className="icon-plus text-lg"></div>
                <span>Добавить товар</span>
              </button>
              <a
                href="index.html"
                target="_blank"
                className="px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                title="Открыть сайт"
              >
                <div className="icon-external-link text-lg"></div>
              </a>
              <button
                onClick={() => {
                  sessionStorage.removeItem('adminAuth');
                  window.location.href = 'admin-login.html';
                }}
                className="px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                title="Выйти"
              >
                <div className="icon-log-out text-lg"></div>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('AdminHeader error:', error);
    return null;
  }
}