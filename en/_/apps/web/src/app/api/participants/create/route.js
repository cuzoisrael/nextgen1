import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      full_name,
      email,
      phone,
      organization,
      role,
      location,
      country,
      registration_type,
      interests,
    } = body;

    // Generate QR code for the participant
    const qrCodeUrl = `data:${encodeURIComponent(JSON.stringify({ id: email, name: full_name, type: registration_type }))}`;
    const qrResponse = await fetch(
      `/integrations/qr-code/generatebasicbase64?data=${qrCodeUrl}&size=300`,
    );
    const qrCodeBase64 = await qrResponse.text();
    const qr_code_url = `data:image/png;base64,${qrCodeBase64}`;

    const [participant] = await sql`
      INSERT INTO participants (
        full_name, email, phone, organization, role, location, country, 
        registration_type, interests, qr_code_url
      )
      VALUES (
        ${full_name}, ${email}, ${phone || null}, ${organization || null}, 
        ${role || null}, ${location || null}, ${country || null}, 
        ${registration_type}, ${interests || []}, ${qr_code_url}
      )
      RETURNING *
    `;

    return Response.json(participant);
  } catch (error) {
    console.error("Error creating participant:", error);
    return Response.json(
      { error: "Failed to create participant" },
      { status: 500 },
    );
  }
}
