import { Router } from "express";
import { getAllProperties, getPropertyById } from "../controllers/propertiesController";

const propertiesRouter = Router();

propertiesRouter.get('/', getAllProperties);
propertiesRouter.get('/:id', getPropertyById);

export default propertiesRouter;