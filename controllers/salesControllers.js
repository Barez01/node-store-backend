const {
  returnRecords,
  createTable,
  insertRecord,
  updateRecord,
  deleteRecord,
} = require("../utils/sqlFunctions");
const verifyUserToken = require("../utils/verifyUserToken");
const checkRole = require("../utils/checkRole");
const { orderSchema, orderItemSchema } = require("../schema/salesSchema");

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

    await createTable(orderSchema);

    const orders = await returnRecords("orders");
    return res.status(200).json({ orders: orders != null ? orders : [] });
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

    await createTable(orderItemSchema);

    const orderId = req.orderId;

    const orderItems = await returnRecords(
      "order_items",
      "WHERE order_id = ?",
      [orderId],
    );
    return res
      .status(200)
      .json({ orderItems: orderItems != null ? orderItems : [] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addOrder = async (req, res) => {
  try {
    const accessToken = req.headers.authorization;
    const requester = await verifyUserToken(accessToken);

    if (!requester.success) {
      return res.status(401).json({ error: requester.error });
    }

    const { paymentMethod, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    await createTable(orderSchema);
    await createTable(orderItemSchema);

    let totalPrice = 0;

    for (const item of items) {
      totalPrice += item.quantity * item.price;
    }

    const orderResult = await insertRecord("orders", {
      user_id: requester.id,
      total_price: totalPrice,
      payment_method: paymentMethod,
    });

    const orderId = orderResult.insertId; // CHECK THIS IN CASE OF ERROR!

    for (const item of items) {
      const product = await returnRecords("products", "WHERE id = ?", [
        item.productId,
      ]);

      if (!product || product.length === 0) {
        return res.status(404).json({
          message: `Product ${item.productId} not found`,
        });
      }

      const currentStock = product[0].stock;

      if (currentStock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for product ${item.productId}`,
        });
      }

      await insertRecord("order_items", {
        order_id: orderId,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_sale: item.price,
        unit_type: item.unitType,
      });

      await updateRecord(
        "products",
        {
          stock: currentStock - item.quantity,
        },
        "WHERE id = ?",
        [item.productId],
      );
    }

    return res.status(200).json({
      message: "Order created successfully",
      orderId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  getOrderItems,
  addOrder,
};
