# BeforeAfterUI: AI-Powered UI Transformation Assistant

## Summary

BeforeAfterUI is a web application that helps users transform their UI designs by comparing a current UI with a target design. The app uses Google's Gemini AI to analyze the differences between the two designs and generate step-by-step implementation guidance for various technology stacks.

## Structure

- **components/**: React components for the UI (CodeInput, ImageUploader, ResultDisplay, etc.)
- **services/**: API integration services (geminiService.ts for Gemini AI)
- **.zencoder/**: Documentation directory
- **root files**: Main application files (App.tsx, index.tsx, vite.config.ts)

## Language & Runtime

**Language**: TypeScript with React
**Version**: TypeScript ~5.7.2, React ^19.1.0
**Build System**: Vite ^6.2.0
**Package Manager**: npm

## Dependencies

**Main Dependencies**:

- React ^19.1.0
- React DOM ^19.1.0
- @google/genai ^1.9.0 (Google Gemini AI SDK)
- marked ^13.0.2 (Markdown parsing)
- highlight.js ^11.10.0 (Code syntax highlighting)
- Tailwind CSS (via CDN)

**Development Dependencies**:

- TypeScript ~5.7.2
- Vite ^6.2.0
- @types/node ^22.14.0

## Build & Installation

```bash
# Install dependencies
npm install

# Set up environment variable
# Create .env.local file with GEMINI_API_KEY

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Application Structure

**Entry Point**: index.tsx renders the main App component
**Main Components**:

- App.tsx: Main application container
- ImageUploader: Handles image uploads for before/after UI
- StackSelector: Tech stack selection (React, Vue, Angular, etc.)
- ResultDisplay: Shows AI-generated transformation plan
- CodeInput: Allows users to input current UI code

## AI Integration

The application uses Google's Gemini AI (gemini-2.5-flash model) to analyze UI differences:

- Sends before/after images to Gemini API
- Includes current code and tech stack information
- Processes AI response into formatted markdown
- Requires GEMINI_API_KEY environment variable

## Features

- Upload current UI screenshot
- Upload target design screenshot
- Select technology stack (React, Vue, Angular, etc.)
- Input current UI code (optional)
- Add custom instructions (optional)
- Generate detailed transformation plan with code examples
