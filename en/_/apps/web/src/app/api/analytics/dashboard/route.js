import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const [participantsCount] =
      await sql`SELECT COUNT(*)::int as count FROM participants`;
    const [vendorsCount] =
      await sql`SELECT COUNT(*)::int as count FROM vendors`;
    const [feedbackCount] =
      await sql`SELECT COUNT(*)::int as count FROM feedback`;
    const [revenueSum] =
      await sql`SELECT COALESCE(SUM(amount_paid), 0)::numeric as total FROM vendors`;

    const registrationTypes = await sql`
      SELECT registration_type as type, COUNT(*)::int as count 
      FROM participants 
      GROUP BY registration_type
      ORDER BY count DESC
    `;

    // Get top interests by unnesting the array and counting
    const topInterests = await sql`
      SELECT 
        unnest(interests) as interest, 
        COUNT(*)::int as count 
      FROM participants 
      WHERE interests IS NOT NULL AND array_length(interests, 1) > 0
      GROUP BY unnest(interests)
      ORDER BY count DESC
      LIMIT 10
    `;

    return Response.json({
      total_participants: participantsCount.count,
      total_vendors: vendorsCount.count,
      total_feedback: feedbackCount.count,
      total_revenue: parseFloat(revenueSum.total),
      registration_types: registrationTypes,
      top_interests: topInterests,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return Response.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
