'use server';

/**
 * @fileOverview An AI agent that summarizes a book.
 *
 * - summarizeBook - A function that handles the book summarization process.
 * - SummarizeBookInput - The input type for the summarizeBook function.
 * - SummarizeBookOutput - The return type for the summarizeBook function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeBookInputSchema = z.object({
  title: z.string().describe('The title of the book to summarize.'),
  author: z.string().describe('The author of the book to summarize.'),
});
export type SummarizeBookInput = z.infer<typeof SummarizeBookInputSchema>;

const SummarizeBookOutputSchema = z.object({
  summary: z.string().describe('A concise, engaging summary of the book, as if written for a library catalog.'),
});
export type SummarizeBookOutput = z.infer<typeof SummarizeBookOutputSchema>;


export async function summarizeBook(input: SummarizeBookInput): Promise<SummarizeBookOutput> {
  return summarizeBookFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeBookPrompt',
  input: {schema: SummarizeBookInputSchema},
  output: {schema: SummarizeBookOutputSchema},
  prompt: `You are an expert librarian creating a catalog summary for a book.

  Based on the title and author, generate a concise, engaging, and completely fictional summary for the book. The summary should be about 2-3 sentences long and give a sense of the book's plot or main themes.

  Title: {{title}}
  Author: {{author}}
  `,
});

const summarizeBookFlow = ai.defineFlow(
  {
    name: 'summarizeBookFlow',
    inputSchema: SummarizeBookInputSchema,
    outputSchema: SummarizeBookOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
