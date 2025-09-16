
"use client";

import * as React from 'react';
import type { Book, Member } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
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
import { Plus, Search, MoreVertical, BookDown, Library, UserCheck, Book as BookIcon, ShoppingCart } from 'lucide-react';
import AddBookForm from './AddBookForm';
import { Badge } from './ui/badge';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import bookCovers from '@/lib/placeholder-images.json';
import { useCheckout } from '@/hooks/use-checkout.tsx';


interface BookTableProps {
  books: Book[];
  members: Member[];
  onSearch: (term: string) => void;
  onFilter: (status: string) => void;
  onAddBook: (book: Omit<Book, 'id' | 'status' | 'reservations' | 'reviews'>) => void;
  onCheckOut: (bookIds: string[], memberId: string, dueDate: Date) => void;
  onReturnBook: (bookId: string) => void;
  onReserveBook: (bookId: string, memberId: string) => void;
}

export default function BookTable({ books, members, onSearch, onFilter, onAddBook, onCheckOut, onReturnBook, onReserveBook }: BookTableProps) {
  const [addBookOpen, setAddBookOpen] = React.useState(false);
  const { toast } = useToast();
  const { checkoutItems, addToCheckout } = useCheckout();

  const handleReturn = (book: Book) => {
    onReturnBook(book.id);
    const hasReservations = book.reservations && book.reservations.length > 0;
    
    let description = `"${book.title}" has been returned to the library.`;
    if(hasReservations) {
      const nextMember = members.find(m => m.id === book.reservations![0]);
      description += ` It is now on hold for ${nextMember?.name || 'the next person'}.`
    }

    toast({
      title: "Book Returned",
      description,
      duration: hasReservations ? 5000 : 3000,
    })
  }

  const handleReserve = (book: Book, memberId: string) => {
    onReserveBook(book.id, memberId);
    const member = members.find(m => m.id === memberId);
    toast({
        title: "Book Reserved",
        description: `"${book.title}" has been reserved for ${member?.name}. They are position #${(book.reservations?.length || 0) + 1} in the queue.`
    });
  }

  const handleAddToCart = (book: Book) => {
    addToCheckout(book);
    toast({
      title: 'Added to Checkout',
      description: `"${book.title}" has been added to your checkout list.`,
    });
  };

  const getMemberName = (memberId?: string) => {
    if (!memberId) return 'N/A';
    return members.find(m => m.id === memberId)?.name || 'Unknown Member';
  };

  const isOverdue = (dueDate?: string | { toDate: () => Date }) => {
    if (!dueDate) return false;
    const date = typeof dueDate === 'string' ? new Date(dueDate) : dueDate.toDate();
    return date < new Date();
  }
  
  const formatDate = (date?: string | { toDate: () => Date }) => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date.toDate();
    return d.toLocaleDateString();
  }

  return (
    <TooltipProvider>
    <div className="space-y-4">
      <div className="glassmorphic p-6 rounded-lg">
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
                        onFormSubmit={(data) => {
                            onAddBook(data);
                            setAddBookOpen(false);
                        }}
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

      <div className="glassmorphic overflow-hidden rounded-lg">
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
            {books.length > 0 ? books.map((book) => {
              const cover = book.coverImage ? { src: book.coverImage, width: 400, height: 600, hint: 'ai generated' } : bookCovers.bookCovers[(parseInt(book.id, 16) - 1) % bookCovers.bookCovers.length];
              const isBookInCheckout = checkoutItems.some(item => item.id === book.id);
              return (
              <TableRow key={book.id} className={cn('border-white/10', isOverdue(book.dueDate) && 'bg-destructive/20 hover:bg-destructive/30')}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                      {cover.src ? (
                          <Image src={cover.src} alt={book.title} width={48} height={64} data-ai-hint={cover.hint} className="w-full h-full object-cover" />
                      ) : (
                          <BookIcon className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <Link href={`/catalog/${book.id}`} className="hover:underline font-semibold">
                        {book.title}
                      </Link>
                       <p className="text-sm text-muted-foreground md:hidden">{book.author}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{book.author}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Badge variant={book.status === 'Available' ? 'default' : (isOverdue(book.dueDate) ? 'destructive' : 'secondary')}>
                      {isOverdue(book.dueDate) ? 'Overdue' : book.status}
                    </Badge>
                    {book.reservations && book.reservations.length > 0 && (
                      <Tooltip>
                        <TooltipTrigger>
                           <Badge variant="outline"><Library className="h-3 w-3" /></Badge>
                        </TooltipTrigger>
                         <TooltipContent>
                           <p>{book.reservations.length} reservation{book.reservations.length > 1 ? 's' : ''}. Next: {getMemberName(book.reservations[0])}</p>
                         </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{book.status === 'Checked Out' ? getMemberName(book.memberId) : 'N/A'}</TableCell>
                <TableCell className={cn("hidden lg:table-cell", isOverdue(book.dueDate) && "text-destructive font-semibold")}>
                  {formatDate(book.dueDate)}
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
                        <DropdownMenuItem onClick={() => handleAddToCart(book)} disabled={isBookInCheckout}>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          <span>{isBookInCheckout ? 'Added to Checkout' : 'Add to Checkout'}</span>
                        </DropdownMenuItem>
                      ) : (
                        <>
                          <DropdownMenuItem onClick={() => handleReturn(book)}>
                            <BookDown className="mr-2 h-4 w-4" />
                            <span>Return Book</span>
                          </DropdownMenuItem>
                           <DropdownMenuSub>
                             <DropdownMenuSubTrigger>
                               <UserCheck className="mr-2 h-4 w-4" />
                               <span>Reserve</span>
                             </DropdownMenuSubTrigger>
                             <DropdownMenuPortal>
                              <DropdownMenuSubContent className="glassmorphic">
                                {members
                                  .filter(m => m.id !== book.memberId && !book.reservations?.includes(m.id))
                                  .map(member => (
                                  <DropdownMenuItem key={member.id} onClick={() => handleReserve(book, member.id)}>
                                    {member.name}
                                  </DropdownMenuItem>
                                ))}
                                {members.filter(m => m.id !== book.memberId && !book.reservations?.includes(m.id)).length === 0 && (
                                  <DropdownMenuItem disabled>No members to reserve</DropdownMenuItem>
                                )}
                              </DropdownMenuSubContent>
                             </DropdownMenuPortal>
                           </DropdownMenuSub>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )}) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No books found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
    </TooltipProvider>
  );
}
