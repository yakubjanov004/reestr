# Agent ish tartibi

## Har vazifadan oldin

1. `git status --short` bilan ishchi daraxtni tekshir.
2. User so'rovini backend, frontend, import, UI yoki docs vazifasiga ajrat.
3. `.agents` ichidagi mos bo'limlarni o'qi.
4. Mavjud kod patternini top.
5. O'zgarish blast radiusini bahola.

## Kichik o'zgarish

Masalan matn, bitta field, bitta UI tuzatish:

1. Kerakli faylni o'qi.
2. Minimal patch qil.
3. Mos tekshiruvni ishga tushir.
4. Yakunda o'zgargan fayl va tekshiruvni qisqa yoz.

## Backend feature

1. Model kerakmi aniqlash.
2. Serializer validation.
3. Permission/scope.
4. View/URL.
5. Audit.
6. Migration.
7. Frontendga kerak payload.
8. `python backend\manage.py check`.

## Frontend feature

1. API payloadni aniqlash.
2. Page/hook/component structure.
3. Role route/sidebar.
4. Localization.
5. CSS responsive.
6. Loading/error/empty state.
7. `npm run build`.

## Import/privacy vazifasi

1. Excel header mappingni tekshir.
2. Source type detectionni tekshir.
3. Privacy levelni belgila.
4. Dedupe ta'sirini bahola.
5. Serializer/detail/raw_data leakage yo'qligini tekshir.
6. Demo fayl bilan manual oqimni tekshir yoki test yoz.

## Review vazifasi

Reviewda topilmalar birinchi bo'lsin. Har topilma:

- severity;
- fayl/line;
- muammo;
- real ta'sir;
- tavsiya.

Agar topilma yo'q bo'lsa, buni aniq ayt va qolgan test riskini yoz.

## Yakuniy javob

Yakuniy javob qisqa bo'lsin:

- nima o'zgardi;
- qaysi fayllar;
- qaysi tekshiruvlar o'tdi yoki nega o'tkazilmadi;
- muhim risk yoki keyingi qadam.
