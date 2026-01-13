import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      company_name,
      contact_person,
      email,
      phone,
      partnership_tier,
      amount_pledged,
      website,
    } = body;

    const [vendor] = await sql`
      INSERT INTO vendors (
        company_name, contact_person, email, phone, partnership_tier, amount_pledged, website
      )
      VALUES (
        ${company_name}, ${contact_person}, ${email}, ${phone || null}, 
        ${partnership_tier}, ${amount_pledged}, ${website || null}
      )
      RETURNING *
    `;

    return Response.json(vendor);
  } catch (error) {
    console.error("Error creating vendor:", error);
    return Response.json({ error: "Failed to create vendor" }, { status: 500 });
  }
}
