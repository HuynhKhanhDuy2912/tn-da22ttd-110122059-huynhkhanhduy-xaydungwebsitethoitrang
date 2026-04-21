import { createCrudRouter } from "./base.route.js";
import outfitController from "../controllers/outfit.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

export default createCrudRouter(outfitController, {
  createMiddlewares: [protect, authorize("admin")],
  updateMiddlewares: [protect, authorize("admin")],
  deleteMiddlewares: [protect, authorize("admin")]
});
