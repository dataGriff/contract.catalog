import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface AsyncAPIContract {
  type: 'asyncapi';
  title: string;
  version: string;
  description: string;
  fileName: string;
  channels: Record<string, any>;
  servers?: Record<string, any>;
  domain?: string;
}

export function parseAsyncAPIContract(filePath: string): AsyncAPIContract {
  const content = fs.readFileSync(filePath, 'utf-8');
  const spec = yaml.load(content) as any;

  return {
    type: 'asyncapi',
    title: spec.info?.title || 'Untitled Events',
    version: spec.info?.version || '1.0.0',
    description: spec.info?.description || '',
    fileName: path.basename(filePath),
    channels: spec.channels || {},
    servers: spec.servers || {}
  };
}

export function parseAllAsyncAPIContracts(contractsDir: string): AsyncAPIContract[] {
  const asyncapiDir = path.join(contractsDir, 'asyncapi');
  if (!fs.existsSync(asyncapiDir)) {
    return [];
  }

  const files = fs.readdirSync(asyncapiDir)
    .filter(file => file.endsWith('.yaml') || file.endsWith('.yml') || file.endsWith('.json'));

  return files.map(file => parseAsyncAPIContract(path.join(asyncapiDir, file)));
}
