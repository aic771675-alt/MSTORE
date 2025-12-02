const ProductList = React.memo(({ products, onEdit, onDelete }) => {
  const [deleting, setDeleting] = React.useState(null);
  const [sortField, setSortField] = React.useState('id');
  const [sortOrder, setSortOrder] = React.useState('asc');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const handleDelete = React.useCallback(async (id) => {
    if (!confirm('Удалить товар?')) return;
    setDeleting(id);
    try {
      await onDelete(id);
    } finally {
      setDeleting(null);
    }
  }, [onDelete]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = safeProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.article.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && p.published) ||
      (statusFilter === 'draft' && !p.published);
    return matchesSearch && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const modifier = sortOrder === 'asc' ? 1 : -1;
    return aVal > bVal ? modifier : -modifier;
  });

  if (safeProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <div className="icon-package text-6xl text-gray-300 mb-4"></div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">Нет товаров</h3>
        <p className="text-gray-500">Добавьте первый товар</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4 border-b bg-gray-50 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="icon-search text-lg text-gray-400"></div>
          <input type="text" placeholder="Поиск..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">Статус:</span>
          {[
            { key: 'all', label: 'Все', count: safeProducts.length, color: 'blue' },
            { key: 'published', label: 'Опубликовано', count: safeProducts.filter(p => p.published).length, color: 'green' },
            { key: 'draft', label: 'Черновики', count: safeProducts.filter(p => !p.published).length, color: 'orange' }
          ].map(({ key, label, count, color }) => (
            <button key={key} onClick={() => setStatusFilter(key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                statusFilter === key ? `bg-${color}-600 text-white` : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}>
              {label} ({count})
            </button>
          ))}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['article', 'name', 'Статус', 'Размеры', 'totalStock', 'price', 'Скидка', 'Действия'].map((field, idx) => (
                <th key={idx} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => typeof field === 'string' && field.toLowerCase() !== 'статус' && field.toLowerCase() !== 'размеры' && field.toLowerCase() !== 'скидка' && field.toLowerCase() !== 'действия' && handleSort(field)}>
                  {field.charAt(0).toUpperCase() + field.slice(1)} {sortField === field && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {sortedProducts.map((product) => {
              const sizes = product.sizes || {};
              const totalStock = product.totalStock || 0;
              
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{product.article}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={product.images?.[0]} alt={product.name} className="w-12 h-12 object-cover rounded" loading="lazy" />
                      <div className="max-w-xs truncate text-sm font-medium">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={async () => {
                      try {
                        await window.supabaseClient.updateProduct(product.id, { published: !product.published });
                        window.location.reload();
                      } catch (error) {
                        alert('Ошибка: ' + error.message);
                      }
                    }} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      product.published ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {product.published ? 'Опубликован' : 'Черновик'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-1 text-xs">
                      {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                        <span key={size} className={`px-2 py-1 rounded font-medium ${
                          (sizes[size] || 0) === 0 ? 'bg-red-100 text-red-700' : 
                          (sizes[size] || 0) <= 3 ? 'bg-orange-100 text-orange-700' : 
                          'bg-green-100 text-green-700'
                        }`}>
                          {size}:{sizes[size] || 0}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${totalStock === 0 ? 'text-red-600' : totalStock <= 10 ? 'text-orange-600' : 'text-green-600'}`}>
                      {totalStock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {product.discount > 0 ? (
                      <div>
                        <span className="text-red-600 font-bold">{Math.round(product.price * (1 - product.discount / 100))} ₽</span>
                        <span className="text-gray-400 text-xs line-through ml-2">{product.price} ₽</span>
                      </div>
                    ) : (
                      <span className="text-gray-900 font-medium">{product.price} ₽</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {product.discount > 0 ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">-{product.discount}%</span>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => onEdit(product)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm">
                        Редактировать
                      </button>
                      <button onClick={() => handleDelete(product.id)} disabled={deleting === product.id}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm disabled:opacity-50">
                        {deleting === product.id ? 'Удаление...' : 'Удалить'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t bg-gray-50">
        <div className="text-sm text-gray-600">
          Всего: {sortedProducts.length} товаров
        </div>
      </div>
    </div>
  );
});