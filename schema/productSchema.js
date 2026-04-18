const productSchema = `
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2),
  stock DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit_type VARCHAR(10) CHECK (unit_type IN ('kg', 'packet', 'item')) NOT NULL,
  min_stock_alert DECIMAL(10,2) DEFAULT 0,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

module.exports = productSchema;