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

function ReturnApp() {
  try {
    return (
      <div className="min-h-screen bg-white flex flex-col" data-name="return-app" data-file="return-app.js">
        <Header cartItemsCount={0} onCartClick={() => window.location.href = 'index.html'} />
        
        <main className="flex-1 max-w-5xl mx-auto px-4 py-10 md:py-14 w-full">
          <h1 className="text-2xl md:text-3xl font-light tracking-wide mb-14 text-center">Возврат и обмен</h1>

          <div className="space-y-14">
            <section>
              <h2 className="text-xl font-medium mb-6">Условия возврата</h2>
              <div className="space-y-4 text-[var(--text-secondary)]">
                <p>Вы можете вернуть товар надлежащего качества в течение <strong className="text-[var(--primary-color)]">14 дней</strong> с момента получения.</p>
                
                <div className="bg-[var(--secondary-color)] p-6 space-y-3">
                  <h3 className="font-medium text-[var(--primary-color)] mb-3">Товар принимается к возврату, если:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start space-x-2">
                      <div className="icon-check text-green-600 mt-1"></div>
                      <span>Сохранен товарный вид и потребительские свойства</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="icon-check text-green-600 mt-1"></div>
                      <span>Сохранены все бирки и этикетки</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="icon-check text-green-600 mt-1"></div>
                      <span>Товар не был в использовании</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="icon-check text-green-600 mt-1"></div>
                      <span>Есть документ о покупке</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-6">Как оформить возврат</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-[var(--secondary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-medium">1</span>
                  </div>
                  <h3 className="font-medium mb-2">Свяжитесь с нами</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Напишите в Telegram или WhatsApp о желании вернуть товар</p>
                </div>

                <div className="text-center p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-[var(--secondary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-medium">2</span>
                  </div>
                  <h3 className="font-medium mb-2">Отправьте товар</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Мы пришлем адрес и инструкции по отправке</p>
                </div>

                <div className="text-center p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-[var(--secondary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-medium">3</span>
                  </div>
                  <h3 className="font-medium mb-2">Получите возврат</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Деньги вернутся в течение 10 рабочих дней</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-6">Обмен товара</h2>
              <div className="bg-[var(--secondary-color)] p-6 space-y-4">
                <p className="text-[var(--text-secondary)]">
                  Если вам не подошел размер или цвет, вы можете обменять товар на другой в течение 14 дней.
                </p>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>• Обмен производится бесплатно</li>
                  <li>• При обмене действуют те же условия, что и при возврате</li>
                  <li>• Если нужного размера нет в наличии, мы вернем деньги</li>
                </ul>
              </div>
            </section>

            <section className="border-l-4 border-red-500 bg-red-50 p-6">
              <h3 className="font-medium text-red-900 mb-3 flex items-center space-x-2">
                <div className="icon-x-circle text-xl"></div>
                <span>Не подлежат возврату</span>
              </h3>
              <ul className="space-y-2 text-sm text-red-800">
                <li>• Товары со следами использования</li>
                <li>• Товары без бирок и этикеток</li>
                <li>• Товары распродажи (если указано особо)</li>
              </ul>
            </section>
          </div>

          <div className="text-center mt-8">
            <a href="index.html" className="btn-primary inline-block">
              Вернуться в каталог
            </a>
          </div>
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    );
  } catch (error) {
    console.error('ReturnApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <ReturnApp />
  </ErrorBoundary>
);