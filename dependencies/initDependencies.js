import UserRepository from '../user.module/user.repository.js';
import UserService from '../user.module/users.service.js';
import UserController from '../user.module/users.controller.js';

import ProductRepository from '../products.module/products.repository.js';
import ProductService from '../products.module/products.service.js';
import ProductController from '../products.module/products.controller.js';

 import OrderRepository from '../orders.module/orders.repository.js';
import OrderService from '../orders.module/orders.service.js';
 import OrderController from '../orders.module/orders.controller.js'; 

import AddressRepository from '../address.module/address.repository.js';
import CartRepository from '../cart.module/cart.repository.js';
import CartService from '../cart.module/carts.services.js';
import CartController from '../cart.module/carts.controller.js';

export function initDependencies(pool) {
  const orderRepository = new OrderRepository(pool);
  const orderService = new OrderService(orderRepository); 
   const orderController = new OrderController(orderService); 
const addressRepository = new AddressRepository(pool)
  





  const userRepository = new UserRepository(pool);
  const userService = new UserService(userRepository,addressRepository,orderService);
  const userController = new UserController(userService);

  
  const productRepository = new ProductRepository(pool);
  const productService = new ProductService(productRepository);
  const productController = new ProductController(productService);



const cartRepository = new CartRepository(pool)
const cartService= new CartService(cartRepository,productService)
const cartController = new CartController(cartService)
  
  
  return {
    userController,
    productController,
   orderController,
   cartController 
  };
}