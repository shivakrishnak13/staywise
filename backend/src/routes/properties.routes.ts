import { Router } from "express";
import { getAllProperties } from "../controllers/propertiesController";

const propertiesRouter = Router();

propertiesRouter.get('/', getAllProperties);

export default propertiesRouter;