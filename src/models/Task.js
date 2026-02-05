const { ObjectId } = require('mongodb');
const { getDB } = require('../config/database');

class Task {
  static collectionName = 'tasks';

  static async create(taskData) {
    const db = getDB();
    const { title, description, userId, status = 'pending' } = taskData;

    const newTask = {
      title,
      description,
      status,
      userId: new ObjectId(userId),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection(this.collectionName).insertOne(newTask);
    
    return {
      _id: result.insertedId,
      ...newTask
    };
  }

  static async findAll(userId, filters = {}) {
    const db = getDB();
    const query = { userId: new ObjectId(userId) };

    // Add status filter if provided
    if (filters.status) {
      query.status = filters.status;
    }

    const tasks = await db.collection(this.collectionName)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return tasks;
  }

  static async findById(taskId) {
    const db = getDB();
    
    if (!ObjectId.isValid(taskId)) {
      return null;
    }

    return await db.collection(this.collectionName).findOne({ 
      _id: new ObjectId(taskId) 
    });
  }

  static async update(taskId, updateData) {
    const db = getDB();
    
    if (!ObjectId.isValid(taskId)) {
      return null;
    }

    const update = {
      ...updateData,
      updatedAt: new Date()
    };

    const result = await db.collection(this.collectionName).findOneAndUpdate(
      { _id: new ObjectId(taskId) },
      { $set: update },
      { returnDocument: 'after' }
    );

    return result;
  }

  static async updateStatus(taskId, status) {
    const db = getDB();
    
    if (!ObjectId.isValid(taskId)) {
      return null;
    }

    const result = await db.collection(this.collectionName).findOneAndUpdate(
      { _id: new ObjectId(taskId) },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        } 
      },
      { returnDocument: 'after' }
    );

    return result;
  }

  static async delete(taskId) {
    const db = getDB();
    
    if (!ObjectId.isValid(taskId)) {
      return null;
    }

    const result = await db.collection(this.collectionName).deleteOne({ 
      _id: new ObjectId(taskId) 
    });

    return result.deletedCount > 0;
  }

  static async isOwner(taskId, userId) {
    const task = await this.findById(taskId);
    
    if (!task) {
      return false;
    }

    return task.userId.toString() === userId.toString();
  }
}

module.exports = Task;
