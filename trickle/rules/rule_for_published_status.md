When working with products in MOLOVE
- All products have a `published` field (true/false)
- Published products (published: true) are visible on the main website
- Draft products (published: false) are only visible in admin panel
- New products default to published: true in form
- Admin can toggle status with one click in product list
- Status filter shows: All, Published, Draft counts
- Main website (app.js) filters to show only published products
- Admin panel shows all products regardless of status