import {Router} from "express";

import AuthToken from "../middlewares/midd.authenticate.js"
import validate from "../middlewares/midd.validate.js"
import registerUserSchema from "../validation.schemas/register.schema.js"
import loginUserSchema from "../validation.schemas/login.schema.js"
export function userRouter(userController){
const router = Router();
router.post("/register",validate(registerUserSchema), (req,res) => userController.registerUser(req,res));
router.get('/verify/:token',(req,res)=> userController.verifyEmail(req,res))
router.post('/login',validate(loginUserSchema),(req,res)=>userController.loginUser(req,res))
router.get('/me', AuthToken, (req, res) => userController.getCurrentUser(req, res));
router.get('/logout', (req, res) => userController.logoutUser(req, res));
router.post('/forgot-password', (req, res) => userController.requestPasswordReset(req, res));
router.post('/reset-password/:token', (req, res) => userController.resetPassword(req, res));
return router;

}




