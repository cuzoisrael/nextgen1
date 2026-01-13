import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const vendors = await sql`
      SELECT * FROM vendors ORDER BY created_at DESC
    `;
    return Response.json(vendors);
  } catch (error) {
    console.error("Error listing vendors:", error);
    return Response.json({ error: "Failed to list vendors" }, { status: 500 });
  }
}
