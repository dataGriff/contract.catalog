import { DataContract } from '../parsers/data-parser.js';

export function generateDataPage(contract: DataContract): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(contract.title)} - Data Contract</title>
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
        .header-content {
            max-width: 1200px;
            margin: 0 auto;
        }
        header h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        .nav-link {
            display: inline-block;
            color: white;
            text-decoration: none;
            margin-top: 1rem;
            opacity: 0.9;
        }
        .nav-link:hover {
            opacity: 1;
            text-decoration: underline;
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
            margin-bottom: 1rem;
            font-size: 1.5rem;
            border-bottom: 2px solid #667eea;
            padding-bottom: 0.5rem;
        }
        .property {
            background: #f9f9f9;
            border-left: 4px solid #49cc90;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 4px;
        }
        .property-name {
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
            color: #49cc90;
            font-weight: bold;
            margin-bottom: 0.25rem;
        }
        .property-type {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        .property-description {
            color: #666;
        }
        .required-badge {
            display: inline-block;
            background: #f93e3e;
            color: white;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            margin-left: 0.5rem;
        }
        .schema-info {
            background: #f0f0f0;
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1rem;
        }
        .schema-info-item {
            margin-bottom: 0.5rem;
        }
        .schema-info-label {
            font-weight: bold;
            color: #667eea;
        }
        pre {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <header>
        <div class="header-content">
            <a href="../index.html" class="nav-link">← Back to Catalog</a>
            <h1>📊 ${escapeHtml(contract.title)}</h1>
        </div>
    </header>
    
    <div class="container">
        ${contract.description ? `
        <div class="section">
            <h2>Description</h2>
            <p>${escapeHtml(contract.description)}</p>
        </div>
        ` : ''}

        ${contract.schema.$id || contract.schema.$schema ? `
        <div class="section">
            <h2>Schema Information</h2>
            <div class="schema-info">
                ${contract.schema.$schema ? `
                    <div class="schema-info-item">
                        <span class="schema-info-label">Schema:</span> ${escapeHtml(contract.schema.$schema)}
                    </div>
                ` : ''}
                ${contract.schema.$id ? `
                    <div class="schema-info-item">
                        <span class="schema-info-label">ID:</span> ${escapeHtml(contract.schema.$id)}
                    </div>
                ` : ''}
            </div>
        </div>
        ` : ''}

        ${contract.schema.properties ? `
        <div class="section">
            <h2>Properties</h2>
            ${Object.entries(contract.schema.properties).map(([propName, prop]: [string, any]) => `
                <div class="property">
                    <div class="property-name">
                        ${escapeHtml(propName)}
                        ${contract.schema.required && contract.schema.required.includes(propName) ? '<span class="required-badge">REQUIRED</span>' : ''}
                    </div>
                    <div class="property-type">
                        Type: ${escapeHtml(prop.type || 'any')}
                        ${prop.format ? ` (format: ${escapeHtml(prop.format)})` : ''}
                        ${prop.enum ? ` - Allowed values: ${prop.enum.map((v: any) => escapeHtml(JSON.stringify(v))).join(', ')}` : ''}
                    </div>
                    ${prop.description ? `<div class="property-description">${escapeHtml(prop.description)}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="section">
            <h2>Full Schema</h2>
            <pre>${escapeHtml(JSON.stringify(contract.schema, null, 2))}</pre>
        </div>
    </div>
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
