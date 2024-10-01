import mime from 'mime-types';

export const getMimeType = (fileName) => {
  return mime.lookup(fileName) || 'application/octet-stream';
};
