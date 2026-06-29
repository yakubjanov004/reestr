# UI, CSS va localization

## UI xarakteri

Bu operational dashboard. Dizayn ishga yo'naltirilgan, ixcham va skan qilishga
qulay bo'lishi kerak. Marketing landing, katta hero, dekorativ gradient/orb va
ortiqcha bezaklar qo'shma.

## Layout qoidalari

- Cards faqat takrorlanuvchi item, panel yoki modal uchun.
- Page sectionlarni ichma-ich card qilib yuborma.
- Jadval, filter, stats va actionlar zich, lekin o'qilishi oson bo'lsin.
- Mobile va desktopda matnlar containerdan chiqib ketmasin.
- Buttonlar ichida ikon + qisqa label ishlat.
- Toolbar/action uchun lucide iconlardan foydalan.
- Bir sahifadagi hero, contact card, FAQ, guidelines, dashboard card va boshqa
  panel/grid elementlar orasidagi masofalar bir xil token yoki CSS variable orqali
  boshqarilsin. Bir card chegaraga yaqin, boshqasi uzoq bo'lib qolmasin.
- Help/Yordam sahifasida hero kontenti chap tomondan boshlanadi; hero ichki
  paddingi, cardlar orasidagi gap va panel ichki paddingi bir xil o'lchov
  tizimidan olinadi (`--help-page-gap`, `--help-card-gap`, `--help-panel-x`,
  `--help-panel-y`). Bu qiymatlarni sabab bo'lmasa buzma.
- Grid cardlari va section ichki kontenti chap/o'ng chegaradan bir xil masofada
  turishi kerak. Tasodifiy `14px`, `20px`, `22px`, `36px` aralashmasini alohida
  joylarda hardcode qilib yuborma; avval mavjud variable yoki tokenni ishlat.
- Sidebar barcha rollarda bir xil card ritmini saqlaydi: nav link va logout
  itemlari `--sidebar-item-height`, `--sidebar-item-gap`,
  `--sidebar-item-padding-x`, `--sidebar-item-radius` tokenlari bilan
  boshqariladi. Operator, supervayzer, manager va admin uchun alohida height,
  padding yoki section gap yozma; faqat link tarkibi role bo'yicha o'zgaradi.
- Sidebar sectionlari orasidagi divider/gap ham token orqali qoladi
  (`--sidebar-section-gap`, `--sidebar-section-divider-gap`). Bottom utility
  linklar, active link va profile summary boshqa rolda boshqa masofaga o'tib
  ketmasligi kerak.
- KPI sidebar linki faqat `operator` roli uchun ko'rsatiladi. Uni
  supervayzer, manager yoki admin sidebar sectionlariga qo'shma; bu rollar
  uchun monitoring, audit, records/batches va boshqaruv linklari yetarli.
- Yonma-yon monitoring boardlarda chap va o'ng ustun balandligi kontent soniga
  qarab o'zgarib ketmasin. Masalan `/supervisor-monitoring` sahifasida
  `Operator holati` paneli va o'ngdagi `Yuklashlar jadvali`, `Kecha
  yuklamaganlar`, `Filial kesimi` panel guruhi desktopda bir xil balandlikda
  yopilishi kerak. Operator soni kam bo'lsa bo'sh joy panel ichida qoladi,
  ko'p bo'lsa operatorlar pagination orqali chiqariladi; o'ng ro'yxatlar esa
  panel ichida scroll bo'ladi.
- Fixed-height card ishlatilsa, avval ichidagi real kontent sig'ishi
  tekshirilsin. Status badge, chiplar, metrikalar, footer va action tugmalar
  kesilib qolmasligi kerak; siqilish paydo bo'lsa card height yoki ichki
  kompozitsiya tuzatiladi, `overflow: hidden` bilan muammo yashirilmaydi.
- Dashboarddagi oy/yil matnlari browser `Intl` natijasiga to'liq suyanmasin.
  Ba'zi muhitlarda Uzbek locale `M06` kabi chiqishi mumkin. `holatiga` kabi
  UI labelar uchun explicit Uzbek oy nomlari formatteridan foydalan.
- Dashboard grafiklarida backendda mavjud bo'lmagan statuslarni ko'rsatma.
  Masalan reestr workflowida `tasdiqlangan` yoki `kutilayotgan` statusi yo'q
  bo'lsa, legend/tooltipda bunday so'zlar chiqmasin va sun'iy formula
  (`count * 0.2 + ...`) bilan soxta qiymat hisoblanmasin. Grafik labeli
  haqiqiy manbani aytsin: masalan `Kiritilgan reestrlar`.
- Upload sahifasida noto'g'ri Excel yoki noto'g'ri reestr turi tanlanganda
  foydalanuvchiga umumiy `xatolik yuz berdi` demasdan, backend `detail`
  xabarini ko'rsat. Masalan mobil fayl internetga yuklansa qaysi tur tanlanishi
  kerakligi aytilsin; shablon mos bo'lmasa to'g'ri formatdagi Excel faylni
  yuklash kerakligi yozilsin.

## CSS tuzilmasi

- Entry: `frontend/src/styles.css`.
- Modullar: `frontend/src/styles/`.
- Mavjud naming style va tokenlardan foydalan.
- Rang palitrasi bir xil hue oilasiga haddan tashqari yopishib qolmasin.
- Font size viewport width bilan scale qilinmasin.
- Letter spacing manfiy bo'lmasin.

## Rang va hero gradient qoidasi

To'liq rang qoidalari `03-frontend/color-system.md` faylida. Rangga tegadigan
har qanday frontend vazifadan oldin o'sha faylni o'qi.

- Asosiy hero bannerlarda dominant gradient chap tomonda ko'k va o'ng tomonda
  yashil/emerald tomonga o'tishi kerak.
- Tavsiya etilgan light hero: `linear-gradient(135deg, #2563eb 0%, #1e88c8 48%, #0f8f8f 100%)`.
- Tavsiya etilgan dark hero: `linear-gradient(135deg, #1d4ed8 0%, #0369a1 48%, #047857 100%)`.
- Purple/binafsha gradientni asosiy hero foniga aylantirma. Purple faqat kichik
  icon, badge yoki alohida status aksenti sifatida zarur bo'lsa ishlatiladi.
- Help/Yordam sahifasi hero banneri aynan ko'kdan yashilga uyg'un o'tuvchi
  gradientda qolishi kerak.
- Sidebar active linklari, profile summary, asosiy primary buttonlar, dashboard
  hero, KPI primary panel, manager/supervayzer hero va guide hero uchun
  `var(--brand-gradient)` ishlatilishi kerak. Bu light mode'da screenshotdagi
  ko'kdan teal/yashilga o'tadigan rangni saqlaydi.

## Localization

Visible text qo'shilsa quyilarni yangila:

- `frontend/src/localization/translations/uz.js`
- `frontend/src/localization/translations/uz-cyrl.js`
- `frontend/src/localization/translations/ru.js`

Kod ichida hardcoded user-facing text qoldirma. Upload sahifasida hozir ayrim
hardcoded Uzbek matnlar bor, yangi ish qilganda imkon bo'lsa shu joylarni ham
localizationga o'tkaz.

## Format helperlar

Sana, vaqt va son formatlari uchun mavjud helperlarni tekshir:

- `frontend/src/utils/format.js`
- `useI18n` ichidagi `fmt`

Har komponentda alohida formatlash mantiqini ko'paytirma.

## Accessibility

- Icon-only buttonlarda `aria-label` yoki `title` bo'lsin.
- Form inputlarda label borligiga e'tibor ber.
- Error state text bilan ham ko'rinsin, faqat rangga tayanma.
- Modal/focus flow mavjud patternga mos bo'lsin.

## Responsive

- Sidebar mobile drawer patternini buzma.
- Jadval/panel elementlari kichik ekranda overflow yoki stacked layoutga ega bo'lsin.
- Button matnlari sig'masa qisqa label yoki icon-only state ishlat.
