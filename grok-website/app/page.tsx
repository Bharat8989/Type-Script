"use client"; // Mark this as a Client Component

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return; // Prevent empty submissions

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/grok", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Server error");
      }
      
      setResponse(data.reply);
    } catch (error) {
      setResponse(error instanceof Error ? error.message : "Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Ask Grok</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question here..."
          className="w-full p-3 border rounded-lg mb-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Thinking..." : "Submit"}
        </button>
      </form>
      {response && (
        <div className="mt-6 w-full max-w-md p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Grok's Response:</h2>
          <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
}