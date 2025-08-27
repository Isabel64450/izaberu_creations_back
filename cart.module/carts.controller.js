


class CartController {
  constructor(cartService){
    this.cartService = cartService
  }
  async addToCart(req, res) {
    try {
      const cartItem =req.body;
       if (!cartItem.cart_id || !cartItem.product_id || !cartItem.unit_price) {
      return res.status(400).json({ message: "Champs obligatoires manquants." });
    }
       const result= await this.cartService.addItem(cartItem);
      res.status(201).json(result);
    } catch (err) {
      console.error("Erreur controller :", err);
      res.status(400).json({ message: err.message });
    }
  }

async getCart(req, res) {
    try {
      const cartId = req.params.cartId;
      const items = await this.cartService.getCartItems(cartId);
      res.json(items);
    } catch (err) {
      console.error("Erreur récupération panier :", err);
      res.status(400).json({ message: err.message });
    }
  }

  async deleteCartItem(req, res) {
    try {
      const itemId = req.params.itemId;
      await this.cartService.removeItem(itemId);
      res.json({ message: "Item supprimé" });
    } catch (err) {
      console.error("Erreur suppression item panier :", err);
      res.status(400).json({ message: err.message });
    }
  }

async getCartItemCount(req, res) {
    try {
      const { cartId } = req.params;
      if (!cartId) {
        return res.status(400).json({ message: "cartId manquant." });
      }

      const count = await this.cartService.getItemCount(cartId);
      res.status(200).json({ cartId, itemCount: count });
    } catch (error) {
      console.error("Erreur getCartItemCount:", error);
      res.status(500).json({ message: error.message });
    }
  }

async updateQuantity(req, res) {
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    await this.cartService.updateItemQuantity(itemId, quantity);
    res.status(200).json({ message: "Quantité mise à jour avec succès" });
  } catch (error) {
    console.error("Erreur mise à jour quantité :", error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour de la quantité" });
  }
}












}

export default CartController;