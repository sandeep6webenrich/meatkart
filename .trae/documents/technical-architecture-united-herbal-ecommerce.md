## 1. Architecture Design

```mermaid
graph TD
  A[User Browser] --> B[Next.js Frontend]
  B --> C[Next.js API Routes]
  C --> D[Prisma ORM]
  D --> E[PostgreSQL Database]
  C --> F[NimbusPost API]
  C --> G[Razorpay/Cashfree API]
  C --> H[WhatsApp/SMS/Email Services]
  
  I[Admin Browser] --> B
  
  subgraph "Frontend Layer"
    B
  end
  
  subgraph "Backend Layer"
    C
  end
  
  subgraph "Data Layer"
    D
    E
  end
  
  subgraph "External Services"
    F
    G
    H
  end
```

## 2. Technology Description
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT tokens
- **Payment Integration**: Razorpay SDK, Cashfree SDK
- **Shipping Integration**: NimbusPost API
- **Notifications**: WhatsApp Business API, SendGrid/SMTP, SMS Gateway
- **File Storage**: AWS S3 or Supabase Storage
- **Analytics**: Google Analytics 4, Meta Pixel
- **Initialization Tool**: create-next-app

## 3. Route Definitions
| Route | Purpose |
|-------|---------|
| / | Homepage with featured products and categories |
| /shop | Product listing with filters and pagination |
| /shop/[category] | Category-specific product listings |
| /product/[slug] | Individual product detail page |
| /cart | Shopping cart with item management |
| /checkout | Multi-step checkout process |
| /order-confirmation/[id] | Order success page with tracking |
| /order-tracking/[id] | Order status tracking page |
| /about, /contact, /privacy, /terms | Legal and informational pages |
| /api/auth/* | Authentication endpoints |
| /api/products/* | Product CRUD operations |
| /api/orders/* | Order management endpoints |
| /api/payments/* | Payment processing endpoints |
| /api/shipping/* | Shipping integration endpoints |
| /api/notifications/* | Notification service endpoints |
| /admin | Admin dashboard login |
| /admin/dashboard | Main admin interface |
| /admin/products | Product management |
| /admin/orders | Order management |
| /admin/inventory | Inventory control |
| /admin/reports | Sales reports and analytics |

## 4. API Definitions

### 4.1 Authentication APIs
```
POST /api/auth/login
```
Request:
| Param Name | Param Type | isRequired | Description |
|------------|------------|------------|-------------|
| email | string | true | Admin email address |
| password | string | true | Admin password |

Response:
```json
{
  "success": true,
  "token": "jwt_token_string",
  "user": {
    "id": "user_id",
    "email": "admin@unitedhealthcare.com",
    "role": "admin"
  }
}
```

### 4.2 Product APIs
```
GET /api/products
```
Query Parameters:
| Param Name | Param Type | Description |
|------------|------------|-------------|
| category | string | Filter by category slug |
| page | number | Page number for pagination |
| limit | number | Items per page |
| sort | string | Sort by price, name, or date |

Response:
```json
{
  "products": [
    {
      "id": "product_id",
      "name": "Herbal Product Name",
      "slug": "herbal-product-slug",
      "price": 299.00,
      "discountedPrice": 249.00,
      "images": ["image_url_1", "image_url_2"],
      "stock": 50,
      "category": {
        "id": "category_id",
        "name": "Immunity Boosters",
        "slug": "immunity-boosters"
      }
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

### 4.3 Order APIs
```
POST /api/orders/create
```
Request:
| Param Name | Param Type | isRequired | Description |
|------------|------------|------------|-------------|
| items | array | true | Array of product items with quantities |
| shippingAddress | object | true | Customer shipping details |
| paymentMethod | string | true | "razorpay", "cashfree", or "cod" |
| customerInfo | object | true | Customer contact information |

Response:
```json
{
  "success": true,
  "orderId": "order_unique_id",
  "paymentRequired": true,
  "paymentData": {
    "razorpay_order_id": "rzp_order_id"
  }
}
```

### 4.4 Payment APIs
```
POST /api/payments/verify
```
Request:
| Param Name | Param Type | isRequired | Description |
|------------|------------|------------|-------------|
| razorpay_order_id | string | true | Razorpay order ID |
| razorpay_payment_id | string | true | Razorpay payment ID |
| razorpay_signature | string | true | Razorpay signature for verification |

Response:
```json
{
  "success": true,
  "orderId": "order_unique_id",
  "status": "paid"
}
```

### 4.5 Shipping APIs
```
POST /api/shipping/create-shipment
```
Request:
| Param Name | Param Type | isRequired | Description |
|------------|------------|------------|-------------|
| orderId | string | true | Order ID for shipment |
| pickupAddress | object | true | Warehouse pickup details |
| deliveryAddress | object | true | Customer delivery details |

Response:
```json
{
  "success": true,
  "awbNumber": "awb_tracking_number",
  "labelUrl": "shipping_label_pdf_url",
  "trackingUrl": "tracking_page_url"
}
```

## 5. Server Architecture Diagram

```mermaid
graph TD
  A[Client Request] --> B[Next.js API Route]
  B --> C[Validation Layer]
  C --> D[Business Logic Layer]
  D --> E[Database Layer]
  D --> F[External Services]
  
  subgraph "API Layer"
    B
    C
  end
  
  subgraph "Service Layer"
    D
  end
  
  subgraph "Data Layer"
    E[Prisma ORM]
    E --> G[PostgreSQL]
  end
  
  subgraph "External Integrations"
    F[NimbusPost]
    F[Razorpay]
    F[Notification Services]
  end
```

## 6. Data Model

### 6.1 Data Model Definition
```mermaid
erDiagram
  USERS ||--o{ ORDERS : places
  USERS ||--o{ ADDRESSES : has
  ORDERS ||--o{ ORDER_ITEMS : contains
  PRODUCTS ||--o{ ORDER_ITEMS : included_in
  PRODUCTS ||--o{ PRODUCT_IMAGES : has_images
  PRODUCTS ||--o{ PRODUCT_VIDEOS : has_videos
  PRODUCTS }o--|| CATEGORIES : belongs_to
  ORDERS ||--|| PAYMENTS : has_payment
  ORDERS ||--|| SHIPMENTS : has_shipment
  ORDERS ||--o{ NOTIFICATIONS : triggers

  USERS {
    string id PK
    string email UK
    string password_hash
    string name
    string role
    string phone
    datetime created_at
    datetime updated_at
  }

  PRODUCTS {
    string id PK
    string name
    string slug UK
    string description
    string ingredients
    string benefits
    decimal price
    decimal discounted_price
    integer stock_quantity
    string category_id FK
    boolean is_active
    datetime created_at
    datetime updated_at
  }

  CATEGORIES {
    string id PK
    string name
    string slug UK
    string description
    integer sort_order
    boolean is_active
  }

  ORDERS {
    string id PK
    string user_id FK
    string order_number UK
    decimal total_amount
    string status
    string payment_method
    string payment_status
    json shipping_address
    json customer_info
    datetime created_at
    datetime updated_at
  }

  ORDER_ITEMS {
    string id PK
    string order_id FK
    string product_id FK
    integer quantity
    decimal unit_price
    decimal total_price
  }

  PAYMENTS {
    string id PK
    string order_id FK
    string payment_method
    string transaction_id
    decimal amount
    string status
    json payment_data
    datetime created_at
  }

  SHIPMENTS {
    string id PK
    string order_id FK
    string awb_number UK
    string carrier
    string status
    json tracking_data
    string label_url
    datetime created_at
    datetime updated_at
  }

  NOTIFICATIONS {
    string id PK
    string order_id FK
    string type
    string recipient
    string status
    json notification_data
    datetime created_at
  }
```

### 6.2 Data Definition Language

**Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Categories Table**
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);
```

**Products Table**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  ingredients TEXT,
  benefits TEXT,
  price DECIMAL(10,2) NOT NULL,
  discounted_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_price ON products(price);
```

**Product Images Table**
```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(200),
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(is_primary);
```

**Orders Table**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  customer_info JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

**Order Items Table**
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
```

**Payments Table**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(100),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);
```

**Shipments Table**
```sql
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  awb_number VARCHAR(50) UNIQUE,
  carrier VARCHAR(100),
  status VARCHAR(50) DEFAULT 'created',
  tracking_data JSONB,
  label_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_shipments_order ON shipments(order_id);
CREATE INDEX idx_shipments_awb ON shipments(awb_number);
```

**Notifications Table**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  type VARCHAR(50) NOT NULL CHECK (type IN ('whatsapp', 'email', 'sms')),
  recipient VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notification_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_order ON notifications(order_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_status ON notifications(status);
```