import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

/**
 * Generates professional HTML documentation for AsyncAPI contracts using the official AsyncAPI generator
 */
export class AsyncAPIDocGenerator {
  private contractsDir: string;
  private outputDir: string;

  constructor(contractsDir: string, outputDir: string) {
    this.contractsDir = contractsDir;
    this.outputDir = outputDir;
  }

  generate(): void {
    console.log('📡 Generating AsyncAPI documentation...');
    
    // Find all AsyncAPI contract files
    const asyncapiFiles = this.findAsyncAPIFiles(this.contractsDir);
    
    if (asyncapiFiles.length === 0) {
      console.log('  No AsyncAPI contracts found.');
      return;
    }

    console.log(`  Found ${asyncapiFiles.length} AsyncAPI contract(s)`);

    // Create output directory for AsyncAPI docs
    const asyncapiOutputDir = path.join(this.outputDir, 'asyncapi-docs');
    this.ensureDir(asyncapiOutputDir);

    // Generate documentation for each AsyncAPI file
    asyncapiFiles.forEach(({ filePath, domain, service, fileName }) => {
      try {
        const docName = fileName.replace(/\.(yaml|yml|json)$/, '');
        const outputPath = path.join(asyncapiOutputDir, domain, service, docName);
        
        this.ensureDir(outputPath);

        console.log(`  Generating: ${domain}/${service}/${docName}`);

        // Run AsyncAPI generator
        execSync(
          `npx @asyncapi/generator "${filePath}" @asyncapi/html-template -o "${outputPath}" --force-write --disable-warning`,
          { stdio: 'pipe' }
        );

        console.log(`  ✓ Generated ${domain}/${service}/${docName}`);
      } catch (error) {
        console.error(`  ✗ Failed to generate documentation for ${filePath}:`, error);
      }
    });

    console.log('✨ AsyncAPI documentation generated successfully!\n');
  }

  private findAsyncAPIFiles(baseDir: string): Array<{ filePath: string; domain: string; service: string; fileName: string }> {
    const result: Array<{ filePath: string; domain: string; service: string; fileName: string }> = [];
    
    if (!fs.existsSync(baseDir)) {
      return result;
    }

    // Read all domain directories
    const entries = fs.readdirSync(baseDir, { withFileTypes: true });
    
    entries.forEach(entry => {
      if (entry.isDirectory()) {
        const domainDir = path.join(baseDir, entry.name);
        const domainEntries = fs.readdirSync(domainDir, { withFileTypes: true });
        
        // Each subdirectory in domain is a service
        domainEntries.forEach(serviceEntry => {
          if (serviceEntry.isDirectory()) {
            const serviceDir = path.join(domainDir, serviceEntry.name);
            const files = fs.readdirSync(serviceDir);
            
            files.forEach(file => {
              if (file.endsWith('.yaml') || file.endsWith('.yml') || file.endsWith('.json')) {
                const filePath = path.join(serviceDir, file);
                
                // Check if it's an AsyncAPI file by reading its content
                try {
                  const content = fs.readFileSync(filePath, 'utf-8');
                  if (content.includes('asyncapi:') || content.includes('"asyncapi"')) {
                    result.push({
                      filePath,
                      domain: entry.name,
                      service: serviceEntry.name,
                      fileName: file
                    });
                  }
                } catch (error) {
                  // Skip files that can't be read
                }
              }
            });
          }
        });
      }
    });

    return result;
  }

  private ensureDir(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}
