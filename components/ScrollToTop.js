function ScrollToTop() {
  try {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      const toggleVisibility = () => {
        setIsVisible(window.pageYOffset > 300);
      };
      window.addEventListener('scroll', toggleVisibility);
      return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return isVisible ? (
      <button onClick={scrollToTop} className="fixed bottom-8 right-8 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-all z-40">
        <div className="icon-arrow-up text-xl"></div>
      </button>
    ) : null;
  } catch (error) {
    console.error('ScrollToTop error:', error);
    return null;
  }
}