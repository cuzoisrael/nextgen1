import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const registration_type = searchParams.get("type");

    let query = sql`SELECT * FROM participants WHERE 1=1`;

    if (search) {
      const searchPattern = `%${search}%`;
      query = sql`
        SELECT * FROM participants 
        WHERE full_name ILIKE ${searchPattern} 
        OR email ILIKE ${searchPattern}
        OR organization ILIKE ${searchPattern}
      `;
    } else if (registration_type) {
      query = sql`
        SELECT * FROM participants 
        WHERE registration_type = ${registration_type}
      `;
    } else {
      query = sql`SELECT * FROM participants ORDER BY registered_at DESC`;
    }

    const participants = await query;
    return Response.json(participants);
  } catch (error) {
    console.error("Error listing participants:", error);
    return Response.json(
      { error: "Failed to list participants" },
      { status: 500 },
    );
  }
}
