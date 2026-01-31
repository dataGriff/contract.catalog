import { Domain } from '../parsers/domain-parser.js';

export function generateArchitecturePage(domains: Domain[]): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Architecture Overview - Contract Catalog</title>
    <script type="module">
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        mermaid.initialize({ 
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose'
        });
    </script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        nav {
            background: white;
            padding: 1rem 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        nav a {
            color: #667eea;
            text-decoration: none;
            margin-right: 1.5rem;
            font-weight: 600;
        }
        nav a:hover {
            text-decoration: underline;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }
        .section {
            background: white;
            margin-bottom: 2rem;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .section h2 {
            color: #667eea;
            margin-bottom: 1rem;
            font-size: 1.8rem;
            border-bottom: 2px solid #667eea;
            padding-bottom: 0.5rem;
        }
        .section h3 {
            color: #555;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            font-size: 1.4rem;
        }
        .mermaid {
            background: #fafafa;
            padding: 20px;
            border-radius: 4px;
            margin: 20px 0;
            display: flex;
            justify-content: center;
        }
        .info-box {
            background: #e8f4f8;
            border-left: 4px solid #3498db;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .domain-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 1rem;
        }
        .domain-card {
            background: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 1.5rem;
        }
        .domain-card h4 {
            color: #667eea;
            margin-bottom: 0.5rem;
        }
        .domain-card ul {
            list-style: none;
            margin-top: 0.5rem;
        }
        .domain-card li {
            padding: 0.25rem 0;
            color: #666;
        }
        .domain-card a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            margin-top: 0.5rem;
        }
        .domain-card a:hover {
            text-decoration: underline;
        }
        footer {
            text-align: center;
            padding: 2rem;
            color: #666;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <header>
        <h1>📐 Architecture Overview</h1>
        <p>Visual representation of domains, services, and their interactions</p>
    </header>
    
    <nav>
        <a href="index.html">← Back to Catalog</a>
        <a href="#system-overview">System Overview</a>
        <a href="#domains">Domains</a>
    </nav>
    
    <div class="container">
        <div class="section">
            <h2 id="system-overview">System Overview</h2>
            <p>The Contract Catalog demonstrates a microservices architecture organized into ${domains.length} domain(s).</p>
            
            <div class="mermaid">
graph TB
    ${generateSystemOverviewDiagram(domains)}
            </div>
            
            <div class="info-box">
                <strong>Architecture Highlights:</strong>
                <ul style="margin-top: 0.5rem; margin-left: 1.5rem;">
                    <li><strong>Domains:</strong> ${domains.length} logical domains organizing related services</li>
                    <li><strong>Services:</strong> ${domains.reduce((acc, d) => acc + d.services.length, 0)} microservices across all domains</li>
                    <li><strong>APIs:</strong> ${domains.reduce((acc, d) => acc + d.services.reduce((s, svc) => s + svc.apiContracts.length, 0), 0)} OpenAPI REST API specifications</li>
                    <li><strong>Events:</strong> ${domains.reduce((acc, d) => acc + d.services.reduce((s, svc) => s + svc.eventContracts.length, 0), 0)} AsyncAPI event specifications</li>
                    <li><strong>Data Contracts:</strong> ${domains.reduce((acc, d) => acc + d.services.reduce((s, svc) => s + svc.dataContracts.length, 0), 0)} ODCS data contracts</li>
                </ul>
            </div>
        </div>

        <div class="section" id="domains">
            <h2>Domain Architecture</h2>
            <p>Each domain represents a bounded context with related services and capabilities.</p>
            
            <div class="domain-grid">
                ${domains.map(domain => `
                    <div class="domain-card">
                        <h4>🏛️ ${escapeHtml(domain.displayName)}</h4>
                        <p style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">${domain.services.length} service(s)</p>
                        <ul>
                            ${domain.services.map(service => `
                                <li>⚙️ ${escapeHtml(service.displayName)}</li>
                            `).join('')}
                        </ul>
                        <a href="${escapeHtml(domain.name)}/architecture.html">View Domain Architecture →</a>
                    </div>
                `).join('')}
            </div>
        </div>

        ${domains.map(domain => `
            <div class="section">
                <h2>🏛️ ${escapeHtml(domain.displayName)} Domain</h2>
                <p>Domain containing ${domain.services.length} service(s) with related capabilities.</p>
                
                <div class="mermaid">
${generateDomainArchitectureDiagram(domain)}
                </div>
                
                <h3>Services</h3>
                <div class="domain-grid">
                    ${domain.services.map(service => `
                        <div class="domain-card">
                            <h4>⚙️ ${escapeHtml(service.displayName)}</h4>
                            <ul>
                                ${service.apiContracts.length > 0 ? `<li>📡 ${service.apiContracts.length} API contract(s)</li>` : ''}
                                ${service.eventContracts.length > 0 ? `<li>📨 ${service.eventContracts.length} event contract(s)</li>` : ''}
                                ${service.dataContracts.length > 0 ? `<li>📊 ${service.dataContracts.length} data contract(s)</li>` : ''}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('')}
    </div>

    <footer>
        <p>Generated by Contract Catalog</p>
    </footer>
</body>
</html>`;
}

export function generateDomainArchitecturePage(domain: Domain): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(domain.displayName)} Architecture - Contract Catalog</title>
    <script type="module">
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        mermaid.initialize({ 
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose'
        });
    </script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        nav {
            background: white;
            padding: 1rem 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        nav a {
            color: #667eea;
            text-decoration: none;
            margin-right: 1.5rem;
            font-weight: 600;
        }
        nav a:hover {
            text-decoration: underline;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }
        .section {
            background: white;
            margin-bottom: 2rem;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .section h2 {
            color: #667eea;
            margin-bottom: 1rem;
            font-size: 1.8rem;
            border-bottom: 2px solid #667eea;
            padding-bottom: 0.5rem;
        }
        .section h3 {
            color: #555;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            font-size: 1.4rem;
        }
        .mermaid {
            background: #fafafa;
            padding: 20px;
            border-radius: 4px;
            margin: 20px 0;
            display: flex;
            justify-content: center;
        }
        .info-box {
            background: #e8f4f8;
            border-left: 4px solid #3498db;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .service-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 1rem;
        }
        .service-card {
            background: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 1.5rem;
        }
        .service-card h4 {
            color: #667eea;
            margin-bottom: 0.5rem;
        }
        .service-card ul {
            list-style: none;
            margin-top: 0.5rem;
        }
        .service-card li {
            padding: 0.25rem 0;
            color: #666;
        }
        .contract-list {
            margin-top: 1rem;
        }
        .contract-list a {
            display: block;
            color: #667eea;
            text-decoration: none;
            padding: 0.5rem;
            margin: 0.25rem 0;
            background: white;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
        }
        .contract-list a:hover {
            background: #f0f0f0;
        }
        footer {
            text-align: center;
            padding: 2rem;
            color: #666;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <header>
        <h1>🏛️ ${escapeHtml(domain.displayName)} Domain</h1>
        <p>Architecture and service documentation</p>
    </header>
    
    <nav>
        <a href="../index.html">← Back to Catalog</a>
        <a href="../architecture.html">System Architecture</a>
        <a href="#overview">Overview</a>
        <a href="#services">Services</a>
    </nav>
    
    <div class="container">
        <div class="section" id="overview">
            <h2>Domain Architecture</h2>
            <p>The ${escapeHtml(domain.displayName)} domain contains ${domain.services.length} service(s) organized around related capabilities.</p>
            
            <div class="mermaid">
${generateDomainArchitectureDiagram(domain)}
            </div>
            
            <div class="info-box">
                <strong>Domain Summary:</strong>
                <ul style="margin-top: 0.5rem; margin-left: 1.5rem;">
                    <li><strong>Services:</strong> ${domain.services.length} microservice(s) in this domain</li>
                    <li><strong>API Contracts:</strong> ${domain.services.reduce((acc, s) => acc + s.apiContracts.length, 0)} REST API(s)</li>
                    <li><strong>Event Contracts:</strong> ${domain.services.reduce((acc, s) => acc + s.eventContracts.length, 0)} event stream(s)</li>
                    <li><strong>Data Contracts:</strong> ${domain.services.reduce((acc, s) => acc + s.dataContracts.length, 0)} data schema(s)</li>
                </ul>
            </div>
        </div>

        <div class="section" id="services">
            <h2>Services</h2>
            <div class="service-grid">
                ${domain.services.map(service => `
                    <div class="service-card">
                        <h4>⚙️ ${escapeHtml(service.displayName)}</h4>
                        <ul>
                            <li>📡 ${service.apiContracts.length} API contract(s)</li>
                            <li>📨 ${service.eventContracts.length} event contract(s)</li>
                            <li>📊 ${service.dataContracts.length} data contract(s)</li>
                        </ul>
                        
                        ${service.apiContracts.length + service.eventContracts.length + service.dataContracts.length > 0 ? `
                            <div class="contract-list">
                                ${service.apiContracts.map(contract => `
                                    <a href="${escapeHtml(service.name)}/${escapeHtml(contract.fileName.replace(/\.(yaml|yml|json)$/, '.html'))}">
                                        📡 ${escapeHtml(contract.title)}
                                    </a>
                                `).join('')}
                                ${service.eventContracts.map(contract => `
                                    <a href="${escapeHtml(service.name)}/${escapeHtml(contract.fileName.replace(/\.(yaml|yml|json)$/, '.html'))}">
                                        📨 ${escapeHtml(contract.title)}
                                    </a>
                                `).join('')}
                                ${service.dataContracts.map(contract => `
                                    <a href="${escapeHtml(service.name)}/${escapeHtml(contract.fileName.replace(/\.(yaml|yml|json)$/, '.html'))}">
                                        📊 ${escapeHtml(contract.title)}
                                    </a>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    </div>

    <footer>
        <p>Generated by Contract Catalog</p>
    </footer>
</body>
</html>`;
}

function generateSystemOverviewDiagram(domains: Domain[]): string {
  const domainSubgraphs = domains.map((domain, idx) => {
    const services = domain.services.map(service => 
      `        ${service.name.toUpperCase().replace(/-/g, '_')}[${service.displayName}]`
    ).join('\n');
    
    return `    subgraph "${domain.displayName} Domain"
${services}
    end`;
  }).join('\n    \n');

  const hasEvents = domains.some(d => d.services.some(s => s.eventContracts.length > 0));
  
  let infraSubgraph = `    subgraph "Infrastructure"
        API[API Gateway]
        DB[(Databases)]`;
  
  if (hasEvents) {
    infraSubgraph += '\n        KAFKA[Event Bus]';
  }
  
  infraSubgraph += '\n    end';

  // Generate connections
  let connections = '';
  domains.forEach(domain => {
    domain.services.forEach(service => {
      const serviceName = service.name.toUpperCase().replace(/-/g, '_');
      connections += `\n    API --> ${serviceName}`;
      connections += `\n    ${serviceName} --> DB`;
      
      if (service.eventContracts.length > 0 && hasEvents) {
        connections += `\n    ${serviceName} -.->|Events| KAFKA`;
      }
    });
  });

  // Add styling
  let styles = '';
  domains.forEach((domain, idx) => {
    const color = idx === 0 ? '#e1f5ff' : '#fff4e1';
    domain.services.forEach(service => {
      const serviceName = service.name.toUpperCase().replace(/-/g, '_');
      styles += `\n    style ${serviceName} fill:${color}`;
    });
  });
  
  if (hasEvents) {
    styles += '\n    style KAFKA fill:#f0f0f0';
  }

  return `${domainSubgraphs}
    
${infraSubgraph}
${connections}
${styles}`;
}

function generateDomainArchitectureDiagram(domain: Domain): string {
  const services = domain.services.map(service => {
    const serviceName = service.name.toUpperCase().replace(/-/g, '_');
    return `        ${serviceName}[${service.displayName}]`;
  }).join('\n');

  const hasApis = domain.services.some(s => s.apiContracts.length > 0);
  const hasEvents = domain.services.some(s => s.eventContracts.length > 0);
  const hasData = domain.services.some(s => s.dataContracts.length > 0);

  let diagram = `graph LR
    subgraph "${domain.displayName} Domain"
        direction TB
${services}
        
        subgraph "Data Storage"
            DB[(Database)]
        end`;

  if (hasEvents) {
    diagram += `
        
        subgraph "Event Publishing"
            EVENTS[Event Streams]
        end`;
  }

  diagram += '\n    end';

  // Add connections
  domain.services.forEach(service => {
    const serviceName = service.name.toUpperCase().replace(/-/g, '_');
    diagram += `\n    ${serviceName} --> DB`;
    
    if (service.eventContracts.length > 0) {
      diagram += `\n    ${serviceName} -.->|Publishes| EVENTS`;
    }
  });

  // Add contract labels
  if (hasApis || hasEvents || hasData) {
    diagram += '\n    \n    subgraph "Contracts"';
    
    if (hasApis) {
      diagram += '\n        APIs[REST APIs<br/>OpenAPI]';
    }
    if (hasEvents) {
      diagram += '\n        ASYNC[Event Streams<br/>AsyncAPI]';
    }
    if (hasData) {
      diagram += '\n        DATA[Data Schemas<br/>ODCS]';
    }
    
    diagram += '\n    end';
  }

  // Add styling
  domain.services.forEach(service => {
    const serviceName = service.name.toUpperCase().replace(/-/g, '_');
    diagram += `\n    style ${serviceName} fill:#4a90e2`;
  });

  if (hasApis) {
    diagram += '\n    style APIs fill:#90EE90';
  }
  if (hasEvents) {
    diagram += '\n    style ASYNC fill:#FFB347';
    diagram += '\n    style EVENTS fill:#FFB347';
  }
  if (hasData) {
    diagram += '\n    style DATA fill:#DDA0DD';
  }

  return diagram;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
