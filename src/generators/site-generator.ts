import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { parseAllDomains, Domain } from '../parsers/domain-parser.js';
import { generateIndexPage } from '../templates/index-template.js';
import { generateAPIPage } from '../templates/api-template.js';
import { generateEventPage } from '../templates/event-template.js';
import { generateDataPage } from '../templates/data-template.js';

export class StaticSiteGenerator {
  private contractsDir: string;
  private outputDir: string;
  private datacontractCliAvailable: boolean;

  constructor(contractsDir: string, outputDir: string) {
    this.contractsDir = contractsDir;
    this.outputDir = outputDir;
    this.datacontractCliAvailable = this.checkDatacontractCli();
  }

  private checkDatacontractCli(): boolean {
    try {
      execSync('datacontract --version', { stdio: 'pipe' });
      return true;
    } catch {
      return false;
    }
  }

  private generateDataContractWithCli(contractPath: string, outputPath: string): boolean {
    try {
      // Use array form to avoid shell injection issues
      const result = execSync(`datacontract export "${contractPath}" --format html --output "${outputPath}"`, {
        stdio: 'pipe',
        encoding: 'utf-8'
      });
      return true;
    } catch (error: any) {
      // Log the actual error for debugging
      const errorMessage = error.message || 'Unknown error';
      console.warn(`  ⚠ Failed to generate with datacontract-cli: ${errorMessage.split('\n')[0]}`);
      console.warn(`    Using fallback template`);
      return false;
    }
  }

  generate(): void {
    console.log('🔍 Scanning contracts directory...');
    
    if (this.datacontractCliAvailable) {
      console.log('✓ datacontract-cli detected - will use for data contract HTML generation');
    } else {
      console.log('ℹ datacontract-cli not found - using built-in templates for data contracts');
      console.log('  Install with: pip install -r requirements.txt (for enhanced output)');
    }
    
    // Parse all domains
    const domains = parseAllDomains(this.contractsDir);

    console.log(`Found ${domains.length} domain(s)`);
    domains.forEach(domain => {
      console.log(`  - ${domain.displayName}: ${domain.apiContracts.length} API, ${domain.eventContracts.length} Event, ${domain.dataContracts.length} Data contracts`);
    });

    // Create output directories
    this.ensureDir(this.outputDir);
    
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
        const filename = contract.fileName.replace(/\.(yaml|yml|json)$/, '.html');
        const outputPath = path.join(this.outputDir, domain.name, filename);
        
        // Try to use datacontract-cli export if available
        let usedCli = false;
        if (this.datacontractCliAvailable) {
          const contractPath = path.join(this.contractsDir, domain.name, contract.fileName);
          usedCli = this.generateDataContractWithCli(contractPath, outputPath);
        }
        
        // Fallback to built-in template if CLI not available or failed
        if (!usedCli) {
          const html = generateDataPage(contract);
          fs.writeFileSync(outputPath, html);
        }
        
        console.log(`✓ Generated ${domain.name}/${filename}${usedCli ? ' (datacontract-cli)' : ''}`);
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
}
