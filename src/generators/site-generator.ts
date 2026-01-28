import * as fs from 'fs';
import * as path from 'path';
import { parseAllDomains, Domain } from '../parsers/domain-parser.js';
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
    
    // Parse all domains
    const domains = parseAllDomains(this.contractsDir);

    console.log(`Found ${domains.length} domain(s)`);
    domains.forEach(domain => {
      console.log(`  - ${domain.displayName}: ${domain.apiContracts.length} API, ${domain.eventContracts.length} Event, ${domain.dataContracts.length} Data contracts`);
    });

    // Create output directories
    this.ensureDir(this.outputDir);
    this.ensureDir(path.join(this.outputDir, 'assets'));
    
    // Copy Redoc standalone bundle for OpenAPI documentation
    this.copyRedocBundle();
    
    // Create a directory for each domain
    domains.forEach(domain => {
      this.ensureDir(path.join(this.outputDir, domain.name));
    });

    console.log('\n📝 Generating pages...');

    // Generate index page
    const indexHtml = generateIndexPage(domains);
    fs.writeFileSync(path.join(this.outputDir, 'index.html'), indexHtml);
    console.log('✓ Generated index.html');

    // Generate contract pages for each domain
    domains.forEach(domain => {
      // Generate API contract pages
      domain.apiContracts.forEach(contract => {
        const html = generateAPIPage(contract);
        const filename = contract.fileName.replace(/\.(yaml|yml|json)$/, '.html');
        fs.writeFileSync(path.join(this.outputDir, domain.name, filename), html);
        console.log(`✓ Generated ${domain.name}/${filename}`);
      });

      // Generate event contract pages
      domain.eventContracts.forEach(contract => {
        const html = generateEventPage(contract);
        const filename = contract.fileName.replace(/\.(yaml|yml|json)$/, '.html');
        fs.writeFileSync(path.join(this.outputDir, domain.name, filename), html);
        console.log(`✓ Generated ${domain.name}/${filename}`);
      });

      // Generate data contract pages
      domain.dataContracts.forEach(contract => {
        const html = generateDataPage(contract);
        const filename = contract.fileName.replace(/\.(yaml|yml|json)$/, '.html');
        fs.writeFileSync(path.join(this.outputDir, domain.name, filename), html);
        console.log(`✓ Generated ${domain.name}/${filename}`);
      });
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

  private copyRedocBundle(): void {
    const redocSource = path.join(process.cwd(), 'node_modules', 'redoc', 'bundles', 'redoc.standalone.js');
    const redocDest = path.join(this.outputDir, 'assets', 'redoc.standalone.js');
    
    if (fs.existsSync(redocSource)) {
      fs.copyFileSync(redocSource, redocDest);
      console.log('✓ Copied Redoc bundle to assets/');
    } else {
      console.warn('⚠ Redoc bundle not found. OpenAPI documentation may not render correctly.');
      console.warn('  Run: npm install redoc');
    }
  }
}
