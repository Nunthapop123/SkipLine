# SkipLine - Coffee Shop Queue Management System

## Project Description
SkipLine is a comprehensive queue and order management application specifically designed for coffee shops. The system streamlines the ordering workflow, reduces physical wait times, and enhances the overall customer experience by allowing users to browse the menu, customize their beverages, and track their order status in real-time.

For shop operations, it provides a dedicated staff interface to efficiently handle incoming orders and manage the queue flow.

---

## System Architecture Overview
The application utilizes a modern, decoupled **Client-Server architecture**:

- **Client (Frontend):**  
  A responsive web application built to handle both the customer-facing storefront and the staff management dashboard.

- **API (Backend):**  
  A robust RESTful API service handling business logic, user authentication, cart calculations, and order state management.

- **Database:**  
  A relational database management system accessed via an Object-Relational Mapper (ORM) to securely store user credentials, product catalogs (categories, add-ons), and transaction histories.

---

## User Roles & Permissions

### Customer
- Browse product categories (Hot Coffee, Iced Coffee, Frappes, Non-Coffee, Tea)
- Customize orders (size, sweetness level, add-ons)
- Manage shopping cart and proceed to checkout securely
- Track personal order status and queue progress via the tracker interface

### Staff / Admin
- Secure login access to the staff dashboard (`/staff/dashboard`)
- Monitor incoming transactions and order lists in real-time
- Update order statuses (e.g., Pending, Preparing, Ready for Pickup)
- Manage overall store queues and active order flow

---

## Technology Stack

### Frontend
- Next.js (React Framework)
- TypeScript
- Tailwind CSS

### Backend
- Python
- FastAPI
- SQLAlchemy (ORM)
- Pydantic (data validation and schemas)

---

## Environment Configuration

### Backend Environment Variables
The backend uses environment variables for configuration. A template file is provided:

**Setup Instructions:**
1. Navigate to the `backend/` directory
2. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

3. Edit `.env` with your actual values:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/skipline

# JWT Secret (Generate with: openssl rand -hex 32)
SECRET_KEY=your-super-secret-key-change-this

# CORS Origins
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]

# API Server
API_HOST=0.0.0.0
API_PORT=8000
ENVIRONMENT=development
```

**Important:** Never commit your `.env` file to version control. The `.env.example` file serves as a template for developers.

---

## Installation & Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Python (3.8 or higher)
- Git

---

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd SkipLine
```

### 2. Backend SetUp
```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run initialization scripts (in order)
# 1. Create staff and admin users
python scripts/create_staff_admin_users.py

# 2. Seed menu categories and products
python scripts/seed_menu_data.py

# 3. Seed add-ons and link them to products
python scripts/seed_add_ons.py
```

**Initialization Scripts:**
- `create_staff_admin_users.py` - Creates default admin and staff accounts (admin@skipline.com / staff@skipline.com)
- `seed_menu_data.py` - Populates 5 categories with 30 products and size adjustments
- `seed_add_ons.py` - Adds 16 customization options and links them to appropriate products

### 3. Frontend SetUp
```bash
cd ../frontend

# Install dependencies
npm install
```
---

## How to Run the System
You need to run both backend and frontend servers.

### Terminal 1: Start Backend
```bash
cd backend
source venv/bin/activate  # activate environment
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
API: http://localhost:8000
Docs: http://localhost:8000/docs

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```
App: http://localhost:3000

---

## System Screenshots

### Customer Experience

#### 1. **Landing Page**
The home page welcomes customers and highlights the SkipLine service with category navigation.
![Landing Page](public/screenshots/landing-page.png)

#### 2. **Menu & Product Browsing**
Browse all categories and view product offerings with prices and descriptions.
![Menu Page](public/screenshots/menu-page.png)

#### 3. **Product Detail & Customization**
Detailed product view with customization options (size, sweetness, add-ons).
![Product Detail](public/screenshots/product-detail.png)

#### 4. **Add-ons Selection Modal**
Modal for selecting condiments, toppings, and milk alternatives with pricing.
![Add-ons Modal](public/screenshots/addons-modal.png)

#### 5. **Shopping Cart**
View all items in cart with quantity controls and price summary.
![Shopping Cart](public/screenshots/shopping-cart.png)

#### 6. **Checkout & Payment**
Complete checkout process with queue status, order summary, and payment methods.
![Checkout Page](public/screenshots/checkout.png)

#### 7. **Order Confirmation**
Order confirmation screen with estimated pickup time and transaction details.
![Order Confirmation](public/screenshots/order-confirmation.png)

#### 8. **Order Tracking**
Real-time order status tracking with progress indicator and queue position.
![Order Tracking](public/screenshots/order-tracking.png)

#### 9. **Customer Login**
Login page for customers to access order history and track orders.
![Customer Login](public/screenshots/login.png)

#### 10. **Registration**
Customer account creation form with validation.
![Registration](public/screenshots/register.png)

### Staff & Admin Experience

#### 11. **Staff Login Portal**
Secure login page with role selection (Staff/Admin) and credential validation.
![Staff Login](public/screenshots/staff-login.png)

#### 12. **Order Dashboard**
Real-time dashboard showing all active orders organized by status (Confirmed, Doing, Done) with SLA indicators.
![Order Dashboard](public/screenshots/order-dashboard.png)

#### 13. **Menu Management**
Admin interface for managing products with edit, delete, and availability controls.
![Menu Management](public/screenshots/menu-management.png)

#### 14. **Inventory Control**
Real-time inventory tracking with stock quantity adjustments per product.
![Inventory Control](public/screenshots/inventory-control.png)

#### 15. **System Settings**
Global store settings including Busy Mode toggle and Base Prep Time configuration.
![System Settings](public/screenshots/system-settings.png)

#### 16. **Performance Analytics**
Real-time analytics dashboard showing revenue, transaction count, and sales velocity metrics.
![Analytics Dashboard](public/screenshots/analytics-dashboard.png)

---

## Project Structure

### Frontend Organization
```
frontend/
├── public/
│   ├── screenshots/          # UI screenshots for documentation
│   ├── images/              # Product category and hero images
│   ├── icons/               # UI indicator icons (cup sizes, etc.)
│   └── logos/               # Brand logos (kid_logo.png)
├── src/
│   ├── app/                 # Next.js pages (routing)
│   ├── components/          # Reusable React components
│   └── data/                # API clients and utilities
├── package.json
└── tsconfig.json
```

### Backend Organization
```
backend/
├── app/
│   ├── api/                 # API routes (auth, menu, cart, orders, admin)
│   ├── core/                # Core utilities (database, security, config)
│   ├── models/              # SQLAlchemy ORM models
│   ├── schemas/             # Pydantic request/response schemas
│   └── services/            # Business logic services
├── scripts/                 # Database seeding scripts
├── requirements.txt         # Python dependencies
└── .env.example            # Environment template
```

---

## Troubleshooting

### Backend Won't Start
- Ensure PostgreSQL is running: `brew services start postgresql`
- Check DATABASE_URL in `.env` is correct
- Run migrations if database is fresh

### Frontend Not Connecting to API
- Verify backend is running on http://127.0.0.1:8000
- Check browser console for API errors
- Ensure CORS_ORIGINS in backend includes your frontend URL

### Missing Images
- Ensure `/public` folder contains all image files
- Image paths in code should start with `/` (e.g., `/hotCoffee.png`)
- For relative imports, ensure proper image configuration in `next.config.ts`

---

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m "feat: description"`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

---

## License

This project is part of the Software Architecture course (Year 3, Term 2).

© 2025 SkipLine. All rights reserved.

