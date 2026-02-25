import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function ensureUploadsDir() {
  const uploadsDir = path.join(__dirname, '../uploads/resumes');
  
  // Create the directory if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  return uploadsDir;
}

export async function cleanupFile(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      console.error('Error cleaning up file:', error);
    }
  }
}
