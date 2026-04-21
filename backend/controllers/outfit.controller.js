import Outfit from "../models/Outfit.js";
import { createCrudControllers } from "./base.controller.js";

export default createCrudControllers(Outfit, {
  modelName: "Outfit",
  populate: [{ path: "products", select: "name price discount style" }]
});
