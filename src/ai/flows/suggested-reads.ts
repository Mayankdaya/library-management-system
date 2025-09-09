'use server';

/**
 * @fileOverview An AI agent that suggests books based on a user's borrowing history.
 *
 * - suggestReads - A function that handles the book suggestion process.
 * - SuggestedReadsInput - The input type for the suggestReads function.
 * - SuggestedReadsOutput - The return type for the suggestReads function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestedReadsInputSchema = z.object({
  borrowingHistory: z.array(
    z.object({
      title: z.string().describe('The title of the book.'),
      author: z.string().describe('The author of the book.'),
      genre: z.string().describe('The genre of the book.'),
    })
  ).optional().describe('The user historical borrowing data.'),
  numberOfSuggestions: z.number().default(3).describe('The number of book suggestions to return.'),
});
export type SuggestedReadsInput = z.infer<typeof SuggestedReadsInputSchema>;

const SuggestedReadsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      title: z.string().describe('The title of the suggested book.'),
      author: z.string().describe('The author of the suggested book.'),
      genre: z.string().describe('The genre of the suggested book.'),
      reason: z.string().describe('The reason for suggesting this book.'),
    })
  ).describe('A list of book suggestions.'),
});
export type SuggestedReadsOutput = z.infer<typeof SuggestedReadsOutputSchema>;

export async function suggestReads(input: SuggestedReadsInput): Promise<SuggestedReadsOutput> {
  return suggestedReadsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReadsPrompt',
  input: {schema: SuggestedReadsInputSchema},
  output: {schema: SuggestedReadsOutputSchema},
  prompt: `You are a librarian who suggests books to patrons.

  Suggest {{numberOfSuggestions}} books to the user based on their borrowing history, if any.

  The suggested books should be different from the books in the user's borrowing history.

  Here is the user's borrowing history:
  {{#if borrowingHistory}}
  {{#each borrowingHistory}}
  - {{title}} by {{author}} ({{genre}})
  {{/each}}
  {{else}}
  The user has no borrowing history.
  {{/if}}
  `,
});

const suggestedReadsFlow = ai.defineFlow(
  {
    name: 'suggestedReadsFlow',
    inputSchema: SuggestedReadsInputSchema,
    outputSchema: SuggestedReadsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
