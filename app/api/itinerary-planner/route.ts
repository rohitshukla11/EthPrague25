import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert itinerary planner specializing in given region tourism. Based on user preferences, create a detailed and engaging itinerary for their visit to given region. Include historical landmarks, cultural experiences, dining recommendations, and travel tips.`,
          },
          {
            role: 'user',
            content: query,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7, // Balanced creativity for itinerary planning
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('OpenAI API error:', result);
      return NextResponse.json(
        { error: result.error?.message || 'Error generating itinerary' },
        { status: response.status }
      );
    }

    const itinerary = result.choices?.[0]?.message?.content || 'No itinerary generated.';
    return NextResponse.json({ itinerary });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}