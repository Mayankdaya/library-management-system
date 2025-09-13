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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import type { Member, Book } from "@/types"

const formSchema = z.object({
  memberId: z.coerce.number({ required_error: "A member must be selected." }),
  dueDate: z.date({
    required_error: "A due date is required.",
  }),
})

type CheckOutFormValues = z.infer<typeof formSchema>;

interface CheckOutFormProps {
  books: Book[];
  members: Member[];
  onFormSubmit: (data: CheckOutFormValues & { bookIds: number[] }) => void;
}

export default function CheckOutForm({ books, members, onFormSubmit }: CheckOutFormProps) {
  const { toast } = useToast();
  const form = useForm<CheckOutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Set default due date to 2 weeks from now
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    }
  })

  function onSubmit(data: CheckOutFormValues) {
    const bookIds = books.map(b => b.id);
    onFormSubmit({...data, bookIds });
    const memberName = members.find(m => m.id === data.memberId)?.name;
    toast({
      title: "Books Checked Out",
      description: `${books.length} book(s) checked out to ${memberName} are due on ${format(data.dueDate, "PPP")}.`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="memberId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Borrower</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        <Button type="submit" className="w-full">Confirm Checkout</Button>
      </form>
    </Form>
  )
}
