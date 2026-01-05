
import { GoogleGenAI, Type } from "@google/genai";
import { ArtConfig } from "../types";

export const generateArtParams = async (prompt: string): Promise<ArtConfig> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Transform this mood or theme into physics-based generative art parameters: "${prompt}". 
    Create a unique visual system. Return a logical JSON configuration.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          particleCount: { type: Type.INTEGER, description: "Number of particles (50-300)" },
          particleSize: { 
            type: Type.ARRAY, 
            items: { type: Type.NUMBER }, 
            description: "Min and Max size as [min, max]" 
          },
          speed: { type: Type.NUMBER, description: "Base velocity magnitude" },
          connectionRadius: { type: Type.NUMBER, description: "Distance at which particles connect with lines (0-200)" },
          colors: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING }, 
            description: "Hex color codes for the theme" 
          },
          background: { type: Type.STRING, description: "Dark hex background color" },
          gravity: { type: Type.NUMBER, description: "Gravity constant (-0.1 to 0.1)" },
          friction: { type: Type.NUMBER, description: "Friction (0.9 to 1.0)" },
          vortexStrength: { type: Type.NUMBER, description: "Pull towards center (0 to 0.5)" },
          shapeType: { 
            type: Type.STRING, 
            enum: ['circle', 'square', 'line'], 
            description: "The visual primitive" 
          }
        },
        required: ["particleCount", "particleSize", "speed", "connectionRadius", "colors", "background", "gravity", "friction", "vortexStrength", "shapeType"]
      }
    }
  });

  return JSON.parse(response.text);
};
