
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Book } from '@/types';

interface CheckoutContextType {
  checkoutItems: Book[];
  addToCheckout: (book: Book) => void;
  removeFromCheckout: (bookId: string) => void;
  clearCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [checkoutItems, setCheckoutItems] = useState<Book[]>([]);

  const addToCheckout = (book: Book) => {
    setCheckoutItems((prevItems) => {
      // Prevent adding duplicates
      if (prevItems.find(item => item.id === book.id)) {
        return prevItems;
      }
      return [...prevItems, book];
    });
  };

  const removeFromCheckout = (bookId: string) => {
    setCheckoutItems((prevItems) => prevItems.filter(item => item.id !== bookId));
  };

  const clearCheckout = () => {
    setCheckoutItems([]);
  };

  const value = { checkoutItems, addToCheckout, removeFromCheckout, clearCheckout };

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
