class AddressRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async createAddress(addressData) {
    const { number,street,complement, city, postalCode, type = 'main' } = addressData;

    try {
      const [result] = await this.pool.query(
        `INSERT INTO addresses (number, street,complement, city, postal_code, type)
         VALUES (?, ?, ?,?,?,?)`,
        [number,street,complement, city, postalCode, type]
      );

      return result.insertId; 
    } catch (err) {
      console.error('Erreur lors de la création de l’adresse :', err.message);
      throw new Error('Erreur adresse');
    }
  }
}








export default AddressRepository