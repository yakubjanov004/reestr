# Frontend qoidalari

## Feature qanday quriladi

Frontend feature uchun odatiy tartib:

1. Backend endpoint yoki mavjud API payloadni aniqlash.
2. Kerak bo'lsa `api` instance orqali chaqiruv yozish.
3. Page yoki komponentni mavjud pattern asosida yaratish.
4. Role visibility kerak bo'lsa `roles.js` helperlaridan foydalanish.
5. Route kerak bo'lsa `App.jsx`ga guard bilan qo'shish.
6. Sidebar link kerak bo'lsa `roleNavigation.js`ga role bilan qo'shish.
7. Visible text qo'shilsa barcha translation fayllarini yangilash.
8. CSSni mavjud style arxitekturasiga mos joyga qo'shish.
9. `npm run build` bilan tekshirish.

## API qoidalari

- Faqat `frontend/src/api/client.js` dagi `api` instance ishlat.
- Base URL default `/api`.
- Token headerni qo'lda har joyda yozma; `setAuthToken` ishlatadi.
- 401 bo'lsa interceptor localStorage token/userni tozalaydi.
- API errorlarni userga aniq xabar bilan ko'rsat.

## Auth qoidalari

- Current user `AuthContext`dan olinadi.
- Login token va userni localStoragega yozadi.
- Logout localStorage va auth headerni tozalaydi.
- Protected sahifalarda `useAuth` va route guard patternini buzma.

## Role qoidalari

- Role helperlar: `frontend/src/auth/roles.js`.
- Route guardlar: `frontend/src/App.jsx`.
- Sidebar visibility: `frontend/src/navigation/roleNavigation.js`.
- Sidebar section/link kelishuvi: `.agents/03-frontend/sidebar-roles.md`.
- Frontend role check xavfsizlik emas, UX. Backend permission majburiy.

## State va data loading

- Page-level data hooklar mavjud bo'lsa shu patternni davom ettir.
- Search/filter/pagination server bilan mos ishlasin.
- Debounce mavjud joylarda uni buzma.
- Loading, empty va error state bo'lishi kerak.
- Modal ochilganda scroll lock kabi mavjud UX patternlarni saqla.

## Komponent qoidalari

- Reusable UI `frontend/src/components/`ga.
- Page-specific komponent page folder ichida qolishi mumkin.
- Icon kerak bo'lsa `lucide-react` ishlat.
- Manual SVG faqat mavjud tizimda haqiqiy zarurat bo'lsa.

## Qilmaslik kerak

- API URLni har komponentda hardcode qilma.
- Tokenni component state yoki logga chiqarma.
- Backend permission o'rniga faqat frontend hide/show qilma.
- `frontend/dist`ni qo'lda tahrir qilma.
- Yangi dependency qo'shishdan oldin zaruratni asoslamasdan install qilma.
