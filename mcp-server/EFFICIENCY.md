# Image & Code Handling Efficiency Guide

## 🚨 Why Inline Content is Problematic for MCP

### Context Window Bloat
- **Large code files consume massive token counts**
- A 500-line React component = ~15,000 tokens
- Multiple files can exceed context limits entirely
- Leaves little room for actual analysis and code generation

### Token Economics
```
Example: React component with 300 lines
├── As file path: "./src/Button.tsx" (4 tokens)
├── As URL: "https://github.com/user/repo/main/src/Button.tsx" (12 tokens)  
└── As inline content: ~9,000 tokens (context killer!)

Example: Full codebase (10 files, 200 lines each)
├── As file paths: ~40 tokens
├── As URLs: ~120 tokens
└── As inline content: ~60,000 tokens (impossible!)
```

## ✅ Recommended Approaches

### 1. File Paths (Most Efficient)
```json
{
  "beforeCodeFiles": [
    {
      "name": "Button.tsx",
      "input": { "filePath": "./src/components/Button.tsx" }
    },
    {
      "name": "Card.tsx", 
      "input": { "filePath": "./src/components/Card.tsx" }
    }
  ]
}
```

**Benefits:**
- Minimal token usage (3-5 tokens per file)
- No encoding overhead
- Supports large codebases
- Best performance
- Automatic file reading

**Use when:**
- Code files are stored locally
- Working with project codebases
- Batch processing multiple components

### 2. URLs (Good for Remote Code)
```json
{
  "beforeCodeFiles": [
    {
      "name": "Button.tsx",
      "input": { "url": "https://raw.githubusercontent.com/user/repo/main/src/Button.tsx" }
    }
  ]
}
```

**Benefits:**
- Low token usage (8-20 tokens per file)
- Works with GitHub/GitLab raw files
- No local storage needed
- Good for sharing examples

**Use when:**
- Code is hosted on GitHub/GitLab
- Sharing components via URLs
- Working with public repositories

### 3. Inline Content (Last Resort Only)
```json
{
  "beforeCodeFiles": [
    {
      "name": "utils.js",
      "input": { "content": "export const formatDate = (date) => date.toISOString();" }
    }
  ]
}
```

**Drawbacks:**
- High token usage (thousands of tokens)
- Context window bloat
- Poor performance with large files

**Only use when:**
- Very small code snippets (<50 lines)
- No file system access available
- Temporary debugging

## 📊 Performance Comparison

### Images
| Method | Token Usage | Context Impact | Performance | Recommended |
|--------|-------------|----------------|-------------|-------------|
| File Path | 2-5 tokens | Minimal | Excellent | ✅ Yes |
| URL | 5-15 tokens | Low | Good | ✅ Yes |
| Base64 | 1,000-50,000+ tokens | Severe | Poor | ❌ No |

### Code Files
| Method | Token Usage (per file) | Context Impact | Performance | Recommended |
|--------|------------------------|----------------|-------------|-------------|
| File Path | 3-5 tokens | Minimal | Excellent | ✅ Yes |
| URL | 8-20 tokens | Low | Good | ✅ Yes |
| Inline Content | 100-50,000+ tokens | Severe | Poor | ❌ No |

### Real-World Example: Component Analysis
```
Analyzing 5 React components (200 lines each):

File Paths:
├── Token usage: ~25 tokens
├── Context available: 99.9% for analysis
└── Performance: Excellent ✅

URLs:
├── Token usage: ~75 tokens  
├── Context available: 99.7% for analysis
└── Performance: Good ✅

Inline Content:
├── Token usage: ~30,000 tokens
├── Context available: 70% for analysis
└── Performance: Poor ❌
```

## 🎯 Best Practices

### File Organization
```
project/
├── ui-analysis/
│   ├── before/
│   │   ├── dashboard.png
│   │   ├── login.png
│   │   └── profile.png
│   ├── after/
│   │   ├── dashboard.png
│   │   ├── login.png
│   │   └── profile.png
│   └── analysis-results/
│       ├── dashboard-analysis.md
│       ├── login-analysis.md
│       └── profile-analysis.md
```

### Naming Conventions
- Use descriptive names: `dashboard-before.png`, `dashboard-after.png`
- Include version/date: `login-v2-2024-01-15.png`
- Separate by feature: `checkout-flow-step1.png`

### Image Optimization
- **Resolution**: Use appropriate resolution (not unnecessarily high)
- **Format**: PNG for UI screenshots, JPG for photos
- **Size**: Keep under 2MB when possible
- **Compression**: Use tools like TinyPNG for web images

## 🔧 Implementation Examples

### Efficient Batch Analysis
```typescript
const uiScreenshots = [
  { name: 'dashboard', before: './ui/dashboard-before.png', after: './ui/dashboard-after.png' },
  { name: 'profile', before: './ui/profile-before.png', after: './ui/profile-after.png' },
  { name: 'settings', before: './ui/settings-before.png', after: './ui/settings-after.png' }
];

for (const ui of uiScreenshots) {
  await transformUI({
    beforeImage: { filePath: ui.before },
    afterImage: { filePath: ui.after },
    techStack: 'React with Tailwind CSS'
  });
}
```

### URL-Based Analysis
```typescript
const designUrls = {
  current: 'https://cdn.example.com/current-design.png',
  target: 'https://cdn.example.com/target-design.png'
};

await transformUI({
  beforeImage: { url: designUrls.current },
  afterImage: { url: designUrls.target },
  techStack: 'Vue with Tailwind CSS'
});
```

## 🚀 Migration from Base64

### Before (Inefficient)
```json
{
  "tool": "transform_ui",
  "arguments": {
    "beforeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...[15,000 more characters]",
    "afterImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...[15,000 more characters]",
    "techStack": "React with Tailwind CSS"
  }
}
```
**Token usage: ~30,000 tokens** 😱

### After (Efficient)
```json
{
  "tool": "transform_ui", 
  "arguments": {
    "beforeImage": { "filePath": "./screenshots/before.png" },
    "afterImage": { "filePath": "./screenshots/after.png" },
    "techStack": "React with Tailwind CSS"
  }
}
```
**Token usage: ~10 tokens** 🎉

## 💡 Pro Tips

1. **Pre-organize images**: Set up a clear folder structure before analysis
2. **Use relative paths**: Keep paths relative to your project root
3. **Batch similar analyses**: Group related UI transformations
4. **Cache results**: Save analysis results to avoid re-processing
5. **Monitor token usage**: Track how much context you're using
6. **Compress images**: Optimize file sizes without losing quality

## 🔍 Troubleshooting

### Common Issues
- **File not found**: Check file paths are relative to MCP server working directory
- **URL timeout**: Ensure URLs are accessible and respond quickly
- **Large files**: Consider resizing images over 5MB
- **Format errors**: Stick to common formats (PNG, JPG, WebP)

### Debug Commands
```bash
# Check file exists
ls -la ./screenshots/before.png

# Test URL accessibility  
curl -I https://example.com/image.png

# Check image size
du -h ./screenshots/*.png
```

This efficiency-focused approach ensures your MCP server can handle many UI analyses without hitting context limits, providing better performance and more detailed results.
