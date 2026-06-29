# Backend qoidalari

## Feature qanday quriladi

Backend feature uchun odatiy tartib:

1. Domen modelini aniqlash.
2. Kerak bo'lsa modelga field yoki yangi model qo'shish.
3. Migration yaratish.
4. Serializerda validation va output fieldlarni belgilash.
5. View yoki ViewSetda permission va queryset scope qo'llash.
6. URL routing qo'shish.
7. Audit kerak bo'lsa `log_audit_event` qo'shish.
8. Frontendga kerak bo'lgan payloadni minimal va aniq qaytarish.
9. `python backend\manage.py check` ishga tushirish.

## Ruxsat va scope

- Har bir list/detail endpoint data scope bilan cheklangan bo'lishi kerak.
- Frontend guardga tayanma.
- `request.user.can_view_all_data`, `request.user.can_manage_users`,
  `request.user.is_supervisor`, `request.user.is_operator` helperlaridan foydalan.
- Supervisor branch yoki region bilan cheklanishi kerak.
- Operator boshqa operatorning upload yoki recordini ko'rmasligi kerak.

## Serializer qoidalari

- Sensitive fieldlarni bexosdan read-only outputga qo'shma.
- Role assignment validation `OperatorCreateUpdateSerializer` ichida saqlansin.
- User yaratishda role va region/branch mantiqi backendda tekshirilsin.
- Password field doim write-only bo'lsin.
- Update paytida password bo'sh bo'lsa o'zgarmasin.

## Audit qoidalari

Audit kerak bo'lgan actionlar:

- login;
- Excel upload;
- self profile update;
- self password change;
- operator/user yaratish;
- operator/user status o'zgartirish;
- operator/user password o'zgartirish;
- announcement yaratish.

Audit metadata minimal, lekin tekshiruv uchun foydali bo'lsin. Maxfiy shaxsiy
ma'lumotlarni metadata ichiga qo'shma.

## Query performance

- Relation ishlatilsa `select_related` yoki `prefetch_related` qo'sh.
- Dashboard va stats endpointlarda count/sum querylar ko'p bo'lishi mumkin.
  Yangi metrika qo'shganda query sonini nazorat qil.
- Pagination bor endpointlarda katta listni to'liq materialize qilma.

## Error xabarlar

- Userga ko'rinadigan xabarlar Uzbek tilida aniq bo'lsin.
- Import va validation xatolari 400 qaytarsin.
- Permission xatolari 403 qaytarsin.
- Authentication bo'lmasa DRF/JWT 401 qaytaradi.

## Migration qoidalari

- Model o'zgarsa migration qo'sh.
- Existing data uchun default/null/blank mantiqini o'ylab yoz.
- Production data bor deb hisobla.
- Migrationni keraksiz qo'lda tahrir qilma; zarur bo'lsa juda ehtiyotkor bo'l.

## Qilmaslik kerak

- Permissionni faqat frontendda hal qilma.
- Querysetni `User.objects.all()` yoki `RegistryRecord.objects.all()` bilan scope'siz qaytarma.
- Password, token, SECRET_KEY yoki raw sensitive data logga yozma.
- Import pipeline ichida privacy qoidalarini chetlab o'tma.
- `backend/media` ichidagi uploadlarni tasodifan o'chirma.
