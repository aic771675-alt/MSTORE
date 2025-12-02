When working with MOLOVE product data
- All product data is stored in localStorage under key 'molove_products'
- Use window.localStorageClient for all CRUD operations
- Products are initialized from PRODUCTS array on first load
- Export creates JSON file with date: molove-products-YYYY-MM-DD.json
- Import adds products from JSON without removing existing ones
- Each product gets unique ID using Date.now() + Math.random()
- Never use Supabase or external database