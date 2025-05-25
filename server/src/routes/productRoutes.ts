import { Router } from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById,
} from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct); // <== EDIT product
router.delete("/:id", deleteProduct);

export default router;
