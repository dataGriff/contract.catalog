# Contract Catalog

A simple static website generator for documenting your architecture through contracts. Supports OpenAPI, AsyncAPI, and Open Data Contract Standard (ODCS) data contracts - think of it as an "Event Catalog lite" solution.

## 🎯 Overview

Contract Catalog automatically generates a beautiful, navigable static website from your API, event, and data contracts. It provides a centralized view of your system architecture by documenting:

- **API Contracts** (OpenAPI 3.0) - REST API specifications
- **Event Contracts** (AsyncAPI 2.x) - Event-driven architecture documentation
- **Data Contracts** (ODCS v3.1.0) - Data structure definitions using Open Data Contract Standard

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Add Your Contracts

Organize your contract files by domain. Each subdirectory under `contracts/` represents a domain and can contain multiple contract types:

```
contracts/
└── user-management/          # Domain directory
    ├── user-api.yaml         # OpenAPI contract
    ├── user-events.yaml      # AsyncAPI contract
    └── user-contract.yaml    # ODCS data contract
```

You can have multiple domains:

```
contracts/
├── user-management/
│   ├── user-api.yaml
│   ├── user-events.yaml
│   └── user-contract.yaml
├── payment-processing/
│   ├── payment-api.yaml
│   └── payment-events.yaml
└── inventory/
    ├── inventory-api.yaml
    └── inventory-data.yaml
```

### Generate the Catalog

```bash
# Build and generate the static site
npm run build
npm run generate

# Or use the development command to build, generate, and serve
npm run dev
```

The static site will be generated in the `output/` directory.

### View the Catalog

```bash
npm run serve
```

Then open http://localhost:8080 in your browser.

## 📁 Project Structure

```
contract.catalog/
├── contracts/              # Your contract files organized by domain
│   └── user-management/   # Example domain
│       ├── user-api.yaml       # OpenAPI specification
│       ├── user-events.yaml    # AsyncAPI specification
│       └── user-contract.yaml  # ODCS data contract
├── src/                   # Source code
│   ├── parsers/          # Contract parsers (including domain parser)
│   ├── generators/       # Site generator
│   ├── templates/        # HTML templates
│   └── index.ts          # Entry point
├── output/               # Generated static site (gitignored)
└── dist/                 # Compiled TypeScript (gitignored)
```

## 📝 Example Contracts

The repository includes example contracts in the `user-management` domain:

- **user-api.yaml** - OpenAPI specification for a User Management API
- **user-events.yaml** - AsyncAPI specification for user lifecycle events
- **user-contract.yaml** - ODCS v3.1.0 data contract for user data structure

## 🛠️ Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run generate` - Generate the static site from contracts (includes AsyncAPI documentation)
- `npm run serve` - Serve the generated site locally
- `npm run dev` - Build, generate, and serve in one command

## 📖 AsyncAPI Documentation

AsyncAPI contracts receive special treatment with professional, interactive HTML documentation generated using the official [@asyncapi/generator](https://github.com/asyncapi/generator) and [@asyncapi/html-template](https://github.com/asyncapi/html-template).

### Features of AsyncAPI Documentation

- **Rich Interactive UI** - Beautiful, navigable interface with expand/collapse sections
- **Complete Specification Coverage** - Servers, channels, operations, messages, and schemas
- **Schema Visualization** - Visual representation of message payloads and data structures
- **Operation Details** - Full documentation of publish/subscribe operations
- **Example Payloads** - Interactive examples for all messages
- **Professional Styling** - Official AsyncAPI branding and design

### Accessing AsyncAPI Documentation

When you generate the site, AsyncAPI contracts are automatically processed to create:

1. **Summary Page** - A quick overview at `/user-management/user-events.html` with channels and servers
2. **Complete Documentation** - Full interactive docs at `/asyncapi-docs/user-management/user-events/index.html`

The summary page includes a prominent "View Complete AsyncAPI Documentation" button that links to the full documentation.

## 📖 Usage Guide

### Adding OpenAPI Contracts

Create a YAML or JSON file in your domain directory (e.g., `contracts/user-management/`):

```yaml
openapi: 3.0.0
info:
  title: My API
  version: 1.0.0
  description: API description
paths:
  /resource:
    get:
      summary: Get resource
      responses:
        '200':
          description: Success
```

The generated documentation will include:
- **Interactive API documentation** with Redoc
- Detailed endpoint descriptions with request/response schemas
- Code samples and examples
- Searchable API reference
- Downloadable OpenAPI specification

### Adding AsyncAPI Contracts

Create a YAML or JSON file in `contracts/asyncapi/`:

```yaml
asyncapi: 2.6.0
info:
  title: My Events
  version: 1.0.0
channels:
  event.created:
    publish:
      summary: Event created
      message:
        payload:
          type: object
```

### Adding Data Contracts

Create an ODCS v3.1.0 YAML file in `contracts/data/`:

```yaml
domain: my-domain
dataProduct: my-data-product
version: 1.0.0
status: active
kind: DataContract
apiVersion: v3.1.0

description:
  purpose: Define the structure and rules for my data
  usage: Analytics and reporting

schema:
  - name: my_table
    physicalName: my_table
    description: My data table
    properties:
      - name: id
        physicalName: id
        logicalType: string
        required: true
        primaryKey: true
      - name: name
        physicalName: name
        logicalType: string
        required: true
```

## 🎨 Features

- **Simple and Clean UI** - Modern, responsive design
- **Professional OpenAPI Documentation** - Beautiful, interactive API docs powered by Redoc
  - Complete API documentation with request/response examples
  - Interactive schema exploration
  - Search functionality
  - Downloadable OpenAPI specifications
- **Professional AsyncAPI Documentation** - Uses official AsyncAPI Generator with HTML template for rich, interactive event documentation
- **Zero Configuration** - Works out of the box
- **Multiple Contract Types** - OpenAPI, AsyncAPI, and ODCS v3.1.0
- **Static Output** - Deploy anywhere (GitHub Pages, Netlify, etc.)
- **Fast Generation** - Lightweight and efficient
- **Offline-Ready** - All documentation assets are bundled locally

## 📦 Deployment

The generated `output/` directory contains only static HTML files. Deploy to any static hosting service:

- **GitHub Pages**: Copy `output/` to your gh-pages branch
- **Netlify**: Point to the `output/` directory
- **AWS S3**: Upload the `output/` directory
- **Any web server**: Serve the `output/` directory

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

MIT