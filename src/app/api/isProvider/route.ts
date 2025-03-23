import { useQubicConnect } from '@/contexts/QubicConnectContext';
import { useQuLang } from '@/contexts/QuLangContext';
import { Pool } from 'pg';


const pool = new Pool({
  host: process.env.DB_HOST || "46.17.103.110",
  database: process.env.DB_NAME || "postgres",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "sabirestgay",
  ssl: false
});


export async function isProvider() {
  const { connected, showConnectModal, toggleConnectModal } = useQubicConnect();
  const { balance, fetchBalance, walletPublicIdentity } = useQuLang();
  
  if (!connected || !walletPublicIdentity) {
    return {
      status: 400,
      body: false
    }
  }
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM provider WHERE identity = $1', [walletPublicIdentity]);

    if (res.rows.length === 0) {
      return {
        status: 404,
        body: false
      }
    }
      else
      {
        return {
          status: 200,
          body: true
        }
      }
  } catch (err : any) {
    return {
      status: 500,
      body: err.message
    }
  } finally {
    client.release();
  }
}
