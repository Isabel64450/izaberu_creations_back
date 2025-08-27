import ProductService from './products.service.js';

class ProductController {
  constructor(productService){this.productService=productService}
  
  async create(req, res) {
    try {
      const productId = await this.productService.createProduct(req.body);
      res.status(201).json({ message: "Produit créé", productId });
    } catch (error) {
      console.error("Erreur création produit:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
async addImages(req, res) {
  try {
     
    
    const productId = req.params.id;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Aucune image reçue" });
    }

    const imageUrls = files.map(file => file.path); 

    await this.productService.addImages(productId, imageUrls);

    res.status(200).json({ message: "Images ajoutées avec succès" });
  } catch (error) {
    console.error("Erreur addImages (backend) :", error);
    res.status(500).json({ message: "Erreur serveur lors de l'ajout d'images" });
  }
}
  async getAll(req, res) {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des produits" });
  }
}

  async getById(req, res) {
    try {
      const product = await this.productService.getProductById(req.params.productId);
      if (!product) return res.status(404).json({ message: "Produit introuvable" });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
}

export default  ProductController;