# Contract Catalog

A simple static website generator for documenting your architecture through contracts. Supports OpenAPI, AsyncAPI, and JSON Schema data contracts - think of it as an "Event Catalog lite" solution.

## 🎯 Overview

Contract Catalog automatically generates a beautiful, navigable static website from your API, event, and data contracts. It provides a centralized view of your system architecture by documenting:

- **API Contracts** (OpenAPI 3.0) - REST API specifications
- **Event Contracts** (AsyncAPI 2.x) - Event-driven architecture documentation
- **Data Contracts** (JSON Schema) - Data structure definitions

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
└── data/        # JSON Schema files
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
- **user-schema.json** - JSON Schema for user data structure

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

Create a JSON Schema file in `contracts/data/`:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "My Data Contract",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" }
  },
  "required": ["id", "name"]
}
```

## 🎨 Features

- **Simple and Clean UI** - Modern, responsive design
- **Zero Configuration** - Works out of the box
- **Multiple Contract Types** - OpenAPI, AsyncAPI, and JSON Schema
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