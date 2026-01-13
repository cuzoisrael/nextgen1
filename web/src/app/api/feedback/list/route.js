import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const feedback = await sql`
      SELECT * FROM feedback ORDER BY submitted_at DESC LIMIT 100
    `;
    return Response.json(feedback);
  } catch (error) {
    console.error("Error listing feedback:", error);
    return Response.json({ error: "Failed to list feedback" }, { status: 500 });
  }
}
