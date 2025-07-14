#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { GeminiService } from "./geminiService.js";
import { 
  TechStack, 
  UITransformationRequest, 
  ImageAnalysisRequest,
  UITransformationResponse,
  ImageAnalysisResponse 
} from "./types.js";

class BeforeAfterUIServer {
  private server: Server;
  private geminiService: GeminiService;

  constructor() {
    this.server = new Server(
      {
        name: "beforeafterui-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize Gemini service
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    this.geminiService = new GeminiService(apiKey);

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "transform_ui",
            description: "Transform a UI from current state to target design using before/after images and optional code",
            inputSchema: {
              type: "object",
              properties: {
                beforeImage: {
                  type: "object",
                  properties: {
                    filePath: {
                      type: "string",
                      description: "Local file path to the current UI image (recommended)"
                    },
                    url: {
                      type: "string",
                      description: "HTTP/HTTPS URL to the current UI image (recommended)"
                    },
                    base64: {
                      type: "string",
                      description: "Base64 encoded image data (discouraged - use filePath or url instead)"
                    }
                  },
                  description: "Current UI image - provide either filePath, url, or base64"
                },
                afterImage: {
                  type: "object",
                  properties: {
                    filePath: {
                      type: "string",
                      description: "Local file path to the target UI design image (recommended)"
                    },
                    url: {
                      type: "string",
                      description: "HTTP/HTTPS URL to the target UI design image (recommended)"
                    },
                    base64: {
                      type: "string",
                      description: "Base64 encoded image data (discouraged - use filePath or url instead)"
                    }
                  },
                  description: "Target UI design image - provide either filePath, url, or base64"
                },
                techStack: {
                  type: "string",
                  enum: Object.values(TechStack),
                  description: "Technology stack to use for implementation"
                },
                beforeCodeFiles: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { 
                        type: "string",
                        description: "Name/identifier for the code file"
                      },
                      input: {
                        type: "object",
                        properties: {
                          filePath: {
                            type: "string",
                            description: "Local file path to code file (recommended)"
                          },
                          url: {
                            type: "string", 
                            description: "HTTP/HTTPS URL to code file"
                          },
                          content: {
                            type: "string",
                            description: "Inline code content (discouraged for large files)"
                          }
                        },
                        description: "Code input - provide either filePath, url, or content"
                      }
                    },
                    required: ["name", "input"]
                  },
                  description: "Optional array of current code files"
                },
                additionalInstructions: {
                  type: "string",
                  description: "Optional additional instructions for the transformation"
                }
              },
              required: ["beforeImage", "afterImage", "techStack"]
            }
          },
          {
            name: "analyze_ui_image",
            description: "Analyze a single UI image for components, design patterns, accessibility, or general assessment",
            inputSchema: {
              type: "object",
              properties: {
                imageData: {
                  type: "object",
                  properties: {
                    filePath: {
                      type: "string",
                      description: "Local file path to the UI image (recommended)"
                    },
                    url: {
                      type: "string",
                      description: "HTTP/HTTPS URL to the UI image (recommended)"
                    },
                    base64: {
                      type: "string",
                      description: "Base64 encoded image data (discouraged - use filePath or url instead)"
                    }
                  },
                  description: "UI image to analyze - provide either filePath, url, or base64"
                },
                analysisType: {
                  type: "string",
                  enum: ["ui-components", "design-patterns", "accessibility", "general"],
                  description: "Type of analysis to perform"
                },
                techStack: {
                  type: "string",
                  enum: Object.values(TechStack),
                  description: "Optional technology stack for implementation suggestions"
                }
              },
              required: ["imageData", "analysisType"]
            }
          },
          {
            name: "list_tech_stacks",
            description: "List all supported technology stacks",
            inputSchema: {
              type: "object",
              properties: {}
            }
          }
        ] as Tool[]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "transform_ui":
            return await this.handleUITransformation(args as unknown as UITransformationRequest);
            
          case "analyze_ui_image":
            return await this.handleImageAnalysis(args as unknown as ImageAnalysisRequest);
            
          case "list_tech_stacks":
            return await this.handleListTechStacks();
            
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return {
          content: [
            {
              type: "text",
              text: `Error: ${errorMessage}`
            }
          ]
        };
      }
    });
  }

  private async handleUITransformation(request: UITransformationRequest) {
    try {
      const analysis = await this.geminiService.analyzeUITransformation(request);
      
      const response: UITransformationResponse = {
        analysis,
        success: true
      };

      return {
        content: [
          {
            type: "text",
            text: `# UI Transformation Analysis\n\n${analysis}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return {
        content: [
          {
            type: "text",
            text: `# UI Transformation Failed\n\nError: ${errorMessage}`
          }
        ]
      };
    }
  }

  private async handleImageAnalysis(request: ImageAnalysisRequest) {
    try {
      const analysis = await this.geminiService.analyzeImage(request);
      
      const response: ImageAnalysisResponse = {
        analysis,
        success: true
      };

      return {
        content: [
          {
            type: "text",
            text: `# UI Image Analysis (${request.analysisType})\n\n${analysis}`
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return {
        content: [
          {
            type: "text",
            text: `# Image Analysis Failed\n\nError: ${errorMessage}`
          }
        ]
      };
    }
  }

  private async handleListTechStacks() {
    const stacks = Object.entries(TechStack).map(([key, value]) => ({
      key,
      value,
      description: `Use "${value}" as the techStack parameter`
    }));

    const stackList = stacks.map(stack => 
      `- **${stack.key}**: ${stack.value}`
    ).join('\n');

    return {
      content: [
        {
          type: "text",
          text: `# Supported Technology Stacks\n\n${stackList}\n\n## Usage\nUse the exact value (not the key) when calling tools that require a techStack parameter.`
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("BeforeAfterUI MCP server running on stdio");
  }
}

// Start the server
const server = new BeforeAfterUIServer();
server.run().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
