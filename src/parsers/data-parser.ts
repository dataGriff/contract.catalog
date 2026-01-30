import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface DataContract {
  type: 'data';
  title: string;
  description: string;
  fileName: string;
  version?: string;
  domain?: string;
  service?: string;
  dataProduct?: string;
  status?: string;
  schema: any;
  team?: any;
  roles?: any[];
  slaProperties?: any[];
  quality?: any[];
  support?: any[];
  isODCS?: boolean;
}

export function parseDataContract(filePath: string): DataContract {
  const content = fs.readFileSync(filePath, 'utf-8');
  const ext = path.extname(filePath).toLowerCase();
  
  let contract: any;
  
  // Parse based on file extension
  if (ext === '.yaml' || ext === '.yml') {
    contract = yaml.load(content) as any;
    
    // ODCS format
    if (contract.kind === 'DataContract' && contract.apiVersion) {
      return {
        type: 'data',
        title: contract.dataProduct || 'Untitled Data Contract',
        description: contract.description?.purpose || contract.description || '',
        fileName: path.basename(filePath),
        version: contract.version,
        domain: contract.domain,
        dataProduct: contract.dataProduct,
        status: contract.status,
        schema: contract.schema || [],
        team: contract.team,
        roles: contract.roles,
        slaProperties: contract.slaProperties,
        quality: contract.quality,
        support: contract.support,
        isODCS: true
      };
    }
  } else if (ext === '.json') {
    // Legacy JSON Schema format
    contract = JSON.parse(content);
    return {
      type: 'data',
      title: contract.title || 'Untitled Data Contract',
      description: contract.description || '',
      fileName: path.basename(filePath),
      schema: contract,
      isODCS: false
    };
  }
  
  // Fallback
  return {
    type: 'data',
    title: 'Untitled Data Contract',
    description: '',
    fileName: path.basename(filePath),
    schema: contract,
    isODCS: false
  };
}

export function parseAllDataContracts(contractsDir: string): DataContract[] {
  const dataDir = path.join(contractsDir, 'data');
  if (!fs.existsSync(dataDir)) {
    return [];
  }

  const files = fs.readdirSync(dataDir)
    .filter(file => file.endsWith('.json') || file.endsWith('.yaml') || file.endsWith('.yml'));

  return files.map(file => parseDataContract(path.join(dataDir, file)));
}
