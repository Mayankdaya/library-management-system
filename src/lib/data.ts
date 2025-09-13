import type { Book, Member } from '@/types';

export const initialMembers: Member[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', joinDate: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', joinDate: '2023-02-20' },
  { id: 3, name: 'Alice Johnson', email: 'alice.j@example.com', joinDate: '2023-03-10' },
];

export const initialBooks: Book[] = [
  {
    id: 1,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0061120084',
    genre: 'Fiction',
    status: 'Available',
    reservations: [],
    reviews: [
        { memberId: 2, rating: 5, comment: "An absolute classic. A must-read for everyone.", date: "2024-05-20T10:00:00Z" },
        { memberId: 3, rating: 4, comment: "Powerful story and characters. It stays with you long after you finish.", date: "2024-06-15T14:30:00Z" }
    ],
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0451524935',
    genre: 'Dystopian',
    status: 'Checked Out',
    memberId: 1,
    checkoutDate: '2023-10-01',
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days ago
    reservations: [3],
    reviews: [
        { memberId: 1, rating: 5, comment: "A chilling and thought-provoking book that is more relevant than ever.", date: "2024-04-01T18:00:00Z" }
    ],
  },
  {
    id: 3,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    genre: 'Classic',
    status: 'Available',
    reservations: [],
    reviews: [],
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '978-0141439518',
    genre: 'Romance',
    status: 'Available',
    reservations: [],
    reviews: [],
  },
  {
    id: 5,
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '978-0345339683',
    genre: 'Fantasy',
    status: 'Checked Out',
    memberId: 2,
    checkoutDate: '2023-10-15',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
    reservations: [],
    reviews: [],
  },
  {
    id: 6,
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '978-0441013593',
    genre: 'Sci-Fi',
    status: 'Available',
    reservations: [],
    reviews: [],
  },
  {
    id: 7,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '978-0316769488',
    genre: 'Fiction',
    status: 'Checked Out',
    memberId: 3,
    checkoutDate: '2024-07-01',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
    reservations: [1, 2],
    reviews: [],
  },
  {
    id: 8,
    title: 'Brave New World',
    author: 'Aldous Huxley',
    isbn: '978-0060850524',
    genre: 'Dystopian',
    status: 'Available',
    reservations: [],
    reviews: [],
  },
  {
    id: 9,
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    isbn: '978-0618640157',
    genre: 'Fantasy',
    status: 'Available',
    reservations: [],
    reviews: [
        { memberId: 3, rating: 5, comment: "The pinnacle of fantasy literature. An epic in every sense of the word.", date: "2024-07-10T12:00:00Z" }
    ],
  },
  {
    id: 10,
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    isbn: '978-1451673319',
    genre: 'Sci-Fi',
    status: 'Checked Out',
    memberId: 1,
    checkoutDate: '2024-07-10',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reservations: [],
    reviews: [],
  }
];
