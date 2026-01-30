import { OpenAPIContract } from '../parsers/openapi-parser.js';

export function generateAPIPage(contract: OpenAPIContract): string {
  // Serialize the OpenAPI spec as JSON for embedding
  // Remove indentation to reduce file size
  const specJson = JSON.stringify(contract.fullSpec || {})
    .replace(/</g, '\\u003c')  // Escape < to prevent XSS
    .replace(/>/g, '\\u003e')  // Escape > to prevent XSS
    .replace(/\//g, '\\/')     // Escape / to prevent script injection
    .replace(/\u2028/g, '\\u2028')  // Escape line separator
    .replace(/\u2029/g, '\\u2029'); // Escape paragraph separator
  
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
            padding: 1.5rem 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .header-content {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .header-left {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }
        header h1 {
            font-size: 1.5rem;
            margin: 0;
        }
        header .version {
            opacity: 0.9;
            font-size: 0.9rem;
        }
        .nav-link {
            display: inline-block;
            color: white;
            text-decoration: none;
            opacity: 0.9;
            font-weight: 500;
        }
        .nav-link:hover {
            opacity: 1;
            text-decoration: underline;
        }
        .redoc-container {
            background: white;
        }
        .error-container {
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 8px;
            color: #856404;
        }
        .error-container h2 {
            margin-bottom: 1rem;
            color: #856404;
        }
    </style>
</head>
<body>
    <header>
        <div class="header-content">
            <div class="header-left">
                <a href="../../index.html" class="nav-link">← Back to Catalog</a>
                <div>
                    <h1>🔌 ${escapeHtml(contract.title)}</h1>
                    <div class="version">Version: ${escapeHtml(contract.version)}</div>
                </div>
            </div>
        </div>
    </header>
    
    <div class="redoc-container"></div>
    
    <script src="../assets/redoc.standalone.js" onerror="handleScriptError()"></script>
    <script>
        function handleScriptError() {
            const container = document.querySelector('.redoc-container');
            container.innerHTML = '<div class="error-container"><h2>⚠️ Documentation Failed to Load</h2><p>The Redoc library could not be loaded. Please ensure you have run <code>npm install</code> and <code>npm run generate</code> to properly build the documentation.</p></div>';
        }
        
        function initRedoc() {
            try {
                // Check if Redoc is available
                if (typeof Redoc === 'undefined') {
                    handleScriptError();
                    return;
                }
                
                // Embed the OpenAPI spec
                const spec = ${specJson};
                
                // Validate that we have a valid spec
                if (!spec || !spec.openapi) {
                    throw new Error('Invalid OpenAPI specification');
                }
                
                // Initialize Redoc with the embedded spec
                Redoc.init(spec, {
                    scrollYOffset: 70,
                    hideDownloadButton: false,
                    theme: {
                        colors: {
                            primary: {
                                main: '#667eea'
                            }
                        },
                        typography: {
                            fontSize: '15px',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
                            headings: {
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
                            }
                        },
                        sidebar: {
                            width: '280px',
                            backgroundColor: '#fafafa'
                        }
                    }
                }, document.querySelector('.redoc-container'));
            } catch (error) {
                console.error('Failed to initialize Redoc:', error);
                const container = document.querySelector('.redoc-container');
                container.innerHTML = '<div class="error-container"><h2>⚠️ Documentation Error</h2><p>Failed to render OpenAPI documentation: ' + error.message + '</p><p>Please check that your OpenAPI specification is valid.</p></div>';
            }
        }
        
        // Initialize Redoc after the script has loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initRedoc);
        } else {
            initRedoc();
        }
    </script>
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
