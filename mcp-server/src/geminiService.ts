import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai";
import { TechStack, CodeFile, UITransformationRequest, ImageAnalysisRequest, ImageInput } from "./types.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Gemini API key is required");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private async imageInputToGenerativePart(imageInput: ImageInput) {
    let base64Data: string;
    
    if (imageInput.filePath) {
      // Read from local file system
      try {
        const buffer = readFileSync(resolve(imageInput.filePath));
        const mimeType = this.getMimeTypeFromPath(imageInput.filePath);
        base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;
      } catch (error) {
        throw new Error(`Failed to read image file: ${imageInput.filePath}. ${error}`);
      }
    } else if (imageInput.url) {
      // Fetch from URL
      try {
        const response = await fetch(imageInput.url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        const mimeType = response.headers.get('content-type') || 'image/jpeg';
        base64Data = `data:${mimeType};base64,${Buffer.from(buffer).toString('base64')}`;
      } catch (error) {
        throw new Error(`Failed to fetch image from URL: ${imageInput.url}. ${error}`);
      }
    } else if (imageInput.base64) {
      // Use provided base64 (fallback)
      base64Data = imageInput.base64;
    } else {
      throw new Error("No valid image input provided. Use filePath, url, or base64.");
    }

    return this.fileToGenerativePart(base64Data);
  }

  private getMimeTypeFromPath(filePath: string): string {
    const ext = filePath.toLowerCase().split('.').pop();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      case 'bmp':
        return 'image/bmp';
      default:
        return 'image/jpeg'; // Default fallback
    }
  }

  private fileToGenerativePart(base64Data: string) {
    const match = base64Data.match(/data:(.*);base64,(.*)/);
    if (!match) {
      throw new Error("Invalid base64 string format");
    }
    const mimeType = match[1];
    const data = match[2];
    return {
      inlineData: {
        mimeType,
        data,
      },
    };
  }

  private formatCodeFiles(files: CodeFile[]): string {
    if (!files || files.length === 0) {
      return "No code was provided for the current UI.";
    }
    return files.map(file => 
      `--- FILE: ${file.name} ---\n\`\`\`\n${file.content}\n\`\`\``
    ).join('\n\n');
  }

  async analyzeUITransformation(request: UITransformationRequest): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const beforeImagePart = await this.imageInputToGenerativePart(request.beforeImage);
      const afterImagePart = await this.imageInputToGenerativePart(request.afterImage);
      
      const formattedCode = this.formatCodeFiles(request.beforeCodeFiles || []);

      const prompt = `
You are BeforeAfterUI, an expert UI/UX designer and senior frontend developer specializing in ${request.techStack}.

Your task is to analyze the differences between a 'current UI' and a 'target design'. I have provided a screenshot and the source code for the 'current UI'. I have also provided a screenshot of the 'target design'.

Your goal is to provide a detailed, actionable plan to transform the current UI into the target design. Your response must be in Markdown format.

**Analysis Steps & Output Format:**

1.  **High-Level Summary:** Start with a brief paragraph describing the main visual and structural changes required (e.g., "The target design introduces a darker theme, improves spacing, and uses a more modern font...").

2.  **Detailed Breakdown:** Compare the two images and list the specific differences. Categorize them clearly:
    *   **Layout & Spacing:** Changes in element positioning, margins, padding, alignment, and overall structure.
    *   **Color Palette:** Differences in background, text, button, and accent colors. Provide hex codes if you can identify them.
    *   **Typography:** Changes in font family, size, weight, and line height.
    *   **Component Redesign:** Identify components that need significant redesign (e.g., buttons, cards, inputs).
    *   **New/Removed Elements:** List any UI elements present in the target but missing from the current, or vice-versa.

3.  **${request.techStack} Implementation Plan:** Provide specific code modifications and new code snippets using ${request.techStack} to implement the changes.
    *   If I provided 'current UI' code, suggest direct edits to it. Use diff-like formats (e.g., lines to remove/add) where helpful.
    *   If no code was provided, write new component code from scratch.
    *   Explain *why* you are making each code change.

Here is the code for the current UI:
${formattedCode}

Here are additional instructions from the user:
${request.additionalInstructions || "No additional instructions provided."}

Analyze the two images and the provided code/instructions, then generate the transformation plan.
      `;

      const result: GenerateContentResult = await model.generateContent([
        beforeImagePart,
        afterImagePart,
        prompt
      ]);
      
      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error("Error in Gemini API call:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to get analysis from AI: ${error.message}`);
      }
      throw new Error("An unknown error occurred while communicating with the AI.");
    }
  }

  async analyzeImage(request: ImageAnalysisRequest): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const imagePart = await this.imageInputToGenerativePart(request.imageData);
      
      let prompt = "";
      
      switch (request.analysisType) {
        case 'ui-components':
          prompt = `
Analyze this UI screenshot and identify all the UI components present. For each component, provide:
1. Component name and type
2. Current styling and properties
3. Suggested improvements
4. ${request.techStack ? `Implementation approach using ${request.techStack}` : 'General implementation notes'}

Format your response in Markdown with clear sections for each component.
          `;
          break;
          
        case 'design-patterns':
          prompt = `
Analyze this UI screenshot and identify the design patterns being used. Provide:
1. Layout patterns (grid, flexbox, etc.)
2. Navigation patterns
3. Content organization patterns
4. Visual hierarchy patterns
5. Interaction patterns (if observable)
6. Suggestions for improvements

Format your response in Markdown.
          `;
          break;
          
        case 'accessibility':
          prompt = `
Analyze this UI screenshot for accessibility considerations. Provide:
1. Color contrast issues (if any are visible)
2. Text readability concerns
3. UI element sizing and spacing
4. Navigation accessibility
5. Suggestions for accessibility improvements
6. ${request.techStack ? `Specific ${request.techStack} accessibility implementation tips` : 'General accessibility implementation notes'}

Format your response in Markdown.
          `;
          break;
          
        case 'general':
        default:
          prompt = `
Provide a comprehensive analysis of this UI screenshot including:
1. Overall design quality and user experience
2. Visual hierarchy and layout
3. Component identification and assessment
4. Color scheme and typography
5. Potential improvements
6. ${request.techStack ? `Implementation considerations for ${request.techStack}` : 'General implementation notes'}

Format your response in Markdown.
          `;
          break;
      }

      const result: GenerateContentResult = await model.generateContent([
        imagePart,
        prompt
      ]);
      
      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error("Error in Gemini API call:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to analyze image: ${error.message}`);
      }
      throw new Error("An unknown error occurred while analyzing the image.");
    }
  }
}
