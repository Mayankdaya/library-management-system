"use client";

import * as React from 'react';
import type { Book, Member } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, MoreVertical, BookUp, BookDown } from 'lucide-react';
import AddBookForm from './AddBookForm';
import CheckOutForm from './CheckOutForm';
import { Badge } from './ui/badge';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import type { GenerateBookOutput } from '@/ai/flows/generate-book';

interface BookTableProps {
  books: Book[];
  members: Member[];
  onSearch: (term: string) => void;
  onFilter: (status: string) => void;
  onAddBook: (book: Omit<Book, 'id' | 'status'>) => void;
  onCheckOut: (bookId: number, memberId: number, dueDate: string) => void;
  onReturnBook: (bookId: number) => void;
}

export default function BookTable({ books, members, onSearch, onFilter, onAddBook, onCheckOut, onReturnBook }: BookTableProps) {
  const [addBookOpen, setAddBookOpen] = React.useState(false);
  const [checkOutBook, setCheckOutBook] = React.useState<Book | null>(null);
  const [generatedBook, setGeneratedBook] = React.useState<GenerateBookOutput | null>(null);
  const { toast } = useToast();

  const handleReturn = (bookId: number, title: string) => {
    onReturnBook(bookId);
    toast({
      title: "Book Returned",
      description: `"${title}" has been returned to the library.`
    })
  }

  const getMemberName = (memberId?: number) => {
    if (!memberId) return 'N/A';
    return members.find(m => m.id === memberId)?.name || 'Unknown Member';
  };

  const isOverdue = (dueDate?: string) => {
    return dueDate && new Date(dueDate) < new Date();
  }

  return (
    <div className="space-y-4">
      <div className="glassmorphic p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <h2 className="text-2xl font-headline font-semibold">Book Catalog</h2>
            <Dialog open={addBookOpen} onOpenChange={setAddBookOpen}>
                <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" /> Add New Book</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add a New Book</DialogTitle>
                    </DialogHeader>
                    <AddBookForm 
                        key={generatedBook ? JSON.stringify(generatedBook) : 'manual'}
                        onFormSubmit={(data) => {
                            onAddBook(data);
                            setAddBookOpen(false);
                            setGeneratedBook(null);
                        }}
                        onBookGenerated={setGeneratedBook}
                        generatedBook={generatedBook}
                    />
                </DialogContent>
            </Dialog>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search by title, author, borrower..."
                    onChange={(e) => onSearch(e.target.value)}
                    className="pl-10"
                />
            </div>
            <Select onValueChange={onFilter} defaultValue="All">
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Checked Out">Checked Out</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      <div className="glassmorphic overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Borrower</TableHead>
              <TableHead className="hidden lg:table-cell">Due Date</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length > 0 ? books.map((book) => (
              <TableRow key={book.id} className={cn('border-white/10', isOverdue(book.dueDate) && 'bg-destructive/20')}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={book.status === 'Available' ? 'default' : (isOverdue(book.dueDate) ? 'destructive' : 'secondary')}>
                    {isOverdue(book.dueDate) ? 'Overdue' : book.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{book.status === 'Checked Out' ? getMemberName(book.memberId) : 'N/A'}</TableCell>
                <TableCell className={cn("hidden lg:table-cell", isOverdue(book.dueDate) && "text-destructive font-semibold")}>
                  {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className='glassmorphic'>
                      {book.status === 'Available' ? (
                        <DropdownMenuItem onClick={() => setCheckOutBook(book)}>
                          <BookUp className="mr-2 h-4 w-4" />
                          <span>Check Out</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleReturn(book.id, book.title)}>
                          <BookDown className="mr-2 h-4 w-4" />
                          <span>Return Book</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No books found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={!!checkOutBook} onOpenChange={(isOpen) => !isOpen && setCheckOutBook(null)}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Check Out: {checkOutBook?.title}</DialogTitle>
            </DialogHeader>
            {checkOutBook && <CheckOutForm 
                bookTitle={checkOutBook.title}
                members={members}
                onFormSubmit={(data) => {
                  onCheckOut(checkOutBook.id, data.memberId, data.dueDate.toISOString().split('T')[0]);
                  setCheckOutBook(null);
                }} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
