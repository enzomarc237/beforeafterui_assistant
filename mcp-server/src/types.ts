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

export interface CodeFile {
  name: string;
  content: string;
}

export interface UITransformationRequest {
  beforeImage: string; // base64 encoded image
  afterImage: string;  // base64 encoded image
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
  imageData: string; // base64 encoded image
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
