"use client";

import { useEffect, useState } from "react";

/**
 * Component that displays information about database initialization
 * This is now for informational purposes only as database seeding is done via Prisma seeds
 */
const DatabaseInitializer = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  useEffect(() => {
    // Check if we're in a development environment
    if (process.env.NODE_ENV === "development") {
      setMessage(
        'Database is initialized using Prisma seeds. Run "npm run prisma:seed" to seed the database.',
      );
    }
  }, []);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isInfoVisible ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg shadow-md max-w-md">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-sm">Database Information</h4>
            <button
              onClick={() => setIsInfoVisible(false)}
              className="text-blue-500 hover:text-blue-700"
            >
              ✕
            </button>
          </div>
          <p className="text-sm">{message}</p>
          <div className="mt-2 text-xs text-blue-600">
            <p>To seed the database manually, run:</p>
            <code className="bg-blue-100 px-2 py-1 rounded">
              npm run prisma:seed
            </code>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsInfoVisible(true)}
          className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600"
          title="Database information"
        >
          ℹ️
        </button>
      )}
    </div>
  );
};

export default DatabaseInitializer;
