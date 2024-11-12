export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface VaultEntry {
  _id: string;
  userId: string;
  title: string;
  type: 'text' | 'image';
  content: string;
  isDecrypted: boolean;
  createdAt: Date;
}