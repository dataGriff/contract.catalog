import * as path from 'path';
import { fileURLToPath } from 'url';
import { StaticSiteGenerator } from './generators/site-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default paths
const contractsDir = path.join(__dirname, '..', 'contracts');
const outputDir = path.join(__dirname, '..', 'output');

console.log('📋 Contract Catalog Generator');
console.log('================================\n');

const generator = new StaticSiteGenerator(contractsDir, outputDir);
generator.generate();
