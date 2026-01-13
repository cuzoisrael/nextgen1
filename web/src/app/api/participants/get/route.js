import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    const [participant] = await sql`
      SELECT * FROM participants WHERE id = ${id}
    `;

    if (!participant) {
      return Response.json({ error: "Participant not found" }, { status: 404 });
    }

    return Response.json(participant);
  } catch (error) {
    console.error("Error fetching participant:", error);
    return Response.json(
      { error: "Failed to fetch participant" },
      { status: 500 },
    );
  }
}
