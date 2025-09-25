
import { GoogleGenAI } from "@google/genai";
import { AspectRatio, GeneratedImage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImagesFromPrompt = async (
  prompt: string,
  numberOfImages: number,
  aspectRatio: AspectRatio
): Promise<GeneratedImage[]> => {
  try {
    console.log(`Generating ${numberOfImages} image(s) with aspect ratio ${aspectRatio} for prompt: "${prompt}"`);
    
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt,
      config: {
        numberOfImages,
        outputMimeType: 'image/jpeg',
        aspectRatio,
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("API returned no images.");
    }
    
    return response.generatedImages.map((img, index) => {
        const base64ImageBytes: string = img.image.imageBytes;
        return {
          id: `${Date.now()}-${index}`,
          url: `data:image/jpeg;base64,${base64ImageBytes}`,
          prompt: prompt,
        };
    });

  } catch (error) {
    console.error("Error generating images:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
};
