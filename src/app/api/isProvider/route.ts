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
  const HEADERS = {
    accept: "application/json",
    "Content-Type": "application/json",
  };

  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT * FROM providers WHERE wallet_identity = $1",
      [request.nextUrl.searchParams.get("walletPublicIdentity")]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ isProvider: false });
    } else {
      return NextResponse.json({ isProvider: true });
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch provider" + err }, { status: 500 });
  } finally {
    client.release();
  }
}
