'use server';

/**
 * @fileOverview An AI agent that generates a book cover image.
 *
 * - generateBookCover - A function that handles the book cover generation process.
 * - GenerateBookCoverInput - The input type for the generateBookCover function.
 * - GenerateBookCoverOutput - The return type for the generateBookCover function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const GenerateBookCoverInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  genre: z.string().describe('The genre of the book.'),
});
export type GenerateBookCoverInput = z.infer<typeof GenerateBookCoverInputSchema>;

const GenerateBookCoverOutputSchema = z.object({
  coverImage: z.string().describe("A data URI of the generated book cover image. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateBookCoverOutput = z.infer<typeof GenerateBookCoverOutputSchema>;

export async function generateBookCover(input: GenerateBookCoverInput): Promise<GenerateBookCoverOutput> {
  return generateBookCoverFlow(input);
}

const generateBookCoverFlow = ai.defineFlow(
  {
    name: 'generateBookCoverFlow',
    inputSchema: GenerateBookCoverInputSchema,
    outputSchema: GenerateBookCoverOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: googleAI.model('imagen-2.0-fast-generate-001'),
      prompt: `Generate a visually appealing and marketable book cover for a book titled "${input.title}". The genre is ${input.genre}. The cover should be professional, eye-catching, and suitable for a bestseller. Do not include any text on the cover.`,
    });

    if (!media.url) {
      throw new Error('Failed to generate book cover image.');
    }

    return {
      coverImage: media.url,
    };
  }
);
