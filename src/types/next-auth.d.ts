import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      avatar?: string;
      restaurantIds: string[];
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
    restaurantIds: string[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    restaurantIds: string[];
    avatar?: string;
  }
}

