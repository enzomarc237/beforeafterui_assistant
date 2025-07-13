
import { TechStack } from './types';

interface TechStackOption {
  id: TechStack;
  name: string;
}

export const TECH_STACKS: TechStackOption[] = [
  { id: TechStack.React, name: "React with Tailwind" },
  { id: TechStack.Vue, name: "Vue with Tailwind" },
  { id: TechStack.Angular, name: "Angular with Tailwind" },
  { id: TechStack.Svelte, name: "Svelte with Tailwind" },
  { id: TechStack.JavaScript, name: "Vanilla JavaScript & CSS" },
  { id: TechStack.HTMLCSS, name: "HTML & CSS" },
  { id: TechStack.ReactNative, name: "React Native" },
  { id: TechStack.Flutter, name: "Flutter" },
  { id: TechStack.SwiftUI, name: "SwiftUI" },
];
