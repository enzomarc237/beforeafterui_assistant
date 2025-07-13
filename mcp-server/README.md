# BeforeAfterUI MCP Server

An MCP (Model Context Protocol) server that provides AI-powered UI transformation and analysis capabilities to other AI agents and applications.

## Features

### Tools Available

1. **`transform_ui`** - Transform UI from current state to target design
   - Compare before/after UI screenshots
   - Generate detailed transformation plans
   - Provide technology-specific implementation code
   - Support for multiple tech stacks

2. **`analyze_ui_image`** - Analyze single UI images
   - UI component identification
   - Design pattern analysis
   - Accessibility assessment
   - General UI evaluation

3. **`list_tech_stacks`** - List supported technology stacks
   - React with Tailwind CSS
   - Vue with Tailwind CSS
   - Angular with Tailwind CSS
   - Svelte with Tailwind CSS
   - Vanilla JavaScript with CSS
   - HTML & CSS
   - Flutter
   - SwiftUI
   - React Native with StyleSheet

## Setup

### Prerequisites
- Node.js 18+
- Gemini API key from Google AI Studio

### Installation

1. Install dependencies:
   ```bash
   cd mcp-server
   npm install
   ```

2. Build the TypeScript code:
   ```bash
   npm run build
   ```

3. Set up environment variables:
   ```bash
   export GEMINI_API_KEY="your-gemini-api-key-here"
   ```

### Running the Server

```bash
npm start
```

Or for development with auto-rebuild:
```bash
npm run dev
```

## Usage with MCP Clients

### Configuration for Claude Desktop

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "beforeafterui": {
      "command": "node",
      "args": ["/path/to/beforeafterui-mcp-server/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your-gemini-api-key-here"
      }
    }
  }
}
```

### Configuration for Q CLI

Add to your Q CLI MCP configuration:

```json
{
  "beforeafterui": {
    "command": "node",
    "args": ["/path/to/beforeafterui-mcp-server/dist/index.js"],
    "env": {
      "GEMINI_API_KEY": "your-gemini-api-key-here"
    }
  }
}
```

## Tool Usage Examples

### Transform UI

```typescript
// Example tool call
{
  "name": "transform_ui",
  "arguments": {
    "beforeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "afterImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "techStack": "React with Tailwind CSS",
    "beforeCodeFiles": [
      {
        "name": "Button.tsx",
        "content": "export const Button = () => <button>Click me</button>"
      }
    ],
    "additionalInstructions": "Make the button more modern with rounded corners"
  }
}
```

### Analyze UI Image

```typescript
// Example tool call
{
  "name": "analyze_ui_image",
  "arguments": {
    "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "analysisType": "ui-components",
    "techStack": "React with Tailwind CSS"
  }
}
```

### List Tech Stacks

```typescript
// Example tool call
{
  "name": "list_tech_stacks",
  "arguments": {}
}
```

## API Reference

### UITransformationRequest

```typescript
interface UITransformationRequest {
  beforeImage: string;        // base64 encoded image
  afterImage: string;         // base64 encoded image
  techStack: TechStack;       // target technology stack
  beforeCodeFiles?: CodeFile[]; // optional current code files
  additionalInstructions?: string; // optional additional instructions
}
```

### ImageAnalysisRequest

```typescript
interface ImageAnalysisRequest {
  imageData: string;          // base64 encoded image
  analysisType: 'ui-components' | 'design-patterns' | 'accessibility' | 'general';
  techStack?: TechStack;      // optional tech stack for suggestions
}
```

### CodeFile

```typescript
interface CodeFile {
  name: string;    // filename
  content: string; // file content
}
```

## Error Handling

The server provides detailed error messages for:
- Invalid API keys
- Malformed base64 images
- Network connectivity issues
- Invalid tool parameters

## Development

### Project Structure

```
mcp-server/
├── src/
│   ├── index.ts          # Main server implementation
│   ├── geminiService.ts  # Gemini AI service wrapper
│   └── types.ts          # TypeScript type definitions
├── dist/                 # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev  # Watches for changes and rebuilds
```

## License

MIT License
