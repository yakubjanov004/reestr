# Import, privacy va dedupe

## Import pipeline

Asosiy fayllar:

- `backend/records/importing/import_service.py`
- `backend/records/importing/workbook.py`
- `backend/records/importing/record_builder.py`
- `backend/records/importing/privacy.py`
- `backend/records/importing/normalizers.py`
- `backend/records/importing/constants.py`

Oqim:

1. Workbook `openpyxl.load_workbook` bilan ochiladi.
2. `find_header_row` kerakli header qatorini topadi.
3. `detect_source_type` Excel turini aniqlaydi.
4. `resolve_source_type` user tanlagan tur bilan mosligini tekshiradi.
5. `parse_period` fayldan periodni ajratadi.
6. Har qator `map_row` bilan fieldlarga o'tadi.
7. Bo'sh qatorlar skip qilinadi.
8. `apply_privacy_rules` red va masked fieldlarni qayta ishlaydi.
9. `build_record_kwargs` parse, normalize va dedupe key yaratadi.
10. `RegistryRecord` yaratilib, duplicate/skipped/import errorlar batchga yoziladi.

## Header mapping

`HEADER_ALIASES` Excel ustun nomini model fieldga bog'laydi. Yangi ustun qo'shsang:

1. `HEADER_ALIASES`ga alias qo'sh.
2. Kerak bo'lsa `RegistryRecord` modeliga field qo'sh.
3. Field turi date/datetime/decimal bo'lsa tegishli setga qo'sh.
4. Privacy darajasini aniqlab `MASKED_FIELDS` yoki `RED_FIELDS`ga qo'sh.
5. Serializerlarda list/detail chiqishini alohida ko'rib chiq.

## Privacy qoidalari

`RED_FIELDS` - bazaga yozilmaydigan fieldlar.

`MASKED_FIELDS` - maskalanib saqlanadigan fieldlar.

Hozirgi asosiy masklar:

- `client_name` - har bir ism qismi `ABC***` formatida.
- `phone_number` - oxirgi 3 raqam saqlanadi, qolganlari `*`.
- `internet_login` - oxirgi 3 raqam saqlanadi, qolganlari `*`.
- `operator_full_name` - boshlang'ich 3 belgi va `***`.

Privacy o'zgarsa tekshir:

- list serializer;
- detail serializer;
- `raw_data`;
- import error payload;
- audit metadata;
- frontend table/detail modal.

## Dedupe key

`build_dedupe_key` HMAC-SHA256 ishlatadi va `settings.SECRET_KEY`ga bog'liq.

Ustuvorlik:

1. `contract_number`
2. `request_number`
3. mobile: `phone_number + sim_card_number`
4. internet: `internet_login + account_number`
5. fallback: source type, document number, client name, connection/contract date

Muhim: privacy `storage_row`ga qo'llanadi, lekin dedupe uchun kerak joylarda
original row ishlatiladi. Bu duplicate aniqlashni saqlaydi. Shu farqni buzma.

## Transaction qoidalari

- Batch va import natijalari transaction ichida.
- Har record yaratish alohida nested transactionda, IntegrityError bitta qatorni
  duplicate sifatida sanashi uchun.
- Butun fayl bo'sh bo'lsa batch file storage'dan o'chiriladi va ValueError qaytadi.

## Import xatolari

`MAX_IMPORT_ERRORS` limit bor. Xatolar userga ko'rinadi, shuning uchun sensitive
data qaytarmaslik kerak. `add_import_error` payloadini privacy nuqtai nazaridan
tekshir.

## Management commandlar

- `python manage.py apply_privacy_rules` - mavjud yozuvlarga privacy qoidalarini qayta qo'llaydi.
- `python manage.py refresh_client_name_masks` - client name masklarini qayta hisoblaydi.

Privacy logikasi o'zgarsa bu commandlar kerak bo'lishi mumkin.
