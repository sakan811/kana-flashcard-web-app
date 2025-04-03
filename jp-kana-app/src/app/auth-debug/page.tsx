"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

/**
 * Auth debugging page
 * This page helps diagnose authentication issues
 */
export default function AuthDebugPage() {
  const { data: session, status } = useSession();
  const [fetchResult, setFetchResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testSessionEndpoint = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/session');
      const contentType = res.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setFetchResult({ 
          status: res.status, 
          statusText: res.statusText,
          contentType,
          data 
        });
      } else {
        const text = await res.text();
        setFetchResult({ 
          status: res.status, 
          statusText: res.statusText,
          contentType,
          text: text.substring(0, 200) + (text.length > 200 ? '...' : '')
        });
        setError("Expected JSON response but got " + contentType);
      }
    } catch (err: any) {
      setError(err.message);
      setFetchResult(null);
    } finally {
      setLoading(false);
    }
  };

  const testDebugEndpoint = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/debug');
      const data = await res.json();
      setFetchResult({ status: res.status, data });
    } catch (err: any) {
      setError(err.message);
      setFetchResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Auth.js Debugging Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <div className="mb-4">
            <span className="font-medium">Status: </span>
            <span className={`px-2 py-1 rounded text-sm ${
              status === 'authenticated' ? 'bg-green-100 text-green-800' :
              status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {status}
            </span>
          </div>
          
          {session ? (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded overflow-auto max-h-64">
              <pre className="text-sm whitespace-pre-wrap break-words">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              {status === 'loading' ? 'Loading session...' : 'No active session'}
            </p>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">API Tests</h2>
          
          <div className="space-y-4">
            <div>
              <button
                onClick={testSessionEndpoint}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
              >
                Test Session Endpoint
              </button>
              <button
                onClick={testDebugEndpoint}
                disabled={loading}
                className="ml-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-400"
              >
                Test Debug Endpoint
              </button>
            </div>
            
            {loading && (
              <div className="text-yellow-600 dark:text-yellow-400">
                Loading...
              </div>
            )}
            
            {error && (
              <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded">
                Error: {error}
              </div>
            )}
            
            {fetchResult && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded overflow-auto max-h-64">
                <div className="mb-2">
                  <span className="font-medium">Status: </span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    fetchResult.status >= 200 && fetchResult.status < 300 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {fetchResult.status} {fetchResult.statusText}
                  </span>
                </div>
                
                {fetchResult.contentType && (
                  <div className="mb-2">
                    <span className="font-medium">Content-Type: </span>
                    <span className="text-gray-600 dark:text-gray-400">{fetchResult.contentType}</span>
                  </div>
                )}
                
                <pre className="text-sm whitespace-pre-wrap break-words">
                  {fetchResult.text 
                    ? fetchResult.text 
                    : JSON.stringify(fetchResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Environment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><span className="font-medium">Node Environment:</span> {process.env.NODE_ENV}</p>
            <p><span className="font-medium">Next.js Version:</span> {React.version}</p>
            <p><span className="font-medium">Browser:</span> {typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side'}</p>
          </div>
          <div>
            <p><span className="font-medium">Auth Endpoints:</span></p>
            <ul className="list-disc list-inside pl-4 text-gray-600 dark:text-gray-400">
              <li>/api/auth/session</li>
              <li>/api/auth/signin</li>
              <li>/api/auth/signout</li>
              <li>/api/auth/csrf</li>
              <li>/api/auth/callback/github</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 