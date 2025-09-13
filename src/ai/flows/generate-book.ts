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
import {generateBookCover} from './generate-book-cover';


const GenerateBookInputSchema = z.object({
  topic: z.string().describe('The topic or genre for which to generate a book suggestion.'),
});
export type GenerateBookInput = z.infer<typeof GenerateBookInputSchema>;

const GenerateBookOutputSchema = z.object({
  title: z.string().describe('The title of the generated book.'),
  author: z.string().describe('The author of the generated book. Should be a plausible but fictional name.'),
  // A simple regex for ISBN-13, allowing optional hyphens.
  isbn: z.string().regex(/^(978|979)-?[0-9]{1,5}-?[0-9]{1,7}-?[0-9]{1,6}-?[0-9X]$|^[0-9]{13}$/, "A valid ISBN-13 is required.").describe('A valid, unique, and fictional ISBN-13 for the book.'),
  genre: z.string().describe('The genre of the generated book.'),
  coverImage: z.string().optional().describe("A data URI of the generated book cover image. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateBookOutput = z.infer<typeof GenerateBookOutputSchema>;


export async function generateBook(input: GenerateBookInput): Promise<GenerateBookOutput> {
  return generateBookFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBookPrompt',
  input: {schema: GenerateBookInputSchema},
  output: {schema: GenerateBookOutputSchema.omit({ coverImage: true })}, // The prompt itself doesn't generate the image
  prompt: `You are an expert librarian and author with a knack for creating compelling, fictional book titles and details.

  Based on the following topic, generate a single, realistic-sounding but entirely fictional book.

  Your response must include a unique title, a plausible author name, a validly formatted ISBN-13 (e.g., 978-3-16-148410-0), and a suitable genre.

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
    // Run book detail generation and cover generation in parallel
    const [bookDetailsResult, coverImageResult] = await Promise.allSettled([
        prompt(input),
        generateBookCover({ topic: input.topic, genre: '', title: '' }), // Initial call, will be refined
    ]);

    if (bookDetailsResult.status === 'rejected') {
        throw bookDetailsResult.reason;
    }
    
    const bookDetails = bookDetailsResult.value.output;
    if (!bookDetails) {
        throw new Error('Failed to generate book details.');
    }

    // Now call cover generation again with the real title and genre
    const { coverImage } = await generateBookCover({
        title: bookDetails.title,
        genre: bookDetails.genre,
    });

    return {
        ...bookDetails,
        coverImage,
    };
  }
);
