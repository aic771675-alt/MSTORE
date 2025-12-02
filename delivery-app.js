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

function DeliveryApp() {
  try {
    return (
      <div className="min-h-screen bg-white flex flex-col" data-name="delivery-app" data-file="delivery-app.js">
        <Header cartItemsCount={0} onCartClick={() => window.location.href = 'index.html'} />
        
        <main className="flex-1 max-w-5xl mx-auto px-4 py-10 md:py-14 w-full">
          <h1 className="text-2xl md:text-3xl font-light tracking-wide mb-14 text-center">Доставка и оплата</h1>

          <div className="space-y-14">
            <section>
              <h2 className="text-xl font-medium mb-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-[var(--secondary-color)] rounded-full flex items-center justify-center">
                  <div className="icon-truck text-lg text-[var(--primary-color)]"></div>
                </div>
                <span>Способы доставки</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 p-6 space-y-3">
                  <h3 className="font-medium">Курьерская доставка</h3>
                  <p className="text-sm text-[var(--text-secondary)]">По Москве и Московской области</p>
                  <ul className="text-sm text-[var(--text-secondary)] space-y-2">
                    <li>• Доставка 1-2 рабочих дня</li>
                    <li>• Стоимость: 350 ₽</li>
                    <li>• Бесплатно при заказе от 5000 ₽</li>
                  </ul>
                </div>

                <div className="border border-gray-200 p-6 space-y-3">
                  <h3 className="font-medium">Почта России</h3>
                  <p className="text-sm text-[var(--text-secondary)]">По всей России</p>
                  <ul className="text-sm text-[var(--text-secondary)] space-y-2">
                    <li>• Доставка 5-14 рабочих дней</li>
                    <li>• Стоимость: от 400 ₽</li>
                    <li>• Бесплатно при заказе от 7000 ₽</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-[var(--secondary-color)] rounded-full flex items-center justify-center">
                  <div className="icon-credit-card text-lg text-[var(--primary-color)]"></div>
                </div>
                <span>Способы оплаты</span>
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-[var(--secondary-color)]">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="icon-credit-card text-xl text-[var(--primary-color)]"></div>
                  </div>
                  <h3 className="font-medium mb-2">Картой онлайн</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Visa, MasterCard, МИР</p>
                </div>

                <div className="text-center p-6 bg-[var(--secondary-color)]">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="icon-wallet text-xl text-[var(--primary-color)]"></div>
                  </div>
                  <h3 className="font-medium mb-2">Наличными</h3>
                  <p className="text-sm text-[var(--text-secondary)]">При получении курьером</p>
                </div>

                <div className="text-center p-6 bg-[var(--secondary-color)]">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="icon-smartphone text-xl text-[var(--primary-color)]"></div>
                  </div>
                  <h3 className="font-medium mb-2">СБП</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Система быстрых платежей</p>
                </div>
              </div>
            </section>

            <section className="bg-[var(--secondary-color)] p-6 md:p-8">
              <h2 className="text-xl font-medium mb-4">Часто задаваемые вопросы</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Как я могу отследить свой заказ?</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    После отправки заказа вы получите трек-номер в Telegram или WhatsApp. 
                    По нему можно отследить посылку на сайте транспортной компании.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Можно ли изменить адрес доставки?</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Да, но только до момента отправки заказа. Свяжитесь с нами как можно скорее.
                  </p>
                </div>
              </div>
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
    console.error('DeliveryApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <DeliveryApp />
  </ErrorBoundary>
);