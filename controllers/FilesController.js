import { getUserFromToken, filesDb } from '../utils/database.js';
import { getMimeType } from '../utils/mime.js';
import fs from 'fs';

class FilesController {
  // GET /files/:id - Retrieve a file document by ID
  static async getShow(req, res) {
    const token = req.header('X-Token');
    const user = await getUserFromToken(token);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const file = filesDb.find(file => file.id === req.params.id && file.userId === user.id);
    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.status(200).json(file);
  }

  // GET /files - Retrieve all files for a user with pagination
  static async getIndex(req, res) {
    const token = req.header('X-Token');
    const user = await getUserFromToken(token);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const parentId = req.query.parentId || null;
    const page = parseInt(req.query.page, 10) || 0;
    const files = filesDb
      .filter(file => file.userId === user.id && file.parentId === parentId)
      .slice(page * 20, (page + 1) * 20);

    res.status(200).json(files);
  }

  // PUT /files/:id/publish - Set isPublic to true
  static async putPublish(req, res) {
    const token = req.header('X-Token');
    const user = await getUserFromToken(token);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const fileIndex = filesDb.findIndex(file => file.id === req.params.id && file.userId === user.id);
    if (fileIndex === -1) {
      return res.status(404).json({ error: 'Not found' });
    }

    filesDb[fileIndex].isPublic = true;
    res.status(200).json(filesDb[fileIndex]);
  }

  // PUT /files/:id/unpublish - Set isPublic to false
  static async putUnpublish(req, res) {
    const token = req.header('X-Token');
    const user = await getUserFromToken(token);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const fileIndex = filesDb.findIndex(file => file.id === req.params.id && file.userId === user.id);
    if (fileIndex === -1) {
      return res.status(404).json({ error: 'Not found' });
    }

    filesDb[fileIndex].isPublic = false;
    res.status(200).json(filesDb[fileIndex]);
  }

  // GET /files/:id/data - Return file content based on ID and size query
  static async getFile(req, res) {
    const token = req.header('X-Token');
    const file = filesDb.find(file => file.id === req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (!file.isPublic) {
      const user = await getUserFromToken(token);
      if (!user || user.id !== file.userId) {
        return res.status(404).json({ error: 'Not found' });
      }
    }

    if (file.type === 'folder') {
      return res.status(400).json({ error: "A folder doesn't have content" });
    }

    const filePath = getFilePath(file, req.query.size);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Not found' });
    }

    const mimeType = getMimeType(file.name);
    res.setHeader('Content-Type', mimeType);
    fs.createReadStream(filePath).pipe(res);
  }
}

function getFilePath(file, size) {
  let path = file.localPath;
  if (size && ['100', '250', '500'].includes(size)) {
    path = `${path}_${size}`;
  }
  return path;
}

export default FilesController;
