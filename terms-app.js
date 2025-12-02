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
            <button onClick={() => window.location.reload()} className="btn-primary">Перезагрузить</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function TermsApp() {
  try {
    return (
      <div className="min-h-screen bg-white flex flex-col" data-name="terms-app" data-file="terms-app.js">
        <Header cartItemsCount={0} onCartClick={() => window.location.href = 'index.html'} />
        
        <main className="flex-1 max-w-4xl mx-auto px-4 py-10 md:py-14 w-full">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-8 text-center" style={{fontFamily: "'Cormorant Garamond', serif"}}>
            Пользовательское соглашение
          </h1>
          
          <div className="prose prose-sm md:prose max-w-none space-y-6 text-[var(--text-secondary)]">
            <p className="text-xs text-[var(--text-secondary)]">Дата последнего обновления: 27 ноября 2025 года</p>
            
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[var(--text-primary)]">1. Общие положения</h2>
              <p>Настоящее Пользовательское соглашение регулирует отношения между интернет-магазином MOLOVE и пользователями сайта. Используя наш сайт, вы принимаете условия данного соглашения.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[var(--text-primary)]">2. Предмет соглашения</h2>
              <p>Интернет-магазин MOLOVE предоставляет пользователям доступ к информации о товарах и услугах, а также возможность оформления заказов через сайт.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[var(--text-primary)]">3. Оформление заказа</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Заказ считается оформленным после подтверждения менеджером</li>
                <li>Цены на товары действительны на момент оформления заказа</li>
                <li>Сроки доставки указываются приблизительно</li>
                <li>Магазин оставляет за собой право отменить заказ в случае отсутствия товара</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[var(--text-primary)]">4. Оплата</h2>
              <p>Оплата товаров производится следующими способами:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Наличными при получении</li>
                <li>Картой при получении</li>
                <li>Онлайн-оплата на сайте</li>
                <li>Система быстрых платежей (СБП)</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[var(--text-primary)]">5. Доставка</h2>
              <p>Условия доставки согласовываются с менеджером при оформлении заказа. Подробную информацию о доставке можно найти в разделе "Доставка и оплата".</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[var(--text-primary)]">6. Возврат и обмен</h2>
              <p>Возврат и обмен товаров осуществляется в соответствии с законодательством РФ. Подробные условия указаны в разделе "Возврат и обмен".</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[var(--text-primary)]">7. Ответственность</h2>
              <p>Интернет-магазин не несет ответственности за:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Задержки доставки по вине транспортной компании</li>
                <li>Неправильно указанные данные при оформлении заказа</li>
                <li>Технические сбои, не зависящие от магазина</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[var(--text-primary)]">8. Контакты</h2>
              <p>По всем вопросам вы можете связаться с нами:</p>
              <ul className="list-none space-y-1">
                <li>Email: info@molove.ru</li>
                <li>Телефон: +7 (900) 000-00-00</li>
              </ul>
            </section>
          </div>

          <div className="text-center mt-10">
            <a href="index.html" className="btn-primary inline-block">Вернуться в каталог</a>
          </div>
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    );
  } catch (error) {
    console.error('TermsApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><TermsApp /></ErrorBoundary>);