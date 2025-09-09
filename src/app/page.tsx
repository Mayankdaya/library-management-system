"use client";

import { useState, useMemo } from 'react';
import type { Book, Member } from '@/types';
import { initialBooks, initialMembers } from '@/lib/data';
import Header from '@/components/Header';
import BookTable from '@/components/BookTable';
import SuggestedReads from '@/components/SuggestedReads';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const handleAddBook = (newBook: Omit<Book, 'id' | 'status'>) => {
    setBooks(prevBooks => [
      ...prevBooks,
      {
        ...newBook,
        id: Date.now(),
        status: 'Available',
      },
    ]);
  };

  const handleCheckOut = (bookId: number, memberId: number, dueDate: string) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === bookId
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
  };

  const handleReturnBook = (bookId: number) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === bookId
          ? {
              ...book,
              status: 'Available',
              memberId: undefined,
              checkoutDate: undefined,
              dueDate: undefined,
            }
          : book
      )
    );
  };

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
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="container mx-auto px-4 py-8">
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
