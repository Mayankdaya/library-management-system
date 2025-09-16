
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Book, Member } from '@/types';
import Header from '@/components/Header';
import BookTable from '@/components/BookTable';
import SuggestedReads from '@/components/SuggestedReads';
import Dashboard from '@/components/Dashboard';
import { useCheckout } from '@/hooks/use-checkout.tsx';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function CatalogPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const { clearCheckout } = useCheckout();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchBooks = async () => {
        const { data, error } = await supabase.from('books').select('*, reviews(*)');
        if (data) setBooks(data);
      };
      const fetchMembers = async () => {
        const { data, error } = await supabase.from('members').select('*');
        if (data) setMembers(data);
      };
      fetchBooks();
      fetchMembers();
    }
  }, [user]);

  const handleAddBook = async (newBook: Omit<Book, 'id' | 'status' | 'reservations'>) => {
    const { data, error } = await supabase.from('books').insert([{ ...newBook, status: 'Available', reservations: [] }]).select('*, reviews(*)').single();
    if (data) {
      setBooks(prevBooks => [...prevBooks, data]);
    }
  };

  const handleCheckOut = async (bookIds: number[], memberId: number, dueDate: string) => {
    const updates = bookIds.map(id => 
      supabase.from('books').update({
        status: 'Checked Out',
        memberId: memberId,
        checkoutDate: new Date().toISOString().split('T')[0],
        dueDate,
      }).eq('id', id)
    );
    await Promise.all(updates);

    const { data: updatedBooks } = await supabase.from('books').select('*, reviews(*)');
    if (updatedBooks) setBooks(updatedBooks);
    
    clearCheckout();
    router.push('/catalog');
  };

  const handleReturnBook = async (bookId: number) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    let updateData: Partial<Book> = {
      status: 'Available',
      memberId: undefined,
      checkoutDate: undefined,
      dueDate: undefined,
    };

    if (book.reservations && book.reservations.length > 0) {
      const nextMemberId = book.reservations[0];
      const remainingReservations = book.reservations.slice(1);
      updateData = {
        status: 'Checked Out',
        memberId: nextMemberId,
        checkoutDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reservations: remainingReservations,
      };
    }
    
    const { data, error } = await supabase.from('books').update(updateData).eq('id', bookId).select();
    
    if (data) {
       const { data: updatedBooks } = await supabase.from('books').select('*, reviews(*)');
       if (updatedBooks) setBooks(updatedBooks);
    }
  };
  
  const handleReserveBook = async (bookId: number, memberId: number) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const newReservations = [...(book.reservations || []), memberId];
    const { data, error } = await supabase.from('books').update({ reservations: newReservations }).eq('id', bookId).select();
    
    if (data) {
       const { data: updatedBooks } = await supabase.from('books').select('*, reviews(*)');
       if (updatedBooks) setBooks(updatedBooks);
    }
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
  
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

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
