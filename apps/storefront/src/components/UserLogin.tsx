/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/user-login.tsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getCustomerByEmail } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const user = await getCustomerByEmail(email);
      // save user to localStorage or context if needed
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/"); // redirect after login
    } catch (err) {
      setError("User not found");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 p-6 border rounded shadow"
    >
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="w-full mb-4 px-3 py-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Continue
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
}
