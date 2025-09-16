
'use server';
/**
 * @fileOverview A flow for generating a book summary.
 *
 * - generateSummary - A function that generates a summary for a given book title and author.
 * - GenerateSummaryInput - The input type for the generateSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSummaryInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  author: z.string().describe('The author of the book.'),
});
export type GenerateSummaryInput = z.infer<typeof GenerateSummaryInputSchema>;

const prompt = ai.definePrompt({
  name: 'generateSummaryPrompt',
  input: { schema: GenerateSummaryInputSchema },
  output: { schema: z.string() },
  prompt: `Generate a short, intriguing, one-paragraph summary for the book "{{title}}" by {{author}}. The summary should be suitable for a library catalog page to entice readers.`,
});

const generateSummaryFlow = ai.defineFlow(
  {
    name: 'generateSummaryFlow',
    inputSchema: GenerateSummaryInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { output } = await prompt(input);
    return output || "";
  }
);

export async function generateSummary(input: GenerateSummaryInput): Promise<string> {
    return generateSummaryFlow(input);
}
