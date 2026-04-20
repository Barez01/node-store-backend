const {
  returnRecords,
  createTable,
  insertRecord,
  updateRecord,
  deleteRecord,
} = require("../utils/sqlFunctions");
const verifyUserToken = require("../utils/verifyUserToken");
const checkRole = require("../utils/checkRole");
const productSchema = require("../schema/productSchema");

const getProducts = async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const requester = await verifyUserToken(accessToken);

    if (!requester.success) {
      return res.status(401).json({ error: requester.error });
    }

    await createTable(productSchema);

    const products = await returnRecords("products");
    return res
      .status(200)
      .json({ products: products != null ? products : [] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const requester = await verifyUserToken(accessToken);

    if (!requester.success) {
      return res.status(401).json({ error: requester.error });
    }

    const role = await checkRole(requester.id);

    if (!role.success) {
      return res.status(401).json({ error: role.error });
    }

    const { name, price, cost_price, stock, unit_type, min_stock_alert, category_id } = req.body;

    await createTable(productSchema);

    await insertRecord("products", {
      name: name,
      price: price,
      cost_price: cost_price,
      stock: stock,
      unit_type: unit_type,
      min_stock_alert: min_stock_alert,
      category_id: category_id,
    });
    return res.status(200).json({ message: "Product added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const requester = await verifyUserToken(accessToken);

    if (!requester.success) {
      return res.status(401).json({ error: requester.error });
    }

    const role = await checkRole(requester.id);

    if (!role.success) {
      return res.status(401).json({ error: role.error });
    }

    const { id, name, price, cost_price, stock, unit_type, min_stock_alert, category_id } = req.body;

    await createTable(productSchema);

    await updateRecord(
      "products",
      {
      name: name,
      price: price,
      cost_price: cost_price,
      stock: stock,
      unit_type: unit_type,
      min_stock_alert: min_stock_alert,
      category_id: category_id,
    },
      `WHERE id = ?`,
      [id],
    );
    return res.status(200).json({ message: "Product updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateStock = async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const requester = await verifyUserToken(accessToken);

    if (!requester.success) {
      return res.status(401).json({ error: requester.error });
    }

    const role = await checkRole(requester.id);

    if (!role.success) {
      return res.status(401).json({ error: role.error });
    }

    const { id, newStock, isSale } = req.body;

    const existingProduct = await returnRecords(
      "products",
      "WHERE id = ?",
      [id]
    );

    if (!existingProduct || existingProduct.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const currentStock = existingProduct[0].stock;

    const stock = isSale ? (currentStock - newStock) : (currentStock + newStock);

    await createTable(productSchema);

    await updateRecord(
      "products",
      {
      stock: stock,
    },
      `WHERE id = ?`,
      [id],
    );
    return res.status(200).json({ message: "Stock updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const requester = await verifyUserToken(accessToken);

    if (!requester.success) {
      return res.status(401).json({ error: requester.error });
    }

    const role = await checkRole(requester.id);

    if (!role.success) {
      return res.status(401).json({ error: role.error });
    }

    const { id } = req.body;

    await createTable(productSchema);

    await deleteRecord("products", `WHERE id = ?`, [id]);
    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  updateStock,
  deleteProduct
};
