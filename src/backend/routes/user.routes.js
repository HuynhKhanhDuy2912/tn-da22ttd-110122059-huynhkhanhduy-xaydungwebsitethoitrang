import { createCrudRouter } from "./base.route.js";
import userController from "../controllers/user.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

export default createCrudRouter(userController, {
  listMiddlewares: [protect, authorize("admin")],
  getMiddlewares: [protect, authorize("admin")],
  createMiddlewares: [protect, authorize("admin")],
  updateMiddlewares: [protect, authorize("admin")],
  deleteMiddlewares: [protect, authorize("admin")]
});
