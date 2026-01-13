import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      participant_id,
      feedback_type,
      session_name,
      rating,
      comments,
      suggestions,
    } = body;

    // Use AI to analyze sentiment
    let sentiment_score = null;
    if (comments) {
      try {
        const aiResponse = await fetch("/integrations/google-gemini-2-5-pro/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `Analyze the sentiment of this feedback and return ONLY a number between -1 (very negative) and 1 (very positive): "${comments}"`,
              },
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const sentimentText = aiData.choices[0]?.message?.content || "0";
          sentiment_score = parseFloat(
            sentimentText.match(/-?\d+\.?\d*/)?.[0] || "0",
          );
        }
      } catch (error) {
        console.error("Error analyzing sentiment:", error);
      }
    }

    const [feedback] = await sql`
      INSERT INTO feedback (
        participant_id, feedback_type, session_name, rating, comments, suggestions, sentiment_score
      )
      VALUES (
        ${participant_id || null}, ${feedback_type}, ${session_name || null}, 
        ${rating || null}, ${comments || null}, ${suggestions || null}, ${sentiment_score}
      )
      RETURNING *
    `;

    return Response.json(feedback);
  } catch (error) {
    console.error("Error creating feedback:", error);
    return Response.json(
      { error: "Failed to create feedback" },
      { status: 500 },
    );
  }
}
