/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/user-login.tsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getOrCreateCustomer } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Get existing customer or create new one
      const customer = await getOrCreateCustomer(email, name || undefined);

      // Save customer to localStorage
      localStorage.setItem("customer", JSON.stringify(customer));
      localStorage.setItem("customerId", customer._id);
      localStorage.setItem("customerEmail", customer.email);

      // Redirect to home page
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-8 border rounded-lg shadow-md"
      >
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Welcome
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your email to continue
        </p>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name (optional)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Only needed for new accounts
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {loading ? "Please wait..." : "Continue"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center mt-6">
          New users will be automatically registered
        </p>
      </form>
    </div>
  );
}
