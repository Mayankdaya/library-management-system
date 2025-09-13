"use client"

import * as React from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { suggestReads, type SuggestedReadsInput, type SuggestedReadsOutput } from '@/ai/flows/suggested-reads'
import { useToast } from '@/hooks/use-toast'

interface SuggestedReadsProps {
  borrowingHistory: SuggestedReadsInput['borrowingHistory'];
}

export default function SuggestedReads({ borrowingHistory }: SuggestedReadsProps) {
  const [suggestions, setSuggestions] = React.useState<SuggestedReadsOutput['suggestions']>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await suggestReads({
        borrowingHistory,
        numberOfSuggestions: 3,
      });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Failed to get suggestions:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not fetch reading suggestions. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glassmorphic sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Sparkles className="h-6 w-6 text-primary/80" />
          Suggested Reads
        </CardTitle>
        <CardDescription>
          Get AI-powered book recommendations based on borrowing history.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGetSuggestions} disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Generating...' : 'Get Suggestions'}
        </Button>

        {isLoading && (
          <div className="space-y-3 pt-4">
             {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg space-y-2 animate-pulse bg-muted/50 border-white/10">
                  <div className="h-5 w-3/4 rounded bg-background/80"></div>
                  <div className="h-4 w-1/2 rounded bg-background/80"></div>
                  <div className="h-10 w-full rounded bg-background/80"></div>
              </div>
            ))}
          </div>
        )}
        
        {suggestions.length > 0 && !isLoading && (
          <div className="space-y-4 pt-4">
            <h4 className="font-semibold font-headline text-lg text-primary/90">Here are some books you might like:</h4>
            {suggestions.map((book, index) => (
              <Card key={index} className="bg-background/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">{book.title}</CardTitle>
                  <CardDescription>by {book.author} ({book.genre})</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">"{book.reason}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
