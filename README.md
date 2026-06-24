# Datan

Datan - Django REST API va React/Vite frontenddan iborat Excel reestr import qilish va boshqarish tizimi. Tizim operatorlar yuklagan GSM va SHPD Excel fayllarini tekshiradi, maxfiylik qoidalarini qo'llaydi, yozuvlarni PostgreSQL bazasiga saqlaydi va supervisor uchun statistik/audit panel beradi.

## Asosiy imkoniyatlar

- Excel import: `.xlsx` va `.xlsm` fayllarini yuklash.
- Ikki manba turi: `Mobil raqam` va `Internet ulanish`.
- Deduplikatsiya: eski yozuvlar qayta bazaga yozilmaydi.
- Maxfiylik qoidalari: qizil ustunlar saqlanmaydi, sariq ustunlar maskalanadi, ochiq ustunlar asl holida saqlanadi.
- Rollar: operator faqat o'z importlarini ko'radi, supervisor o'z viloyatini boshqaradi, manager barcha viloyatlarni ko'radi.
- Dashboard: reestr, upload, operator va oxirgi import statistikasi.
- Audit log: login, upload va foydalanuvchi boshqaruvi amallari bazaga yoziladi.

## Texnologiyalar

- Backend: Django, Django REST Framework, Simple JWT
- Database: PostgreSQL
- Excel parser: openpyxl
- Frontend: React 18, Vite, React Router, Axios
- UI iconlar: lucide-react

## Loyiha tuzilmasi

```text
datan/
  backend/
    accounts/           # user, role, audit log
    records/            # upload batch, registry records, import service
    telecom_registry/   # Django settings va URL routing
    scripts/            # database helper script
  data/                 # namunaviy Excel fayllar
  frontend/
    public/             # favicon va public assetlar
    src/
      components/       # layout, sidebar, umumiy UI komponentlar
      pages/            # dashboard, upload, records, audit va boshqalar
      api/              # axios client
      auth/             # auth context
```

## Talablar

- Python 3.12+ tavsiya etiladi
- Node.js 20+ tavsiya etiladi
- PostgreSQL 14+
- Windows PowerShell buyruqlari quyida ko'rsatilgan

## Backendni ishga tushirish

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

`backend/.env` ichida PostgreSQL va boshlang'ich supervisor qiymatlarini sozlang:

```env
POSTGRES_DB=reestr_telecom
POSTGRES_USER=reestr_user
POSTGRES_PASSWORD=reestr_password
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432

MANAGER_USERNAME=manager
MANAGER_PASSWORD=manager12345
```

Database yaratish, migration va supervisor yaratish:

```powershell
python scripts\create_database.py
python manage.py migrate
python manage.py create_manager
python manage.py runserver 127.0.0.1:8000
```

Backend URL:

```text
http://127.0.0.1:8000
```

## Frontendni ishga tushirish

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Frontend URL:

```text
http://127.0.0.1:5173
```

Vite proxy `/api` so'rovlarini lokal backendga yuboradi:

```text
/api -> http://127.0.0.1:8000
```

Production build:

```powershell
cd frontend
npm run build
```

## Rollar

`supervisor`:

- o'z viloyatidagi operator akkauntlarini yaratadi;
- o'z viloyatidagi upload va reestr yozuvlarini ko'radi;
- audit log va tizim statistikalarini ko'radi;
- foydalanuvchi holatini va parolini boshqaradi.

`manager`:

- barcha viloyat va filiallar bo'yicha ma'lumotlarni ko'radi;
- supervisor va operator akkauntlarini boshqaradi;
- umumiy statistika, audit va import tarixini nazorat qiladi.

`operator`:

- login/parol bilan kiradi;
- Excel fayl yuklaydi;
- faqat o'z uploadlari va yozuvlarini ko'radi.

## Frontend sahifalar

- `/dashboard` - umumiy statistika
- `/upload` - Excel fayl yuklash
- `/records` - reestr yozuvlari
- `/batches` - yuklashlar tarixi
- `/privacy` - maxfiylik qoidalari
- `/operators` - foydalanuvchilar boshqaruvi
- `/audit` - audit log

`/operators` va `/audit` supervisor, manager va admin uchun ochiq.

## Asosiy API endpointlar

```text
POST /api/auth/token/             # login
POST /api/auth/token/refresh/     # token refresh
GET  /api/users/me/               # joriy user
GET  /api/records/stats/          # dashboard statistika
POST /api/records/upload/         # Excel upload
GET  /api/records/                # reestr list
GET  /api/records/<id>/           # reestr detail
GET  /api/records/batches/        # upload batchlar
GET  /api/audit-logs/             # audit log
GET  /api/operators/              # foydalanuvchilar
```

## Excel import qoidalari

Upload sahifasida manba turi tanlanadi:

- `Mobil raqam` - GSM reestr fayllari.
- `Internet ulanish` - SHPD reestr fayllari.

Backend Excel sarlavha qatorini avtomatik topadi va fayl turini tekshiradi. Masalan, `Internet ulanish` tanlab GSM fayli yuborilsa import rad etiladi.

Deduplikatsiya ustuvor kalitlari:

- kontrakt raqami;
- ariza raqami;
- GSM uchun telefon + SIM;
- SHPD uchun internet login + hisob raqami;
- oxirgi fallback: hujjat raqami + mijoz + sana.

## Maxfiylik qoidalari

`data/rule` ichidagi rang belgilari import xizmatida qo'llanadi:

- qizil ustunlar bazaga yozilmaydi;
- sariq ustunlar maskalanadi, masalan `ABC***`;
- ochiq ustunlar asl qiymatida saqlanadi.

Oldin import qilingan yozuvlarni yangilangan qoidalarga o'tkazish:

```powershell
cd backend
python manage.py apply_privacy_rules
```

Mijoz nomlari maskasini qayta hisoblash:

```powershell
cd backend
python manage.py refresh_client_name_masks
```

## Audit

Quyidagi amallar `accounts_auditlog` jadvaliga yoziladi:

- login;
- Excel upload;
- foydalanuvchi yaratish;
- foydalanuvchi profilini o'zgartirish;
- foydalanuvchi holatini o'zgartirish;
- parolni o'zgartirish.

Frontend `/audit` sahifasi `GET /api/audit-logs/` orqali DBdan o'qiydi.

## Favicon

Frontend favicon fayllari:

```text
frontend/public/favicon.ico
frontend/public/favicon.png
```

`frontend/index.html` faylida favicon linklari ulangan. Dev serverda favicon avtomatik `/favicon.ico` manzilidan olinadi.

## Tez tekshiruv

Backend:

```powershell
cd backend
python manage.py check
```

Frontend:

```powershell
cd frontend
npm run build
```

API ishlayotganini tekshirish:

```powershell
curl.exe -i http://127.0.0.1:8000/api/users/me/
```

Token yuborilmasa `401 Unauthorized` qaytishi normal.
