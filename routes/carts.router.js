import { Router } from 'express';

export function cartRouter(cartController) {
  const router = Router();

  router.post('/', (req, res) => cartController.addToCart(req, res));
router.get('/:cartId', (req, res) => cartController.getCart(req, res));
router.delete('/item/:itemId', (req, res) => cartController.deleteCartItem(req, res));
router.get('/:cartId/count',(req,res)=> cartController.getCartItemCount(req,res));
router.put('/:itemId/quantity',(req,res)=> cartController.updateQuantity(req,res));
  return router;
}