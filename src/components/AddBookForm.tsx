"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { generateBook, type GenerateBookOutput } from "@/ai/flows/generate-book"
import { Loader2, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "./ui/textarea"

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  author: z.string().min(2, "Author must be at least 2 characters."),
  isbn: z.string().regex(/^(978|979)-?[0-9]{1,5}-?[0-9]{1,7}-?[0-9]{1,6}-?[0-9X]$|^[0-9]{13}$/, "Please enter a valid ISBN-13."),
  genre: z.string().min(2, "Genre must be at least 2 characters."),
})

type AddBookFormValues = z.infer<typeof formSchema>;

interface AddBookFormProps {
  onFormSubmit: (data: AddBookFormValues) => void;
  onBookGenerated: (book: GenerateBookOutput) => void;
  generatedBook: GenerateBookOutput | null;
}

export default function AddBookForm({ onFormSubmit, onBookGenerated, generatedBook }: AddBookFormProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [topic, setTopic] = useState("");

  const form = useForm<AddBookFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      genre: "",
    },
  })
  
  useEffect(() => {
    if (generatedBook) {
      form.reset(generatedBook);
    }
  }, [generatedBook, form]);


  function onSubmit(data: AddBookFormValues) {
    onFormSubmit(data);
    toast({
      title: "Success!",
      description: `"${data.title}" has been added to the library.`,
    });
    form.reset();
  }

  const handleGenerateBook = async () => {
    if (!topic) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a topic to generate a book.",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const book = await generateBook({ topic });
      onBookGenerated(book);
      toast({
        title: "Book Generated!",
        description: "The form has been pre-filled with the AI-generated book.",
      });
      setAiDialogOpen(false);
    } catch (error) => {
      console.error("Failed to generate book:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not generate book details. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            Add Book with AI
          </Button>
        </DialogTrigger>
        <DialogContent className="glassmorphic">
          <DialogHeader>
            <DialogTitle>Generate a Book with AI</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Describe a topic or genre, and the AI will create a plausible book for you.
            </p>
            <Textarea 
              placeholder="e.g., 'A sci-fi mystery on a remote space station' or 'A cozy fantasy about a magical bakery'"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleGenerateBook} disabled={isGenerating}>
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isGenerating ? 'Generating...' : 'Generate Book'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
            Or add manually
            </span>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="The Great Gatsby" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="F. Scott Fitzgerald" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isbn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ISBN</FormLabel>
                <FormControl>
                  <Input placeholder="978-0743273565" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <FormControl>
                  <Input placeholder="Classic" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Add Book</Button>
        </form>
      </Form>
    </>
  )
}
