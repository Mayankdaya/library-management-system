"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Book, Member } from '@/types';
import { initialBooks, initialMembers } from '@/lib/data';
import Header from '@/components/Header';
import BookTable from '@/components/BookTable';
import SuggestedReads from '@/components/SuggestedReads';
import Dashboard from '@/components/Dashboard';
import { useCheckout } from '@/hooks/use-checkout';

export default function CatalogPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const { clearCheckout } = useCheckout();

  const handleAddBook = (newBook: Omit<Book, 'id' | 'status'>) => {
    setBooks(prevBooks => [
      ...prevBooks,
      {
        ...newBook,
        id: Date.now(),
        status: 'Available',
        reservations: [],
      },
    ]);
  };

  const handleCheckOut = (bookIds: number[], memberId: number, dueDate: string) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        bookIds.includes(book.id)
          ? {
              ...book,
              status: 'Checked Out',
              memberId: memberId,
              checkoutDate: new Date().toISOString().split('T')[0],
              dueDate,
            }
          : book
      )
    );
    // Clear the cart after checkout
    clearCheckout();
    // Redirect to catalog page to see the result
    router.push('/catalog');
  };

  const handleReturnBook = (bookId: number) => {
    setBooks(prevBooks =>
      prevBooks.map(book => {
        if (book.id === bookId) {
          const newBook: Book = {
            ...book,
            status: 'Available',
            memberId: undefined,
            checkoutDate: undefined,
            dueDate: undefined,
          };
          if (book.reservations && book.reservations.length > 0) {
            newBook.status = 'Checked Out';
            newBook.memberId = book.reservations[0];
            newBook.checkoutDate = new Date().toISOString().split('T')[0];
            // Due 2 weeks from now
            newBook.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            newBook.reservations = book.reservations.slice(1);
          }
          return newBook;
        }
        return book;
      })
    );
  };
  
  const handleReserveBook = (bookId: number, memberId: number) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === bookId
          ? {
              ...book,
              reservations: [...(book.reservations || []), memberId],
            }
          : book
      )
    );
  }

  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        if (filterStatus === 'All') return true;
        if (filterStatus === 'Overdue') {
          if (book.status !== 'Checked Out' || !book.dueDate) return false;
          return new Date(book.dueDate) < new Date();
        }
        return book.status === filterStatus;
      })
      .filter(book => {
        const term = searchTerm.toLowerCase();
        const member = book.memberId ? members.find(m => m.id === book.memberId) : null;
        return (
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          book.isbn.toLowerCase().includes(term) ||
          book.genre.toLowerCase().includes(term) ||
          (member && member.name.toLowerCase().includes(term))
        );
      });
  }, [books, members, searchTerm, filterStatus]);

  const borrowingHistory = useMemo(() => {
    return books.filter(book => book.status === 'Checked Out').map(({ title, author, genre }) => ({ title, author, genre }));
  }, [books]);


  return (
    <div className="min-h-screen bg-transparent text-foreground font-body">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <Dashboard books={books} members={members} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-8">
          <div className="lg:col-span-2">
            <BookTable
              books={filteredBooks}
              members={members}
              onSearch={setSearchTerm}
              onFilter={setFilterStatus}
              onAddBook={handleAddBook}
              onCheckOut={handleCheckOut}
              onReturnBook={handleReturnBook}
              onReserveBook={handleReserveBook}
            />
          </div>
          <div>
            <SuggestedReads borrowingHistory={borrowingHistory} />
          </div>
        </div>
      </main>
    </div>
  );
}
