import express from "express";

export const createCrudRouter = (
  controller,
  {
    listMiddlewares = [],
    getMiddlewares = [],
    createMiddlewares = [],
    updateMiddlewares = [],
    deleteMiddlewares = []
  } = {}
) => {
  const router = express.Router();

  router.get("/", ...listMiddlewares, controller.list);
  router.get("/:id", ...getMiddlewares, controller.getById);
  router.post("/", ...createMiddlewares, controller.create);
  router.put("/:id", ...updateMiddlewares, controller.update);
  router.delete("/:id", ...deleteMiddlewares, controller.remove);

  return router;
};
