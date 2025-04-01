"use client";

import { useEffect } from "react";

/**
 * Component to initialize database when the app loads
 * This is a client component since it needs to be run in the browser
 */
const DatabaseInitializer = () => {
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log("Initializing kana database...");
        const response = await fetch("/api/init-database", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (data.success) {
          console.log(
            `Database initialized with ${data.count} kana characters.`,
          );
          console.log("Database initialization complete:", data.message);
        } else {
          console.error("Error initializing database:", data.message);
        }
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };

    initializeDatabase();
  }, []);

  // This component doesn't render anything visible to avoid disrupting the UI
  return null;
};

export default DatabaseInitializer;
