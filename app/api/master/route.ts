import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Missing query" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a master agent that is reposnsible to distribute tasks to sub-agents. You are given a user input and you need to distribute the tasks to the sub-agents. The sub-agents are:
            - Historician Agent (to provide historical information about the city)
            - Tour Guide Agent (to provide tour guide information about the city)
            - Itinerary Planner Agent (to provide itinerary information about the city)
            - Language Translator Agent (to provide language translation information about the city)
            You need to distribute the tasks to the sub-agents based on their capabilities. You need to give user prompt to the sub-agents and return the result to the user`,
          },
          {
            role: "user",
            content: query,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", result);
      return NextResponse.json(
        { error: result.error?.message || "Error generating itinerary" },
        { status: response.status }
      );
    }

    const itinerary =
      result.choices?.[0]?.message?.content || "No itinerary generated.";
    return NextResponse.json({ itinerary });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
