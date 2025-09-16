
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Book, Member } from '@/types';
import Header from '@/components/Header';
import BookTable from '@/components/BookTable';
import SuggestedReads from '@/components/SuggestedReads';
import Dashboard from '@/components/Dashboard';
import { useCheckout } from '@/hooks/use-checkout.tsx';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, writeBatch, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
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
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const fetchAllData = async () => {
      if (!user) return;
      setDataLoading(true);
      try {
        const booksCollection = collection(db, "books");
        const membersCollection = collection(db, "members");

        const [booksSnapshot, membersSnapshot] = await Promise.all([
          getDocs(booksCollection),
          getDocs(membersCollection),
        ]);
        
        const membersData = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
        setMembers(membersData);

        const booksData = await Promise.all(booksSnapshot.docs.map(async (bookDoc) => {
          const bookData = { id: bookDoc.id, ...bookDoc.data() } as Book;
          if (bookData.memberId) {
            const borrower = membersData.find(m => m.id === bookData.memberId);
            bookData.borrower = borrower;
          }
          
          // Fetch reviews for each book
          const reviewsCol = collection(db, `books/${bookDoc.id}/reviews`);
          const reviewsSnap = await getDocs(reviewsCol);
          bookData.reviews = reviewsSnap.docs.map(reviewDoc => {
             const reviewData = { id: reviewDoc.id, ...reviewDoc.data() } as Review;
             reviewData.member = membersData.find(m => m.id === reviewData.memberId);
             return reviewData;
          });

          return bookData;
        }));
        
        setBooks(booksData);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setDataLoading(false);
      }
    };

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const handleAddBook = async (newBook: Omit<Book, 'id' | 'status' | 'reservations' | 'reviews'>) => {
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, "books"), {
        ...newBook,
        status: 'Available',
        reservations: [],
      });
      const newBookData = { ...newBook, id: docRef.id, status: 'Available', reservations: [], reviews: [] } as Book;
      setBooks(prevBooks => [...prevBooks, newBookData]);
    } catch (error) {
        console.error("Error adding book:", error);
    }
  };

  const handleCheckOut = async (bookIds: string[], memberId: string, dueDate: Date) => {
    if (!user) return;
    const batch = writeBatch(db);
    bookIds.forEach(id => {
      const bookRef = doc(db, 'books', id);
      batch.update(bookRef, {
        status: 'Checked Out',
        memberId: memberId,
        checkoutDate: Timestamp.now(),
        dueDate: Timestamp.fromDate(dueDate),
      });
    });
    await batch.commit();
    clearCheckout();
    await fetchAllData(); // Re-fetch all data to get updated state
  };
  
  const handleReturnBook = async (bookId: string) => {
    if (!user) return;
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    let updateData: any = {
      status: 'Available',
      memberId: null,
      checkoutDate: null,
      dueDate: null,
    };

    if (book.reservations && book.reservations.length > 0) {
      const nextMemberId = book.reservations[0];
      const remainingReservations = book.reservations.slice(1);
      const newDueDate = new Date();
      newDueDate.setDate(newDueDate.getDate() + 14);
      updateData = {
        status: 'Checked Out',
        memberId: nextMemberId,
        checkoutDate: Timestamp.now(),
        dueDate: Timestamp.fromDate(newDueDate),
        reservations: remainingReservations,
      };
    }
    
    const bookRef = doc(db, 'books', bookId);
    await updateDoc(bookRef, updateData);
    await fetchAllData();
  };
  
  const handleReserveBook = async (bookId: string, memberId: string) => {
    if(!user) return;
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const newReservations = [...(book.reservations || []), memberId];
    const bookRef = doc(db, 'books', bookId);
    await updateDoc(bookRef, { reservations: newReservations });
    await fetchAllData();
  }

  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        if (filterStatus === 'All') return true;
        if (filterStatus === 'Overdue') {
          if (book.status !== 'Checked Out' || !book.dueDate) return false;
          const dueDate = (book.dueDate as any)?.toDate ? (book.dueDate as any).toDate() : new Date(book.dueDate);
          return dueDate < new Date();
        }
        return book.status === filterStatus;
      })
      .filter(book => {
        const term = searchTerm.toLowerCase();
        const memberName = book.borrower?.name?.toLowerCase() || '';

        return (
          book.title.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          book.isbn.toLowerCase().includes(term) ||
          book.genre.toLowerCase().includes(term) ||
          (memberName && memberName.includes(term))
        );
      });
  }, [books, members, searchTerm, filterStatus]);

  const borrowingHistory = useMemo(() => {
    return books.filter(book => book.status === 'Checked Out').map(({ title, author, genre }) => ({ title, author, genre }));
  }, [books]);
  
  if (loading || dataLoading || !user) {
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
