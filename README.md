# SkipLine - Coffee Shop Queue Management System

## Project Description
SkipLine is a comprehensive queue and order management application specifically designed for coffee shops. The system streamlines the ordering workflow, reduces physical wait times, and enhances the overall customer experience by allowing users to browse the menu, customize their beverages, and track their order status in real-time.

For shop operations, it provides a dedicated staff interface to efficiently handle incoming orders and manage the queue flow.

---

## System Architecture Overview
SkipLine follows a **Service-Based Architecture (SBA)** where each core business capability is implemented as a focused service module behind a unified API.

- **Frontend Service Layer (Next.js Client):**
  Provides role-specific interfaces (Customer, Staff, Admin) and consumes backend services through typed API clients.

- **Authentication Service:**
  Handles registration, login, JWT issuance, identity validation, and role-based authorization for protected actions.

- **Menu Service:**
  Exposes product catalog data, category organization, availability flags, size options, and add-on combinations.

- **Cart & Checkout Service:**
  Manages cart state, pricing calculations, queue-aware checkout flow, and mock payment-slip submission.

- **Order Workflow Service:**
  Owns FIFO order orchestration and lifecycle transitions (Pending -> Preparing -> Ready -> Completed) with status visibility for customers and staff.

- **Admin Operations Service:**
  Supports menu CRUD, stock updates, busy-mode override, and operational controls for store managers.

- **Analytics Capability (inside Admin Service):**
  Daily operational metrics (for example total orders processed and sales performance) are currently implemented through the admin service endpoints, not as a separate standalone service file.

- **Data Persistence Layer (PostgreSQL + SQLAlchemy ORM):**
  Centralized relational storage for users, products, add-ons, carts, orders, and transaction history.

---

## User Roles & Permissions

### Customer
- **Account Management:** Register, log in, and update personal account details.
- **Order Creation:** Browse the digital menu, view real-time item availability, add items to a cart, and place orders by uploading a mock payment slip.
- **Order Tracking:** Track order progress through live status updates (Pending, Preparing, Ready).
- **Order Collection:** Access and present a unique transaction reference to staff when claiming completed orders.

### Staff
- **Queue Monitoring:** Access a live, auto-updating Kanban dashboard that shows incoming orders in strict FIFO sequence.
- **Order Processing:** Move active orders through kitchen workflow states (Pending -> Preparing -> Ready for Pickup).

### Admin (Shop Manager)
- **Menu Management:** Create new menu items, edit existing item details (name, description, pricing), and remove obsolete products.
- **Inventory Control:** Update stock quantities for final products so customer-facing availability is always accurate.
- **System Override:** Trigger Busy Mode to temporarily disable checkout during peak rush periods.
- **Performance Tracking:** Review operational analytics, including total orders processed and overall sales performance.

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

### Database
- PostgreSQL

---

## Installation & Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Python (3.8 or higher)
- Git
- PostgreSQL (14+ recommended)
- Docker Desktop (for Docker-based backend setup)

---

### 1. Clone the Repository
```bash
git clone https://github.com/Nunthapop123/SkipLine.git
cd SkipLine
```

### 2. Backend Setup

Choose one backend setup method.

#### Option A: Manual (Local Python + Local PostgreSQL)

1. Open Terminal 1 and prepare backend dependencies.

```bash
cd backend
python -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows PowerShell alternative
# .\venv\Scripts\Activate.ps1

pip install -r requirements.txt

# macOS/Linux
cp .env.example .env

# Windows PowerShell alternative
# Copy-Item .env.example .env
```

2. Start PostgreSQL service.

- macOS (Homebrew): `brew services start postgresql`
- Windows (PowerShell as Administrator): `net start postgresql-x64-16`
- Linux: `sudo systemctl start postgresql`

3. Create database and user.

```sql
psql postgres
CREATE DATABASE skipline;
CREATE USER skipline_user WITH PASSWORD 'skipline_password';
GRANT ALL PRIVILEGES ON DATABASE skipline TO skipline_user;
\q
```

4. Update `backend/.env`.

```env
DATABASE_URL=postgresql://skipline_user:skipline_password@localhost:5432/skipline
SECRET_KEY=your-super-secret-key-change-this-in-production
```

5. Run initialization scripts.

```bash
cd backend
source venv/bin/activate  # Windows: .\venv\Scripts\Activate.ps1
python scripts/create_staff_admin_users.py
python scripts/seed_menu_data.py
python scripts/seed_add_ons.py
```

#### Option B: Docker (Backend + PostgreSQL)

1. Go to the project root and start containers.

```bash
cd SkipLine
docker compose -f docker-compose.backend.yml up -d --build
```

2. Run initialization scripts.

```bash
docker compose -f docker-compose.backend.yml exec backend python scripts/create_staff_admin_users.py
docker compose -f docker-compose.backend.yml exec backend python scripts/seed_menu_data.py
docker compose -f docker-compose.backend.yml exec backend python scripts/seed_add_ons.py
```

Note: If you are already in the `SkipLine` root directory, you do not need to run `cd SkipLine` again.

Because containers are started with `-d` (detached mode), you can continue using the same terminal for the next commands.

3. Verify backend services.

- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- PostgreSQL: localhost:5432 (db: `skipline`, user: `skipline_user`, password: `skipline_password`)

4. Stop containers when done.

```bash
docker compose -f docker-compose.backend.yml down
```

**Initialization Scripts:**
- `create_staff_admin_users.py` - Creates default admin and staff accounts.

Default Staff/Admin Credentials:

| Role | EmployeeID/Email | Password |
|---|---|---|
| Admin | admin@skipline.com | admin123 |
| Staff | staff@skipline.com | staff123 |

Important: Change default credentials after first successful login in non-demo environments.
- `seed_menu_data.py` - Populates 5 categories with 30 products and size adjustments
- `seed_add_ons.py` - Adds 16 customization options and links them to appropriate products

### 3. Frontend SetUp

Open a new terminal, then run:

```bash
cd frontend

# Install dependencies
npm install
```
---

## How to Run the System
Use the setup flow above:

- Backend: choose **Option A (Manual)** or **Option B (Docker)** in **Backend Setup**.
- Frontend: run `npm install` once, then `npm run dev` in `frontend`.

Endpoints:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs

---

## System Screenshots

### Customer Experience

#### 1. **Landing Page**
The home page welcomes customers and highlights the SkipLine service with category navigation.
![Landing Page](docs/screenshots/landing-page.png)

#### 2. **Menu & Product Browsing**
Browse all categories and view product offerings with prices and descriptions.
![Menu Page](docs/screenshots/menu-page.png)

#### 3. **Product Detail & Customization**
Detailed product view with customization options (size, sweetness, add-ons).
![Product Detail](docs/screenshots/product-detail.png)

#### 4. **Add-ons Selection Modal**
Modal for selecting condiments, toppings, and milk alternatives with pricing.
![Add-ons Modal](docs/screenshots/addons-modal.png)

#### 5. **Shopping Cart**
View all items in cart with quantity controls and price summary.
![Shopping Cart](docs/screenshots/shopping-cart.png)

#### 6. **Checkout & Payment**
Complete checkout process with queue status, order summary, and payment methods.
![Checkout Page](docs/screenshots/checkout.png)

#### 7. **Order Confirmation**
Order confirmation screen with estimated pickup time and transaction details.
![Order Confirmation](docs/screenshots/order-confirmation.png)

#### 8. **Order Tracking**
Real-time order status tracking with progress indicator and queue position.
![Order Tracking](docs/screenshots/order-tracking.png)

#### 9. **Customer Login**
Login page for customers to access order history and track orders.
![Customer Login](docs/screenshots/login.png)

#### 10. **Registration**
Customer account creation form with validation.
![Registration](docs/screenshots/register.png)

### Staff & Admin Experience

#### 11. **Staff Login Portal**
Secure login page with role selection (Staff/Admin) and credential validation.
![Staff Login](docs/screenshots/staff-login.png)

#### 12. **Order Dashboard**
Real-time dashboard showing all active orders organized by status (Confirmed, Doing, Done) with SLA indicators.
![Order Dashboard](docs/screenshots/order-dashboard.png)

#### 13. **Menu Management**
Admin interface for managing products with edit, delete, and availability controls.
![Menu Management](docs/screenshots/menu-management.png)

#### 14. **Inventory Control**
Real-time inventory tracking with stock quantity adjustments per product.
![Inventory Control](docs/screenshots/inventory-control.png)

#### 15. **System Settings**
Global store settings including Busy Mode toggle and Base Prep Time configuration.
![System Settings](docs/screenshots/system-settings.png)

#### 16. **Performance Analytics**
Real-time analytics dashboard showing revenue, transaction count, and sales velocity metrics.
![Analytics Dashboard](docs/screenshots/analytics-dashboard.png)

---

## Project Structure

```text
SkipLine/
├── README.md
├── LICENSE
├── docker-compose.backend.yml
├── docs/
│   └── screenshots/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── requirements.txt
│   ├── scripts/
│   │   ├── create_staff_admin_users.py
│   │   ├── seed_menu_data.py
│   │   └── seed_add_ons.py
│   └── app/
│       ├── main.py
│       ├── api/
│       │   ├── dependencies.py
│       │   └── routes/
│       │       ├── auth.py
│       │       ├── cart.py
│       │       ├── menu.py
│       │       ├── order.py
│       │       └── admin.py
│       ├── core/
│       │   ├── config.py
│       │   ├── database.py
│       │   └── security.py
│       ├── models/
│       │   ├── user.py
│       │   ├── product.py
│       │   ├── cart.py
│       │   ├── order.py
│       │   └── store.py
│       ├── schemas/
│       │   ├── user.py
│       │   ├── product.py
│       │   ├── cart.py
│       │   ├── order.py
│       │   └── store.py
│       └── services/
│           ├── authentication.py
│           ├── menu.py
│           ├── cart.py
│           ├── order.py
│           └── admin.py
└── frontend/
  ├── package.json
  ├── next.config.ts
  ├── tsconfig.json
  ├── public/
  │   ├── kid_logo.png
  │   ├── kid-herosection.png
  │   ├── hotCoffee.png
  │   ├── iceCoffee.png
  │   ├── tea.png
  │   ├── frappes.png
  │   └── nonCoffee.png
  ├── components/
  │   ├── Navbar.tsx
  │   ├── StaffNavbar.tsx
  │   ├── Footer.tsx
  │   ├── landing/
  │   ├── auth/
  │   ├── cart/
  │   ├── menu/
  │   ├── transaction/
  │   ├── my-order/
  │   └── admin/
  └── src/
    ├── app/
    │   ├── page.tsx
    │   ├── menu/
    │   ├── cart/
    │   ├── transaction/
    │   ├── my-order/
    │   ├── staff/
    │   ├── admin/
    │   └── (auth)/
    └── data/
      ├── menuApi.ts
      ├── orderApi.ts
      ├── cartApi.ts
      ├── adminApi.ts
      ├── userApi.ts
      └── menuData.ts
```

---

## Troubleshooting

### Backend Won't Start
- Ensure PostgreSQL is running:
  - macOS: `brew services start postgresql`
  - Windows: start `postgresql-x64-<version>` service
  - Linux: `sudo systemctl start postgresql`
- Check DATABASE_URL in `.env` is correct
- Run migrations if database is fresh

### Docker Backend Issues
- Ensure Docker Desktop is running
- Rebuild services: `docker compose -f docker-compose.backend.yml up -d --build`
- Check logs:
  - `docker compose -f docker-compose.backend.yml logs backend`
  - `docker compose -f docker-compose.backend.yml logs db`

### Frontend Not Connecting to API
- Verify backend is running on http://127.0.0.1:8000
- Check browser console for API errors
- Ensure CORS_ORIGINS in backend includes your frontend URL

### Missing Images
- Ensure `/public` folder contains all image files
- Image paths in code should start with `/` (e.g., `/hotCoffee.png`)
- For relative imports, ensure proper image configuration in `next.config.ts`

---



