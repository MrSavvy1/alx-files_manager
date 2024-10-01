import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';

// Get user information based on token
export const getMe = async (req, res) => {
  const token = req.headers['x-token'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Get the user ID from Redis using the token
  const userId = await redisClient.get(`auth_${token}`);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Find the user by ID in the database
    const user = await dbClient.db.collection('users').findOne({ _id: dbClient.ObjectId(userId) });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Return the user's email and ID
    return res.status(200).json({ id: user._id, email: user.email });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
