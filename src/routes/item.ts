import express from "express"
import { 
    createItem,
    getItems,
    getItemById,
    updateItembyId,
    deleteItembyId
} from "../controllers/item.js"
import { validate } from "../middlewares/validate.js"
import { authenticate } from "../middlewares/authenticate.js"

import { createItemSchema, getItemsSchema, updateItemSchema, itemParamsSchema } from "../schemas/item.js"

const itemRouter = express.Router();

itemRouter.post("/", authenticate, validate({ body: createItemSchema }), createItem);
itemRouter.get("/", authenticate, validate({ query: getItemsSchema }), getItems);
itemRouter.get("/:id", authenticate, validate({ params: itemParamsSchema }), getItemById);
itemRouter.put("/:id", authenticate, validate({ body: updateItemSchema, params: itemParamsSchema }), updateItembyId);
itemRouter.delete("/:id", authenticate, validate({ params: itemParamsSchema }), deleteItembyId);

export { itemRouter };