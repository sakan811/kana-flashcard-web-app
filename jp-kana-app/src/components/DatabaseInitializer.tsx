'use client';

import { useEffect } from 'react';

/**
 * Component to initialize database when the app loads
 * This is a client component since it needs to be run in the browser
 */
const DatabaseInitializer = () => {
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const response = await fetch('/api/init-database');
        const data = await response.json();
        
        if (data.success) {
          console.log('Database initialization complete:', data.message);
        } else {
          console.error('Error initializing database:', data.message);
        }
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initializeDatabase();
  }, []);

  // This component doesn't render anything
  return null;
};

export default DatabaseInitializer; 