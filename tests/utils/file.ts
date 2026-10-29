import path from "path";
import fs from "fs";

export const generateStorageFilename = (...paths: string[]): string => {
    return path.join(...paths);
}

export const writeStorageFile = (data: string, filename: string): string => {
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, data);

    return filename;
}

export const readStorageFile = (filename: string): string => {
  return fs.readFileSync(filename, 'utf-8')
}
