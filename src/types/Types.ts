// User interface
export interface User {
  id: number;
  email: string;
  imageUrl: string | null;
  password: string;
  username: string;
}

// Post interface
export interface Post {
  id: number;
  caption: string;
  description: string;
  imageUrl: string;
  publicId: string;
  createdAt: string;
  user: User;
}
