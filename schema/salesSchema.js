const orderSchema = `
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id),
  total_price DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(20) DEFAULT 'cash',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const orderItemSchema = `
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity DECIMAL(10,2) NOT NULL,
  price_at_sale DECIMAL(10,2) NOT NULL,
  unit_type VARCHAR(10) NOT NULL
);
`;

module.exports = {
  orderSchema,
  orderItemSchema,
};
