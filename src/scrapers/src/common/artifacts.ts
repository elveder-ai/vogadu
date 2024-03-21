import * as fs from 'fs/promises';
import * as path from 'path';

export async function save<T>(rootDirectory: string, filename: string, data: T[]) {
  const dataJson = JSON.stringify(data);

  const artifcatsDirectoryPath = await addArtifactsDirectoryIfNotExist(rootDirectory);
  const filePath = path.join(artifcatsDirectoryPath, `${filename}.txt`);

  try {
    await fs.writeFile(filePath, dataJson);
    console.log(`SAVED TO: ${filePath}`);
  } catch (e) {
    console.error('ERROR SAVING TO FILE', e);
  }
}

export async function get<T>(rootDirectory: string, filename: string): Promise<T[]> {
  const artifcatsDirectoryPath = getArticatsDirectoryPath(rootDirectory);
  const filePath = path.join(artifcatsDirectoryPath, `${filename}.txt`);

  try {
    const data = await fs.readFile(filePath, 'utf8');
    const result: T[] = JSON.parse(data);

    return result;
  } catch (e) {
    console.error('ERROR GETTING DATA FROM FILE', e);

    return [];
  }
}

function getArticatsDirectoryPath(rootDirectory: string): string {
  const basePath = path.resolve(rootDirectory, '../../../..');
  const result = path.join(basePath, 'artifacts');

  return result;
}

async function addArtifactsDirectoryIfNotExist(rootDirectory: string): Promise<string> {
  const artifcatsDirectoryPath = getArticatsDirectoryPath(rootDirectory);

  try {
    await fs.access(artifcatsDirectoryPath);
  } catch (e) {
    await fs.mkdir(artifcatsDirectoryPath, { recursive: true });

    console.log('ADDED ARTICATS DIRECTORY:', artifcatsDirectoryPath);
  }

  return artifcatsDirectoryPath;
}