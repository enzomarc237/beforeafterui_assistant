# BeforeAfterUI - AI-Powered UI Transformation Assistant

This project contains both a web application and an MCP server for AI-powered UI transformation and analysis.

## 🌐 Web Application

A React-based web app that helps transform UI designs by comparing before/after images and generating implementation code.

### Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   ```bash
   npm run dev
   ```

## 🔌 MCP Server

An MCP (Model Context Protocol) server that exposes UI transformation capabilities to other AI agents and applications.

### Quick Setup

Run the setup script:
```bash
./setup-mcp.sh
```

Or manually:
```bash
cd mcp-server
npm install
npm run build
export GEMINI_API_KEY="your-api-key-here"
npm start
```

### Available Tools

- **`transform_ui`** - Transform UI from current to target design using before/after images
- **`analyze_ui_image`** - Analyze UI images for components, patterns, accessibility
- **`list_tech_stacks`** - List supported technology stacks

### Supported Tech Stacks

- React with Tailwind CSS
- Vue with Tailwind CSS  
- Angular with Tailwind CSS
- Svelte with Tailwind CSS
- Vanilla JavaScript with CSS
- HTML & CSS
- Flutter
- SwiftUI
- React Native with StyleSheet

### Integration

#### Q CLI Configuration
```json
{
  "beforeafterui": {
    "command": "node",
    "args": ["/path/to/mcp-server/dist/index.js"],
    "env": {
      "GEMINI_API_KEY": "your-api-key-here"
    }
  }
}
```

#### Claude Desktop Configuration
```json
{
  "mcpServers": {
    "beforeafterui": {
      "command": "node", 
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## 📚 Documentation

- [MCP Server README](mcp-server/README.md) - Detailed server documentation
- [Usage Examples](mcp-server/EXAMPLES.md) - Practical usage examples
- [Configuration Examples](mcp-server/mcp-config-example.json) - MCP client configurations

## 🔑 API Key Setup

Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🚀 Use Cases

- **Design System Migration** - Transform components to match new design systems
- **Responsive Design** - Analyze and improve mobile responsiveness  
- **Accessibility Audits** - Check UI for accessibility issues
- **Component Documentation** - Generate docs from UI screenshots
- **Code Generation** - Get implementation code from design mockups

## 🛠️ Development

Both the web app and MCP server are built with TypeScript and use the Google Gemini AI API for image analysis and code generation.
