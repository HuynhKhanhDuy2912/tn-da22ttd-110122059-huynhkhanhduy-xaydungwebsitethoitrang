import User from "../models/User.js";
import { createCrudControllers } from "./base.controller.js";

export default createCrudControllers(User, {
  modelName: "User"
});
