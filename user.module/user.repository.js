import argon2 from 'argon2';
class UserRepository{
    constructor(pool){
        this.pool=pool
    }
async createUser(userData) {
  const { customer_id, userName, userLastName, userEmail, adress_delivery, password } = userData;

  try {
    const [result] = await this.pool.query(
      `INSERT INTO users (customer_id, userName, userLastName, userEmail, adress_delivery, password)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [customer_id, userName, userLastName, userEmail, adress_delivery, password]
    );

    return result.insertId;

  } catch (err) {
    console.error('Erreur dans UserRepository.createUser :', err.message);
    throw new Error("Erreur lors de l'insertion de l'utilisateur");
  }
}
async getUserByEmail(email) {
  try {
    const [rows] = await this.pool.query(
      "SELECT * FROM users WHERE userEmail = ?",
      [email]
    );
    return rows[0] || null; 
  } catch (err) {
    console.error("Erreur dans UserRepository.getUserByEmail :", err.message);
    throw new Error("Erreur lors de la récupération de l'utilisateur par email");
  }
}
async getUserById(userId) {
  console.log("ID reçu dans le repository:", userId); 
  try {
    console.log("Recherche user avec l'ID =", userId);
    const [rows] = await this.pool.query(
      'SELECT * FROM users WHERE customer_id = ? LIMIT 1',
      [userId]
    );
    return rows[0] || null;
  } catch (err) {
    console.error("Erreur dans getUserById :", err.message);
    throw new Error("Erreur lors de la récupération de l'utilisateur");
  }
}
async markUserAsVerified(userId) {
  try {
    const sql = `UPDATE users SET isVerified = 1 WHERE customer_id = ?`;
    const [result] = await this.pool.query(sql, [userId]);

    if (result.affectedRows === 0) {
      throw new Error('Aucun utilisateur trouvé avec cet ID');
    }

    return result;
  } catch (error) {
    console.error('Erreur dans markUserAsVerified:', error.message);
    throw new Error('Erreur lors de la mise à jour de la vérification');
  }
}
async savePasswordResetToken(userId, token) {
  try {
    const expireTime = new Date(Date.now() + 3600000); 
    await this.pool.query(
      `UPDATE users SET resetPasswordToken = ?, resetPasswordExpire = ? WHERE customer_id = ?`,
      [token, expireTime, userId]
    );
  } catch (err) {
    console.error("Erreur savePasswordResetToken :", err.message);
    throw new Error("Impossible d'enregistrer le token de réinitialisation");
  }
}

async getUserByResetToken(token) {
  try {
    const [rows] = await this.pool.query(
      `SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpire > NOW()`,
      [token]
    );
    return rows[0] || null;
  } catch (err) {
    console.error("Erreur getUserByResetToken :", err.message);
    throw new Error("Erreur lors de la récupération par token");
  }
}

async updateUserPassword(userId, newPassword) {
  const hashedPassword = await argon2.hash(newPassword);
  await this.pool.query(
    `UPDATE users 
     SET password = ?, resetPasswordToken = NULL, resetPasswordExpire = NULL 
     WHERE customer_id = ?`,
    [hashedPassword, userId]
  );
}


}
 export default  UserRepository