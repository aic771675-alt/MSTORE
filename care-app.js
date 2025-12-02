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

function CareApp() {
  try {
    const careInstructions = [
      {
        icon: 'droplet',
        title: 'Стирка',
        tips: [
          'Машинная стирка при температуре не выше 30°C',
          'Используйте деликатный режим',
          'Стирайте изделия наизнанку',
          'Не используйте отбеливатель'
        ]
      },
      {
        icon: 'wind',
        title: 'Сушка',
        tips: [
          'Сушите в горизонтальном положении',
          'Избегайте прямых солнечных лучей',
          'Не используйте машинную сушку',
          'Не отжимайте изделия'
        ]
      },
      {
        icon: 'zap',
        title: 'Глажка',
        tips: [
          'Гладьте при низкой температуре (110°C)',
          'Используйте защитную ткань',
          'Гладьте с изнаночной стороны',
          'Не используйте пар для деликатных тканей'
        ]
      },
      {
        icon: 'archive',
        title: 'Хранение',
        tips: [
          'Храните в сухом прохладном месте',
          'Используйте тканевые чехлы',
          'Избегайте складок и заломов',
          'Защищайте от моли натуральными средствами'
        ]
      }
    ];

    return (
      <div className="min-h-screen bg-white flex flex-col" data-name="care-app" data-file="care-app.js">
        <Header cartItemsCount={0} onCartClick={() => window.location.href = 'index.html'} />
        
        <main className="flex-1 max-w-5xl mx-auto px-4 py-10 md:py-14 w-full">
          <h1 className="text-2xl md:text-3xl font-light tracking-wide mb-5 text-center">Уход за изделиями</h1>
          <p className="text-center text-[var(--text-secondary)] mb-14 max-w-2xl mx-auto leading-relaxed">
            Правильный уход продлит жизнь вашей одежды и сохранит её первозданный вид
          </p>

          <div className="grid md:grid-cols-2 gap-10 mb-14">
            {careInstructions.map((section, index) => (
              <div key={index} className="bg-[var(--secondary-color)] p-8 space-y-5">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <div className={`icon-${section.icon} text-xl text-[var(--primary-color)]`}></div>
                  </div>
                  <h2 className="text-xl font-medium">{section.title}</h2>
                </div>
                <ul className="space-y-2">
                  {section.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm text-[var(--text-secondary)]">
                      <span className="text-[var(--primary-color)] mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8">
            <div className="flex items-start space-x-3">
              <div className="icon-alert-triangle text-xl text-amber-600 mt-1"></div>
              <div className="space-y-2">
                <h3 className="font-medium text-amber-900">Важно знать</h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Всегда проверяйте этикетку на изделии перед стиркой</li>
                  <li>• Для деликатных тканей рекомендуется химчистка</li>
                  <li>• Натуральные ткани могут давать небольшую усадку</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
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
    console.error('CareApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <CareApp />
  </ErrorBoundary>
);