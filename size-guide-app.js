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

function SizeGuideApp() {
  try {
    const [selectedCategory, setSelectedCategory] = React.useState('tops');

    const categories = {
      tops: 'Верх (блузки, рубашки)',
      dresses: 'Платья',
      bottoms: 'Низ (брюки, юбки)',
      outerwear: 'Верхняя одежда'
    };

    const sizeTables = {
      tops: [
        { size: 'XS', bust: '80-84', waist: '60-64', hips: '86-90' },
        { size: 'S', bust: '84-88', waist: '64-68', hips: '90-94' },
        { size: 'M', bust: '88-92', waist: '68-72', hips: '94-98' },
        { size: 'L', bust: '92-96', waist: '72-76', hips: '98-102' },
        { size: 'XL', bust: '96-100', waist: '76-80', hips: '102-106' }
      ],
      dresses: [
        { size: 'XS', bust: '80-84', waist: '60-64', hips: '86-90', length: '90-95' },
        { size: 'S', bust: '84-88', waist: '64-68', hips: '90-94', length: '95-100' },
        { size: 'M', bust: '88-92', waist: '68-72', hips: '94-98', length: '100-105' },
        { size: 'L', bust: '92-96', waist: '72-76', hips: '98-102', length: '105-110' },
        { size: 'XL', bust: '96-100', waist: '76-80', hips: '102-106', length: '110-115' }
      ],
      bottoms: [
        { size: 'XS', waist: '60-64', hips: '86-90', inseam: '75-78' },
        { size: 'S', waist: '64-68', hips: '90-94', inseam: '78-81' },
        { size: 'M', waist: '68-72', hips: '94-98', inseam: '81-84' },
        { size: 'L', waist: '72-76', hips: '98-102', inseam: '84-87' },
        { size: 'XL', waist: '76-80', hips: '102-106', inseam: '87-90' }
      ],
      outerwear: [
        { size: 'XS', bust: '82-86', waist: '62-66', shoulders: '38-40', sleeve: '58-60' },
        { size: 'S', bust: '86-90', waist: '66-70', shoulders: '40-42', sleeve: '60-62' },
        { size: 'M', bust: '90-94', waist: '70-74', shoulders: '42-44', sleeve: '62-64' },
        { size: 'L', bust: '94-98', waist: '74-78', shoulders: '44-46', sleeve: '64-66' },
        { size: 'XL', bust: '98-102', waist: '78-82', shoulders: '46-48', sleeve: '66-68' }
      ]
    };

    return (
      <div className="min-h-screen bg-white flex flex-col" data-name="size-guide-app" data-file="size-guide-app.js">
        <Header cartItemsCount={0} onCartClick={() => window.location.href = 'index.html'} />
        
        <main className="flex-1 max-w-5xl mx-auto px-4 py-10 md:py-14 w-full">
          <h1 className="text-2xl md:text-3xl font-light tracking-wide mb-10 text-center">Таблица размеров</h1>

          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 text-sm transition-all ${
                  selectedCategory === key
                    ? 'bg-[var(--primary-color)] text-white'
                    : 'border border-gray-300 hover:border-[var(--primary-color)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--secondary-color)]">
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">Размер</th>
                  {selectedCategory === 'tops' && (
                    <>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">Обхват груди (см)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">Обхват талии (см)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">Обхват бёдер (см)</th>
                    </>
                  )}
                  {selectedCategory === 'dresses' && (
                    <>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">Обхват груди (см)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">Обхват талии (см)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">Обхват бёдер (см)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">Длина (см)</th>
                    </>
                  )}
                  {selectedCategory === 'bottoms' && (
                    <>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">Обхват талии (см)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">Обхват бёдер (см)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">Длина по внутр. шву (см)</th>
                    </>
                  )}
                  {selectedCategory === 'outerwear' && (
                    <>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">Обхват груди (см)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">Обхват талии (см)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">Ширина плеч (см)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">Длина рукава (см)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {sizeTables[selectedCategory].map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">{row.size}</td>
                    {Object.entries(row).map(([key, value]) => {
                      if (key !== 'size') {
                        return <td key={key} className="border border-gray-300 px-4 py-3 text-sm">{value}</td>;
                      }
                      return null;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[var(--secondary-color)] p-8 rounded-lg space-y-5">
            <h2 className="text-lg font-medium mb-5">Как правильно снять мерки</h2>
            <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
              <p><strong>Обхват груди:</strong> Измеряется по самой выступающей части груди, лента должна проходить горизонтально вокруг тела.</p>
              <p><strong>Обхват талии:</strong> Измеряется в самом узком месте торса, обычно чуть выше пупка.</p>
              <p><strong>Обхват бёдер:</strong> Измеряется по самой широкой части бёдер.</p>
              <p><strong>Длина рукава:</strong> Измеряется от плечевого шва до запястья при слегка согнутой руке.</p>
              <p className="pt-2 text-xs">💡 Совет: Снимайте мерки в нижнем белье, стойте прямо, но расслабленно. Лента должна прилегать к телу, но не сдавливать его.</p>
            </div>
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
    console.error('SizeGuideApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <SizeGuideApp />
  </ErrorBoundary>
);