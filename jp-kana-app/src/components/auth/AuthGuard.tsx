import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [redirectInitiated, setRedirectInitiated] = useState(false);

  React.useEffect(() => {
    // Only redirect if the user is definitely unauthenticated and redirect hasn't been initiated yet
    if (status === "unauthenticated" && !redirectInitiated) {
      // Mark that a redirect has been initiated to prevent multiple redirects
      setRedirectInitiated(true);
      // Include the current path as the callback URL
      const callbackUrl = encodeURIComponent(pathname);
      router.push(`/login?callbackUrl=${callbackUrl}`);
    }

    // Reset the redirect state if the status changes to loading or authenticated
    if (status !== "unauthenticated") {
      setRedirectInitiated(false);
    }
  }, [status, router, pathname, redirectInitiated]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-xl text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  // Only render children when authenticated
  if (status === "authenticated") {
    return <>{children}</>;
  }

  // Show placeholder while redirect happens
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
};

export default AuthGuard;
