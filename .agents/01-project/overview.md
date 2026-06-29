# Loyiha haqida

## Maqsad

Datan - telecom reestr fayllarini import qilish va boshqarish tizimi.
Operatorlar GSM va SHPD Excel fayllarini yuklaydi. Backend faylni tekshiradi,
privacy qoidalarini qo'llaydi, duplicate qatorlarni ajratadi va yozuvlarni
PostgreSQL bazasiga saqlaydi.

Tizim rollar bo'yicha ishlaydi:

- `operator` - Excel yuklaydi va o'z data scope'ini ko'radi.
- `supervisor` - o'z region/branch operatorlarini boshqaradi va monitoring qiladi.
- `manager` - barcha hududlar bo'yicha supervisor/operator va statistikani ko'radi.
- `admin` - manager yaratadi va admin paneldan foydalanadi.

## Stack

- Backend: Django, Django REST Framework, Simple JWT.
- Database: PostgreSQL.
- Excel parser: openpyxl.
- Frontend: React 18, Vite, React Router, Axios.
- UI iconlar: lucide-react.
- Styling: global `styles.css` va `frontend/src/styles/` ichidagi modulli CSS.
- Localization: Uzbek Latin, Uzbek Cyrillic, Russian.

## Muhim domen tushunchalari

- `Region` - hudud.
- `Branch` - filial, regionga tegishli.
- `User` - custom Django user, role va location bilan.
- `UploadBatch` - bitta Excel upload natijasi.
- `RegistryRecord` - import qilingan reestr yozuvi.
- `Announcement` - role/scope bo'yicha ko'rinadigan e'lon.
- `AuditLog` - login, upload va user boshqaruvi kabi actionlar tarixi.

## Source type

- `mobile` - GSM / mobil raqam reestri.
- `internet` - SHPD / internet ulanish reestri.

Frontendda bu tanlov `SourceTypeTabs` orqali beriladi. Backend tanlangan tur
bilan Excel ichidagi real tur mosligini tekshiradi.

## Demo data

`data/` papkasida namunaviy Excel fayllar bor. `backend/scripts/setup_initial_data.py`
ularni import qilib demo batch va recordlar yaratadi. Demo userlar va parollar
README ichida yozilgan.
