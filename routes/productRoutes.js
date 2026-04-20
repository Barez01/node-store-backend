const express = require("express");
const {getProducts, addProduct, updateProduct, deleteProduct, updateStock} = require("../controllers/productControllers");
const router = express.Router();

router.get("/products", getProducts);
router.post("/products", addProduct);
router.put("/products", updateProduct);
router.put("/products/update-stock", updateStock);
router.delete("/products", deleteProduct);

module.exports = router;