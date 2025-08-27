import { Router } from "express";
import upload from "../config/multer.js";


export function productRouter(productController) {
  const router = Router();

  router.get("/", (req, res) => productController.getAll(req, res));
  router.get("/:productId", (req, res) => productController.getById(req, res));
  
  router.put("/:id", (req, res) => productController.update(req, res));
  router.delete("/:id", (req, res) => productController.delete(req, res));
  router.post("/", upload.array('images', 3), (req, res) => productController.create(req, res));
  router.post("/:id/images", upload.array('images', 5), (req, res) => productController.addImages(req, res));
  return router;
}