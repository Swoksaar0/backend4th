const { MongoClient } = require('mongodb');

let db = null;
let client = null;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/task_management';
    
    client = new MongoClient(mongoURI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    db = client.db();

    // Create indexes for better performance
    await createIndexes();

    console.log('✅ MongoDB connected successfully');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

const createIndexes = async () => {
  try {
    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ username: 1 }, { unique: true });

    // Tasks collection indexes
    await db.collection('tasks').createIndex({ userId: 1 });
    await db.collection('tasks').createIndex({ createdAt: -1 });
    await db.collection('tasks').createIndex({ status: 1 });

    console.log('✅ Database indexes created');
  } catch (error) {
    console.error('⚠️ Error creating indexes:', error.message);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
};

module.exports = {
  connectDB,
  getDB,
  closeDB
};
