# MASTER PROJECT ARCHITECTURE
## Premium Women's Fashion E-commerce Website — Bangladesh

### 1. PROJECT OBJECTIVE

Build a modern, premium, mobile-first, fully responsive custom e-commerce website for women's fashion in Bangladesh.

The website will sell:
- Salwar Kameez and Three-Piece
- Sarees
- Burqa and Abaya
- Kurtis
- New Collections
- Sale and Discount Products
- Future product categories configurable through the admin panel

The website must be visually attractive, fast, secure, easy to manage, and extremely simple for customers to use.

This must be a real, functional e-commerce application, not just a static design or frontend demo.

The logo, brand name, product images, banners, delivery charges, and brand colors must be editable later without rebuilding the website.

### 2. CORE DESIGN SYSTEM

Use the following initial brand colors:

- Primary Burgundy: #762A43
- Secondary Ivory: #F7F0E8
- Accent Gold: #C5A46D
- Text Charcoal: #252525
- White: #FFFFFF
- Muted Background: #F5F5F5
- Success: #238636
- Error: #D92D20

Design requirements:
- Premium South Asian women's fashion aesthetic.
- Clean layouts with generous whitespace.
- High-quality fashion photography.
- Elegant typography supporting Bengali and English.
- Consistent buttons, cards, forms, icons, spacing, and borders.
- Subtle transitions without unnecessary animations.
- No cluttered layouts, excessive colors, intrusive popups, or distracting effects.
- Strong contrast and accessible text sizes.
- Mobile-first responsive layouts for phones, tablets, laptops, and desktops.

Create a centralized design system so colors, typography, logo, button styles, and other visual elements can be changed globally.

### 3. WEBSITE NAVIGATION

Main navigation:
- Home
- Salwar Kameez / Three-Piece
- Sarees
- Burqa / Abaya
- Kurtis
- New Arrivals
- Best Sellers
- Offers
- Order Tracking
- Contact

Include:
- Search
- Shopping Cart
- Optional Wishlist
- Mobile navigation menu
- Footer with contact information, delivery policy, return policy, privacy policy, and terms.

Categories and subcategories must be manageable through the admin panel. Do not hardcode the entire category structure.

### 4. HOMEPAGE ARCHITECTURE

Build the homepage with the following sections:

1. Header with logo, navigation, search, and cart.
2. Main fashion hero banner with a clear Shop Now CTA.
3. Category cards with attractive images.
4. New Arrivals.
5. Best Sellers.
6. Featured Collections.
7. Promotional offers.
8. Selected popular products.
9. Customer reviews, when available.
10. Brand introduction or trust section.
11. Footer with policies and contact information.

Allow the admin to update the hero banner, featured categories, promotional content, and homepage product sections without editing code.

Avoid unnecessary sections that make the homepage long or cluttered.

### 5. PRODUCT CATALOG

Every product should support:
- Product name
- Unique slug and SKU
- Product description
- Category and subcategory
- Main image and additional images
- Regular price
- Sale price
- Product variants
- Stock quantity
- Publication status
- Featured product setting
- SEO title and description
- Created and updated timestamps

Product listing pages must support:
- Search
- Category filtering
- Price filtering
- Color filtering when applicable
- Size filtering when applicable
- Sorting by newest, price, popularity, and best sellers
- Pagination or efficient progressive loading
- Clear out-of-stock labels
- Product image, name, price, sale price, and discount display

Do not show irrelevant filters for products that do not support them.

### 6. CATEGORY-BASED SIZE AND VARIANT SYSTEM

Size selection must be configurable for each category and product.

Examples:
- Salwar Kameez: S, M, L, XL, XXL, or custom sizes.
- Burqa / Abaya: product-specific size options.
- Sarees: size selection disabled by default.
- Kurtis and other products: configurable sizes.

Requirements:
- Admin can enable or disable size selection per product.
- Admin can define size options for a category and override them for individual products.
- Admin can mark size selection as required or optional.
- If size is required, customers cannot add the product to the cart without selecting a valid size.
- Each variant can have its own SKU, stock, and price adjustment.
- Colors must be configurable when relevant.
- Unavailable variants must be disabled.
- The backend must validate all selected variants before accepting an order.

Category defaults should provide convenience, but individual product settings must take precedence.

### 7. PRODUCT DETAILS PAGE

Display:
- Product image gallery
- Image zoom
- Product name
- Regular and sale prices
- Availability status
- Color selector when applicable
- Size selector when applicable
- Size chart when applicable
- Quantity selector
- Add to Cart button
- Buy Now button
- Product description
- Delivery information
- Return and exchange policy
- Related products

Buy Now should take the customer directly to checkout with the selected product and variant.

Add to Cart should add the selected product to the cart and show a clear confirmation without forcing unnecessary navigation.

Do not allow customers to purchase unavailable stock.

### 8. SHOPPING CART

The cart must display:
- Product image and name
- Selected size and color
- Quantity
- Unit price
- Line total
- Remove option
- Discount, when applicable
- Delivery charge estimate when available
- Grand total

Customers can update quantities or remove products easily.

Validate stock and current pricing whenever the cart is updated and again before creating an order.

The cart should remain available if the customer refreshes the page or returns later, subject to the selected persistence strategy.

### 9. SIMPLE CHECKOUT — HIGHEST PRIORITY

The checkout must be extremely short, mobile-friendly, and easy to complete.

Required fields:
1. Customer name — required.
2. Mobile number — required.
3. Complete delivery address — required.
4. Additional order instructions — optional multiline text field.

Do not require account registration or login.

Collect only the information needed to deliver the order. Use a simple address field initially; additional location selectors can be introduced only if they materially improve delivery-charge accuracy.

Checkout requirements:
- Display the selected products, variants, quantities, and prices.
- Display the delivery charge and grand total.
- Use Cash on Delivery as the default payment method.
- Clearly display the final amount payable.
- Validate the mobile number and address.
- Preserve entered information when recoverable errors occur.
- Disable repeated submission while an order is being processed.
- Prevent duplicate order creation.
- Provide understandable validation and error messages.
- Show a clear order confirmation page after successful order creation.

The backend must independently calculate the final total and validate product prices, stock, delivery charges, and discounts.

Never trust a total price submitted by the browser.

### 10. DELIVERY CHARGE CONFIGURATION

Create an admin-configurable delivery charge system with two initial settings:

- Inside Dhaka delivery charge: NOT CONFIGURED YET.
- Outside Dhaka delivery charge: NOT CONFIGURED YET.

Do not invent or hardcode delivery prices.

The admin must be able to enter and update these values later without modifying source code.

Requirements:
- Add delivery charge settings to the admin panel.
- Use the customer's delivery location to determine the applicable charge.
- Display the charge clearly before order confirmation.
- Recalculate the final total on the server.
- Save the applied delivery charge as a snapshot in the order.
- Changing future delivery settings must not change previously placed orders.

If the location is insufficient to determine whether the delivery is inside or outside Dhaka, ask the customer to select the appropriate delivery area using a simple control.

### 11. PAYMENT SYSTEM

Initial payment method:
- Cash on Delivery (COD).

Requirements:
- COD is enabled by default.
- Clearly state that payment is due upon delivery.
- Save the payment method with each order.
- Track payment status separately from order status.
- Support payment statuses such as Unpaid, Paid, Failed, and Refunded, where applicable.
- Provide a future integration point for a supported online payment gateway.
- Do not display inactive online payment methods as if they were available.

### 12. ORDER MANAGEMENT AND TRACKING

Every successful order must receive a unique, human-readable order number.

Order statuses:
- Pending
- Confirmed
- Processing
- Shipped
- Delivered
- Cancelled
- Returned
- Delivery Failed

Keep payment status separate from order status.

Each order must store:
- Customer name
- Mobile number
- Delivery address
- Order items and variant selections
- Product prices at the time of purchase
- Quantity
- Discount
- Delivery charge
- Grand total
- Payment method and status
- Order status
- Courier details when available
- Status history with timestamps

#### Customer Order Tracking Flow

1. Customer opens Order Tracking.
2. Customer enters the order number.
3. Customer enters the mobile number used during checkout.
4. Backend verifies that both values match the same order.
5. If valid, show the order details and current status.
6. Display a visual progress timeline.
7. Show courier name and tracking number when available.
8. Allow the customer to check the latest status again later.

The tracking page must work without account registration.

Protect customer information. Do not reveal an order merely because someone knows its order number. Use appropriate request rate limits and generic error messages.

#### Tracking Timeline

- Order Received
- Order Confirmed
- Preparing / Packaging
- Shipped
- Delivered

Cancelled, Returned, and Delivery Failed must be displayed as distinct outcomes, not as successful delivery stages.

Admin status changes must automatically update the customer's tracking page.

Courier tracking must only be described as live when a working courier API is integrated. Otherwise, display the latest manually updated shipment status.

### 13. ADMIN DASHBOARD

Build a secure, responsive admin panel with role-based access.

Dashboard overview:
- Total orders
- New orders
- Processing orders
- Delivered orders
- Cancelled and returned orders
- Total sales
- Low-stock products
- Best-selling products

Admin modules:

1. Product Management
2. Categories and Subcategories
3. Product Variants and Sizes
4. Inventory Management
5. Order Management
6. Customer Management
7. Delivery Charge Settings
8. Payment Settings
9. Coupons and Discounts
10. Homepage Banner and Content Management
11. Reviews Management
12. Reports and Analytics
13. Staff and Permissions
14. Website Settings
15. Audit Logs

Admin functions:
- Create, edit, publish, unpublish, and archive products.
- Upload and manage product images.
- Configure category-specific size options.
- Update stock and prices.
- Confirm, process, ship, cancel, and complete orders.
- Record courier details and tracking numbers.
- Update delivery charges without code changes.
- Configure homepage content and brand identity.
- Export relevant order reports.
- Review important administrative activities.

Use pagination, search, filters, and bulk actions to keep large product and order lists manageable.

### 14. CUSTOMER-FRIENDLY UX RULES

The website must prioritize simplicity.

- No mandatory registration.
- No unnecessary checkout steps.
- No intrusive popups.
- No irrelevant product options.
- No hidden delivery charges.
- No confusing error messages.
- No unnecessary horizontal scrolling.
- No repeated entry of the same information.
- No fake urgency or fabricated stock warnings.
- No inactive buttons or decorative controls that do nothing.

Use clear button labels, visible feedback, readable typography, and predictable navigation.

The main purchase flow should be:

Browse Product → Select Required Options → Buy Now → Enter Delivery Details → Review Total → Place Order → Confirmation.

Keep optional features such as Wishlist, reviews, coupons, and advanced filters unobtrusive.

### 15. SEARCH, SEO, AND MARKETING

Include:
- Search by product name and category.
- Bengali and English search support where feasible.
- SEO-friendly product and category URLs.
- Editable SEO titles and descriptions.
- Sitemap and canonical URLs.
- Product structured data.
- Social sharing metadata.
- Google Analytics 4 integration point.
- Meta Pixel integration point.
- Configurable discount campaigns.
- Optional abandoned-cart recovery.
- Optional SMS or WhatsApp notifications through supported services.

Marketing integrations must respect privacy requirements and use appropriate consent where required.

### 16. DATABASE ARCHITECTURE

Design a relational database with appropriate relationships and indexes.

Suggested entities:
- users
- roles and permissions
- categories
- products
- product_images
- product_variants
- inventory
- carts
- cart_items
- orders
- order_items
- order_status_history
- payments
- shipments
- coupons
- reviews
- wishlists
- site_settings
- audit_logs

Requirements:
- Use unique order identifiers.
- Store order-item price and product information as purchase-time snapshots.
- Keep inventory updates transaction-safe.
- Prevent overselling under concurrent purchases.
- Keep delivery charge and discount snapshots for historical accuracy.
- Keep customer data protected by access controls.
- Never store plaintext passwords or sensitive payment credentials.
- Do not expose server secrets in frontend code.

### 17. TECHNICAL ARCHITECTURE

Recommended initial stack:
- Frontend: Next.js and TypeScript.
- UI: Tailwind CSS with reusable design components.
- Database: PostgreSQL.
- Backend: Secure server-side application logic or a properly configured backend service.
- Authentication: Secure admin authentication with role-based permissions.
- Product images: Optimized image storage and CDN.
- Hosting: A production-compatible deployment platform.

Supabase may be considered for PostgreSQL, authentication, and storage, but it must be configured with strict access policies.

Requirements:
- Keep business logic on the server.
- Protect all admin routes and write operations.
- Validate all incoming data.
- Use secure environment variables.
- Implement database migrations.
- Configure backups and error monitoring.
- Avoid unnecessary dependencies and excessive JavaScript.
- Make the application deployable to a production environment.

The technology choices may be adjusted if Antigravity determines that another stack better fits the actual implementation, but the core architecture and business requirements must remain intact.

### 18. SECURITY AND RELIABILITY

Implement:
- Secure authentication and authorization.
- Server-side validation.
- Rate limiting for order tracking and sensitive endpoints.
- Protection against duplicate checkout submissions.
- Secure session and cookie configuration.
- Input sanitization and safe database queries.
- CSRF protection where applicable.
- Audit logs for important admin actions.
- Automated backups and recovery procedures.
- Error monitoring and clear failure handling.

Never rely on frontend-only checks for prices, stock, permissions, or order ownership.

### 19. PERFORMANCE AND ACCESSIBILITY

- Mobile-first responsive design.
- Optimized product images.
- Responsive image sizes and modern formats.
- Lazy loading for below-the-fold images.
- Efficient database queries and indexes.
- Pagination for large lists.
- Caching where appropriate.
- Semantic HTML and keyboard-accessible controls.
- Accessible form labels and validation messages.
- Good contrast and readable text.
- Avoid layout shifts and unnecessary animations.

Target strong real-world Core Web Vitals rather than guaranteeing a particular score before testing.

### 20. TESTING REQUIREMENTS

Before launch, test:

1. Product creation and editing.
2. Category and variant configuration.
3. Required and optional size selection.
4. Out-of-stock prevention.
5. Cart quantity updates.
6. Correct price and discount calculation.
7. Dhaka and outside-Dhaka delivery charges.
8. COD checkout.
9. Duplicate submission prevention.
10. Successful order confirmation.
11. Order tracking with correct and incorrect details.
12. Admin status updates.
13. Cancellation and return flows.
14. Admin authorization and customer data protection.
15. Mobile, tablet, and desktop responsiveness.
16. Database backup and recovery.
17. Search, SEO, and performance.

Use a staging environment and test orders before processing real customer orders.

### 21. IMPLEMENTATION STRATEGY

Build the project in the following phases:

Phase 1: Requirements, project setup, database design, and design system.

Phase 2: Homepage, navigation, categories, product listing, and product details.

Phase 3: Variants, stock management, cart, pricing, and checkout.

Phase 4: COD orders, configurable delivery charges, order confirmation, and tracking.

Phase 5: Admin dashboard, product management, order management, and settings.

Phase 6: Security, SEO, performance optimization, and testing.

Phase 7: Deployment, monitoring, and production launch.

Do not generate the entire application in one unverified step. Build incrementally, run the application, test each phase, and fix errors before proceeding.

### 22. ACCEPTANCE CRITERIA

The project is ready for launch only when:

- Customers can browse and search real products.
- Product variants and stock work correctly.
- Checkout requires only the essential information.
- COD orders are saved correctly.
- Delivery charges are configurable and calculated correctly.
- The final total is validated on the server.
- Duplicate orders and overselling are prevented.
- Customers can securely track their orders.
- Admins can manage products, inventory, orders, and settings.
- The website works on common mobile and desktop screen sizes.
- Branding can be changed without rebuilding core functionality.
- Security, backups, and error handling are in place.
- All critical purchase and tracking flows have passed testing.

## FINAL INSTRUCTION TO ANTIGRAVITY

Act as a senior e-commerce architect, UI/UX designer, full-stack engineer, database designer, and QA engineer.

First, analyze this complete specification and create a practical implementation plan.

Then generate a series of detailed, sequential development prompts, one phase at a time. Each prompt must specify:
- The exact feature to build.
- The relevant pages and components.
- Database changes.
- Backend logic and API requirements.
- UI/UX requirements.
- Security and validation rules.
- Acceptance tests.
- Dependencies on previous phases.

Maintain a single consistent architecture and design system across all phases.

Do not skip requirements, invent business values, or substitute a nonfunctional demo for working features.

Keep the customer-facing experience simple and the admin experience powerful.

Use placeholders for the brand name, logo, delivery charges, contact details, and any credentials that have not yet been supplied.

Start by generating the complete project structure, architecture decisions, database schema, and Phase 1 implementation prompt. Do not attempt to build every feature at once.