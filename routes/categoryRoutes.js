const express = require("express");
const {getCategories, addCategory, updateCategory, deleteCategory} = require("../controllers/categoryControllers");
const router = express.Router();

router.get("/categories", getCategories);
router.post("/categories", addCategory);
router.put("/categories", updateCategory);
router.delete("/categories", deleteCategory);

module.exports = router;