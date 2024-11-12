export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface VaultEntry {
  id: string;
  userId: string;
  type: 'text' | 'image';
  content: string;
  isDecrypted: boolean;
  createdAt: Date;
}