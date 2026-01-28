import { OpenAPIContract } from '../parsers/openapi-parser.js';

export function generateAPIPage(contract: OpenAPIContract): string {
  // Serialize the OpenAPI spec as JSON for embedding
  const specJson = JSON.stringify(contract.fullSpec || {}, null, 2);
  
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
    </style>
</head>
<body>
    <header>
        <div class="header-content">
            <div class="header-left">
                <a href="../index.html" class="nav-link">← Back to Catalog</a>
                <div>
                    <h1>🔌 ${escapeHtml(contract.title)}</h1>
                    <div class="version">Version: ${escapeHtml(contract.version)}</div>
                </div>
            </div>
        </div>
    </header>
    
    <div class="redoc-container">
        <redoc spec-url='#'></redoc>
    </div>
    
    <script src="../assets/redoc.standalone.js"></script>
    <script>
        // Embed the OpenAPI spec directly in the page
        const spec = ${specJson};
        
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
