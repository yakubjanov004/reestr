# Build, run va tekshiruv

## Backendni ishga tushirish

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python scripts\setup_initial_data.py
python manage.py runserver 127.0.0.1:8000
```

`backend/.env` ichida PostgreSQL sozlamalari bo'lishi kerak:

```env
POSTGRES_DB=reestr_telecom
POSTGRES_USER=reestr_user
POSTGRES_PASSWORD=reestr_password
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
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

Backend URL:

```text
http://127.0.0.1:8000
```

Vite proxy:

```text
/api -> http://127.0.0.1:8000
```

## Build

Frontend production build:

```powershell
cd frontend
npm run build
```

Eslatma: build `frontend/dist` papkasini qayta yozadi. Agar vazifa faqat backend
yoki dokumentatsiya bo'lsa, build shart emas.

## Majburiy tekshiruvlar

Backend o'zgarishidan keyin:

```powershell
python backend\manage.py check
```

Model o'zgarsa:

```powershell
cd backend
python manage.py makemigrations
python manage.py migrate
```

Frontend o'zgarishidan keyin:

```powershell
cd frontend
npm run build
```

Import/privacy o'zgarishidan keyin imkon bo'lsa demo fayl bilan upload oqimini
qo'lda tekshir.

## Tez API sanity check

Token yuborilmasa 401 qaytishi normal:

```powershell
curl.exe -i http://127.0.0.1:8000/api/users/me/
```

## Agent uchun qoida

Tekshiruvni ishga tushira olmasang yoki dependency/DB yo'q bo'lsa, yakuniy
xabarda aniq ayt. Taxmin qilib "o'tdi" deb yozma.
