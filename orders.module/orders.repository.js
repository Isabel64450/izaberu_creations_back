

class OrderRepository {
  constructor(pool){
    this.pool = pool
  }
  async insertOrder(order) {
    const sql = `
      INSERT INTO orders (
        order_id,
        customer_id,
        order_status,
        order_purchase_timestamp,
        order_approved_at,
        order_delivered_carrier_date,
        order_delivered_customer_date,
        order_estimated_delivery_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      order.order_id,
      order.customer_id,
      order.order_status,
      order.order_purchase_timestamp,
      order.order_approved_at,
      order.order_delivered_carrier_date,
      order.order_delivered_customer_date,
      order.order_estimated_delivery_date,
    ];

    
    const [result] = await this.pool.query(sql, values);

    return {
      index_id: result.insertId, 
      ...order,
    };
  }

}

export default  OrderRepository;