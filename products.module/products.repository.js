

class ProductRepository {
  constructor(pool){
    this.pool = pool
  }
  async create(productData) {
    const [result] = await this.pool.query(`
      INSERT INTO products (
        product_category_name,
        product_photos_qty,
        product_weight_g,
        product_lenght_cm,
        product_height_cm,
        product_width_cm,
        category,
        price,
        description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
    `, [
      productData.name,
      productData.imageCount,
      productData.weight,
      productData.length,
      productData.height,
      productData.width,
      productData.category,
      productData.price,
      productData.description
    ]);
    return result.insertId;
  }

  async addImages(productId, imageUrls) {
    const values = imageUrls.map((url, idx) => [productId, url, idx + 1]);
    
    await this.pool.query(`
      INSERT INTO product_images (product_id, image_url, display_order)
      VALUES ?
    `, [values]);
  }

  
async createWarehouseEntry(productId, quantity, disponibility) {
  await this.pool.query(`
    INSERT INTO warehouse (product_id, quantity, disponibility)
    VALUES (?, ?, ?)
  `, [productId, quantity, disponibility]);
}


async getWarehouseStock(productId) {
  const [rows] = await this.pool.query(
    `SELECT quantity FROM warehouse WHERE product_id = ?`,
    [productId]
  );
  return rows[0];
}









async findAll() {
  const [rows] = await this.pool.query(`
    SELECT p.*, GROUP_CONCAT(pi.image_url ORDER BY pi.display_order) AS images
    FROM products p
    LEFT JOIN product_images pi ON p.product_id = pi.product_id
    GROUP BY p.product_id
    ORDER BY p.product_id DESC
  `);
  return rows.map(product => ({
    ...product,
    images: product.images ? product.images.split(',') : []
  }));
}





  async findById(productId) {
    const [[product]] = await this.pool.query("SELECT * FROM products WHERE product_id = ?", [productId]);
    const [imagesRows] = await this.pool.query("SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC", [productId]);
    const imageUrls = imagesRows.map(img => img.image_url);
    return { ...product, images:imageUrls };
  }
};


export default  ProductRepository;