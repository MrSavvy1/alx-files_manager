import jwt from 'jsonwebtoken';

const usersDb = [
  { id: 'user1', email: 'user@example.com', token: 'user1_token' },
  { id: 'user2', email: 'test@example.com', token: 'user2_token' },
];

export const filesDb = [
  {
    id: 'file1',
    userId: 'user1',
    name: 'example.jpg',
    type: 'image',
    isPublic: false,
    parentId: null,
    localPath: '/path/to/file1',
  },
  {
    id: 'file2',
    userId: 'user1',
    name: 'folder1',
    type: 'folder',
    isPublic: false,
    parentId: null,
    localPath: '/path/to/folder1',
  },
];

export const getUserFromToken = async (token) => {
  return usersDb.find(user => user.token === token) || null;
};
