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

const getOrders = async (req, res) => {
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

    await createTable(categorySchema);

    const orders = await returnRecords("orders");
    return res
      .status(200)
      .json({ orders: orders != null ? orders : [] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getOrderItems = async (req, res) => {
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

    await createTable(categorySchema);

    const orderId = req.orderId;

    const orderItems = await returnRecords("order_items", "WHERE order_id = ?", [orderId]);
    return res
      .status(200)
      .json({ orderItems: orderItems != null ? orderItems : [] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addCategory = async (req, res) => {
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

    const { name, description } = req.body;

    await createTable(categorySchema);

    await insertRecord("categories", {
      name: name,
      description: description,
    });
    return res.status(200).json({ message: "Category added" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
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

    const { id, name, description } = req.body;

    await createTable(categorySchema);

    await updateRecord(
      "categories",
      {
        name: name,
        description: description,
      },
      `WHERE id = ?`,
      [id],
    );
    return res.status(200).json({ message: "Category updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
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

    await createTable(categorySchema);

    await deleteRecord("categories", `WHERE id = ?`, [id]);
    return res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
