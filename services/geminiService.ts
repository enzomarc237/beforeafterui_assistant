import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TechStack } from "../types";
import { CodeFile } from "../components/CodeManager";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function fileToGenerativePart(base64Data: string) {
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

const formatCodeFiles = (files: CodeFile[]): string => {
  if (files.length === 0) {
    return "No code was provided for the current UI.";
  }
  return files.map(file => 
    `--- FILE: ${file.name} ---\n\`\`\`\n${file.content}\n\`\`\``
  ).join('\n\n');
};

export async function* analyzeUiDifferenceStream(
  beforeImageBase64: string,
  afterImageBase64: string,
  beforeCodeFiles: CodeFile[],
  additionalInstructions: string,
  stack: TechStack
): AsyncGenerator<string> {
  try {
    const beforeImagePart = fileToGenerativePart(beforeImageBase64);
    const afterImagePart = fileToGenerativePart(afterImageBase64);
    
    const formattedCode = formatCodeFiles(beforeCodeFiles);

    const prompt = `
You are BeforeAfterUI, an expert UI/UX designer and senior frontend developer specializing in ${stack}.

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

3.  **${stack} Implementation Plan:** Provide specific code modifications and new code snippets using ${stack} to implement the changes.
    *   If I provided 'current UI' code, suggest direct edits to it. Use diff-like formats (e.g., lines to remove/add) where helpful.
    *   If no code was provided, write new component code from scratch.
    *   Explain *why* you are making each code change.

Here is the code for the current UI:
${formattedCode}

Here are additional instructions from the user:
${additionalInstructions || "No additional instructions provided."}

Analyze the two images and the provided code/instructions, then generate the transformation plan.
    `;

    const contents = {
        parts: [
            beforeImagePart,
            afterImagePart,
            { text: prompt }
        ]
    };
    
    const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: contents,
    });
    
    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }

  } catch (error) {
    console.error("Error in Gemini API call:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get analysis from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
};