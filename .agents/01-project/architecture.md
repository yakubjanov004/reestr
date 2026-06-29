# Arxitektura

## Backend tuzilmasi

- `backend/telecom_registry/settings.py` - Django sozlamalari, DB, JWT, CORS, logging.
- `backend/telecom_registry/urls.py` - API routing.
- `backend/accounts/models.py` - `User`, `Region`, `Branch`, `AuditLog`.
- `backend/accounts/serializers.py` - user/profile/password/operator serializerlari.
- `backend/accounts/views.py` - login, profile, organization options, operator CRUD, audit.
- `backend/records/models.py` - `UploadBatch`, `RegistryRecord`, `Announcement`.
- `backend/records/views.py` - upload, stats, records, batches, announcements.
- `backend/records/importing/` - Excel import pipeline.
- `backend/scripts/` - DB va seed helperlari.

## Frontend tuzilmasi

- `frontend/src/main.jsx` - React root, router, providers.
- `frontend/src/App.jsx` - route tree va route guardlar.
- `frontend/src/api/client.js` - Axios instance, auth header, 401 cleanup.
- `frontend/src/auth/AuthContext.jsx` - login/logout/current user state.
- `frontend/src/auth/roles.js` - frontend role helperlar.
- `frontend/src/navigation/roleNavigation.js` - sidebar linklari role bo'yicha.
- `frontend/src/pages/` - page-level UI.
- `frontend/src/components/` - reusable UI komponentlar.
- `frontend/src/localization/` - tarjimalar va i18n provider.
- `frontend/src/styles.css` - style entrypoint.
- `frontend/src/styles/` - bo'limlarga ajratilgan CSS.

## Asosiy request oqimi

1. User `/login` sahifasida login qiladi.
2. Frontend `POST /api/auth/token/` ga username/password yuboradi.
3. Backend JWT access/refresh va user payload qaytaradi.
4. Frontend access tokenni localStoragega saqlaydi va Axios headerga qo'yadi.
5. Protected route `AuthContext` orqali user mavjudligini tekshiradi.
6. API endpointlar backend permission va scope orqali data qaytaradi.

## Upload oqimi

1. Operator `/upload` sahifasida `mobile` yoki `internet` tanlaydi.
2. `.xlsx` yoki `.xlsm` fayl multipart form bilan yuboriladi.
3. `UploadExcelView` role, file extension va operator branchini tekshiradi.
4. `import_excel_file` workbookni ochadi.
5. Header row topiladi, source type aniqlanadi.
6. Privacy qoidalari qo'llanadi.
7. Dedupe key yaratiladi.
8. `RegistryRecord` yoziladi yoki duplicate/skipped sifatida sanaladi.
9. `UploadBatch` statistikasi va audit log saqlanadi.

## Data scope oqimi

Backendda scope har doim queryset darajasida enforce qilinadi:

- Manager va admin barcha data scope'ini ko'radi.
- Supervisor branchga biriktirilgan bo'lsa branch bo'yicha ko'radi.
- Supervisor regionga biriktirilgan bo'lsa region bo'yicha ko'radi.
- Operator faqat o'z upload/recordlarini ko'radi.

Frontend route guardlari faqat qulaylik uchun. Haqiqiy xavfsizlik backendda.
