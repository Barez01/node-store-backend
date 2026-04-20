const express = require("express");
const {getProducts, addProduct, updateProduct, deleteProduct} = require("../controllers/productControllers");
const router = express.Router();

router.get("/products", getProducts);
router.post("/products", addProduct);
router.put("/products", updateProduct);
router.delete("/products", deleteProduct);

module.exports = router;