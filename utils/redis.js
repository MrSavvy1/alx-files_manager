const { createClient } = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => console.log('Redis Client Error', err));
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const redisGet = promisify(this.client.get).bind(this.client);
    return redisGet(key);
  }

  async set(key, value, time) {
    const redisSet = promisify(this.client.set).bind(this.client);
    await redisSet(key, value);
    await this.client.expire(key, time);
  }

  async del(key) {
    const redisDel = promisify(this.client.del).bind(this.client);
    return redisDel(key);
  }
}

module.exports = new RedisClient();
