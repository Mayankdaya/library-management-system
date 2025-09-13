export interface Review {
  memberId: number;
  rating: number; // 1 to 5
  comment: string;
  date: string;
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
}

export interface Member {
  id: number;
  name: string;
  email: string;
  joinDate: string;
}
