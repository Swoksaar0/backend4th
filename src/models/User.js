const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const { getDB } = require('../config/database');

class User {
  static collectionName = 'users';

  static async create(userData) {
    const db = getDB();
    const { username, email, password, role = 'user' } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_ROUNDS) || 10
    );

    const newUser = {
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection(this.collectionName).insertOne(newUser);
    
    return {
      _id: result.insertedId,
      username,
      email: email.toLowerCase(),
      role,
      createdAt: newUser.createdAt
    };
  }

  static async findByEmail(email) {
    const db = getDB();
    return await db.collection(this.collectionName).findOne({ 
      email: email.toLowerCase() 
    });
  }

  static async findByUsername(username) {
    const db = getDB();
    return await db.collection(this.collectionName).findOne({ username });
  }

  static async findById(id) {
    const db = getDB();
    if (!ObjectId.isValid(id)) {
      return null;
    }
    return await db.collection(this.collectionName).findOne({ 
      _id: new ObjectId(id) 
    });
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateLastLogin(userId) {
    const db = getDB();
    await db.collection(this.collectionName).updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          lastLogin: new Date(),
          updatedAt: new Date()
        } 
      }
    );
  }

  static sanitizeUser(user) {
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = User;
