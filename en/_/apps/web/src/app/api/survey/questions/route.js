import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const questions = await sql`
      SELECT * FROM survey_questions
      WHERE is_active = true
      ORDER BY id ASC
    `;

    return Response.json(questions);
  } catch (error) {
    console.error("Error fetching survey questions:", error);
    return Response.json(
      { error: "Failed to fetch questions" },
      { status: 500 },
    );
  }
}
