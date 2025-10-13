import { Router } from "express"
import { createUser, getUserDetails, loginUser } from "../controllers/authControllers";
import { authenticate } from "../middlewares/authMiddleware";
const authRouter = Router();


authRouter.post('/auth', loginUser);

authRouter.post('/signup', createUser)

authRouter.get('/details', authenticate, getUserDetails);

export default authRouter;