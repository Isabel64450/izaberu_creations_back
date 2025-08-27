
import ProductRepository from './products.repository.js';
import CategoryService from '../cart.module/carts.services.js'; 

class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }


  async createProduct(data) {
    const {
      name,
      price,
      description,
      weight,
      length,
      height,
      width,
      category,
      quantity,
      imageUrls=[]
    } = data;

    const imageCount = imageUrls.length;

    const productId = await this.productRepository.create({
      name,
      price,
      description,
      weight,
      length,
      height,
      width,
      category,
      quantity,
      imageCount
    });
    const disponibility = quantity > 0 ? 1 : 0;
  await this.productRepository.createWarehouseEntry(productId, quantity, disponibility);
if(imageUrls.length > 0){
    await this.productRepository.addImages(productId, imageUrls);
}
    return productId;
  }
async addImages(productId, imageUrls) {
  if (!Array.isArray(imageUrls)) {
    throw new Error("imageUrls doit être un tableau");
  }

  return this.productRepository.addImages(productId, imageUrls);
}
  async getAllProducts() {
    return await this.productRepository.findAll();
  }

  async getProductById(id) {
    return await this.productRepository.findById(id);
  }

async getWarehouseStock(productId) {
  if (!productId) {
    throw new Error("ID du produit manquant");
  }

  const stock = await this.productRepository.getWarehouseStock(productId);

  if (!stock) {
    throw new Error("Aucune donnée de stock trouvée pour ce produit");
  }

  return stock;
}






}


export default  ProductService;