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
      "SELECT * FROM providers"
    );
   
    // make a requeest thorugh these endpoints an crete a json object with the results in this way wallet_identity: response_from_endpoint
    // return the json object
    const results = [];
    for(let i = 0; i < res.rows.length; i++){
      const response = await fetch(res.rows[i].endpoint_inference, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      results.push({status : json,  wallet_identity:res.rows[i].wallet_identity}); 
      
    }
    return NextResponse.json( results );

  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch providers" + err },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
