import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST || "46.17.103.110",
  database: process.env.DB_NAME || "postgres",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "sabirestgay",
  ssl: false,
});

export async function GET(request: NextRequest) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT * FROM providers WHERE wallet_identity = $1",
      [request.nextUrl.searchParams.get("walletPublicIdentity")]
    );

    if (res.rows.length === 0) {
      try {
        const result = await pool.query(
          `INSERT INTO providers 
           (endpoint_inference,  wallet_identity) 
           VALUES ($1, $2)`,
          [
            request.nextUrl.searchParams.get("endpoint_inference"),
            request.nextUrl.searchParams.get("walletPublicIdentity"),
          ]
        );
        return NextResponse.json({ worked: true });
      } catch (error) {
        return NextResponse.json(
          { error: "Failed to insert provider" + error },
          { status: 500 }
        );
      }
    } else {
      const result = await pool.query(
        `UPDATE providers 
         SET endpoint_inference = $1 
         WHERE wallet_identity = $2`,
        [
          request.nextUrl.searchParams.get("endpoint_inference"),
          request.nextUrl.searchParams.get("walletPublicIdentity"),
        ]
      );
      return NextResponse.json({ worked: true });
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch provider" + err },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
