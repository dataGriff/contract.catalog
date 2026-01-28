import { AsyncAPIContract } from '../parsers/asyncapi-parser.js';

export function generateEventPage(contract: AsyncAPIContract): string {
  const docName = contract.fileName.replace(/\.(yaml|yml|json)$/, '');
  const asyncapiDocLink = contract.domain 
    ? `../asyncapi-docs/${contract.domain}/${docName}/index.html`
    : `../asyncapi-docs/${docName}/index.html`;
    
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(contract.title)} - Event Contract</title>
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
        .channel {
            background: #f9f9f9;
            border-left: 4px solid #764ba2;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 4px;
        }
        .channel-name {
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
            color: #764ba2;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        .channel-description {
            color: #666;
            margin-bottom: 0.5rem;
        }
        .server-item {
            background: #f0f0f0;
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            border-radius: 4px;
        }
        .server-name {
            font-weight: bold;
            color: #667eea;
            margin-bottom: 0.25rem;
        }
        .server-url {
            font-family: 'Courier New', monospace;
            color: #333;
        }
        .asyncapi-link {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            font-weight: bold;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .asyncapi-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
        }
    </style>
</head>
<body>
    <header>
        <div class="header-content">
            <a href="../index.html" class="nav-link">← Back to Catalog</a>
            <h1>📡 ${escapeHtml(contract.title)}</h1>
            <div class="version">Version: ${escapeHtml(contract.version)}</div>
        </div>
    </header>
    
    <div class="container">
        <a href="${asyncapiDocLink}" class="asyncapi-link">📖 View Complete AsyncAPI Documentation →</a>
        
        ${contract.description ? `
        <div class="section">
            <h2>Description</h2>
            <p>${escapeHtml(contract.description)}</p>
        </div>
        ` : ''}

        ${contract.servers && Object.keys(contract.servers).length > 0 ? `
        <div class="section">
            <h2>Servers</h2>
            ${Object.entries(contract.servers).map(([name, server]: [string, any]) => `
                <div class="server-item">
                    <div class="server-name">${escapeHtml(name)}</div>
                    <div class="server-url">${escapeHtml(server.url)} (${escapeHtml(server.protocol)})</div>
                    ${server.description ? `<div>${escapeHtml(server.description)}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="section">
            <h2>Channels</h2>
            ${Object.entries(contract.channels).map(([channelName, channel]: [string, any]) => `
                <div class="channel">
                    <div class="channel-name">${escapeHtml(channelName)}</div>
                    ${channel.description ? `<div class="channel-description">${escapeHtml(channel.description)}</div>` : ''}
                    ${channel.publish ? `
                        <div class="channel-description">
                            <strong>Publishes:</strong> ${escapeHtml(channel.publish.summary || channel.publish.description || 'Event')}
                        </div>
                    ` : ''}
                    ${channel.subscribe ? `
                        <div class="channel-description">
                            <strong>Subscribes:</strong> ${escapeHtml(channel.subscribe.summary || channel.subscribe.description || 'Event')}
                        </div>
                    ` : ''}
                </div>
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
