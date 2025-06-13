'use server';

/**
 * @fileOverview An AI agent that provides restock suggestions based on distribution records.
 *
 * - getRestockSuggestions - A function that generates restock suggestions.
 * - RestockSuggestionsInput - The input type for the getRestockSuggestions function.
 * - RestockSuggestionsOutput - The return type for the getRestockSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RestockSuggestionsInputSchema = z.object({
  distributionRecords: z
    .string()
    .describe('A string containing distribution records, including product names and quantities distributed.'),
});
export type RestockSuggestionsInput = z.infer<typeof RestockSuggestionsInputSchema>;

const RestockSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('Restock suggestions for each product, along with the reason for each suggestion.'),
});
export type RestockSuggestionsOutput = z.infer<typeof RestockSuggestionsOutputSchema>;

export async function getRestockSuggestions(input: RestockSuggestionsInput): Promise<RestockSuggestionsOutput> {
  return restockSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'restockSuggestionsPrompt',
  input: {schema: RestockSuggestionsInputSchema},
  output: {schema: RestockSuggestionsOutputSchema},
  prompt: `You are an inventory management expert. Analyze the following distribution records and provide restock suggestions for each product.

Distribution Records:
{{{distributionRecords}}}

Provide specific quantities if possible, and the reason for the suggestion.
`,
});

const restockSuggestionsFlow = ai.defineFlow(
  {
    name: 'restockSuggestionsFlow',
    inputSchema: RestockSuggestionsInputSchema,
    outputSchema: RestockSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
