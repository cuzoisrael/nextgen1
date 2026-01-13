import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const [participantsCount] =
      await sql`SELECT COUNT(*)::int as count FROM participants`;
    const [vendorsCount] =
      await sql`SELECT COUNT(*)::int as count FROM vendors`;

    return Response.json({
      participants: participantsCount.count,
      partners: vendorsCount.count,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
