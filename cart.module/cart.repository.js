

class CartRepository {
  constructor(pool){this.pool=pool}
  async insertCartItem (item) {
    const addedAtFormatted = new Date(item.added_at).toISOString().slice(0, 19).replace('T', ' ');
    const rows = `
    INSERT INTO cart
    (cart_id, cart_item_ref, product_id, unit_price, shipping_fee, added_at, customer_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    item.cart_id,
    item.cart_item_ref,
    item.product_id,
    item.unit_price,
    item.shipping_fee,
    
    addedAtFormatted,
    item.customer_id || null
  ];

  const [result] = await this.pool.query(rows, values);
  return { id: result.insertId, ...item };
  }

async findItemsByCartId(cartId) {
  const [rows] = await this.pool.query(
     `SELECT 
        c.product_id,
        p.product_category_name AS product_name,
        SUM(c.quantity) AS quantity,
        c.unit_price,
        c.shipping_fee,
        MIN(c.cart_item_id) AS cart_item_id, -- pour un identifiant unique
        MIN(c.cart_item_ref) AS cart_item_ref,
        (SELECT image_url 
         FROM product_images 
         WHERE product_id = p.product_id 
         ORDER BY display_order ASC 
         LIMIT 1) AS image
     FROM cart c
     JOIN products p ON c.product_id = p.product_id
     WHERE c.cart_id = ?
     GROUP BY c.product_id, p.product_category_name, c.unit_price, c.shipping_fee`,
    [cartId]
  );
  return rows;
}

  async deleteItemById(itemId) {
    const [result] = await this.pool.query(
      `DELETE FROM cart WHERE cart_item_id = ?`,
      [itemId]
    );
    return result.affectedRows > 0;
  }

  async countItems(cartId) {
    const query = `
      SELECT COUNT(*) as count
      FROM cart
      WHERE cart_id = ?
    `;
    const [[result]] = await this.pool.query(query, [cartId]);
    return result.count || 0;
  }


async updateItemQuantity(itemId, quantity) {
  await this.pool.query(
    `UPDATE cart SET quantity = ? WHERE cart_item_id = ?`,
    [quantity, itemId]
  );
}


async findItemById(itemId) {
  const [rows] = await this.pool.query(
    `SELECT * FROM cart WHERE cart_item_id = ?`,
    [itemId]
  );
  return rows[0];
}







  
}

export default  CartRepository;