import express from "express";

import {userRouter} from "./routes/user.routes.js";
 import {addressRouter} from "./routes/address.routes.js";
import {productRouter} from "./routes/products.router.js"
import{cartRouter}from "./routes/carts.router.js"


import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import getPool from "./services/mariadb.pool.js";
import { initDependencies } from "./dependencies/initDependencies.js";
import { orderRouter } from "./routes/orders.router.js";






dotenv.config();


const app = express();
app.use(cors({
  origin:`${process.env.CLIENT_FRONT}`, 
  credentials: true,            
}))

const pool = getPool();
app.use(express.json());
app.use(cookieParser())

const {userController, productController,addressController,cartController,orderController}=initDependencies(pool)



app.use("/users", userRouter(userController));

app.use('/cart', cartRouter(cartController)) 
app.use('/products', productRouter(productController))
app.use('/orders', orderRouter(orderController))

app.listen(CLIENT_URL, () => {
  console.log(`Server is running at ${CLIENT_URL}`);
});

