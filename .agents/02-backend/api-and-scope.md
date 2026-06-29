# API va scope

## Endpointlar

- `POST /api/auth/token/` - login.
- `POST /api/auth/token/refresh/` - token refresh.
- `GET /api/users/me/` - joriy user.
- `PATCH /api/users/me/` - self profile update.
- `POST /api/users/me/password/` - self password change.
- `GET /api/organization/options/` - role, region va branch optionlar.
- `GET /api/audit-logs/` - audit list.
- `GET /api/announcements/` - e'lonlar.
- `POST /api/announcements/` - e'lon yaratish.
- `GET /api/operators/` - user/operator list.
- `POST /api/operators/` - user/operator yaratish.
- `PATCH /api/operators/<id>/` - user/operator update.
- `POST /api/records/upload/` - Excel upload.
- `GET /api/records/stats/` - dashboard stats.
- `GET /api/records/filter-options/` - records filter optionlari.
- `GET /api/records/batches/` - upload batch list.
- `GET /api/records/` - registry record list.
- `GET /api/records/<id>/` - registry record detail.

## Role ierarxiyasi

```text
operator < supervisor < manager < admin
```

Backend role rank:

- `operator` = 10
- `supervisor` = 20
- `manager` = 30
- `admin` = 40

## User boshqaruvi

Admin:

- manager yaratadi;
- manager, supervisor, operator va adminlarni listda ko'ra oladi.

Manager:

- supervisor va operator yaratadi;
- manager yoki admin yarata olmaydi.

Supervisor:

- faqat operator yaratadi;
- o'z viloyat/region scope'idan tashqariga chiqa olmaydi. Agar supervisor
  branchga biriktirilgan bo'lsa ham scope `branch.region` orqali olinadi.

Operator:

- user yarata olmaydi.

## Record va batch scope

`records.views.ScopedQuerysetMixin` asosiy qoida:

- `can_view_all_data` bo'lsa hammasi ko'rinadi.
- Supervisor bo'lsa `effective_region` bo'yicha ko'radi:
  `user.branch.region` mavjud bo'lsa shu olinadi, aks holda `user.region`.
  Supervisor faqat bitta filial bilan cheklanmaydi; o'z viloyatidagi barcha
  operator reestr/batchlarini ko'radi.
- Operator bo'lsa `uploaded_by=request.user`.

Yangi records/batches/stats endpoint qo'shsang, shu mantiqni qayta ishlat.

Scope kengaytirish frontend query paramlariga ishonmasin. `assigned_region`,
`assigned_branch` va `uploaded_by` filterlari avval backend scope toraytirilgan
queryset ustida ishlashi kerak.

## Organization filterlar

Manager/supervisor uchun query paramlar:

- `assigned_region`
- `assigned_branch`
- `uploaded_by`

Operator uchun bu filterlar boshqa user data ochmasligi kerak.

## Announcement scope

- Manager barcha scope uchun e'lon ko'radi.
- Supervisor o'z scope'iga va o'zi yaratgan e'lonlarga kira oladi.
- Operator faqat `all` yoki `operator` targetdagi, o'z region/branchiga mos
  active e'lonlarni ko'radi.

## Audit scope

- Admin kengroq auditni ko'radi.
- Manager lower role actionlarini ko'radi.
- Supervisor o'z regionidagi operator actionlarini ko'radi.
- Operator audit endpointga kira olmaydi.

## Frontend bilan moslik

Route guardlar `frontend/src/App.jsx` va role helperlar `frontend/src/auth/roles.js`
ichida. Backenddagi role mantiqi o'zgarsa frontend helperlar ham mos yangilansin.
