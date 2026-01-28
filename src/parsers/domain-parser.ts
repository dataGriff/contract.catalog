import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { OpenAPIContract } from './openapi-parser.js';
import { AsyncAPIContract } from './asyncapi-parser.js';
import { DataContract } from './data-parser.js';

export interface Domain {
  name: string;
  displayName: string;
  apiContracts: OpenAPIContract[];
  eventContracts: AsyncAPIContract[];
  dataContracts: DataContract[];
}

function detectContractType(filePath: string): 'openapi' | 'asyncapi' | 'data' | 'unknown' {
  const content = fs.readFileSync(filePath, 'utf-8');
  const ext = path.extname(filePath).toLowerCase();
  
  try {
    if (ext === '.yaml' || ext === '.yml') {
      const doc = yaml.load(content) as any;
      
      // Check for OpenAPI
      if (doc.openapi) {
        return 'openapi';
      }
      
      // Check for AsyncAPI
      if (doc.asyncapi) {
        return 'asyncapi';
      }
      
      // Check for ODCS
      if (doc.kind === 'DataContract' && doc.apiVersion) {
        return 'data';
      }
    } else if (ext === '.json') {
      const doc = JSON.parse(content);
      
      // Check for OpenAPI
      if (doc.openapi) {
        return 'openapi';
      }
      
      // Check for AsyncAPI
      if (doc.asyncapi) {
        return 'asyncapi';
      }
      
      // Legacy JSON Schema data contract
      if (doc.$schema || doc.title) {
        return 'data';
      }
    }
  } catch (e) {
    // Ignore parse errors
  }
  
  return 'unknown';
}

function parseOpenAPIContract(filePath: string, domain: string): OpenAPIContract {
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
    domain
  };
}

function parseAsyncAPIContract(filePath: string, domain: string): AsyncAPIContract {
  const content = fs.readFileSync(filePath, 'utf-8');
  const spec = yaml.load(content) as any;

  return {
    type: 'asyncapi',
    title: spec.info?.title || 'Untitled Events',
    version: spec.info?.version || '1.0.0',
    description: spec.info?.description || '',
    fileName: path.basename(filePath),
    channels: spec.channels || {},
    servers: spec.servers || {},
    domain
  };
}

function parseDataContract(filePath: string, domain: string): DataContract {
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
        domain: contract.domain || domain,
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
      isODCS: false,
      domain
    };
  }
  
  // Fallback
  return {
    type: 'data',
    title: 'Untitled Data Contract',
    description: '',
    fileName: path.basename(filePath),
    schema: contract,
    isODCS: false,
    domain
  };
}

export function parseAllDomains(contractsDir: string): Domain[] {
  if (!fs.existsSync(contractsDir)) {
    return [];
  }

  const domains: Domain[] = [];
  const entries = fs.readdirSync(contractsDir, { withFileTypes: true });

  // Each subdirectory is a domain
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const domainName = entry.name;
      const domainPath = path.join(contractsDir, domainName);
      
      const domain: Domain = {
        name: domainName,
        displayName: domainName.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        apiContracts: [],
        eventContracts: [],
        dataContracts: []
      };

      // Scan all files in the domain directory
      const files = fs.readdirSync(domainPath)
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ext === '.yaml' || ext === '.yml' || ext === '.json';
        });

      for (const file of files) {
        const filePath = path.join(domainPath, file);
        const contractType = detectContractType(filePath);

        try {
          switch (contractType) {
            case 'openapi':
              domain.apiContracts.push(parseOpenAPIContract(filePath, domainName));
              break;
            case 'asyncapi':
              domain.eventContracts.push(parseAsyncAPIContract(filePath, domainName));
              break;
            case 'data':
              domain.dataContracts.push(parseDataContract(filePath, domainName));
              break;
          }
        } catch (error) {
          console.warn(`Warning: Failed to parse ${filePath}:`, error);
        }
      }

      // Only add domain if it has at least one contract
      if (domain.apiContracts.length > 0 || 
          domain.eventContracts.length > 0 || 
          domain.dataContracts.length > 0) {
        domains.push(domain);
      }
    }
  }

  return domains;
}
