import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { createInterface } from 'readline';
export const emptyFolder = async (folderPath) => {
  try {
    // Find all files in the folder
    const files = await fsPromises.readdir(folderPath);
    for (const file of files) {
      try {
        await fsPromises.unlink(path.resolve(folderPath, file));
        console.log(`${folderPath}/${file} has been removed successfully`);

      } catch (error) {
        
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const getChunkProps = (range, fileSize) => {
  const parts = range.replace(/bytes=/, '').split('-');

  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunkSize = end - start + 1;

  return {
    start,
    end,
    chunkSize,
  };
};

export const getFileSizeAndResolvedPath = (filePath) => {
  const resolvedPath = path.resolve(filePath);
  const stat = fs.statSync(resolvedPath);
  return { fileSize: stat.size, resolvedPath: resolvedPath };
};

export const normalizeText = (text) => {
  return text.split(' ').join('-').replace(':', '');
};



export const failedItems = async (filePath) => {
  var fileLineArray = [];
  var lineReader = createInterface({
  input: fs.createReadStream(filePath)
  });
  
  for await (const line of lineReader) {
    fileLineArray.push(`${line.split('failed')[0].trim()}`);
  }
  return fileLineArray;
}
