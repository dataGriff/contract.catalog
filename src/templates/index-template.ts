import { OpenAPIContract } from '../parsers/openapi-parser.js';
import { AsyncAPIContract } from '../parsers/asyncapi-parser.js';
import { DataContract } from '../parsers/data-parser.js';

export function generateIndexPage(
  apiContracts: OpenAPIContract[],
  eventContracts: AsyncAPIContract[],
  dataContracts: DataContract[]
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contract Catalog</title>
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
            text-align: center;
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
        .container {
            max-width: 1200px;
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
            margin-bottom: 1.5rem;
            font-size: 1.8rem;
            border-bottom: 2px solid #667eea;
            padding-bottom: 0.5rem;
        }
        .contract-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 1rem;
        }
        .contract-card {
            background: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 1.5rem;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .contract-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .contract-card h3 {
            color: #333;
            margin-bottom: 0.5rem;
            font-size: 1.3rem;
        }
        .contract-card .version {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        .contract-card .description {
            color: #666;
            margin-bottom: 1rem;
            font-size: 0.95rem;
        }
        .contract-card a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            margin-top: 0.5rem;
        }
        .contract-card a:hover {
            text-decoration: underline;
        }
        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: #667eea;
            color: white;
            border-radius: 12px;
            font-size: 0.8rem;
            margin-bottom: 0.5rem;
        }
        .empty-state {
            text-align: center;
            color: #999;
            padding: 2rem;
            font-style: italic;
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
        <h1>📋 Contract Catalog</h1>
        <p>Architecture documentation from API, Event, and Data Contracts</p>
    </header>
    
    <div class="container">
        <div class="section">
            <h2>🔌 API Contracts (OpenAPI)</h2>
            ${apiContracts.length > 0 ? `
            <div class="contract-grid">
                ${apiContracts.map(contract => `
                <div class="contract-card">
                    <span class="badge">OpenAPI</span>
                    <h3>${escapeHtml(contract.title)}</h3>
                    <div class="version">Version: ${escapeHtml(contract.version)}</div>
                    <div class="description">${escapeHtml(contract.description)}</div>
                    <a href="api/${escapeHtml(contract.fileName.replace(/\.(yaml|yml|json)$/, '.html'))}">View Details →</a>
                </div>
                `).join('')}
            </div>
            ` : '<div class="empty-state">No API contracts found</div>'}
        </div>

        <div class="section">
            <h2>📡 Event Contracts (AsyncAPI)</h2>
            ${eventContracts.length > 0 ? `
            <div class="contract-grid">
                ${eventContracts.map(contract => `
                <div class="contract-card">
                    <span class="badge">AsyncAPI</span>
                    <h3>${escapeHtml(contract.title)}</h3>
                    <div class="version">Version: ${escapeHtml(contract.version)}</div>
                    <div class="description">${escapeHtml(contract.description)}</div>
                    <a href="events/${escapeHtml(contract.fileName.replace(/\.(yaml|yml|json)$/, '.html'))}">View Details →</a>
                </div>
                `).join('')}
            </div>
            ` : '<div class="empty-state">No event contracts found</div>'}
        </div>

        <div class="section">
            <h2>📊 Data Contracts (ODCS)</h2>
            ${dataContracts.length > 0 ? `
            <div class="contract-grid">
                ${dataContracts.map(contract => `
                <div class="contract-card">
                    <span class="badge">ODCS v3.1</span>
                    <h3>${escapeHtml(contract.title)}</h3>
                    <div class="description">${escapeHtml(contract.description)}</div>
                    <a href="data/${escapeHtml(contract.fileName.replace(/\.(yaml|yml|json)$/, '.html'))}">View Details →</a>
                </div>
                `).join('')}
            </div>
            ` : '<div class="empty-state">No data contracts found</div>'}
        </div>
    </div>

    <footer>
        <p>Generated by Contract Catalog</p>
    </footer>
</body>
</html>`;
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
