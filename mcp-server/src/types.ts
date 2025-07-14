export enum TechStack {
  React = "React with Tailwind CSS",
  Vue = "Vue with Tailwind CSS",
  Angular = "Angular with Tailwind CSS",
  Svelte = "Svelte with Tailwind CSS",
  JavaScript = "Vanilla JavaScript with CSS",
  HTMLCSS = "HTML & CSS",
  Flutter = "Flutter",
  SwiftUI = "SwiftUI",
  ReactNative = "React Native with StyleSheet",
}

export interface ImageInput {
  // Support multiple input methods
  filePath?: string;    // Local file path
  url?: string;         // HTTP/HTTPS URL
  base64?: string;      // Fallback for base64 (discouraged)
}

export interface CodeInput {
  // Support multiple input methods for code
  filePath?: string;    // Local file path (recommended)
  content?: string;     // Inline content (discouraged for large files)
  url?: string;         // HTTP/HTTPS URL to code file
}

export interface CodeFile {
  name: string;
  input: CodeInput;
}

export interface UITransformationRequest {
  beforeImage: ImageInput;
  afterImage: ImageInput;
  techStack: TechStack;
  beforeCodeFiles?: CodeFile[];
  additionalInstructions?: string;
}

export interface UITransformationResponse {
  analysis: string;
  success: boolean;
  error?: string;
}

export interface ImageAnalysisRequest {
  imageData: ImageInput;
  analysisType: 'ui-components' | 'design-patterns' | 'accessibility' | 'general';
  techStack?: TechStack;
}

export interface ImageAnalysisResponse {
  analysis: string;
  components?: string[];
  suggestions?: string[];
  success: boolean;
  error?: string;
}
