import sql from "@/app/api/utils/sql";

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, payment_status, amount_paid, stripe_payment_intent_id } = body;

    if (!id) {
      return Response.json({ error: "Vendor ID is required" }, { status: 400 });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (payment_status) {
      updates.push(`payment_status = $${paramCount++}`);
      values.push(payment_status);
    }

    if (amount_paid !== undefined) {
      updates.push(`amount_paid = $${paramCount++}`);
      values.push(amount_paid);
    }

    if (stripe_payment_intent_id) {
      updates.push(`stripe_customer_id = $${paramCount++}`);
      values.push(stripe_payment_intent_id);
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(id);
    const query = `
      UPDATE vendors
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const [vendor] = await sql(query, values);

    return Response.json(vendor);
  } catch (error) {
    console.error("Error updating vendor:", error);
    return Response.json({ error: "Failed to update vendor" }, { status: 500 });
  }
}
