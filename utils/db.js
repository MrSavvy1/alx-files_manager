const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const url = process.env.DB_HOST || 'mongodb://localhost:27017';
    const dbName = process.env.DB_NAME || 'files_manager';
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect().then(() => {
      this.db = this.client.db(dbName);
    });
  }

  async isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }

  async findUserByEmail(email) {
    return this.db.collection('users').findOne({ email });
  }

  async createUser(email, password) {
    const result = await this.db.collection('users').insertOne({ email, password });
    return result.ops[0];
  }
}

module.exports = new DBClient();
