# Qilmaslik kerak bo'lgan ishlar

## Git va fayl tizimi

- User yozgan o'zgarishlarni bekor qilma.
- `git reset --hard`, `git checkout --`, recursive delete kabi destructive
  commandlarni aniq ruxsatsiz ishlatma.
- `backend/media` ichidagi upload fayllarni o'chirma.
- `logs/` fayllarini feature commitga qo'shma.
- `frontend/dist`ni qo'lda tahrir qilma.
- `.env`, secret, token, passwordlarni commit qilma.

## Backend

- Permissionni faqat frontendga topshirma.
- Scope'siz `RegistryRecord`, `UploadBatch`, `User`, `AuditLog` list qaytarma.
- Role hierarchy mantiqini serializer/viewdan chetlab o'tma.
- Privacy qoidalarini vaqtincha o'chirib import qilma.
- Sensitive raw Excel data ni audit, log yoki responsega qo'shma.
- `SECRET_KEY`ni o'zgartirma; dedupe HMACga ta'sir qiladi.
- Migrationni data ta'sirini o'ylamasdan yozma.

## Import

- Dedupe keyni yengil o'zgartirma.
- Masklangan fielddan dedupe identity sifatida foydalanib yuborma.
- Red fieldlarni model/serializer orqali qayta ochma.
- Import exceptionni yutib yuborib userga "success" qaytarma.
- Fayl turini tekshirmasdan import qilma.

## Frontend

- API URLni component ichida hardcode qilma.
- Tokenni consolega chiqarmang.
- User-facing textni localizationdan tashqarida ko'paytirma.
- Role checkni faqat link yashirish bilan tugatma.
- White mode asosiy ranglarini purple/binafsha gradientga almashtirma.
- Sidebar active, primary button, hero va KPI primary panellarida
  `var(--brand-gradient)` o'rniga hardcoded rang ishlatma.
- Bir sahifadagi card/grid/panel masofalarini har xil qilib yuborma; spacing
  uchun mavjud CSS variable yoki tokenlardan foydalan.
- Sidebar item balandligi, paddingi, icon o'lchami yoki section gapini role
  bo'yicha alohida yozma. `--sidebar-*` tokenlarini chetlab o'tadigan hardcoded
  sidebar spacing qo'shma.
- KPI linkini supervayzer, manager yoki admin sidebariga qaytarib qo'shma; KPI
  sidebar faqat operator uchun.
- Upload linkini operator bo'lmagan role sidebariga qo'shma. Role yuqoriligi
  pastki role sidebar linklarini avtomatik meros qilish degani emas.
- Sidebar section/linklarini `.agents/03-frontend/sidebar-roles.md`dagi
  kelishuvga qarshi o'zgartirma.
- Jadval/filterlarni server pagination bilan moslamasdan clientda katta data
  tortib olma.
- UIga marketing hero, dekorativ orb, ortiqcha gradient qo'shma.

## Dependency

- Yangi package qo'shishdan oldin mavjud stack bilan yechim borligini tekshir.
- Package qo'shilsa `package.json` va lockfile mos yangilansin.
- Backend dependency qo'shilsa `requirements.txt` yangilansin.

## Javob berish

- Tekshiruvni o'tkazmagan bo'lsang "o'tdi" deb yozma.
- Noaniq riskni yashirma.
- Juda uzun xulosa bilan asosiy natijani ko'mib yuborma.
