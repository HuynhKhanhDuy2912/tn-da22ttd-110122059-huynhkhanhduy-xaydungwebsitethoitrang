import { createCrudRouter } from "./base.route.js";
import productVariantController from "../controllers/productVariant.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

export default createCrudRouter(productVariantController, {
  createMiddlewares: [protect, authorize("admin")],
  updateMiddlewares: [protect, authorize("admin")],
  deleteMiddlewares: [protect, authorize("admin")]
});
