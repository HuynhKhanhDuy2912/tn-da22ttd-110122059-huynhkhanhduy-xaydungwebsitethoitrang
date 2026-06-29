import { createCrudRouter } from "./base.route.js";
import categoryController from "../controllers/category.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

export default createCrudRouter(categoryController, {
  createMiddlewares: [protect, authorize("admin")],
  updateMiddlewares: [protect, authorize("admin")],
  deleteMiddlewares: [protect, authorize("admin")]
});
