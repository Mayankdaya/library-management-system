export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  status: 'Available' | 'Checked Out';
  borrower?: string;
  checkoutDate?: string;
  dueDate?: string;
}
