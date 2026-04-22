const { returnCustomRecords } = require("../utils/sqlFunctions");
const verifyUserToken = require("../utils/verifyUserToken");
const checkRole = require("../utils/checkRole");

const getOverview = async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const requester = await verifyUserToken(accessToken);

    if (!requester.success) {
      return res.status(401).json({ error: requester.error });
    }

    const totalSalesResult = await returnCustomRecords(
      "SELECT SUM(total_price) AS totalSales",
      "orders",
    );
    const totalSales = totalSalesResult?.[0]?.totalSales || 0;

    const productsResult = await returnCustomRecords(
      "SELECT COUNT(*) AS totalProducts",
      "products",
    );
    const totalProducts = productsResult?.[0]?.totalProducts || 0;

    const categoriesResult = await returnCustomRecords(
      "SELECT COUNT(*) AS totalCategories",
      "categories",
    );
    const totalCategories = categoriesResult?.[0]?.totalCategories || 0;

    const lowStockProducts = await returnCustomRecords(
      "SELECT *",
      "products",
      "WHERE stock <= min_stock_alert",
    );

    const salesTrend = await returnCustomRecords(
      "SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(total_price) AS total",
      "orders",
      "WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) GROUP BY month ORDER BY month ASC",
    );

    const profitTrend = await returnCustomRecords(`
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

    const todaySalesResult = await returnCustomRecords(
      "SELECT SUM(total_price) as todaySales",
      "orders",
      "WHERE DATE(created_at) = CURDATE()",
    );
    const todaySales = todaySalesResult?.[0]?.todaySales || 0;

    const topProducts = await returnCustomRecords(`
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
      totalProducts,
      totalCategories,
      todaySales,
      lowStockProducts: lowStockProducts || [],
      salesTrend: salesTrend || [],
      profitTrend: profitTrend || [],
      topSellingProducts: topProducts || [],
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOverview,
};
