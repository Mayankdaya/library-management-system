export interface Review {
  id: number;
  book_id: number;
  member_id: number;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  members: Member; // Joined data
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  status: 'Available' | 'Checked Out';
  memberId?: number;
  checkoutDate?: string;
  dueDate?: string;
  reservations?: number[]; // memberIds
  reviews?: Review[];
  coverImage?: string; // Data URI for the cover image
}

export interface Member {
  id: number;
  name: string;
  email: string;
  joinDate: string;
}
