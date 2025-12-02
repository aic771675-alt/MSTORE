const AboutApp = () => {
    const [scrollY, setScrollY] = React.useState(0);

    React.useEffect(() => {
        setupAnimations();
        
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const setupAnimations = () => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-up');
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });
    };

    return (
        <>
            <Header />
            <main className="pt-16 md:pt-16">
                <section className="relative min-h-[calc(100vh-4rem)] md:min-h-screen flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white"></div>
                    <div 
                        className="relative text-center px-4 py-6"
                        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
                    >
                        <div className="mb-6 md:mb-12">
                            <div className="w-px h-10 md:h-20 bg-black mx-auto mb-4 md:mb-8 animate-fade-in"></div>
                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-light tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-8 animate-fade-in">
                                MOLOVE
                            </h1>
                            <div className="w-10 sm:w-12 md:w-20 h-px bg-black mx-auto mb-4 md:mb-8 animate-fade-in"></div>
                        </div>
                        <p className="text-xs md:text-sm tracking-[0.1em] md:tracking-[0.2em] uppercase text-gray-600 animate-fade-in">
                            Прокрутите вниз
                        </p>
                    </div>
                </section>

                <section className="min-h-screen flex items-center py-24 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="scroll-animate">
                                <div className="aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden">
                                    <img 
                                        src="https://app.trickle.so/storage/public/images/usr_17fbb08870000001/5fafc09a-0486-41b0-93e9-e0d93927714f.png"
                                        alt="Anzhelika Moleva"
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                            </div>
                            <div className="space-y-8 scroll-animate">
                                <div>
                                    <div className="w-12 h-px bg-black mb-6"></div>
                                    <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-wide">
                                        О бренде
                                    </h2>
                                </div>
                                <div className="space-y-6 text-gray-700 leading-relaxed">
                                    <p className="text-lg">
                                        Верхняя одежда MOLOVE — это тренды сезона, универсальный крой и натуральные ткани.
                                    </p>
                                    <p className="text-lg">
                                        Мы создаём вещи, которые подчеркивают индивидуальность и дарят комфорт в любую погоду.
                                    </p>
                                    <p className="text-lg">
                                        Каждая деталь продумана до мелочей, чтобы вы чувствовали себя уверенно в любой ситуации.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 px-4 bg-black text-white">
                    <div className="max-w-4xl mx-auto text-center scroll-animate">
                        <h2 className="text-4xl md:text-6xl font-light mb-16 tracking-wide">
                            Наши ценности
                        </h2>
                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                { title: 'Качество', desc: 'Натуральные материалы и безупречное исполнение' },
                                { title: 'Стиль', desc: 'Актуальные тренды в минималистичном дизайне' },
                                { title: 'Комфорт', desc: 'Универсальный крой для любого типа фигуры' }
                            ].map((value, i) => (
                                <div key={i} className="space-y-4" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="w-px h-16 bg-white mx-auto opacity-50"></div>
                                    <h3 className="text-xl tracking-widest uppercase">{value.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{value.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-32 px-4">
                    <div className="max-w-2xl mx-auto text-center scroll-animate">
                        <div className="w-16 h-px bg-black mx-auto mb-12"></div>
                        <blockquote className="text-2xl md:text-3xl font-light leading-relaxed tracking-wide mb-12">
                            "Одежда должна подчеркивать вашу индивидуальность, а не скрывать её"
                        </blockquote>
                        <div className="text-sm tracking-widest uppercase text-gray-500">
                            Анжелика Молева, основатель MOLOVE
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
            <ScrollToTop />
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AboutApp />);
