# Sidebar role kelishuvi

Bu hujjat 4 ta role uchun sidebar nomlari, ichidagi sectionlar va linklar
bo'yicha kelishilgan manba hisoblanadi. Sidebar o'zgarishidan oldin shu faylni,
keyin `frontend/src/navigation/roleNavigation.js`ni o'qi.

## Asosiy qoida

Role ierarxiyasi: `operator < supervayzer < manager < admin`.

Bu ierarxiya permission va data scope uchun ishlaydi, lekin sidebar linklari
avtomatik meros bo'lmaydi. Yuqori role pastki role ishini takrorlamaydi:

- `operator` - import qiladi va o'z reestrini ko'radi.
- `supervayzer` - hudud/filial operatorlarini nazorat qiladi.
- `manager` - barcha hududlar bo'yicha boshqaruv va monitoring qiladi.
- `admin` - tizim, rollar va umumiy nazoratni boshqaradi.

Shuning uchun `KPI` va `Reestrni yuklash` operatorga tegishli. Supervayzer,
manager va admin sidebariga KPI yoki upload linkini qo'shma.

## Umumiy pastki linklar

Har bir role sidebarida utility linklar tepada emas, nav oxiridagi
`nav-section-utility` sectionida turadi. Ular profile summary va `Chiqish`
buttonidan yuqorida, asosiy/role sectionlardan pastda bo'lishi kerak. Hozirda 2 ta link mavjud:

| Nomi | Route | Izoh |
| --- | --- | --- |
| Yordam | `/help` | Support, FAQ va murojaat qilish qoidalari |
| Sozlamalar | `/settings` | Til, theme va user sozlamalari |

Profile summary va `Chiqish` buttoni sidebar footerda qoladi. Bular role section
hisoblanmaydi. `buildTopLinks()` bo'sh qaytadi; utility linklarni tepaga
qaytarma.


## Hozirgi holat

Hozirgi sidebar manbasi: `frontend/src/navigation/roleNavigation.js`.

### Operator

Operator sidebarida 2 ta asosiy section bor.

| Section key | Ko'rinadigan nom | Linklar |
| --- | --- | --- |
| `operations` | Asosiy | `Reestrni yuklash` -> `/upload` |
| `operator_view` | Operator paneli | `Statistika` -> `/dashboard`; `Reestr` -> `/records`; `KPI` -> `/kpi`; `E'lonlar` -> `/announcements`; `Yuklashlar tarixi` -> `/batches`; `Qo'llanma` -> `/guide` |

Operator uchun bo'lishi kerak:

- Upload operatorning asosiy ishi.
- KPI faqat operator sidebarida bo'ladi.
- Reestr va yuklashlar operatorning o'z scope'i bo'yicha ko'rinadi.

Operatorga qo'shilmasligi kerak:

- `Operator monitoring`
- `Operatorlar`
- `Audit`
- `Manager paneli`
- `Admin paneli`

### Supervayzer

Supervayzer sidebarida 1 ta role section bor. `Asosiy` sectioni chiqmaydi,
chunki supervayzer reestr yuklamaydi.

| Section key | Ko'rinadigan nom | Linklar |
| --- | --- | --- |
| `supervisor_panel` | Supervayzer nazorati | `Statistika` -> `/dashboard`; `Operator monitoring` -> `/supervisor-monitoring`; `Operatorlar` -> `/operators`; `Reestr` -> `/records`; `Yuklashlar tarixi` -> `/batches`; `E'lonlar` -> `/announcements`; `Audit` -> `/audit`; `Qo'llanma` -> `/guide` |

Supervayzer uchun bo'lishi kerak:

- Operator monitoring - hudud/filial operatorlari bugun yukladimi yoki yo'q.
- Operatorlar - supervayzer ko'ra oladigan operatorlarni boshqarish.
- Hudud reestri va yuklashlar tarixi - o'z scope'i bo'yicha.
- Audit - o'z hududi/filiali bo'yicha nazorat.

Supervayzerga qo'shilmasligi kerak:

- `Reestrni yuklash`
- `KPI`
- `Manager paneli`
- `Admin paneli`

### Manager

Manager sidebarida 1 ta role section bor. `Asosiy` sectioni chiqmaydi,
chunki manager reestr yuklamaydi.

| Section key | Ko'rinadigan nom | Linklar |
| --- | --- | --- |
| `manager_panel` | Manager nazorati | `Statistika` -> `/dashboard`; `Manager paneli` -> `/manager`; `Operatorlar` -> `/operators`; `Operator monitoring` -> `/supervisor-monitoring`; `Reestr` -> `/records`; `Yuklashlar tarixi` -> `/batches`; `E'lonlar` -> `/announcements`; `Audit` -> `/audit`; `Qo'llanma` -> `/guide` |

Manager uchun bo'lishi kerak:

- Barcha hududlar bo'yicha umumiy dashboard va manager workspace.
- Supervisor/operatorlarni ko'rish va boshqarish.
- Operator monitoring - barcha ko'rinadigan operatorlar kesimida.
- Audit, records, batches va e'lonlar - manager scope'i bo'yicha.

Managerga qo'shilmasligi kerak:

- `Reestrni yuklash`
- `KPI`
- `Admin paneli`

### Admin

Admin sidebarida 1 ta role section bor. `Asosiy` sectioni chiqmaydi,
chunki admin reestr yuklamaydi.

| Section key | Ko'rinadigan nom | Linklar |
| --- | --- | --- |
| `admin_panel` | Admin nazorati | `Statistika` -> `/dashboard`; `Admin paneli` -> `/admin-panel`; `Operatorlar` -> `/operators`; `E'lonlar` -> `/announcements`; `Operator monitoring` -> `/supervisor-monitoring`; `Audit` -> `/audit`; `Qo'llanma` -> `/guide` |

Admin uchun bo'lishi kerak:

- Admin paneli va tizim darajasidagi nazorat.
- Manager/supervayzer/operatorlarni boshqarish.
- Audit va umumiy data ko'rinishi.
- Operator monitoring - tizim bo'yicha umumiy nazorat uchun.

Adminga qo'shilmasligi kerak:

- `Reestrni yuklash`
- `KPI`
- Operatorning shaxsiy ish oqimiga tegishli actionlar.

## Target holat

Hozirgi role-sidebar bo'linishi target holat sifatida qabul qilinadi:

- Operator 2 ta asosiy sectionga ega: `Asosiy` va `Operator paneli`.
- `Asosiy` sectionida faqat `Reestrni yuklash` bo'ladi va u faqat operatorga
  ko'rsatiladi.
- Supervayzer, manager va admin bittadan role panel sectionga ega; qolgan
  linklar shu o'rtadagi section ichida turadi.
- Section nomlari role vazifasini ochib beradi, `Umumiy` kabi noaniq nomlar
  ishlatilmaydi.
- Linklar role ish oqimi bo'yicha joylashadi: avval nazorat/ish, keyin data.
- KPI faqat operator sectionida qoladi.
- Upload faqat operator sectionida qoladi.
- Utility linklar hamma role uchun bir xil qoladi va sidebar pastida chiqadi.

## Keyingi to'g'rilash nuqtalari

Kodga darhol o'zgartirish kiritishdan oldin quyidagi nuqtalar user bilan
kelishiladi. Kelishuvsiz sidebarni qayta tartiblama.

1. Admin ichidagi `Operator monitoring` hozir `system_data` sectionida turibdi.
   Semantik jihatdan bu data emas, nazorat funksiyasi. Agar yanada aniqroq
   sidebar kerak bo'lsa, uni `admin_control` sectioniga ko'chirish mumkin.
   Bunda yangi section ochilmaydi, faqat link joyi o'zgaradi.
2. Manager va supervayzerda `Operator monitoring` nazorat sectionida qoladi:
   `manager_control` va `supervisor_control`.
3. `Statistika` linki hamma rolda `/dashboard`ga boradi, lekin dashboard
   contenti role scope bo'yicha farq qiladi. Agar nom chalkash tuyulsa,
   translationda role-specific label kelishib olinadi, route o'zgarmaydi.
4. `E'lonlar` manager/admin/supervayzer uchun boshqaruvga yaqin ko'rinishi
   mumkin, lekin hozir data/records sectionida turadi. Ko'chirish kerak bo'lsa
   avval role bo'yicha nimani anglatishi kelishiladi.
5. Link soni ko'payib ketmasligi kerak. Har role sidebarida 2 ta asosiy section
   saqlanadi; yangi section faqat haqiqiy yangi ish oqimi bo'lsa ochiladi.

## O'zgartirish tartibi

Sidebarni o'zgartirish kerak bo'lsa:

1. Avval shu hujjatda role va section bo'yicha kelishuvni yangila.
2. Keyin `frontend/src/navigation/roleNavigation.js`da linkni qo'sh yoki olib tashla.
3. Section key yangi bo'lsa `frontend/src/components/Sidebar.jsx`dagi
   emphasized section listini tekshir.
4. Visible text o'zgarsa uchta translation faylini yangila:
   `uz.js`, `uz-cyrl.js`, `ru.js`.
5. Sidebar spacing CSSga tegma; o'lchamlar `--sidebar-*` tokenlari bilan
   boshqariladi.
6. `npm run build` bilan tekshir.

## Qilmaslik kerak

- Role baland bo'lgani uchun pastki role linklarini avtomatik qo'shma.
- KPI linkini supervayzer, manager yoki admin sidebariga qo'shma.
- Upload linkini operator bo'lmagan rolega qo'shma.
- Bir linkni bir role ichida ikki sectionga takroran qo'shma.
- Section nomlarini `Umumiy`, `Nazorat`, `Data` kabi juda noaniq qilib yuborma;
  role va scope aniq ko'rinsin.
- Sidebar item height, padding, radius yoki gapni role bo'yicha alohida yozma.
