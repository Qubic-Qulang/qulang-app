# Qulang – Spécifications techniques MVP (v0.1)

## 1. Architecture

| Couche        | Tech choisie                              | Rôle                                                                 |
| ------------- | ----------------------------------------- | -------------------------------------------------------------------- |
| Frontend      | **Next.js** (React 18) – hébergé sur Vercel | UI publique + dashboards Users / Providers, auth (mail + mdp, wallet) |
| API & Workers | Node 18 (Express) – conteneurs **Docker** | REST, logique métier, signature TX, cron payout hebdo                 |
| Base de données | **MongoDB 7** (Docker)                   | Persistance hors-chaîne                                              |
| Blockchain    | Qubic main-net                            | Top-up, collecte, paiements, burn                                     |
| Object storage (option) | MinIO / OVH S3                  | Logs binaires, exports                                               |

---

## 2. Schéma MongoDB

```text
users
 └─ _id           ObjectId
 └─ email         string
 └─ passwordHash  Argon2id
 └─ nickname      string
 └─ identity      string (Qubic ID)
 └─ seedEnc       base64 AES-256-GCM(seed)
 └─ balanceCached long   # non critique
 └─ status        ACTIVE | SUSPENDED
 └─ createdAt / updatedAt

providers
 └─ _id
 └─ email
 └─ passwordHash
 └─ identity      string (public ID)
 └─ endpointPath  string
 └─ version       string
 └─ inputPrice    long   # QUBIC / 1 k in
 └─ outputPrice   long   # QUBIC / 1 k out
 └─ burnRate      float  # 0–1
 └─ totalEarnings long
 └─ pendingPayout long
 └─ status        READY | DISABLED
 └─ createdAt / updatedAt

transactions
 └─ _id
 └─ txHash, tick
 └─ type      TOPUP | WITHDRAW | INFERENCE | PAYOUT
 └─ userId?, providerId?
 └─ amount, burned
 └─ status    PENDING | CONFIRMED | FAILED
 └─ timestamp

usageLogs
 └─ _id, userId, providerId
 └─ inputTokens, outputTokens, cost
 └─ tick, createdAt

auditLogs (option)
 └─ _id, level, message, context, createdAt
````

---

## 3. Flux monétaire

1. **Top-up**

   * Seed (55 car.) générée → `seedEnc`.
   * Utilisateur envoie QUBIC → **son** wallet custodial.
   * API crédite `balanceCached` et crée `transactions.TOPUP`.

2. **Utilisation IA**

   * Débit immédiat du solde interne, crédit `pendingPayout` provider.
   * Logs : `usageLogs`, `transactions.INFERENCE`.

3. **Payout hebdo**

   * **Dimanche 01 h 00 UTC**.
   * Si `pendingPayout ≥ 3 000 000 QUBIC` : TX signée depuis le hot-wallet central → provider, reset à 0.
   * Frais Qulang transférés vers vault froid.

---

## 4. Sécurité

| Élément            | Décision                                        |
| ------------------ | ----------------------------------------------- |
| Chiffrement seeds  | AES-256-GCM, clé maître `ENV_SECRET`            |
| Hash mots de passe | **Argon2id** (64 MiB, t = 3, p = 2) + pepper    |
| Auth sessions      | JWT HS256, validité **3 jours**, pas de refresh |
| Signature TX       | Seed déchiffrée uniquement en RAM               |
| Retrait provider   | Payout batch hebdo (voir flux)                  |

