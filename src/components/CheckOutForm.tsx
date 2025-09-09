"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  borrower: z.string().min(2, "Borrower name must be at least 2 characters."),
  dueDate: z.date({
    required_error: "A due date is required.",
  }),
})

type CheckOutFormValues = z.infer<typeof formSchema>;

interface CheckOutFormProps {
  bookTitle: string;
  onFormSubmit: (data: CheckOutFormValues) => void;
}

export default function CheckOutForm({ bookTitle, onFormSubmit }: CheckOutFormProps) {
  const { toast } = useToast();
  const form = useForm<CheckOutFormValues>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(data: CheckOutFormValues) {
    onFormSubmit(data);
    toast({
      title: "Book Checked Out",
      description: `"${bookTitle}" is due on ${format(data.dueDate, "PPP")}.`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="borrower"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Borrower's Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0,0,0,0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Check Out Book</Button>
      </form>
    </Form>
  )
}
