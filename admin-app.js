const AdminApp = () => {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [editingProduct, setEditingProduct] = React.useState(null);
    const [showForm, setShowForm] = React.useState(false);

    React.useEffect(() => {
        init();
    }, []);

    const init = async () => {
        await window.waitForSupabase();
        loadProducts();
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await window.supabaseClient.getProducts();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading products:', error);
            alert('Ошибка загрузки товаров. Проверьте подключение к базе данных.\n\n' + (error.message || error));
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        try {
            if (editingProduct) {
                await window.supabaseClient.updateProduct(editingProduct.id, formData);
            } else {
                await window.supabaseClient.createProduct(formData);
            }
            setShowForm(false);
            setEditingProduct(null);
            loadProducts();
        } catch (error) {
            throw error;
        }
    };

    const handleDelete = async (id) => {
        try {
            await window.supabaseClient.deleteProduct(id);
            loadProducts();
        } catch (error) {
            alert('Ошибка: ' + error.message);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader currentPage="products" />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                        {!showForm && (
                            <div className="mb-6">
                                <button onClick={() => { setEditingProduct(null); setShowForm(true); }}
                                    className="btn-primary flex items-center gap-2">
                                    <div className="icon-plus"></div>
                                    Добавить товар
                                </button>
                            </div>
                        )}

                        {showForm ? (
                            <ProductForm product={editingProduct} onSave={handleSave}
                                onCancel={() => { setShowForm(false); setEditingProduct(null); }} />
                        ) : loading ? (
                            <div className="text-center py-12">Загрузка...</div>
                        ) : (
                            <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} />
                        )}
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminApp />);