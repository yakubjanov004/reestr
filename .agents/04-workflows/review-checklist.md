# Review checklist

## Security va privacy

- Backend permission endpointda bormi?
- Queryset scope to'g'rimi?
- Operator boshqa user datasini ko'rmayaptimi?
- Supervisor region/branchdan tashqariga chiqmayaptimi?
- Sensitive field serializer, raw_data, audit yoki error payload orqali chiqmayaptimi?
- Token, password, SECRET_KEY logga yozilmayaptimi?

## Import

- Header alias to'g'ri qo'shilganmi?
- Source type detection buzilmaganmi?
- Privacy oldin qo'llanyaptimi?
- Dedupe original identity bilan ishlayaptimi?
- Duplicate count va skipped count to'g'ri sanalyaptimi?
- Import error payload maxfiy ma'lumot ko'rsatmayaptimi?
- Bo'sh fayl va noto'g'ri tur uchun error aniqmi?

## Backend

- Migration kerak bo'lsa bor-mi?
- `select_related`/`prefetch_related` kerak joyda ishlatilganmi?
- Pagination saqlanganmi?
- Audit kerak actionlarda yozilyaptimi?
- User-facing errorlar tushunarlimi?
- `python backend\manage.py check` o'tganmi?

## Frontend

- API client umumiy `api` instance orqali ishlatilganmi?
- Loading/error/empty state bormi?
- Role guard va sidebar visibility mosmi?
- Localization uch tilda yangilanganmi?
- Mobile layout buzilmaydimi?
- Button/input textlari sig'adimi?
- `npm run build` o'tganmi?

## Data va deployment

- `.env` yoki secret commit qilinmaganmi?
- `frontend/dist` tasodifan o'zgartirilmaganmi?
- `backend/media` yoki `logs` tasodifan qo'shilmaganmi?
- Demo seed production logic bilan aralashib ketmaganmi?

## Yakuniy tekshiruv

- `git status --short` o'zgarishlari kutilganmi?
- Keraksiz refactor yo'qmi?
- User so'rovidan tashqari fayllarga tegilmaganmi?
- Agar test o'tmagan bo'lsa, sabab aniq yozilganmi?
