import * as fs from 'fs';
import * as path from 'path';
import { parseAllOpenAPIContracts, OpenAPIContract } from '../parsers/openapi-parser.js';
import { parseAllAsyncAPIContracts, AsyncAPIContract } from '../parsers/asyncapi-parser.js';
import { parseAllDataContracts, DataContract } from '../parsers/data-parser.js';
import { generateIndexPage } from '../templates/index-template.js';
import { generateAPIPage } from '../templates/api-template.js';
import { generateEventPage } from '../templates/event-template.js';
import { generateDataPage } from '../templates/data-template.js';

export class StaticSiteGenerator {
  private contractsDir: string;
  private outputDir: string;

  constructor(contractsDir: string, outputDir: string) {
    this.contractsDir = contractsDir;
    this.outputDir = outputDir;
  }

  generate(): void {
    console.log('🔍 Scanning contracts directory...');
    
    // Parse all contracts
    const apiContracts = parseAllOpenAPIContracts(this.contractsDir);
    const eventContracts = parseAllAsyncAPIContracts(this.contractsDir);
    const dataContracts = parseAllDataContracts(this.contractsDir);

    console.log(`Found ${apiContracts.length} API contracts`);
    console.log(`Found ${eventContracts.length} event contracts`);
    console.log(`Found ${dataContracts.length} data contracts`);

    // Create output directories
    this.ensureDir(this.outputDir);
    this.ensureDir(path.join(this.outputDir, 'api'));
    this.ensureDir(path.join(this.outputDir, 'events'));
    this.ensureDir(path.join(this.outputDir, 'data'));

    console.log('\n📝 Generating pages...');

    // Generate index page
    const indexHtml = generateIndexPage(apiContracts, eventContracts, dataContracts);
    fs.writeFileSync(path.join(this.outputDir, 'index.html'), indexHtml);
    console.log('✓ Generated index.html');

    // Generate API contract pages
    apiContracts.forEach(contract => {
      const html = generateAPIPage(contract);
      const filename = contract.fileName.replace(/\.(yaml|yml|json)$/, '.html');
      fs.writeFileSync(path.join(this.outputDir, 'api', filename), html);
      console.log(`✓ Generated api/${filename}`);
    });

    // Generate event contract pages
    eventContracts.forEach(contract => {
      const html = generateEventPage(contract);
      const filename = contract.fileName.replace(/\.(yaml|yml|json)$/, '.html');
      fs.writeFileSync(path.join(this.outputDir, 'events', filename), html);
      console.log(`✓ Generated events/${filename}`);
    });

    // Generate data contract pages
    dataContracts.forEach(contract => {
      const html = generateDataPage(contract);
      const filename = contract.fileName.replace('.json', '.html');
      fs.writeFileSync(path.join(this.outputDir, 'data', filename), html);
      console.log(`✓ Generated data/${filename}`);
    });

    console.log('\n✨ Static site generated successfully!');
    console.log(`📁 Output directory: ${this.outputDir}`);
    console.log('\n💡 To view the site:');
    console.log('   npm run serve');
    console.log('   Then open http://localhost:8080 in your browser');
  }

  private ensureDir(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}
