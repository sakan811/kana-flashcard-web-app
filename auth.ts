import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user }) {
      // Check if this is a valid user object with email
      if (user && user.id) {
        try {
          // Try to find the user first
          const existingUser = await prisma.user.findUnique({
            where: { id: user.id }
          });
          
          // If user doesn't exist in database yet, create them
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || 'GitHub User',
              },
            });
            console.log(`Created new user: ${user.email}`);
          }
          
          return true;
        } catch (error) {
          console.error('Error creating/finding user:', error);
          return false;
        }
      }
      return true;
    }
  }
})