import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { responses } = await request.json();

    if (!responses || !Array.isArray(responses)) {
      return Response.json(
        { error: "Invalid responses format" },
        { status: 400 },
      );
    }

    for (const response of responses) {
      await sql`
        INSERT INTO survey_responses (
          participant_id,
          question_id,
          response_text,
          response_options
        ) VALUES (
          ${response.participant_id || null},
          ${response.question_id},
          ${response.response_text || null},
          ${response.response_options || null}
        )
      `;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error submitting survey:", error);
    return Response.json({ error: "Failed to submit survey" }, { status: 500 });
  }
}
