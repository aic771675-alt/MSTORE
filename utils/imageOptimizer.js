const imageOptimizer = {
  optimize: function(url, size = 'default') {
    if (!url) return url;
    
    const sizeParams = {
      thumb: 'w=300&h=375&fit=crop&q=80',
      card: 'w=400&h=500&fit=crop&q=85',
      detail: 'w=800&h=1000&fit=crop&q=90',
      default: 'w=600&h=750&fit=crop&q=85'
    };
    
    const params = sizeParams[size] || sizeParams.default;
    
    if (url.includes('unsplash.com')) {
      return `${url}?${params}&fm=webp`;
    }
    
    if (url.includes('images.pexels.com')) {
      return `${url}?${params}&auto=compress&cs=tinysrgb`;
    }
    
    return url;
  }
};

if (typeof window !== 'undefined') {
  window.imageOptimizer = imageOptimizer;
}