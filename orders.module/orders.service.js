

class OrderService {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async createOrderForUser(customerId, orderIdFromFrontend) {
  const newOrder = {
    order_id: orderIdFromFrontend,
    customer_id: customerId,
    order_status: 'pending',
    order_purchase_timestamp: new Date(),
    order_approved_at: null,
    order_delivered_carrier_date: null,
    order_delivered_customer_date: null,
    order_estimated_delivery_date: null,
  };

  return await this.orderRepository.insertOrder(newOrder);
}

  async getAllOrders() {
    return await this.repository.getAllOrders();
  }

  
  async getOrderById(id) {
    const order = await this.repository.getOrderById(id);
    if (!order) {
      throw new Error("Commande introuvable.");
    }
    return order;
  }

  
  async updateOrderById(id, updateData) {
    
    const updatedOrder = await this.repository.updateOrderById(id, updateData);
    if (!updatedOrder) {
      throw new Error("Échec de la mise à jour. Commande introuvable.");
    }
    return updatedOrder;
  }

  
  async deleteOrderById(id) {
    const deleted = await this.repository.deleteOrderById(id);
    if (!deleted) {
      throw new Error("Commande à supprimer introuvable.");
    }
    return deleted;
  }
}


export default  OrderService;