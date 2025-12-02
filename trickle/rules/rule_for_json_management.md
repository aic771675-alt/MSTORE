When working with product JSON files
- Export creates a JSON file with all current products
- Import adds products from JSON file to the database
- JSON format: array of objects with fields: name, article, category, price, image, description
- Exported files are named with date: molove-products-YYYY-MM-DD.json
- Always validate JSON structure before importing
- Import adds new products, does not update existing ones