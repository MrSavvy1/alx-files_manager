import { ObjectId } from 'mongodb';
import dbClient from '../utils/db.js';
import sha1 from 'sha1';

export const postNew = async (req, res) => {
  const { email, password } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  // Check if password is provided
  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  }

  try {
    // Check if the user already exists
    const userExists = await dbClient.db.collection('users').findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password with SHA1
    const hashedPassword = sha1(password);

    // Create a new user object
    const newUser = {
      email,
      password: hashedPassword,
    };

    // Insert the user into the database
    const result = await dbClient.db.collection('users').insertOne(newUser);

    // Return the new user with id and email only
    return res.status(201).json({ id: result.insertedId, email });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
