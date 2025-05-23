import psycopg2

conn = psycopg2.connect(
    host="46.17.103.110",
    database="postgres",
    user="postgres",
    password="sabirestgay"
)
cur = conn.cursor()

# Supprimer les tables existantes (dans l'ordre inverse des dépendances)
cur.execute("DROP TABLE IF EXISTS transactions CASCADE;")
cur.execute("DROP TABLE IF EXISTS providers CASCADE;")
cur.execute("DROP TABLE IF EXISTS logins CASCADE;")
cur.execute("DROP TABLE IF EXISTS users CASCADE;")
conn.commit()

print("Tables supprimées avec succès !")

# Créer la table users : seul le champ "identity" (clé primaire) est non nul.
cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    identity VARCHAR(255) PRIMARY KEY
);
""")

# Créer la table providers, tous les champs peuvent être NULL sauf la clé primaire.
cur.execute("""
CREATE TABLE IF NOT EXISTS providers (
    provider_id SERIAL PRIMARY KEY,
    model_name VARCHAR(255) NULL,
    endpoint_getstatus VARCHAR(255) NULL,
    endpoint_getname VARCHAR(255) NULL,
    endpoint_inference VARCHAR(255) NULL,
    ranking INTEGER NULL,
    wallet_identity VARCHAR(255) NULL,
    burn_rate NUMERIC(5,2) NULL,
    price_io NUMERIC(10,2) NULL
);
""")

# Créer la table transactions, tous les champs peuvent être NULL sauf la clé primaire.
cur.execute("""
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_identity VARCHAR(255) NULL,
    provider_id INT NULL,
    tokens_used NUMERIC(10,2) NULL,
    total_cost NUMERIC(10,2) NULL,
    burn_amount NUMERIC(10,2) NULL,
    net_amount NUMERIC(10,2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""")

# Créer une table micro login
cur.execute("""
CREATE TABLE IF NOT EXISTS logins (
    identity VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NULL,
    password VARCHAR(255) NULL,
    last_login TIMESTAMP NULL
);
""")

conn.commit()
cur.close()
conn.close()

print("Tables créées avec succès !")
