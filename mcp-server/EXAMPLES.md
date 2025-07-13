# BeforeAfterUI MCP Server Usage Examples

This document provides practical examples of how to use the BeforeAfterUI MCP server tools.

## 🚀 Efficient Image Input Methods

**Recommended approaches (in order of preference):**
1. **File paths** - Most efficient, no context bloat
2. **URLs** - Good for web images, moderate efficiency  
3. **Base64** - Discouraged, causes context window bloat

## Tool: `transform_ui`

Transform a UI from current state to target design using before/after images.

### Example 1: Using Local File Paths (Recommended)

```json
{
  "tool": "transform_ui",
  "arguments": {
    "beforeImage": {
      "filePath": "./screenshots/current-ui.png"
    },
    "afterImage": {
      "filePath": "./screenshots/target-design.png"
    },
    "techStack": "React with Tailwind CSS"
  }
}
```

### Example 2: Using URLs (Good for Web Images)

```json
{
  "tool": "transform_ui",
  "arguments": {
    "beforeImage": {
      "url": "https://example.com/current-ui.png"
    },
    "afterImage": {
      "url": "https://example.com/target-design.png"
    },
    "techStack": "React with Tailwind CSS"
  }
}
```

### Example 3: With Existing Code Files

```json
{
  "tool": "transform_ui",
  "arguments": {
    "beforeImage": {
      "filePath": "./ui-screenshots/before.png"
    },
    "afterImage": {
      "filePath": "./ui-screenshots/after.png"
    },
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

### Example 4: Mobile-First Transformation

```json
{
  "tool": "transform_ui",
  "arguments": {
    "beforeImage": {
      "filePath": "./mobile-ui/current.png"
    },
    "afterImage": {
      "filePath": "./mobile-ui/target.png"
    },
    "techStack": "React Native with StyleSheet",
    "additionalInstructions": "Optimize for mobile devices with touch-friendly interactions and responsive design"
  }
}
```

## Tool: `analyze_ui_image`

Analyze a single UI image for various aspects.

### Example 1: Component Analysis with File Path

```json
{
  "tool": "analyze_ui_image",
  "arguments": {
    "imageData": {
      "filePath": "./ui-analysis/dashboard.png"
    },
    "analysisType": "ui-components",
    "techStack": "React with Tailwind CSS"
  }
}
```

### Example 2: Design Pattern Analysis with URL

```json
{
  "tool": "analyze_ui_image",
  "arguments": {
    "imageData": {
      "url": "https://dribbble.com/shots/example-ui.png"
    },
    "analysisType": "design-patterns"
  }
}
```

### Example 3: Accessibility Analysis

```json
{
  "tool": "analyze_ui_image",
  "arguments": {
    "imageData": {
      "filePath": "./accessibility-audit/form.png"
    },
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
    "imageData": {
      "filePath": "./ui-review/landing-page.png"
    },
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

## 🎯 Best Practices

### Image Input Efficiency

1. **Use file paths when possible**:
   ```json
   "beforeImage": { "filePath": "./screenshots/ui.png" }
   ```

2. **Use URLs for web images**:
   ```json
   "beforeImage": { "url": "https://example.com/ui.png" }
   ```

3. **Avoid base64 unless necessary**:
   ```json
   // Only use as last resort
   "beforeImage": { "base64": "data:image/png;base64,iVBORw0..." }
   ```

### File Organization

```
project/
├── ui-screenshots/
│   ├── before/
│   │   ├── dashboard.png
│   │   ├── login.png
│   │   └── profile.png
│   └── after/
│       ├── dashboard.png
│       ├── login.png
│       └── profile.png
└── analysis/
    ├── components/
    ├── accessibility/
    └── patterns/
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
I have UI screenshots in ./screenshots/before.png and ./screenshots/after.png. 
Can you use the beforeafterui___transform_ui tool to analyze the differences 
and generate React code for the transformation?
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
I need to analyze this UI design at ./ui-mockups/dashboard.png. 
Can you use the beforeafterui server to identify the components 
and suggest improvements for a React implementation?
```

## Common Use Cases

### 1. Design System Migration
Transform existing components to match a new design system:

```json
{
  "tool": "transform_ui",
  "arguments": {
    "beforeImage": { "filePath": "./current-components/button.png" },
    "afterImage": { "filePath": "./design-system/button.png" },
    "techStack": "React with Tailwind CSS",
    "beforeCodeFiles": [{"name": "Button.tsx", "content": "[existing code]"}],
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
    "imageData": { "filePath": "./mobile-screenshots/checkout.png" },
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
    "imageData": { "filePath": "./accessibility-review/form.png" },
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
    "imageData": { "filePath": "./component-library/card-variants.png" },
    "analysisType": "ui-components",
    "techStack": "React with Tailwind CSS"
  }
}
```

## 🔧 Troubleshooting

### Common Issues

1. **File not found**: Ensure file paths are relative to the MCP server's working directory
2. **URL access**: Check that URLs are publicly accessible and return valid images
3. **Image format**: Supported formats: PNG, JPG, JPEG, GIF, WebP, BMP
4. **File permissions**: Ensure the MCP server has read access to image files

### Error Messages

- `Failed to read image file`: Check file path and permissions
- `Failed to fetch image from URL`: Verify URL accessibility and format
- `Invalid base64 string format`: Check base64 encoding format
- `No valid image input provided`: Ensure at least one input method is specified

## 💡 Tips for Best Results

1. **High-quality images**: Use clear, high-resolution screenshots (but not unnecessarily large)
2. **Consistent lighting**: Ensure screenshots have good contrast
3. **Complete views**: Include full component/page views when possible
4. **Specific instructions**: Provide detailed additional instructions
5. **Relevant code**: Include current implementation code for better transformation suggestions
6. **Appropriate tech stack**: Choose the tech stack that matches your project
7. **Organize files**: Keep screenshots organized in logical folder structures
