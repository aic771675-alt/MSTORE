const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = React.useState({
        name: product?.name || '',
        article: product?.article || '',
        category: product?.category || '',
        price: product?.price || '',
        images: product?.images || ['', '', ''],
        description: product?.description || '',
        sizes: product?.sizes || { XS: 0, S: 0, M: 0, L: 0, XL: 0 },
        published: product?.published !== undefined ? product.published : true,
        discount: product?.discount || 0
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSizeChange = (size, value) => {
        const numValue = parseInt(value) || 0;
        setFormData(prev => ({
            ...prev,
            sizes: { ...prev.sizes, [size]: numValue }
        }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.article || !formData.price || !formData.images[0]) {
            alert('Заполните обязательные поля');
            return;
        }
        
        setIsSubmitting(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('ProductForm handleSubmit error:', error);
            const errorMessage = error?.message || error?.toString() || 'Произошла неизвестная ошибка';
            alert('Ошибка при сохранении товара:\n\n' + errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {product ? 'Редактировать товар' : 'Добавить новый товар'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Название <span className="text-red-500">*</span>
                            </label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Артикул <span className="text-red-500">*</span>
                            </label>
                            <input type="text" name="article" value={formData.article} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Категория <span className="text-red-500">*</span></label>
                            <input type="text" name="category" value={formData.category} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Цена <span className="text-red-500">*</span></label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Скидка (%)</label>
                            <input type="number" min="0" max="100" value={formData.discount}
                                onChange={(e) => setFormData(prev => ({...prev, discount: parseInt(e.target.value) || 0}))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Основное изображение <span className="text-red-500">*</span></label>
                        <input type="url" value={formData.images[0]} onChange={(e) => handleImageChange(0, e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                        {formData.images[0] && <img src={formData.images[0]} alt="Превью" className="mt-3 w-32 h-32 object-cover rounded-lg" onError={(e) => e.target.style.display = 'none'} />}
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Дополнительные изображения</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2].map(num => (
                                <div key={num}>
                                    <input type="url" value={formData.images[num]} onChange={(e) => handleImageChange(num, e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" placeholder={`Фото ${num + 1}`} />
                                    {formData.images[num] && <img src={formData.images[num]} className="mt-2 w-20 h-20 object-cover rounded-lg" onError={(e) => e.target.style.display = 'none'} />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Статус</label>
                        <div className="flex gap-4">
                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, published: true }))}
                                className={`px-6 py-3 rounded-lg font-medium ${formData.published ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                Опубликован
                            </button>
                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, published: false }))}
                                className={`px-6 py-3 rounded-lg font-medium ${!formData.published ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                Черновик
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Размеры</label>
                        <div className="grid grid-cols-5 gap-4">
                            {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                                <div key={size}>
                                    <label className="block text-xs font-medium mb-1">{size}</label>
                                    <input type="number" min="0" value={formData.sizes[size]}
                                        onChange={(e) => handleSizeChange(size, e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg text-center" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onCancel}
                            className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Отмена
                        </button>
                        <button type="submit" disabled={isSubmitting}
                            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
                            {isSubmitting && <div className="icon-loader-2 animate-spin"></div>}
                            <div className="icon-save"></div>
                            <span>{product ? 'Сохранить' : 'Добавить'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};