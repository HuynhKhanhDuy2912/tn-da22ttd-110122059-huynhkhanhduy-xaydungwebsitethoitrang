import { createCrudRouter } from "./base.route.js";
import productController from "../controllers/product.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

export default createCrudRouter(productController, {
  createMiddlewares: [protect, authorize("admin")],
  updateMiddlewares: [protect, authorize("admin")],
  deleteMiddlewares: [protect, authorize("admin")]
});
