#!/bin/bash

# BeforeAfterUI MCP Server Setup Script

echo "🚀 Setting up BeforeAfterUI MCP Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Navigate to MCP server directory
cd mcp-server

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build TypeScript"
    exit 1
fi

echo "✅ Build completed successfully"

# Check for Gemini API key
if [ -z "$GEMINI_API_KEY" ]; then
    echo ""
    echo "⚠️  GEMINI_API_KEY environment variable not set"
    echo "   You'll need to set this before using the server:"
    echo "   export GEMINI_API_KEY='your-api-key-here'"
    echo ""
    echo "   Get your API key from: https://makersuite.google.com/app/apikey"
else
    echo "✅ GEMINI_API_KEY environment variable is set"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set your Gemini API key: export GEMINI_API_KEY='your-key'"
echo "2. Test the server: cd mcp-server && npm start"
echo "3. Add to your MCP client configuration (see README.md)"
echo ""
echo "Configuration example for Q CLI:"
echo "{"
echo '  "beforeafterui": {'
echo '    "command": "node",'
echo "    \"args\": [\"$(pwd)/dist/index.js\"],"
echo '    "env": {'
echo '      "GEMINI_API_KEY": "your-api-key-here"'
echo '    }'
echo '  }'
echo "}"
echo ""
echo "For more information, see:"
echo "- mcp-server/README.md"
echo "- mcp-server/EXAMPLES.md"
