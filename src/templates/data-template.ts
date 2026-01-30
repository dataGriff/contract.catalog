import { DataContract } from '../parsers/data-parser.js';

export function generateDataPage(contract: DataContract): string {
  // Check if it's ODCS format
  if (contract.isODCS) {
    return generateODCSPage(contract);
  } else {
    return generateJSONSchemaPage(contract);
  }
}

function generateODCSPage(contract: DataContract): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(contract.title)} - Data Contract (ODCS)</title>
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
        .metadata {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            margin-top: 0.5rem;
            font-size: 0.9rem;
        }
        .metadata-item {
            background: rgba(255,255,255,0.2);
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
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
        .property-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }
        .property-name {
            font-family: 'Courier New', monospace;
            font-size: 1.1rem;
            color: #49cc90;
            font-weight: bold;
        }
        .badge {
            display: inline-block;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: normal;
        }
        .badge.required {
            background: #f93e3e;
            color: white;
        }
        .badge.primary-key {
            background: #667eea;
            color: white;
        }
        .badge.unique {
            background: #fca130;
            color: white;
        }
        .property-type {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        .property-description {
            color: #666;
            margin-bottom: 0.5rem;
        }
        .property-meta {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            margin-top: 0.5rem;
            font-size: 0.85rem;
            color: #888;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }
        .info-item {
            background: #f9f9f9;
            padding: 1rem;
            border-radius: 4px;
        }
        .info-label {
            font-weight: bold;
            color: #667eea;
            margin-bottom: 0.25rem;
        }
        .tag {
            display: inline-block;
            background: #e0e7ff;
            color: #667eea;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.85rem;
            margin-right: 0.5rem;
            margin-bottom: 0.5rem;
        }
    </style>
</head>
<body>
    <header>
        <div class="header-content">
            <a href="../../index.html" class="nav-link">← Back to Catalog</a>
            <h1>📊 ${escapeHtml(contract.title)}</h1>
            <div class="metadata">
                ${contract.version ? `<span class="metadata-item">Version: ${escapeHtml(contract.version)}</span>` : ''}
                ${contract.domain ? `<span class="metadata-item">Domain: ${escapeHtml(contract.domain)}</span>` : ''}
                ${contract.status ? `<span class="metadata-item">Status: ${escapeHtml(contract.status)}</span>` : ''}
                <span class="metadata-item">Standard: ODCS v3.1.0</span>
            </div>
        </div>
    </header>
    
    <div class="container">
        ${contract.description ? `
        <div class="section">
            <h2>Description</h2>
            <p>${escapeHtml(contract.description)}</p>
        </div>
        ` : ''}

        ${contract.team ? `
        <div class="section">
            <h2>Team</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Team Name</div>
                    <div>${escapeHtml(contract.team.name || 'N/A')}</div>
                </div>
                ${contract.team.description ? `
                <div class="info-item">
                    <div class="info-label">Description</div>
                    <div>${escapeHtml(contract.team.description)}</div>
                </div>
                ` : ''}
            </div>
            ${contract.team.members && contract.team.members.length > 0 ? `
                <h3 style="margin-top: 1rem; margin-bottom: 0.5rem;">Team Members</h3>
                ${contract.team.members.map((member: any) => `
                    <div class="info-item" style="margin-bottom: 0.5rem;">
                        <strong>${escapeHtml(member.username)}</strong> - ${escapeHtml(member.role)}
                        ${member.dateIn ? ` (since ${escapeHtml(member.dateIn)})` : ''}
                    </div>
                `).join('')}
            ` : ''}
        </div>
        ` : ''}

        ${contract.schema && contract.schema.length > 0 ? `
            ${contract.schema.map((table: any) => `
                <div class="section">
                    <h2>${escapeHtml(table.businessName || table.name)}</h2>
                    ${table.description ? `<p style="margin-bottom: 1rem;">${escapeHtml(table.description)}</p>` : ''}
                    
                    ${table.tags && table.tags.length > 0 ? `
                        <div style="margin-bottom: 1rem;">
                            ${table.tags.map((tag: string) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                        </div>
                    ` : ''}

                    <div class="info-grid" style="margin-bottom: 1.5rem;">
                        ${table.physicalName ? `
                        <div class="info-item">
                            <div class="info-label">Physical Name</div>
                            <div><code>${escapeHtml(table.physicalName)}</code></div>
                        </div>
                        ` : ''}
                        ${table.physicalType ? `
                        <div class="info-item">
                            <div class="info-label">Type</div>
                            <div>${escapeHtml(table.physicalType)}</div>
                        </div>
                        ` : ''}
                    </div>

                    ${table.quality && table.quality.length > 0 ? `
                        <div style="background: #f0f9ff; border-left: 4px solid #667eea; padding: 1rem; margin-bottom: 1.5rem; border-radius: 4px;">
                            <h4 style="margin-bottom: 0.75rem; color: #667eea;">Table Quality Rules</h4>
                            ${table.quality.map((q: any) => `
                                <div style="margin-bottom: 0.5rem; background: white; padding: 0.75rem; border-radius: 4px;">
                                    ${q.metric ? `<div><strong>${escapeHtml(q.metric)}</strong></div>` : ''}
                                    ${q.description ? `<div style="color: #666; font-size: 0.9rem;">${escapeHtml(q.description)}</div>` : ''}
                                    ${q.dimension ? `<div style="margin-top: 0.25rem; font-size: 0.85rem;">Dimension: ${escapeHtml(q.dimension)}</div>` : ''}
                                    ${q.severity ? `<div style="margin-top: 0.25rem;"><span style="background: ${q.severity === 'error' ? '#fee' : '#ffc'}; padding: 0.2rem 0.5rem; border-radius: 3px; font-size: 0.75rem;">${escapeHtml(q.severity)}</span></div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${table.properties && table.properties.length > 0 ? `
                        <h3 style="margin-bottom: 1rem;">Properties</h3>
                        ${table.properties.map((prop: any) => `
                            <div class="property">
                                <div class="property-header">
                                    <span class="property-name">${escapeHtml(prop.name)}</span>
                                    ${prop.required ? '<span class="badge required">REQUIRED</span>' : ''}
                                    ${prop.primaryKey ? '<span class="badge primary-key">PRIMARY KEY</span>' : ''}
                                    ${prop.unique ? '<span class="badge unique">UNIQUE</span>' : ''}
                                </div>
                                ${prop.businessName ? `<div style="color: #888; font-size: 0.9rem; margin-bottom: 0.5rem;">${escapeHtml(prop.businessName)}</div>` : ''}
                                <div class="property-type">
                                    Type: <strong>${escapeHtml(prop.logicalType || 'unknown')}</strong>
                                    ${prop.physicalType ? ` (${escapeHtml(prop.physicalType)})` : ''}
                                </div>
                                ${prop.description ? `<div class="property-description">${escapeHtml(prop.description)}</div>` : ''}
                                ${prop.classification ? `
                                    <div class="property-meta">
                                        <span>Classification: <strong>${escapeHtml(prop.classification)}</strong></span>
                                    </div>
                                ` : ''}
                                ${prop.examples && prop.examples.length > 0 ? `
                                    <div style="margin-top: 0.5rem; font-size: 0.85rem; color: #666;">
                                        Examples: ${prop.examples.map((ex: any) => `<code>${escapeHtml(JSON.stringify(ex))}</code>`).join(', ')}
                                    </div>
                                ` : ''}
                                ${prop.quality && prop.quality.length > 0 ? `
                                    <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #e5e7eb;">
                                        <div style="font-weight: bold; margin-bottom: 0.5rem; color: #667eea; font-size: 0.9rem;">Quality Rules</div>
                                        ${prop.quality.map((q: any) => `
                                            <div style="margin-bottom: 0.5rem; padding: 0.5rem; background: white; border-radius: 4px; font-size: 0.85rem;">
                                                ${q.metric ? `<div><strong>${escapeHtml(q.metric)}</strong></div>` : ''}
                                                ${q.description ? `<div style="color: #666;">${escapeHtml(q.description)}</div>` : ''}
                                                ${q.severity ? `<div style="margin-top: 0.25rem;"><span style="background: ${q.severity === 'error' ? '#fee' : '#ffc'}; padding: 0.1rem 0.4rem; border-radius: 3px; font-size: 0.75rem;">${escapeHtml(q.severity)}</span></div>` : ''}
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    ` : ''}
                </div>
            `).join('')}
        ` : ''}

        ${contract.roles && contract.roles.length > 0 ? `
        <div class="section">
            <h2>Roles & Access</h2>
            ${contract.roles.map((role: any) => `
                <div class="info-item" style="margin-bottom: 1rem;">
                    <div class="info-label">${escapeHtml(role.role)}</div>
                    <div>Access: <strong>${escapeHtml(role.access)}</strong></div>
                    ${role.description ? `<div style="margin-top: 0.25rem;">${escapeHtml(role.description)}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${contract.slaProperties && contract.slaProperties.length > 0 ? `
        <div class="section">
            <h2>Service Level Agreement</h2>
            <div class="info-grid">
                ${contract.slaProperties.map((sla: any) => `
                    <div class="info-item">
                        <div class="info-label">${escapeHtml(sla.property)}</div>
                        <div>${escapeHtml(sla.value)}${sla.unit ? ` ${escapeHtml(sla.unit)}` : ''}</div>
                        ${sla.description ? `<div style="font-size: 0.85rem; color: #666; margin-top: 0.25rem;">${escapeHtml(sla.description)}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        ${contract.quality && contract.quality.length > 0 ? `
        <div class="section">
            <h2>Data Quality</h2>
            ${contract.quality.map((q: any) => `
                <div class="info-item" style="margin-bottom: 1rem;">
                    ${q.metric ? `<div class="info-label">Metric: ${escapeHtml(q.metric)}</div>` : ''}
                    ${q.dimension ? `<div style="margin-top: 0.5rem;"><strong>Dimension:</strong> ${escapeHtml(q.dimension)}</div>` : ''}
                    ${q.description ? `<div style="margin-top: 0.25rem;">${escapeHtml(q.description)}</div>` : ''}
                    ${q.value !== undefined ? `<div style="margin-top: 0.25rem;"><strong>Value:</strong> ${escapeHtml(q.value)}${q.unit ? ` ${escapeHtml(q.unit)}` : ''}</div>` : ''}
                    ${q.severity ? `<div style="margin-top: 0.25rem;"><strong>Severity:</strong> <span style="color: ${q.severity === 'error' ? '#f93e3e' : '#fca130'};">${escapeHtml(q.severity)}</span></div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${contract.support && contract.support.length > 0 ? `
        <div class="section">
            <h2>Support & Contact</h2>
            <div class="info-grid">
                ${contract.support.map((s: any) => `
                    <div class="info-item">
                        <div class="info-label">${escapeHtml(s.channel || 'Contact')}</div>
                        <div>${escapeHtml(s.value)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    </div>
</body>
</html>`;
}

function generateJSONSchemaPage(contract: DataContract): string {
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
            <a href="../../index.html" class="nav-link">← Back to Catalog</a>
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

function escapeHtml(text: string | number | boolean): string {
  if (text === null || text === undefined) {
    return '';
  }
  const str = String(text);
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, m => map[m]);
}
