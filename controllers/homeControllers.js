const {
  returnRecords,
  createTable,
  insertRecord,
  updateRecord,
  deleteRecord,
} = require("../utils/sqlFunctions");
const verifyUserToken = require("../utils/verifyUserToken");
const checkRole = require("../utils/checkRole");
const categorySchema = require("../schema/categorySchema");

const mysql = require("mysql");
const config = require("../db/config");
const pool = mysql.createPool(config);

const getOverview = async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const requester = await verifyUserToken(accessToken);

    if (!requester.success) {
      return res.status(401).json({ error: requester.error });
    }

    // 💰 total sales
    const [totalSalesResult] = await pool
      .promise()
      .query("SELECT SUM(total_price) AS totalSales FROM orders");

    const totalSales = totalSalesResult[0]?.totalSales || 0;

    // 📦 total products
    const [productsResult] = await pool
      .promise()
      .query("SELECT COUNT(*) AS totalProducts FROM products");

    const totalProducts = productsResult[0].totalProducts;

    // 🗂️ total categories
    const [categoriesResult] = await pool
      .promise()
      .query("SELECT COUNT(*) AS totalCategories FROM categories");

    const totalCategories = categoriesResult[0].totalCategories;

    // ⚠️ low stock
    const [lowStockProducts] = await pool
      .promise()
      .query("SELECT * FROM products WHERE stock <= min_stock_alert");

    // 📊 sales trend (6 months)
    const [salesTrend] = await pool.promise().query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
      SUM(total_price) AS total
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `);

    // 💰 profit trend
    const [profitTrend] = await pool.promise().query(`
      SELECT 
        DATE_FORMAT(o.created_at, '%Y-%m') AS month,
        SUM((oi.price_at_sale - p.cost_price) * oi.quantity) AS profit
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `);

    // 💸 today's sales
    const [todaySalesResult] = await pool.promise().query(`
  SELECT SUM(total_price) as todaySales
  FROM orders
  WHERE DATE(created_at) = CURDATE()
`);

    const todaySales = todaySalesResult[0]?.todaySales || 0;

    // 🥇 top selling products
    const [topProducts] = await pool.promise().query(`
  SELECT 
    p.id,
    p.name,
    SUM(oi.quantity) as totalSold
  FROM order_items oi
  JOIN products p ON oi.product_id = p.id
  GROUP BY p.id
  ORDER BY totalSold DESC
  LIMIT 5
`);

    return res.status(200).json({
      totalSales,
      todaySales,
      totalProducts,
      totalCategories,
      lowStockProducts,
      salesTrend,
      profitTrend,
      topSellingProducts: topProducts,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOverview,
};
