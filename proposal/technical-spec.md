# Qulang – Spécifications techniques MVP (v0.1)

## 1. Architecture

| Couche        | Tech choisie                           | Rôle principal                                                                |
|---------------|----------------------------------------|-------------------------------------------------------------------------------|
| Frontend      | **Next.js** (React 18) – Vercel         | Landing + dashboards Users / Providers, authentification mail + mdp            |
| API & Workers | **Node 18 / Express** – Docker          | REST / WebSocket, logique métier, signature TX, cron payout hebdo              |
| Base de données | **MongoDB 7** – Docker                | Persistance hors-chaîne                                                       |
| Blockchain    | **Qubic main-net**                     | Top-up, collecte, paiements, burn                                             |
| Stockage objet| **MinIO / OVH S3**                     | Dumps Mongo, exports                                                          |

---

## 2. Schéma MongoDB

```text
users
 └─ _id             ObjectId
 └─ email           string
 └─ passwordHash    Argon2id
 └─ nickname        string
 └─ identity        string  # Qubic ID (60 car.)
 └─ seedEnc         base64 AES-256-GCM(seed)
 └─ balanceCached   long    # QUBIC (facultatif)
 └─ status          ACTIVE | SUSPENDED
 └─ createdAt, updatedAt

providers
 └─ _id
 └─ email, passwordHash
 └─ identity        string  # Qubic ID
 └─ endpointPath    string  # URL inference
 └─ version         string
 └─ inputPrice      long    # QUBIC / 1 k tokens in
 └─ outputPrice     long    # QUBIC / 1 k tokens out
 └─ burnRate        float   # 0 – 1
 └─ totalEarnings   long
 └─ pendingPayout   long
 └─ status          READY | DISABLED
 └─ createdAt, updatedAt

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

auditLogs (optionnel)
 └─ _id, level, message, context, createdAt
````

---

## 3. Flux monétaire

| Étape               | Description                                                                                                                                                                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Top-up**          | Minimum **1 000 000 QUBIC**. L’utilisateur envoie les fonds vers *son* wallet custodial (seed chiffrée) ; l’API crédite `balanceCached` et crée `transactions.TOPUP`.                                                                          |
| **Consommation IA** | Débit immédiat du solde interne, crédit de `pendingPayout` chez le provider ; enregistrement `usageLogs` + `transactions.INFERENCE`.                                                                                                           |
| **Payout hebdo**    | **Dimanche 01 h 00 UTC**. Si `pendingPayout ≥ 3 000 000 QUBIC`, le hot-wallet central signe la TX → identity provider, inscrit `transactions.PAYOUT`, remet `pendingPayout = 0`. Les frais Qulang sont ensuite transférés vers un vault froid. |

---

## 4. Sécurité

| Élément            | Décision                                              |
| ------------------ | ----------------------------------------------------- |
| Chiffrement seeds  | AES-256-GCM, clé maître `ENV_SECRET`                  |
| Hash mots de passe | **Argon2id** (64 MiB, t = 3, p = 2) + pepper global   |
| Sessions           | JWT HS256, validité **3 jours**, pas de refresh-token |
| Signature TX       | Seed déchiffrée uniquement en mémoire volatile        |
| Limite API         | 50 req/min/IP                                         |
| Transport          | HTTPS obligatoire                                     |

---

## 5. Exigences fonctionnelles

| ID   | Fonction essentielle                                    |
| ---- | ------------------------------------------------------- |
| F-01 | Inscription / login mail + mdp                          |
| F-02 | Top-up via Qubic (min 1 000 000)                        |
| F-03 | Appel modèle IA : calcul coût, débit solde              |
| F-04 | Dashboard User : solde, historique, bouton Top-up       |
| F-05 | Dashboard Provider : pending payout, stats, éditer prix |
| F-06 | Batch payout hebdo automatique                          |
| F-07 | Admin : lister / suspendre users ou providers           |

---

## 6. Exigences non-fonctionnelles

| Domaine       | Cible                                         |
| ------------- | --------------------------------------------- |
| Latence API   | < 1 s (95ᵉ centile)                           |
| Débit API     | 50 req/min/IP                                 |
| Disponibilité | 99 % (MVP)                                    |
| Sauvegardes   | **Dump Mongo horaire** → MinIO, rétention 7 j |
| Logs audit    | WARN/ERROR conservés 90 j                     |

---

## 7. API (REST, JSON)

| Méthode & route            | Auth | Action résumée                        |
| -------------------------- | ---- | ------------------------------------- |
| `POST /auth/register`      | —    | Créer compte (F-01)                   |
| `POST /auth/login`         | —    | JWT 3 j                               |
| `POST /wallet/topup`       | U    | Génère adresse + montant, attend tick |
| `POST /model/infer`        | U    | Calcule coût, débite solde (F-03)     |
| `GET  /dashboard/user`     | U    | Solde + historique                    |
| `GET  /dashboard/provider` | P    | Pending payout + stats                |
| `POST /provider/update`    | P    | MAJ endpoint ou tarifs                |
| `POST /admin/ban`          | A    | Suspendre user/provider               |

> U = User, P = Provider, A = Admin

---

## 8. Jobs récurrents

| Job              | Fréquence         | Rôle                                                |
| ---------------- | ----------------- | --------------------------------------------------- |
| Listener ticks   | continu (< 1 s)   | Détecter `TOPUP` confirmées, créditer solde interne |
| Payout providers | Dimanche 01 h UTC | Envoyer pending ≥ 3 000 000 QUBIC, reset compteur   |
| Sweep vault      | Dimanche 01 h 15  | Transférer frais Qulang vers vault froid            |
| Backup Mongo     | **Chaque heure**  | `mongodump` → MinIO, rétention 7 j                  |
