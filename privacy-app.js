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

function PrivacyApp() {
  try {
    return (
      <div className="min-h-screen bg-white flex flex-col" data-name="privacy-app" data-file="privacy-app.js">
        <Header cartItemsCount={0} onCartClick={() => window.location.href = 'index.html'} />
        
        <main className="flex-1 max-w-4xl mx-auto px-4 py-10 md:py-14 w-full">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-8 text-center" style={{fontFamily: "'Cormorant Garamond', serif"}}>
            Политика конфиденциальности
          </h1>
          
          <div className="prose prose-sm md:prose max-w-none space-y-6 text-[var(--text-secondary)]">
            <p className="text-xs text-[var(--text-secondary)]">Дата последнего обновления: 27 ноября 2025 года</p>
            
            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[var(--text-primary)]">1. Общие положения</h2>
              <p>Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей интернет-магазина MOLOVE.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[var(--text-primary)]">2. Собираемая информация</h2>
              <p>Мы можем собирать следующую информацию:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Имя и фамилия</li>
                <li>Контактная информация (email, телефон)</li>
                <li>Адрес доставки</li>
                <li>История заказов</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[var(--text-primary)]">3. Использование информации</h2>
              <p>Мы используем собранную информацию для:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Обработки и доставки заказов</li>
                <li>Связи с клиентами по вопросам заказов</li>
                <li>Улучшения качества обслуживания</li>
                <li>Отправки информационных рассылок (при согласии)</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[var(--text-primary)]">4. Защита данных</h2>
              <p>Мы применяем современные методы защиты информации и обязуемся не передавать ваши персональные данные третьим лицам без вашего согласия, за исключением случаев, предусмотренных законодательством.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[var(--text-primary)]">5. Ваши права</h2>
              <p>Вы имеете право:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Получать информацию о ваших персональных данных</li>
                <li>Требовать исправления неточных данных</li>
                <li>Требовать удаления ваших данных</li>
                <li>Отозвать согласие на обработку данных</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-medium text-[var(--text-primary)]">6. Контакты</h2>
              <p>По вопросам, связанным с обработкой персональных данных, вы можете обратиться к нам:</p>
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
    console.error('PrivacyApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><PrivacyApp /></ErrorBoundary>);