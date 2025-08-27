import { Router } from 'express';
import authentificationToken from '../middlewares/midd.authenticate.js';

export function orderRouter(orderController) {
  const router = Router();

  router.post('/', authentificationToken,(req, res) => orderController.createOrder(req, res));
  router.get('/', (req, res) => orderController.getAllOrders(req, res));
  router.get('/:id', (req, res) => orderController.getOrderById(req, res));
  router.put('/:id', (req, res) => orderController.updateOrderById(req, res));
  router.delete('/:id', (req, res) => orderController.deleteOrderById(req, res));

  return router;
}