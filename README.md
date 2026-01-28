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

Place your contract files in the appropriate directories:

```
contracts/
├── openapi/     # OpenAPI YAML/JSON files
├── asyncapi/    # AsyncAPI YAML/JSON files
└── data/        # ODCS YAML files (Open Data Contract Standard v3.1.0)
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
├── contracts/              # Your contract files
│   ├── openapi/           # OpenAPI specifications
│   ├── asyncapi/          # AsyncAPI specifications
│   └── data/              # JSON Schema contracts
├── src/                   # Source code
│   ├── parsers/          # Contract parsers
│   ├── generators/       # Site generator
│   ├── templates/        # HTML templates
│   └── index.ts          # Entry point
├── output/               # Generated static site (gitignored)
└── dist/                 # Compiled TypeScript (gitignored)
```

## 📝 Example Contracts

The repository includes example contracts to help you get started:

- **user-api.yaml** - OpenAPI specification for a User Management API
- **user-events.yaml** - AsyncAPI specification for user lifecycle events
- **user-contract.yaml** - ODCS v3.1.0 data contract for user data structure

## 🛠️ Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run generate` - Generate the static site from contracts
- `npm run serve` - Serve the generated site locally
- `npm run dev` - Build, generate, and serve in one command

## 📖 Usage Guide

### Adding OpenAPI Contracts

Create a YAML or JSON file in `contracts/openapi/`:

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
- **Zero Configuration** - Works out of the box
- **Multiple Contract Types** - OpenAPI, AsyncAPI, and ODCS v3.1.0
- **Static Output** - Deploy anywhere (GitHub Pages, Netlify, etc.)
- **Fast Generation** - Lightweight and efficient

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