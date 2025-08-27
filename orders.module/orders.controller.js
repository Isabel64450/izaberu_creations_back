

class OrderController {
  constructor(orderService) {
    this.orderService = orderService;}
  
  async createOrder(req, res) {
  try {
    const user = req.user;
    const { orderId } = req.body;

    if (!user || !user.id) {
      return res.status(401).json({ message: 'Authentification requise.' });
    }
    if (!orderId) {
      return res.status(400).json({ message: 'orderId est requis.' });
    }

    const order = await this.orderService.createOrderForUser(user.id, orderId);

    return res.status(201).json({
      message: 'Commande créée avec succès',
      order,
    });
  } catch (error) {
    console.error('Erreur création commande :', error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}

  async getAllOrders(req, res) {
    try {
      const orders = await this.orderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

 
  async getOrderById(req, res) {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      res.status(200).json(order);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

 
  async updateOrderById(req, res) {
    try {
      const updated = await this.orderService.updateOrderById(req.params.id, req.body);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  
  async deleteOrderById(req, res) {
    try {
      const deleted = await this.orderService.deleteOrderById(req.params.id);
      res.status(200).json({ message: "Commande supprimée.", deleted });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

export default  OrderController;
