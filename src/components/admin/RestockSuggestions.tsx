"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Wand2, Loader2 } from 'lucide-react';
import { getRestockSuggestions, type RestockSuggestionsInput, type RestockSuggestionsOutput } from '@/ai/flows/restock-suggestions';
import { mockDistributionRecords } from '@/lib/mockData'; // Using mock data for demo
import type { DistributionRecord } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


// Helper function to format distribution records for the AI
function formatDistributionRecordsForAI(records: DistributionRecord[]): string {
  if (records.length === 0) {
    return "No distribution records available.";
  }
  return records.map(record => 
    `Product: ${record.productName}, Quantity Distributed: ${record.quantity}, Date: ${new Date(record.date).toLocaleDateString()}`
  ).join('\n');
}

export function RestockSuggestions() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // For demo purposes, we'll use mock distribution records.
  // In a real app, you'd fetch these from your database.
  const [distributionData, setDistributionData] = useState<string>(formatDistributionRecordsForAI(mockDistributionRecords));

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    if (!distributionData.trim() || distributionData === "No distribution records available.") {
        setError("Please provide some distribution records to analyze.");
        setIsLoading(false);
        return;
    }

    try {
      const input: RestockSuggestionsInput = { distributionRecords: distributionData };
      const result: RestockSuggestionsOutput = await getRestockSuggestions(input);
      setSuggestions(result.suggestions);
    } catch (e) {
      console.error("Error generating restock suggestions:", e);
      setError("Failed to generate suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          <Brain className="mr-2 h-6 w-6" />
          AI Restock Advisor
        </CardTitle>
        <CardDescription className="font-body">
          Analyze distribution records to get AI-powered restock suggestions. 
          Current data is pre-filled with mock records for demonstration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="distributionData" className="block text-sm font-medium text-foreground font-headline mb-1">
            Distribution Records Data:
          </label>
          <Textarea
            id="distributionData"
            value={distributionData}
            onChange={(e) => setDistributionData(e.target.value)}
            rows={8}
            placeholder="Paste or type distribution records here, e.g., Product A: 10 units distributed..."
            className="font-mono text-sm"
            disabled={isLoading}
          />
           <p className="text-xs text-muted-foreground mt-1 font-body">
            This field is pre-populated with mock data. You can edit it or paste your own records.
          </p>
        </div>

        <Button onClick={handleGenerateSuggestions} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Analyzing...' : 'Generate Suggestions'}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertTitle className="font-headline">Error</AlertTitle>
            <AlertDescription className="font-body">{error}</AlertDescription>
          </Alert>
        )}

        {suggestions && (
          <Card className="mt-6 bg-secondary/50">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">Restock Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap break-words font-body text-sm leading-relaxed p-4 bg-background rounded-md shadow">
                {suggestions}
              </pre>
            </CardContent>
          </Card>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground font-body">
          AI suggestions are for advisory purposes. Always cross-reference with your inventory data.
        </p>
      </CardFooter>
    </Card>
  );
}
