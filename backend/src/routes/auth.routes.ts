import { Router } from "express"
import { createUser, loginUser } from "../controllers/authControllers";
const authRouter = Router();


authRouter.post('/auth', loginUser);

authRouter.post('/signup', createUser)

export default authRouter;