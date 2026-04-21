import { createCrudRouter } from "./base.route.js";
import searchHistoryController from "../controllers/searchHistory.controller.js";
import SearchHistory from "../models/SearchHistory.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  attachOwner,
  checkOwnership,
  scopeToOwner
} from "../middlewares/ownership.middleware.js";

export default createCrudRouter(searchHistoryController, {
  listMiddlewares: [protect, scopeToOwner("userId")],
  getMiddlewares: [protect, checkOwnership(SearchHistory, "userId")],
  createMiddlewares: [protect, attachOwner("userId")],
  updateMiddlewares: [protect, checkOwnership(SearchHistory, "userId"), attachOwner("userId")],
  deleteMiddlewares: [protect, checkOwnership(SearchHistory, "userId")]
});
