import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    console.log("Received message:", message); // Debug log

    if (!message || typeof message !== "string") {
      console.error("Invalid message format");
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      console.error("API key not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log("Making request to xAI API..."); // Debug log
    const response = await axios.post(
      "https://api.x.ai/v1/chat/completions", // Updated to match curl
      {
        model: "grok-2-latest", // Match curl model
        messages: [
          {
            role: "system",
            content: "You are a test assistant.", // Added system message from curl
          },
          {
            role: "user",
            content: message,
          },
        ],
        stream: false, // Match curl
        temperature: 0, // Match curl (changed from 0.7)
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("xAI API response received:", response.data); // Debug log
    const grokResponse = response.data.choices[0].message.content.trim();
    
    return NextResponse.json({ reply: grokResponse }, { status: 200 });
  } catch (error) {
    console.error("Full error details:", error); // Detailed error logging
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error("Axios error details:", {
        status: error.response?.status,
        data: error.response?.data,
      });

      if (errorMessage?.includes("doesn't have any credits")) {
        return NextResponse.json(
          {
            error: "Your team account has no credits. Please purchase credits at https://console.x.ai/team to continue using Grok.",
          },
          { status: 402 }
        );
      }

      // Handle additional common API errors
      if (error.response?.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key" },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: errorMessage || "API request failed" },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: "edge",
};