

class CartService {
  constructor(cartRepository, productService) {
    this.cartRepository = cartRepository;
this.productService=productService

  }

  async addItem(itemData) {
 
    const existingProduct = await this.productService.getProductById(itemData.product_id);
    
    if (!existingProduct) {
      throw new Error("Produit introuvable.");
    }

    return this.cartRepository.insertCartItem(itemData);
  }

async getCartItems(cartId) {
    if (!cartId) throw new Error("Cart ID is required");
    return await this.cartRepository.findItemsByCartId(cartId);
  }

  async removeItem(itemId) {
    if (!itemId) throw new Error("Item ID is required");
    const deleted = await this.cartRepository.deleteItemById(itemId);
    if (!deleted) throw new Error("Item not found or already deleted");
    return deleted;
  }

async getItemCount(cartId) {
    if (!cartId) throw new Error("cartId est requis");
    const count = await this.cartRepository.countItems(cartId);
    return count;
  }

async updateItemQuantity(itemId, quantity) {
  if (quantity < 1) {
    
    const deleted = await this.cartRepository.deleteItemById(itemId);
    if (!deleted) {
      throw new Error("Article introuvable ou déjà supprimé");
    }
    return; 
  }

  
  const item = await this.cartRepository.findItemById(itemId);
  if (!item) {
    throw new Error("Article introuvable");
  }

  const productId = item.product_id;

  
  const stock = await this.productService.getWarehouseStock(productId);

  if (!stock || stock.quantity < quantity) {
    throw new Error(`Stock insuffisant. Stock actuel : ${stock?.quantity || 0}`);
  }

  
  await this.cartRepository.updateItemQuantity(itemId, quantity);
}



  
}

export default  CartService;