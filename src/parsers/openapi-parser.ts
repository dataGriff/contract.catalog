import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface OpenAPIContract {
  type: 'openapi';
  title: string;
  version: string;
  description: string;
  fileName: string;
  paths: Record<string, any>;
  servers?: Array<{ url: string; description?: string }>;
  domain?: string;
  fullSpec?: any; // Full OpenAPI specification for complete rendering
}

export function parseOpenAPIContract(filePath: string): OpenAPIContract {
  const content = fs.readFileSync(filePath, 'utf-8');
  const spec = yaml.load(content) as any;

  return {
    type: 'openapi',
    title: spec.info?.title || 'Untitled API',
    version: spec.info?.version || '1.0.0',
    description: spec.info?.description || '',
    fileName: path.basename(filePath),
    paths: spec.paths || {},
    servers: spec.servers || [],
    fullSpec: spec
  };
}

export function parseAllOpenAPIContracts(contractsDir: string): OpenAPIContract[] {
  const openapiDir = path.join(contractsDir, 'openapi');
  if (!fs.existsSync(openapiDir)) {
    return [];
  }

  const files = fs.readdirSync(openapiDir)
    .filter(file => file.endsWith('.yaml') || file.endsWith('.yml') || file.endsWith('.json'));

  return files.map(file => parseOpenAPIContract(path.join(openapiDir, file)));
}
