export interface Review {
  id: string; // Firestore document ID
  bookId: string;
  memberId: string;
  rating: number; // 1 to 5
  comment: string;
  date: string; // ISO string
  member?: Member; // Populated after fetching
}

export interface Book {
  id: string; // Firestore document ID
  title: string;
  author: string;
  isbn: string;
  genre: string;
  status: 'Available' | 'Checked Out';
  memberId?: string;
  checkoutDate?: string;
  dueDate?: string;
  reservations?: string[]; // array of memberIds
  reviews?: Review[];
  coverImage?: string;
  // Firestore specific, not always present on the client
  borrower?: Member;
}

export interface Member {
  id: string; // Firestore document ID
  name: string;
  email: string;
  joinDate: string; // ISO string
}
