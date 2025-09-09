'use server';

/**
 * @fileOverview An AI agent that generates details for a new book.
 *
 * - generateBook - A function that handles the book generation process.
 * - GenerateBookInput - The input type for the generateBook function.
 * - GenerateBookOutput - The return type for the generateBook function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookInputSchema = z.object({
  topic: z.string().describe('The topic or genre for which to generate a book suggestion.'),
});
export type GenerateBookInput = z.infer<typeof GenerateBookInputSchema>;

const GenerateBookOutputSchema = z.object({
  title: z.string().describe('The title of the generated book.'),
  author: z.string().describe('The author of the generated book. Should be a plausible but fictional name.'),
  // Regex for ISBN-10 or ISBN-13
  isbn: z.string().regex(/^(?:ISBN(?:-13)?:?)(?=[0-9]{13}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)97[89][- ]?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$|^(?:ISBN(?:-10)?:?)(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$)[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/).describe('A valid, unique, and fictional ISBN-13 for the book.'),
  genre: z.string().describe('The genre of the generated book.'),
});
export type GenerateBookOutput = z.infer<typeof GenerateBookOutputSchema>;


export async function generateBook(input: GenerateBookInput): Promise<GenerateBookOutput> {
  return generateBookFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBookPrompt',
  input: {schema: GenerateBookInputSchema},
  output: {schema: GenerateBookOutputSchema},
  prompt: `You are an expert librarian and author with a knack for creating compelling, fictional book titles and details.

  Based on the following topic, generate a single, realistic-sounding but entirely fictional book.

  Your response must include a unique title, a plausible author name, a validly formatted ISBN-13, and a suitable genre.

  Topic: {{topic}}
  `,
});

const generateBookFlow = ai.defineFlow(
  {
    name: 'generateBookFlow',
    inputSchema: GenerateBookInputSchema,
    outputSchema: GenerateBookOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
