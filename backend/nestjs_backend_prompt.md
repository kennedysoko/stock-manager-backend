# NestJS Backend Generation Prompt - Stock Manager

This document serves as a detailed prompt and architecture specification for building a new working backend using **NestJS**. This backend is tailored to replace the existing `localStorage` logic in the React frontend of the Stock Manager application. 

The scope is strictly limited to four core areas: **Products, Inventory Tracking, Checkout (POS), and Dashboard**.

---

## 1. Tech Stack Overview
- **Framework:** NestJS
- **Database ORM:** Prisma (or TypeORM)
- **Database:** SQLite (for local development) or PostgreSQL
- **Validation:** `class-validator`, `class-transformer`
- **Language:** TypeScript

---

## 2. Database Entities / Prisma Schema
Generate the database schema with the following entities to support the application logic:

### `Product`
- `id`: String (Primary Key, e.g., 'PRD-001' or UUID)
- `name`: String
- `category`: String (e.g., 'Beverages', 'Staples')
- `price`: Float / Int
- `stock`: Int (Current quantity in stock)
- `minStockLevel`: Int (Threshold for alerts)
- `supplier`: String (Optional)
- `emoji`: String
- `image`: String (Nullable)
- `notes`: String (Nullable)
- `createdAt` / `updatedAt`: DateTime

### `Transaction` (Inventory Movements)
- `id`: String (Primary Key, e.g., 'TXN-0001' or UUID)
- `productId`: String (Foreign Key to Product)
- `type`: Enum ('IN' or 'OUT')
- `qty`: Int
- `stockBefore`: Int
- `stockAfter`: Int
- `date`: DateTime (Default Now)
- `user`: String (Name of user who made transaction)
- `notes`: String (Nullable, e.g., 'Received goods' or 'POS Sale #123')

### `Sale` (Checkout/Receipt records)
- `id`: String (Primary Key, e.g., 'SALE-101' or UUID)
- `customerName`: String (Default: 'Walk-in Customer')
- `subtotal`: Float
- `discount`: Float
- `total`: Float
- `date`: DateTime
- `user`: String (Cashier)
- **Relation:** SaleItem (1-to-Many linking Sale and Product)

---

## 3. Modules & Endpoints Specification

### A. Products Module (`/products`)
Manages the product catalog. 
**Endpoints:**
1. `GET /products`
   - Returns all active products.
2. `GET /products/low-stock`
   - Returns products where `stock <= minStockLevel`.
3. `POST /products`
   - **Body:** `{ name, cat, price, stock, min, supplier, emoji, image, notes }`
   - **Logic:** Creates the product. If initial `stock` > 0, it should also generate an initial `Transaction` of type 'IN' for audit purposes.
4. `PUT /products/:id`
   - **Body:** `{ name, cat, price, min, supplier, emoji }`
   - **Logic:** Updates details. Should **not** update `stock` directly (stock is updated via transactions).

### B. Inventory Tracking Module (`/inventory`)
Handles stock in/out and transaction auditing.
**Endpoints:**
1. `GET /inventory/transactions`
   - Returns all transactions, sorted by date descending.
2. `POST /inventory/transaction`
   - **Body:** `{ type: 'IN' | 'OUT', productId, qty, notes, user }`
   - **Logic (Atomic Transaction crucial!):**
     1. Fetch the absolute latest `stock` for `productId`. This is `stockBefore`.
     2. Calculate `stockAfter` = `type === 'IN'` ? `stockBefore + qty` : `stockBefore - qty`.
     3. Throw Bad Request if `type === 'OUT'` and `qty > stockBefore` (prevent negative stock).
     4. Update Product's `stock`.
     5. Create and save the `Transaction` record.

### C. Checkout / POS Module (`/checkout`)
Handles Point-Of-Sale logic, ensuring atomicity across multiple items.
**Endpoints:**
1. `POST /checkout/process`
   - **Body:** `{ cart: [{ productId, qty }], discount, customer, user }`
   - **Logic (Must run in a DB Transaction):**
     1. Iterate through `cart`. Validate that `qty` for each item doesn't exceed current `stock`.
     2. Calculate `subtotal` natively querying product prices. Use frontend `discount` to arrive at `total`. 
     3. Deduct `qty` from each Product's `stock`.
     4. Generate a `Transaction` of type 'OUT' for each item with notes: `"POS Sale #{SaleRef}"`. 
     5. Save the `Sale` and generic receipt data.
     6. **Return** receipt payload: `{ ref, date, customer, items (with prices), subtotal, discount, total }` back to the frontend.

### D. Dashboard Module (`/dashboard`)
Provides aggregated data for the React dashboard.
**Endpoints:**
1. `GET /dashboard/summary`
   - **Returns Payload:**
     - `totalProducts`: count of products.
     - `lowStockCount`: count where `stock <= minStockLevel`.
     - `totalStockValue`: sum of `(price * stock)` across all products.
     - `recentTransactions`: array of the 5 most recent transactions.
     - `weeklyMovements`: array aggregating IN/OUT quantities for the current week (Mon-Sun).

---

## 4. Specific Business Logic Notes for AI Generation
- **Validation:** Use `@IsInt()`, `@Min(0)`, `@IsEnum()` from `class-validator` in DTOs extensively. We never want negative stock or negative prices.
- **Concurrency / Negative Stock:** When implementing the `Checkout` or `Inventory` POST endpoints, emphasize the use of DB transactions (`prisma.$transaction`).
- **Services:** Separate logic! Creating a checkout should invoke the internal `InventoryService` to process the outgoing stock transactions rather than repeating stock deduction logic.
- **CORS:** Ensure `app.enableCors()` is invoked in `main.ts` so the React generic localhost app can connect seamlessly.

---
**Instructions for the AI Developer:** 
"Take this document and generate a completely functional NestJS API boilerplate, including `prisma.schema`, `Products`, `Inventory`, `Checkout`, and `Dashboard` modules. Implement the exact services and controllers outlined above."
