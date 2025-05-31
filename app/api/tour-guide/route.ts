import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { preferences } = await req.json();

  if (!preferences) {
    return NextResponse.json({ error: 'Missing preferences for tour recommendations' }, { status: 400 });
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
            content: `You are a knowledgeable tour guide specializing in Prague. Based on user preferences, provide personalized recommendations for places to visit, activities to do, and cultural experiences to enjoy in Prague. Include practical tips and insights to enhance the user's experience.`,
          },
          {
            role: 'user',
            content: preferences,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7, // Balanced creativity for tour recommendations
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('OpenAI API error:', result);
      return NextResponse.json(
        { error: result.error?.message || 'Error generating tour recommendations' },
        { status: response.status }
      );
    }

    const recommendations = result.choices?.[0]?.message?.content || 'No recommendations generated.';
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}