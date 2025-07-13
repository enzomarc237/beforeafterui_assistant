# BeforeAfterUI MCP Server Usage Examples

This document provides practical examples of how to use the BeforeAfterUI MCP server tools.

## Tool: `transform_ui`

Transform a UI from current state to target design using before/after images.

### Example 1: Basic UI Transformation

```json
{
  "tool": "transform_ui",
  "arguments": {
    "beforeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "afterImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "techStack": "React with Tailwind CSS"
  }
}
```

### Example 2: UI Transformation with Existing Code

```json
{
  "tool": "transform_ui",
  "arguments": {
    "beforeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "afterImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "techStack": "React with Tailwind CSS",
    "beforeCodeFiles": [
      {
        "name": "Button.tsx",
        "content": "import React from 'react';\n\nexport const Button = ({ children, onClick }) => {\n  return (\n    <button \n      className=\"bg-blue-500 text-white px-4 py-2 rounded\"\n      onClick={onClick}\n    >\n      {children}\n    </button>\n  );\n};"
      },
      {
        "name": "Card.tsx",
        "content": "import React from 'react';\n\nexport const Card = ({ title, content }) => {\n  return (\n    <div className=\"border rounded-lg p-4 shadow-sm\">\n      <h3 className=\"text-lg font-semibold mb-2\">{title}</h3>\n      <p className=\"text-gray-600\">{content}</p>\n    </div>\n  );\n};"
      }
    ],
    "additionalInstructions": "Make the design more modern with darker colors and better spacing. Add hover effects to interactive elements."
  }
}
```

### Example 3: Mobile-First Transformation

```json
{
  "tool": "transform_ui",
  "arguments": {
    "beforeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "afterImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "techStack": "React Native with StyleSheet",
    "additionalInstructions": "Optimize for mobile devices with touch-friendly interactions and responsive design"
  }
}
```

## Tool: `analyze_ui_image`

Analyze a single UI image for various aspects.

### Example 1: Component Analysis

```json
{
  "tool": "analyze_ui_image",
  "arguments": {
    "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "analysisType": "ui-components",
    "techStack": "React with Tailwind CSS"
  }
}
```

### Example 2: Design Pattern Analysis

```json
{
  "tool": "analyze_ui_image",
  "arguments": {
    "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "analysisType": "design-patterns"
  }
}
```

### Example 3: Accessibility Analysis

```json
{
  "tool": "analyze_ui_image",
  "arguments": {
    "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "analysisType": "accessibility",
    "techStack": "Vue with Tailwind CSS"
  }
}
```

### Example 4: General UI Analysis

```json
{
  "tool": "analyze_ui_image",
  "arguments": {
    "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "analysisType": "general",
    "techStack": "Angular with Tailwind CSS"
  }
}
```

## Tool: `list_tech_stacks`

Get a list of all supported technology stacks.

### Example

```json
{
  "tool": "list_tech_stacks",
  "arguments": {}
}
```

## Integration Examples

### Using with Q CLI

1. Add the server to your Q CLI configuration:

```json
{
  "beforeafterui": {
    "command": "node",
    "args": ["/path/to/beforeafterui-mcp-server/dist/index.js"],
    "env": {
      "GEMINI_API_KEY": "your-api-key-here"
    }
  }
}
```

2. Use in Q CLI conversation:

```
Can you help me transform this UI? I have a before image and an after image.
[Upload images]
Use the beforeafterui___transform_ui tool with React and Tailwind CSS.
```

### Using with Claude Desktop

1. Add to Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "beforeafterui": {
      "command": "node",
      "args": ["/absolute/path/to/beforeafterui-mcp-server/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

2. Use in Claude conversation:

```
I need to analyze this UI design. Can you use the beforeafterui server to identify the components and suggest improvements for a React implementation?
```

## Common Use Cases

### 1. Design System Migration
Transform existing components to match a new design system:

```json
{
  "tool": "transform_ui",
  "arguments": {
    "beforeImage": "[current component screenshot]",
    "afterImage": "[design system component screenshot]",
    "techStack": "React with Tailwind CSS",
    "beforeCodeFiles": [{"name": "Component.tsx", "content": "[existing code]"}],
    "additionalInstructions": "Migrate to our new design system with consistent spacing, colors, and typography"
  }
}
```

### 2. Responsive Design Optimization
Analyze and improve mobile responsiveness:

```json
{
  "tool": "analyze_ui_image",
  "arguments": {
    "imageData": "[mobile screenshot]",
    "analysisType": "general",
    "techStack": "React with Tailwind CSS"
  }
}
```

### 3. Accessibility Audit
Check UI for accessibility issues:

```json
{
  "tool": "analyze_ui_image",
  "arguments": {
    "imageData": "[ui screenshot]",
    "analysisType": "accessibility",
    "techStack": "Vue with Tailwind CSS"
  }
}
```

### 4. Component Library Documentation
Generate component documentation from screenshots:

```json
{
  "tool": "analyze_ui_image",
  "arguments": {
    "imageData": "[component screenshot]",
    "analysisType": "ui-components",
    "techStack": "React with Tailwind CSS"
  }
}
```

## Tips for Best Results

1. **High-quality images**: Use clear, high-resolution screenshots
2. **Consistent lighting**: Ensure screenshots have good contrast
3. **Complete views**: Include full component/page views when possible
4. **Specific instructions**: Provide detailed additional instructions
5. **Relevant code**: Include current implementation code for better transformation suggestions
6. **Appropriate tech stack**: Choose the tech stack that matches your project

## Error Handling

The server provides detailed error messages for common issues:

- Invalid base64 image format
- Missing required parameters
- API key issues
- Network connectivity problems

Always check the error messages for troubleshooting guidance.
