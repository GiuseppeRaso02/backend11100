# UNDR/GRD — Backend API

Backend completo Node.js + Express + MongoDB + JWT + Cloudinary per lo shop streetwear.

## 📦 Cosa c'è dentro

```
backend-undrgrd/
├── src/
│   ├── server.js              # Entry point Express
│   ├── config/
│   │   ├── db.js              # Connessione MongoDB
│   │   └── cloudinary.js      # Setup upload immagini
│   ├── models/
│   │   ├── User.js            # Schema utente + hash password
│   │   ├── Product.js         # Schema prodotti
│   │   └── Request.js         # Schema richieste clienti
│   ├── middleware/
│   │   ├── authMiddleware.js  # ✅ controlla se sei loggato (+ admin)
│   │   └── validate.js        # Validazione body con Zod
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── requestController.js
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth/{register,login,me}
│   │   ├── productRoutes.js   # /api/products (CRUD)
│   │   └── requestRoutes.js   # /api/requests
│   └── utils/
│       └── seedAdmin.js       # Crea il primo admin
├── package.json
├── .env.example               # Copia in .env e compila
└── .gitignore
```

## 🚀 Setup locale (5 minuti)

### 1. Installa Node.js 18+
Se non ce l'hai: https://nodejs.org

### 2. Installa le dipendenze
```bash
cd backend-undrgrd
npm install
```

### 3. Crea il database MongoDB (gratis)
1. Vai su https://www.mongodb.com/cloud/atlas → registrati
2. Crea un cluster **M0 Free**
3. **Database Access** → crea utente con password
4. **Network Access** → aggiungi IP `0.0.0.0/0` (consenti da ovunque)
5. **Connect** → "Drivers" → copia la connection string
   (sostituisci `<password>` con la tua password)

### 4. Crea account Cloudinary (gratis)
1. https://cloudinary.com → registrati
2. Dashboard → copia **Cloud Name**, **API Key**, **API Secret**

### 5. Configura `.env`
```bash
cp .env.example .env
```
Apri `.env` e compila tutti i valori. Per generare un JWT_SECRET robusto:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 6. Crea il primo admin
```bash
npm run seed:admin
```
Userà `ADMIN_EMAIL` e `ADMIN_PASSWORD` dal `.env`.

### 7. Avvia
```bash
npm run dev
```
→ API live su http://localhost:4000
→ Test: http://localhost:4000/api/health

## 🌐 Deploy in produzione (gratis)

### Opzione consigliata: Render.com

1. Spingi questo progetto su GitHub
2. Vai su https://render.com → New → Web Service
3. Collega la repo
4. Build: `npm install` — Start: `npm start`
5. Aggiungi **tutte** le variabili del `.env` in **Environment**
6. ⚠️ Cambia `CORS_ORIGIN` con il dominio del tuo frontend
   (es. `https://undrgrd.lovable.app`)
7. Deploy → ottieni URL pubblico tipo `https://undrgrd-api.onrender.com`

### Alternative: Railway, Fly.io, VPS personale

## 📡 API Endpoints

### Auth
| Metodo | Path | Body | Auth |
|--------|------|------|------|
| POST | `/api/auth/register` | `{email, password, name?}` | ❌ |
| POST | `/api/auth/login` | `{email, password}` | ❌ |
| GET | `/api/auth/me` | — | ✅ Bearer |

Risposta login/register:
```json
{ "token": "eyJhbGc...", "user": { "_id": "...", "email": "...", "role": "user" } }
```

### Products
| Metodo | Path | Auth |
|--------|------|------|
| GET | `/api/products?category=Hoodie&q=void` | ❌ |
| GET | `/api/products/:id` | ❌ |
| POST | `/api/products` (multipart, campo `image`) | 🛡️ admin |
| PUT | `/api/products/:id` (multipart) | 🛡️ admin |
| DELETE | `/api/products/:id` | 🛡️ admin |

Body create/update (multipart/form-data):
```
name=VOID Hoodie
category=Hoodie
price=145
stock=12
sizes=S,M,L,XL
description=...
drop=DROP 04
image=<file>
```

### Requests (richieste clienti dal carrello)
| Metodo | Path | Auth |
|--------|------|------|
| POST | `/api/requests` | opzionale |
| GET | `/api/requests` | 🛡️ admin |
| PATCH | `/api/requests/:id` (`{status}`) | 🛡️ admin |

Body POST:
```json
{
  "contact": { "name": "Mario", "phone": "+39...", "email": "...", "notes": "" },
  "items": [
    { "productId": "...", "name": "VOID Hoodie", "size": "L", "price": 145, "quantity": 1 }
  ]
}
```

## 🔐 Come funzionano i middleware

```js
// solo loggati
router.get("/me", authMiddleware, controller);

// solo admin (auth + admin in catena)
router.post("/", authMiddleware, adminMiddleware, controller);
```

Il client deve mandare l'header:
```
Authorization: Bearer <token-ricevuto-dal-login>
```

## 🔌 Collegare il frontend Lovable

Una volta che il backend è online (es. `https://undrgrd-api.onrender.com`),
torna sul progetto Lovable e dimmi:

> "Il backend è live su `https://...`. Collega il frontend"

Io sostituirò i dati mock con chiamate `fetch` reali al tuo backend.

## ✅ Checklist sicurezza inclusa

- [x] Password hashate con bcrypt (cost 12)
- [x] JWT firmati con secret robusto
- [x] CORS configurabile
- [x] Helmet (HTTP headers sicuri)
- [x] Rate limit globale + anti brute-force su `/auth`
- [x] Validazione input con Zod
- [x] Ruolo admin separato (mai dal client)
- [x] Cloudinary per immagini (no file salvati sul server)

## 🆘 Problemi comuni

**`MongoServerError: bad auth`** → password sbagliata in `MONGO_URI`
**`CORS error` dal frontend** → aggiungi il dominio del frontend in `CORS_ORIGIN`
**`401 Token mancante`** → il client non sta mandando l'header `Authorization`
**Render dorme dopo 15 min** → normale per il free tier; passa al piano da 7$/mese

---

Made underground. Codice 100% tuo. 🖤
