import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query) {
    return NextResponse.json({ error: 'Missing query for historical information' }, { status: 400 });
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
            content: `You are a historian specializing in the history of given region. Provide detailed, accurate, and engaging information about historical places in given region for tourists. Include key landmarks, their historical significance, and tips for visiting.`,
          },
          {
            role: 'user',
            content: query,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7, // Balanced creativity for historical storytelling
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('OpenAI API error:', result);
      return NextResponse.json(
        { error: result.error?.message || 'Error retrieving historical information' },
        { status: response.status }
      );
    }

    const history = result.choices?.[0]?.message?.content || 'No historical information retrieved.';
    return NextResponse.json({ history });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}