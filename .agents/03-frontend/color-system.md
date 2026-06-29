# Rang tizimi

Bu fayl Datan frontend ranglarini o'zgarmas saqlash uchun yozilgan. Rangga,
hero bannerga, sidebar active holatiga, primary buttonlarga yoki dashboard/KPI
bloklariga tegadigan har qanday vazifadan oldin shu faylni o'qi.

## Asosiy talab

White mode, ya'ni kunduzgi rejimda asosiy brend rangi screenshotdagi kabi
chapdan chuqur ko'k, o'rtada ko'k-cyan, o'ngda teal/yashil tomonga yumshoq
o'tadigan gradient bo'lishi kerak.

Asosiy light gradient:

```css
linear-gradient(135deg, #2563eb 0%, #1e88c8 48%, #0f8f8f 100%)
```

Bu gradient `frontend/src/styles/01-tokens.css` ichidagi token orqali turadi:

```css
--brand-gradient: linear-gradient(135deg, #2563eb 0%, #1e88c8 48%, #0f8f8f 100%);
```

Komponentlarda shu token ishlatilishi kerak:

```css
background: var(--brand-gradient);
```

## Qayerlarda majburiy ishlatiladi

Quyidagi joylar white mode'da `var(--brand-gradient)`dan foydalanishi kerak:

- sidebar active linklari;
- sidebar profile summary/user card;
- primary buttonlar;
- dashboard hero banner;
- Help/Yordam hero banner;
- Guide/Qo'llanma hero banner;
- Announcements/E'lonlar hero banner;
- KPI primary panel;
- upload/source type active holatlari;
- records/audit/announcement asosiy badge va action accentlari;
- manager workspace hero;
- supervayzer monitoring hero;
- admin/manager/supervayzer/operator asosiy ishchi panel hero bloklari.
- dashboard secondary stat cardlari (masalan `Shu oy kiritilgan`) soft
  blue/blue-cyan accentda bo'lishi kerak; oq-kulrang card yoki kulrang dekor
  doiralariga qaytarma.

## Dark mode

Dark mode ham blue-to-teal oilasida qoladi. Tavsiya etilgan dark hero:

```css
linear-gradient(135deg, #1d4ed8 0%, #0369a1 48%, #047857 100%)
```

Dark mode'da purple yoki indigo dominant hero foniga aylantirilmasin.
Dashboard dark mode'da ham hero, filter toolbar, V2 stat cardlar va chart
cardlar blue-to-teal oilasida qolishi kerak. Ularni qora/kulrang panelga yoki
blue-only gradientga qaytarma; dark navy fon ustida ko'k-cyan-teal accent
ishlat.

## Nimalarni qilmaslik kerak

- Asosiy hero yoki primary bloklarni purple/binafsha gradientga o'tkazma.
- `#7c3aed`, `#6366f1`, `#8b5cf6`, `#a78bfa`, `#4f46e5` ranglarini asosiy
  hero/sidebar/primary action foniga qo'yma.
- Sidebar active holatini solid ko'k `#2563eb` qilib yuborma; gradient bo'lsin.
- Har sahifaga alohida hardcoded gradient yozma; avval `--brand-gradient` ishlat.
- White mode rangini bir joyda o'zgartirib, boshqa sahifalarni eski rangda
  qoldirma.
- Purple faqat kichik icon, chart series, status badge yoki ikkilamchi aksent
  sifatida zarur bo'lsa ishlatiladi. U brend fon rangi emas.

## Qayerdan tekshiriladi

Rang tokenlari:

- `frontend/src/styles/01-tokens.css`

Sidebar active/profile ranglari:

- `frontend/src/styles/18-sidebar-reference.css`
- `frontend/src/styles/03-shell.css`

Asosiy hero va primary bloklar:

- `frontend/src/styles/24-operator-pages.css`
- `frontend/src/styles/26-supervisor.css`
- `frontend/src/styles/27-manager.css`
- `frontend/src/styles/29-help.css`
- `frontend/src/pages/DashboardPage.jsx`
- `frontend/src/pages/GuidePage.jsx`
- `frontend/src/pages/AnnouncementsPage.jsx`

## O'zgarishdan keyingi tekshiruv

Rangga tegilganda quyidagilarni bajar:

```powershell
cd frontend
npm run build
```

Keyin ushbu so'rov bilan eski dominant purple/blue-only hero gradientlar qaytib
kelmaganini tekshir:

```powershell
rg -n "linear-gradient\(135deg, #7c3aed|linear-gradient\(135deg, #6366f1|linear-gradient\(135deg, #2563eb 0%, #1d4ed8 100%\)" frontend\src
```

Agar natija chiqsa, u asosiy hero/sidebar/primary fon emas, balki kichik chart
yoki status aksenti ekanini tekshir. Aks holda `var(--brand-gradient)`ga
almashtir.
