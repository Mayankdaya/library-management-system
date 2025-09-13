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
}

export interface Member {
  id: number;
  name: string;
  email: string;
  joinDate: string;
}
