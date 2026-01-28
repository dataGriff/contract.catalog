import * as fs from 'fs';
import * as path from 'path';

export interface DataContract {
  type: 'data';
  title: string;
  description: string;
  fileName: string;
  schema: any;
}

export function parseDataContract(filePath: string): DataContract {
  const content = fs.readFileSync(filePath, 'utf-8');
  const schema = JSON.parse(content);

  return {
    type: 'data',
    title: schema.title || 'Untitled Data Contract',
    description: schema.description || '',
    fileName: path.basename(filePath),
    schema
  };
}

export function parseAllDataContracts(contractsDir: string): DataContract[] {
  const dataDir = path.join(contractsDir, 'data');
  if (!fs.existsSync(dataDir)) {
    return [];
  }

  const files = fs.readdirSync(dataDir)
    .filter(file => file.endsWith('.json'));

  return files.map(file => parseDataContract(path.join(dataDir, file)));
}
