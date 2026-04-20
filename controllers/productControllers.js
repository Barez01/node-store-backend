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

    await createTable(productSchema);

    await insertRecord("products", {
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

    await createTable(productSchema);

    await updateRecord(
      "products",
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

    await createTable(productSchema);

    await deleteRecord("products", `WHERE id = ?`, [id]);
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
