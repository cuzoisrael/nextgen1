import sql from "@/app/api/utils/sql";

export async function POST() {
  try {
    // Gather all analytics data
    const [participantsCount] =
      await sql`SELECT COUNT(*)::int as count FROM participants`;
    const registrationTypes = await sql`
      SELECT registration_type, COUNT(*)::int as count 
      FROM participants 
      GROUP BY registration_type
    `;
    const topInterests = await sql`
      SELECT unnest(interests) as interest, COUNT(*)::int as count 
      FROM participants 
      WHERE interests IS NOT NULL 
      GROUP BY unnest(interests)
      ORDER BY count DESC LIMIT 10
    `;
    const feedbackStats = await sql`
      SELECT 
        AVG(rating)::numeric(3,2) as avg_rating,
        COUNT(*)::int as total_feedback,
        AVG(sentiment_score)::numeric(3,2) as avg_sentiment
      FROM feedback
      WHERE rating IS NOT NULL
    `;

    const analyticsData = {
      total_participants: participantsCount.count,
      registration_types: registrationTypes,
      top_interests: topInterests,
      feedback: feedbackStats[0],
    };

    // Use Google Gemini to generate insights
    const response = await fetch("/integrations/google-gemini-2-5-pro/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `You are an expert event analyst for NextGen Summit 2026, a premier technology conference in Nigeria. 
          
Analyze this data and provide actionable insights:

${JSON.stringify(analyticsData, null, 2)}

Provide:
1. Key trends and patterns
2. Recommendations for improving participant experience
3. Suggested focus areas for content and sessions
4. Marketing insights
5. Potential partnership opportunities

Be specific, data-driven, and actionable. Format your response clearly with sections.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("AI analysis failed");
    }

    const aiData = await response.json();
    const insights = aiData.choices[0]?.message?.content;

    // Store the insights
    await sql`
      INSERT INTO analytics_insights (insight_type, insight_data)
      VALUES ('ai_generated', ${JSON.stringify({ insights, data: analyticsData })})
    `;

    return Response.json({ insights, data: analyticsData });
  } catch (error) {
    console.error("Error generating insights:", error);
    return Response.json(
      { error: "Failed to generate insights" },
      { status: 500 },
    );
  }
}
