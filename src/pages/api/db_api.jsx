import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || "46.17.103.110",
  database: process.env.DB_NAME || "postgres",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "sabirestgay",
  ssl: false
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { identity } = req.body;
      const result = await pool.query(
        'INSERT INTO users (identity) VALUES ($1) ON CONFLICT (identity) DO NOTHING RETURNING *',
        [identity]
      );
      res.status(200).json(result.rows[0] || { message: 'User already exists' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else if (req.method === 'GET') {
    try {
      const { identity } = req.query;
      const result = await pool.query('SELECT * FROM users WHERE identity = $1', [identity]);
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export async function createUser(identity) {
  const result = await pool.query(
    'INSERT INTO users (identity) VALUES ($1) ON CONFLICT (identity) DO NOTHING RETURNING *',
    [identity]
  );
  return result.rows[0];
}

export async function getUser(identity) {
  const result = await pool.query('SELECT * FROM users WHERE identity = $1', [identity]);
  return result.rows[0];
}

export async function getProviders() {
  const result = await pool.query('SELECT * FROM providers ORDER BY ranking DESC');
  return result.rows;
}

export async function createProvider(providerData) {
  const {
    model_name,
    endpoint_getstatus,
    endpoint_getname,
    endpoint_inference,
    ranking,
    wallet_identity,
    burn_rate,
    price_io
  } = providerData;
  const result = await pool.query(
    `INSERT INTO providers 
     (model_name, endpoint_getstatus, endpoint_getname, endpoint_inference, ranking, wallet_identity, burn_rate, price_io) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [model_name, endpoint_getstatus, endpoint_getname, endpoint_inference, ranking, wallet_identity, burn_rate, price_io]
  );
  return result.rows[0];
}

export async function updateProvider(provider_id, providerData) {
  const {
    model_name,
    endpoint_getstatus,
    endpoint_getname,
    endpoint_inference,
    ranking,
    wallet_identity,
    burn_rate,
    price_io
  } = providerData;
  const result = await pool.query(
    `UPDATE providers
     SET model_name = $1,
         endpoint_getstatus = $2,
         endpoint_getname = $3,
         endpoint_inference = $4,
         ranking = $5,
         wallet_identity = $6,
         burn_rate = $7,
         price_io = $8
     WHERE provider_id = $9
     RETURNING *`,
    [model_name, endpoint_getstatus, endpoint_getname, endpoint_inference, ranking, wallet_identity, burn_rate, price_io, provider_id]
  );
  return result.rows[0];
}

export async function recordTransaction(transactionData) {
  const { user_identity, provider_id, tokens_used, total_cost, burn_amount, net_amount } = transactionData;
  const result = await pool.query(
    `INSERT INTO transactions 
     (user_identity, provider_id, tokens_used, total_cost, burn_amount, net_amount) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [user_identity, provider_id, tokens_used, total_cost, burn_amount, net_amount]
  );
  return result.rows[0];
}

export async function updateTransaction(transaction_id, transactionData) {
  const { user_identity, provider_id, tokens_used, total_cost, burn_amount, net_amount } = transactionData;
  const result = await pool.query(
    `UPDATE transactions
     SET user_identity = $1,
         provider_id = $2,
         tokens_used = $3,
         total_cost = $4,
         burn_amount = $5,
         net_amount = $6
     WHERE id = $7
     RETURNING *`,
    [user_identity, provider_id, tokens_used, total_cost, burn_amount, net_amount, transaction_id]
  );
  return result.rows[0];
}

export async function getUserTransactions(user_identity) {
  const result = await pool.query(
    `SELECT t.*, p.model_name 
     FROM transactions t
     JOIN providers p ON t.provider_id = p.provider_id
     WHERE t.user_identity = $1
     ORDER BY t.created_at DESC`,
    [user_identity]
  );
  return result.rows;
}
