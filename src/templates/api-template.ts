import { OpenAPIContract } from '../parsers/openapi-parser.js';

export function generateAPIPage(contract: OpenAPIContract): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(contract.title)} - API Contract</title>
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
        header .version {
            opacity: 0.9;
            font-size: 1rem;
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
        .endpoint {
            background: #f9f9f9;
            border-left: 4px solid #667eea;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 4px;
        }
        .method {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.85rem;
            margin-right: 0.5rem;
        }
        .method.get { background: #61affe; color: white; }
        .method.post { background: #49cc90; color: white; }
        .method.put { background: #fca130; color: white; }
        .method.delete { background: #f93e3e; color: white; }
        .method.patch { background: #50e3c2; color: white; }
        .path {
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
            color: #333;
        }
        .endpoint-description {
            margin-top: 0.5rem;
            color: #666;
        }
        .server-item {
            background: #f0f0f0;
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            border-radius: 4px;
        }
        .server-url {
            font-family: 'Courier New', monospace;
            color: #667eea;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <header>
        <div class="header-content">
            <a href="../index.html" class="nav-link">← Back to Catalog</a>
            <h1>🔌 ${escapeHtml(contract.title)}</h1>
            <div class="version">Version: ${escapeHtml(contract.version)}</div>
        </div>
    </header>
    
    <div class="container">
        ${contract.description ? `
        <div class="section">
            <h2>Description</h2>
            <p>${escapeHtml(contract.description)}</p>
        </div>
        ` : ''}

        ${contract.servers && contract.servers.length > 0 ? `
        <div class="section">
            <h2>Servers</h2>
            ${contract.servers.map((server: any) => `
                <div class="server-item">
                    <div class="server-url">${escapeHtml(server.url)}</div>
                    ${server.description ? `<div>${escapeHtml(server.description)}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="section">
            <h2>Endpoints</h2>
            ${Object.entries(contract.paths).map(([path, methods]: [string, any]) => `
                ${Object.entries(methods).map(([method, details]: [string, any]) => {
                    const validMethods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
                    const methodLower = method.toLowerCase();
                    const methodClass = validMethods.includes(methodLower) ? methodLower : 'get';
                    return `
                    <div class="endpoint">
                        <div>
                            <span class="method ${methodClass}">${escapeHtml(method.toUpperCase())}</span>
                            <span class="path">${escapeHtml(path)}</span>
                        </div>
                        ${details.summary ? `<div class="endpoint-description"><strong>${escapeHtml(details.summary)}</strong></div>` : ''}
                        ${details.description ? `<div class="endpoint-description">${escapeHtml(details.description)}</div>` : ''}
                    </div>
                `}).join('')}
            `).join('')}
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
