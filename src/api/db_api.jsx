import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  host: "46.17.103.110",
  database: "postgres",
  user: "postgres",
  password: "sabirestgay",
  ssl: false
});

// Log connection status
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

// User related functions
export async function createUser(identity) {
  try {
    const result = await pool.query(
      'INSERT INTO users (identity) VALUES ($1) ON CONFLICT (identity) DO NOTHING RETURNING *',
      [identity]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUser(identity) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE identity = $1', [identity]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Provider related functions
export async function getProviders() {
  try {
    const result = await pool.query('SELECT * FROM providers ORDER BY ranking DESC');
    return result.rows;
  } catch (error) {
    console.error('Error fetching providers:', error);
    throw error;
  }
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
  
  try {
    const result = await pool.query(
      `INSERT INTO providers 
       (model_name, endpoint_getstatus, endpoint_getname, endpoint_inference, 
        ranking, wallet_identity, burn_rate, price_io) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [model_name, endpoint_getstatus, endpoint_getname, endpoint_inference, 
       ranking, wallet_identity, burn_rate, price_io]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating provider:', error);
    throw error;
  }
}

// Transaction related functions
export async function recordTransaction(transactionData) {
  const {
    user_identity,
    provider_id,
    tokens_used,
    total_cost,
    burn_amount,
    net_amount
  } = transactionData;
  
  try {
    const result = await pool.query(
      `INSERT INTO transactions 
       (user_identity, provider_id, tokens_used, total_cost, burn_amount, net_amount) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_identity, provider_id, tokens_used, total_cost, burn_amount, net_amount]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error recording transaction:', error);
    throw error;
  }
}

export async function getUserTransactions(user_identity) {
  try {
    const result = await pool.query(
      `SELECT t.*, p.model_name 
       FROM transactions t
       JOIN providers p ON t.provider_id = p.provider_id
       WHERE t.user_identity = $1
       ORDER BY t.created_at DESC`,
      [user_identity]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    throw error;
  }
}
