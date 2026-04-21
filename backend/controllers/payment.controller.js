import Payment from "../models/Payment.js";
import { createCrudControllers } from "./base.controller.js";

export default createCrudControllers(Payment, {
  modelName: "Payment",
  populate: [
    { path: "orderId", select: "status totalPrice" },
    { path: "userId", select: "username email" }
  ]
});
