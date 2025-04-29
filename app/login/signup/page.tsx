import React from "react";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form className="flex flex-col gap-4">
          <label htmlFor="username" className="text-left font-medium">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="password" className="text-left font-medium">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="mt-4 w-full px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-semibold"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
