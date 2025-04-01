import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-xl text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          Authentication Required
        </h1>
        <p className="text-xl mb-10 max-w-2xl text-gray-600 dark:text-gray-300">
          Please sign in to access the flashcards.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
