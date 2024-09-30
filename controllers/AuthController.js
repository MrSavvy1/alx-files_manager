const sha1 = require('sha1');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

class AuthController {
  static async getConnect(req, res) {
    const authorization = req.headers.authorization || '';
    const encodedCreds = authorization.split(' ')[1];

    if (!encodedCreds) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decodedCreds = Buffer.from(encodedCreds, 'base64').toString('utf8');
    const [email, password] = decodedCreds.split(':');
    const hashedPassword = sha1(password);

    const user = await dbClient.findUserByEmail(email);
    if (!user || user.password !== hashedPassword) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    await redisClient.set(`auth_${token}`, user._id.toString(), 86400);

    res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await redisClient.del(`auth_${token}`);
    return res.status(204).send();
  }
}

module.exports = AuthController;
