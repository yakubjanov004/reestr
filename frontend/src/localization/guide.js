export const GUIDE_TRANSLATIONS = {
  uz: {
    heroKicker: "Tizim qo'llanmasi",
    title: "Datandan foydalanish qo'llanmasi",
    description:
      "Bu bo'lim sayt nima ish qilishi, qaysi rol nimalarni bajarishi va asosiy sahifalardan qanday foydalanishni skrinshot ko'rinishlari bilan tushuntiradi.",
    stats: {
      roles: "Rol bo'yicha",
      screens: "Sahifa skrinshotlari",
      steps: "Ish jarayonlari",
      language: "3 tilda"
    },
    tabs: {
      operator: "Operator uchun",
      supervisor: "Supervayzer uchun",
      manager: "Menejer uchun",
      admin: "Administrator uchun"
    },
    roleNote: "Supervayzer bo'limidagi amallar faqat supervayzer huquqi bor foydalanuvchilarda ochiladi.",
    whatSystemDoes: {
      title: "Sayt nima ish qiladi?",
      items: [
        "Mobil raqam va internet ulanish reestrlarini Excel fayldan bazaga import qiladi.",
        "Import qilingan yozuvlarni qidirish, filterlash va batafsil ko'rish imkonini beradi.",
        "Yuklashlar tarixi, import natijalari va xatoliklarni saqlaydi.",
        "Maxfiy ma'lumotlarni qoidalarga ko'ra saqlamaslik yoki maskalash orqali himoya qiladi."
      ]
    },
    roles: {
      operator: {
        title: "Operator qo'llanmasi",
        intro:
          "Operatorning asosiy vazifasi Excel faylni to'g'ri tur bilan yuklash, import natijasini tekshirish va kerak bo'lsa reestrdan yozuvlarni topishdir.",
        checklistTitle: "Operator ketma-ketligi",
        checklist: [
          "Tizimga login va parol bilan kiring.",
          "Fayl yuklash sahifasida reestr turini tanlang.",
          "Excel faylni tanlang yoki drop zonaga tashlang.",
          "Bazaga yuklash tugmasini bosing.",
          "Import natijasida import, takroriy, o'tkazilgan va muammo sonlarini tekshiring.",
          "Reestr sahifasida yozuvni qidirib, kerakli ma'lumotni ko'ring."
        ],
        steps: [
          {
            icon: "upload",
            title: "1. Excel faylni yuklash",
            text:
              "Mobil raqam yoki internet ulanish turini tanlang. Faqat .xlsx va .xlsm formatdagi fayllar qabul qilinadi.",
            screen: "upload"
          },
          {
            icon: "result",
            title: "2. Import natijasini tekshirish",
            text:
              "Yuklash tugagach, import qilingan, takroriy, o'tkazilgan va muammoli qatorlar soni alohida ko'rsatiladi.",
            screen: "result"
          },
          {
            icon: "records",
            title: "3. Reestrdan yozuv qidirish",
            text:
              "Mijoz, telefon, login yoki ariza bo'yicha qidiring. Sana, operator, region, diler va status bo'yicha filterlardan foydalaning.",
            screen: "records"
          },
          {
            icon: "privacy",
            title: "4. Maxfiylik qoidalarini ko'rish",
            text:
              "Qaysi ustunlar saqlanmasligi, qaysilari maskalanishi va qaysilari asl holida qolishini Maxfiylik qoidalari sahifasidan ko'ring.",
            screen: "privacy"
          }
        ]
      },
      supervisor: {
        title: "Supervayzer qo'llanmasi",
        intro:
          "Supervayzer o'z hududidagi operatorlar ish jarayonini kuzatadi, operator yaratadi, audit jurnalini ko'radi va statistikani nazorat qiladi.",
        checklistTitle: "Supervayzer ketma-ketligi",
        checklist: [
          "Boshqaruv paneli orqali umumiy import holatini va operator faolligini tekshiring.",
          "Faqat o'zingizga biriktirilgan hududdagi operatorlar ro'yxatini nazorat qiling.",
          "Foydalanuvchilar sahifasida operator yarating va hududingizdagi filialga biriktiring.",
          "Kerak bo'lsa foydalanuvchini bloklang, aktivlang yoki parolini yangilang.",
          "Audit jurnali orqali o'z hududingizdagi operatorlarning login, yuklash va foydalanuvchi amallarini tekshiring.",
          "Yuklashlar tarixi va reestr sahifalarida import tafsilotlarini tekshiring."
        ],
        steps: [
          {
            icon: "dashboard",
            title: "1. Statistikani kuzatish",
            text:
              "Boshqaruv paneli umumiy reestr soni, yuklashlar, oxirgi 30 kun importi va operator reytingini ko'rsatadi.",
            screen: "dashboard"
          },
          {
            icon: "users",
            title: "2. Foydalanuvchilarni boshqarish",
            text:
              "Yangi operator yarating va faqat o'zingizga biriktirilgan hududdagi filialga biriktiring. Supervayzer boshqa supervayzer yoki menejer yarata olmaydi.",
            screen: "users"
          },
          {
            icon: "audit",
            title: "3. Audit jurnalini tekshirish",
            text:
              "Kim tizimga kirgani, kim fayl yuklagani va foydalanuvchi bo'yicha qanday amal bajarilgani auditda ko'rinadi.",
            screen: "audit"
          },
          {
            icon: "batches",
            title: "4. Yuklashlar tarixini nazorat qilish",
            text:
              "Fayl nomi, operator, import soni, takroriy qatorlar, muammolar va sana bo'yicha barcha batchlar kuzatiladi.",
            screen: "batches"
          }
        ]
      },
      manager: {
        title: "Menejer qo'llanmasi",
        intro:
          "Menejer barcha hududlar bo'yicha supervayzer va operatorlarni boshqaradi, lekin menejer yoki administrator yarata olmaydi.",
        checklistTitle: "Menejer ketma-ketligi",
        checklist: [
          "Menejer panelida hududlar, filiallar va past rollar bo'yicha umumiy holatni ko'ring.",
          "Boshqaruv panelida barcha hududlar bo'yicha import, operator faolligi va yuklash trendlarini kuzating.",
          "Foydalanuvchilar sahifasida supervayzer yoki operator yarating.",
          "Supervayzerni hududga, operatorni esa filialga to'g'ri biriktiring.",
          "Auditda faqat o'zingizdan past rollar bo'yicha amallarni tekshiring.",
          "Reestr va yuklashlar tarixida barcha hududlar bo'yicha import tafsilotlarini nazorat qiling."
        ],
        steps: [
          {
            icon: "dashboard",
            title: "1. Menejer panelini kuzatish",
            text:
              "Menejer paneli barcha hududlar, filiallar, supervayzerlar va operatorlar bo'yicha umumiy nazorat oynasidir.",
            screen: "dashboard"
          },
          {
            icon: "users",
            title: "2. Supervayzer yoki operator yaratish",
            text:
              "Menejer supervayzer va operator yaratadi. Menejer menejer yarata olmaydi, administrator huquqlariga kirmaydi.",
            screen: "users"
          },
          {
            icon: "audit",
            title: "3. Past rollar auditini ko'rish",
            text:
              "Auditda supervayzer va operatorlar bajargan amallar ko'rinadi. Menejer o'zidan yuqori yoki teng rolni boshqarmaydi.",
            screen: "audit"
          },
          {
            icon: "batches",
            title: "4. Hududlar bo'yicha yuklashlarni tekshirish",
            text:
              "Yuklashlar tarixida operator, filial, import natijasi va sana bo'yicha barcha hududlarni tekshiring.",
            screen: "batches"
          }
        ]
      },
      admin: {
        title: "Administrator qo'llanmasi",
        intro:
          "Administrator tizimdagi barcha foydalanuvchilarni ko'radi, menejer yaratadi va umumiy audit nazoratini olib boradi.",
        checklistTitle: "Administrator ketma-ketligi",
        checklist: [
          "Administrator panelida tizimdagi umumiy foydalanuvchilar va rollar holatini ko'ring.",
          "Foydalanuvchilar sahifasida yangi menejer yarating.",
          "Menejer, supervayzer va operatorlar ro'yxatini umumiy nazorat qiling.",
          "Auditda barcha rollar bo'yicha muhim amallarni tekshiring.",
          "Reestr va yuklashlar tarixida umumiy import holatini kuzating.",
          "Menejer yaratishdan tashqari past rollar boshqaruvini menejer va supervayzer vakolatlariga qoldiring."
        ],
        steps: [
          {
            icon: "dashboard",
            title: "1. Administrator panelini kuzatish",
            text:
              "Administrator paneli menejerlar, past rollar, umumiy reestr va tizim nazorati uchun yuqori darajadagi oynadir.",
            screen: "dashboard"
          },
          {
            icon: "users",
            title: "2. Menejer yaratish",
            text:
              "Administrator foydalanuvchilar sahifasida menejer yaratadi. Menejerlar keyin supervayzer va operatorlarni boshqaradi.",
            screen: "users"
          },
          {
            icon: "audit",
            title: "3. To'liq auditni tekshirish",
            text:
              "Administrator auditda menejer, supervayzer va operatorlar bajargan asosiy amallarni to'liq ko'radi.",
            screen: "audit"
          },
          {
            icon: "batches",
            title: "4. Umumiy yuklashlar tarixini nazorat qilish",
            text:
              "Yuklashlar tarixida barcha filial va operatorlar bo'yicha import natijalarini tekshiring.",
            screen: "batches"
          }
        ]
      }
    },
    screen: {
      browserTitle: "Sahifa ko'rinishi",
      upload: {
        title: "Fayl yuklash",
        source: "Reestr turi",
        mobile: "Mobil raqam",
        internet: "Internet ulanish",
        drop: "Excel faylni tanlang yoki shu yerga tashlang",
        action: "Bazaga yuklash"
      },
      result: {
        title: "Import natijasi",
        imported: "Import",
        duplicate: "Takroriy",
        skipped: "O'tkazilgan",
        issues: "Muammolar"
      },
      records: {
        title: "Reestr yozuvlari",
        search: "Mijoz, telefon, login...",
        columns: ["Mijoz", "Tur", "Region", "Status", "Import"],
        rows: [
          ["Abd***", "Mobil", "Toshkent", "Tayyor", "23.06"],
          ["Kar***", "Internet", "Samarqand", "Tayyor", "23.06"]
        ]
      },
      privacy: {
        title: "Maxfiylik qoidalari",
        red: "Saqlanmaydi",
        yellow: "Maskalanadi",
        white: "Asl qiymat"
      },
      dashboard: {
        title: "Boshqaruv paneli",
        cards: ["Jami reestr", "Yuklashlar", "Operatorlar", "30 kun"]
      },
      users: {
        title: "Foydalanuvchilar",
        form: "Yangi foydalanuvchi",
        table: "Operatorlar ro'yxati"
      },
      audit: {
        title: "Audit jurnali",
        columns: ["Sana", "Foydalanuvchi", "Amal", "Tafsilot"],
        rows: [
          ["23.06", "Administrator", "Import", "Tayyor"],
          ["23.06", "Operator", "Login", "IP"]
        ]
      },
      batches: {
        title: "Yuklashlar tarixi",
        columns: ["Fayl", "Operator", "Import", "Muammo"],
        rows: [
          ["reestr.xlsx", "Operator", "124", "0"],
          ["internet.xlsx", "Supervayzer", "98", "1"]
        ]
      }
    }
  },
  "uz-cyrl": {
    heroKicker: "Тизим қўлланмаси",
    title: "Datanдан фойдаланиш қўлланмаси",
    description:
      "Бу бўлим сайт нима иш қилиши, қайси рол нималарни бажариши ва асосий саҳифалардан қандай фойдаланишни скриншот кўринишлари билан тушунтиради.",
    stats: {
      roles: "Рол бўйича",
      screens: "Саҳифа скриншотлари",
      steps: "Иш жараёнлари",
      language: "3 тилда"
    },
    tabs: {
      operator: "Оператор учун",
      supervisor: "Супервайзер учун",
      manager: "Менежер учун",
      admin: "Администратор учун"
    },
    roleNote: "Супервайзер бўлимидаги амаллар фақат супервайзер ҳуқуқи бор фойдаланувчиларда очилади.",
    whatSystemDoes: {
      title: "Сайт нима иш қилади?",
      items: [
        "Мобил рақам ва интернет уланиш реестрларини Excel файлдан базага импорт қилади.",
        "Импорт қилинган ёзувларни қидириш, фильтрлаш ва батафсил кўриш имконини беради.",
        "Юклашлар тарихи, импорт натижалари ва хатоликларни сақлайди.",
        "Махфий маълумотларни қоидаларга кўра сақламаслик ёки маскалаш орқали ҳимоя қилади."
      ]
    },
    roles: {
      operator: {
        title: "Оператор қўлланмаси",
        intro:
          "Операторнинг асосий вазифаси Excel файлни тўғри тур билан юклаш, импорт натижасини текшириш ва керак бўлса реестрдан ёзувларни топишдир.",
        checklistTitle: "Оператор кетма-кетлиги",
        checklist: [
          "Тизимга логин ва парол билан киринг.",
          "Файл юклаш саҳифасида реестр турини танланг.",
          "Excel файлни танланг ёки drop зонага ташланг.",
          "Базага юклаш тугмасини босинг.",
          "Импорт натижасида импорт, такрорий, ўтказилган ва муаммо сонларини текширинг.",
          "Реестр саҳифасида ёзувни қидириб, керакли маълумотни кўринг."
        ],
        steps: [
          {
            icon: "upload",
            title: "1. Excel файлни юклаш",
            text:
              "Мобил рақам ёки интернет уланиш турини танланг. Фақат .xlsx ва .xlsm форматдаги файллар қабул қилинади.",
            screen: "upload"
          },
          {
            icon: "result",
            title: "2. Импорт натижасини текшириш",
            text:
              "Юклаш тугагач, импорт қилинган, такрорий, ўтказилган ва муаммоли қаторлар сони алоҳида кўрсатилади.",
            screen: "result"
          },
          {
            icon: "records",
            title: "3. Реестрдан ёзув қидириш",
            text:
              "Мижоз, телефон, логин ёки ариза бўйича қидиринг. Сана, оператор, регион, дилер ва статус бўйича фильтрлардан фойдаланинг.",
            screen: "records"
          },
          {
            icon: "privacy",
            title: "4. Махфийлик қоидаларини кўриш",
            text:
              "Қайси устунлар сақланмаслиги, қайсилари маскаланиши ва қайсилари асл ҳолида қолишини Махфийлик қоидалари саҳифасидан кўринг.",
            screen: "privacy"
          }
        ]
      },
      supervisor: {
        title: "Супервайзер қўлланмаси",
        intro:
          "Супервайзер ўзига бириктирилган ҳудуддаги операторлар иш жараёнини кузатади, оператор яратади, аудит журналини кўради ва статистикани назорат қилади.",
        checklistTitle: "Супервайзер кетма-кетлиги",
        checklist: [
          "Бошқарув панели орқали умумий импорт ҳолатини ва оператор фаоллигини текширинг.",
          "Фақат ўзингизга бириктирилган ҳудуддаги операторлар рўйхатини назорат қилинг.",
          "Фойдаланувчилар саҳифасида оператор яратинг ва ҳудудингиздаги филиалга бириктиринг.",
          "Керак бўлса фойдаланувчини блокланг, активланг ёки паролини янгиланг.",
          "Аудит журнали орқали ўз ҳудудингиздаги операторларнинг логин, юклаш ва фойдаланувчи амалларини текширинг.",
          "Юклашлар тарихи ва реестр саҳифаларида импорт тафсилотларини текширинг."
        ],
        steps: [
          {
            icon: "dashboard",
            title: "1. Статистикани кузатиш",
            text:
              "Бошқарув панели умумий реестр сони, юклашлар, охирги 30 кун импорти ва оператор рейтингини кўрсатади.",
            screen: "dashboard"
          },
          {
            icon: "users",
            title: "2. Фойдаланувчиларни бошқариш",
            text:
              "Янги оператор яратинг ва фақат ўзингизга бириктирилган ҳудуддаги филиалга бириктиринг. Супервайзер бошқа супервайзер ёки менежер ярата олмайди.",
            screen: "users"
          },
          {
            icon: "audit",
            title: "3. Аудит журналини текшириш",
            text:
              "Ким тизимга киргани, ким файл юклагани ва фойдаланувчи бўйича қандай амал бажарилгани auditда кўринади.",
            screen: "audit"
          },
          {
            icon: "batches",
            title: "4. Юклашлар тарихини назорат қилиш",
            text:
              "Файл номи, оператор, импорт сони, такрорий қаторлар, муаммолар ва сана бўйича барча batchлар кузатилади.",
            screen: "batches"
          }
        ]
      },
      manager: {
        title: "Менежер қўлланмаси",
        intro:
          "Менежер барча ҳудудлар бўйича супервайзер ва операторларни бошқаради, лекин менежер ёки администратор ярата олмайди.",
        checklistTitle: "Менежер кетма-кетлиги",
        checklist: [
          "Менежер панелида ҳудудлар, филиаллар ва паст роллар бўйича умумий ҳолатни кўринг.",
          "Бошқарув панелида барча ҳудудлар бўйича импорт, оператор фаоллиги ва юклаш трендларини кузатинг.",
          "Фойдаланувчилар саҳифасида супервайзер ёки оператор яратинг.",
          "Супервайзерни ҳудудга, операторни эса филиалга тўғри бириктиринг.",
          "Auditда фақат ўзингиздан паст роллар бўйича амалларни текширинг.",
          "Реестр ва юклашлар тарихида барча ҳудудлар бўйича импорт тафсилотларини назорат қилинг."
        ],
        steps: [
          {
            icon: "dashboard",
            title: "1. Менежер панелини кузатиш",
            text:
              "Менежер панели барча ҳудудлар, филиаллар, супервайзерлар ва операторлар бўйича умумий назорат ойнасидир.",
            screen: "dashboard"
          },
          {
            icon: "users",
            title: "2. Супервайзер ёки оператор яратиш",
            text:
              "Менежер супервайзер ва оператор яратади. Менежер менежер ярата олмайди, администратор ҳуқуқларига кирмайди.",
            screen: "users"
          },
          {
            icon: "audit",
            title: "3. Паст роллар auditини кўриш",
            text:
              "Аудитда супервайзер ва операторлар бажарган амаллар кўринади. Менежер ўзидан юқори ёки тенг ролни бошқармайди.",
            screen: "audit"
          },
          {
            icon: "batches",
            title: "4. Ҳудудлар бўйича юклашларни текшириш",
            text:
              "Юклашлар тарихида оператор, филиал, импорт натижаси ва сана бўйича барча ҳудудларни текширинг.",
            screen: "batches"
          }
        ]
      },
      admin: {
        title: "Администратор қўлланмаси",
        intro:
          "Администратор тизимдаги барча фойдаланувчиларни кўради, менежер яратади ва умумий аудит назоратини олиб боради.",
        checklistTitle: "Администратор кетма-кетлиги",
        checklist: [
          "Администратор панелида тизимдаги умумий фойдаланувчилар ва роллар ҳолатини кўринг.",
          "Фойдаланувчилар саҳифасида янги менежер яратинг.",
          "Менежер, супервайзер ва операторлар рўйхатини умумий назорат қилинг.",
          "Аудитда барча роллар бўйича муҳим амалларни текширинг.",
          "Реестр ва юклашлар тарихида умумий импорт ҳолатини кузатинг.",
          "Менежер яратишдан ташқари паст роллар бошқарувини менежер ва супервайзер ваколатларига қолдиринг."
        ],
        steps: [
          {
            icon: "dashboard",
            title: "1. Администратор панелини кузатиш",
            text:
              "Администратор панели менежерлар, паст роллар, умумий реестр ва тизим назорати учун юқори даражадаги ойнадир.",
            screen: "dashboard"
          },
          {
            icon: "users",
            title: "2. Менежер яратиш",
            text:
              "Администратор фойдаланувчилар саҳифасида менежер яратади. Менежерлар кейин супервайзер ва операторларни бошқаради.",
            screen: "users"
          },
          {
            icon: "audit",
            title: "3. Тўлиқ auditни текшириш",
            text:
              "Администратор аудитда менежер, супервайзер ва операторлар бажарган асосий амалларни тўлиқ кўради.",
            screen: "audit"
          },
          {
            icon: "batches",
            title: "4. Умумий юклашлар тарихини назорат қилиш",
            text:
              "Юклашлар тарихида барча филиал ва операторлар бўйича импорт натижаларини текширинг.",
            screen: "batches"
          }
        ]
      }
    },
    screen: {
      browserTitle: "Саҳифа кўриниши",
      upload: {
        title: "Файл юклаш",
        source: "Реестр тури",
        mobile: "Мобил рақам",
        internet: "Интернет уланиш",
        drop: "Excel файлни танланг ёки шу ерга ташланг",
        action: "Базага юклаш"
      },
      result: {
        title: "Импорт натижаси",
        imported: "Импорт",
        duplicate: "Такрорий",
        skipped: "Ўтказилган",
        issues: "Муаммолар"
      },
      records: {
        title: "Реестр ёзувлари",
        search: "Мижоз, телефон, логин...",
        columns: ["Мижоз", "Тур", "Регион", "Статус", "Импорт"],
        rows: [
          ["Абд***", "Мобил", "Тошкент", "Тайёр", "23.06"],
          ["Кар***", "Интернет", "Самарқанд", "Тайёр", "23.06"]
        ]
      },
      privacy: {
        title: "Махфийлик қоидалари",
        red: "Сақланмайди",
        yellow: "Маскаланади",
        white: "Асл қиймат"
      },
      dashboard: {
        title: "Бошқарув панели",
        cards: ["Жами реестр", "Юклашлар", "Операторлар", "30 кун"]
      },
      users: {
        title: "Фойдаланувчилар",
        form: "Янги фойдаланувчи",
        table: "Операторлар рўйхати"
      },
      audit: {
        title: "Аудит журнали",
        columns: ["Сана", "Фойдаланувчи", "Амал", "Тафсилот"],
        rows: [
          ["23.06", "Администратор", "Импорт", "Тайёр"],
          ["23.06", "Оператор", "Логин", "IP"]
        ]
      },
      batches: {
        title: "Юклашлар тарихи",
        columns: ["Файл", "Оператор", "Импорт", "Муаммо"],
        rows: [
          ["reestr.xlsx", "Оператор", "124", "0"],
          ["internet.xlsx", "Супервайзер", "98", "1"]
        ]
      }
    }
  },
  ru: {
    heroKicker: "Инструкция по системе",
    title: "Инструкция по работе с Datan",
    description:
      "Раздел объясняет, что делает сайт, какие действия выполняет каждая роль и как пользоваться основными страницами с визуальными примерами.",
    stats: {
      roles: "По ролям",
      screens: "Скриншоты страниц",
      steps: "Рабочие процессы",
      language: "На 3 языках"
    },
    tabs: {
      operator: "Для оператора",
      supervisor: "Для супервизора",
      manager: "Для менеджера",
      admin: "Для администратора"
    },
    roleNote: "Действия из раздела супервизора доступны только пользователям с правами supervisor.",
    whatSystemDoes: {
      title: "Что делает сайт?",
      items: [
        "Импортирует реестры мобильных номеров и интернет-подключений из Excel файла в базу.",
        "Позволяет искать, фильтровать и подробно просматривать импортированные записи.",
        "Хранит историю загрузок, результаты импорта и ошибки.",
        "Защищает конфиденциальные данные через удаление или маскирование по правилам."
      ]
    },
    roles: {
      operator: {
        title: "Инструкция оператора",
        intro:
          "Основная задача оператора: загрузить Excel файл с правильным типом реестра, проверить результат импорта и найти записи в реестре при необходимости.",
        checklistTitle: "Последовательность оператора",
        checklist: [
          "Войдите в систему с логином и паролем.",
          "На странице загрузки выберите тип реестра.",
          "Выберите Excel файл или перетащите его в drop-зону.",
          "Нажмите кнопку загрузки в базу.",
          "Проверьте количество импортированных, повторных, пропущенных и проблемных строк.",
          "На странице реестра найдите нужную запись и откройте детали."
        ],
        steps: [
          {
            icon: "upload",
            title: "1. Загрузка Excel файла",
            text:
              "Выберите тип: мобильный номер или интернет-подключение. Принимаются только файлы .xlsx и .xlsm.",
            screen: "upload"
          },
          {
            icon: "result",
            title: "2. Проверка результата импорта",
            text:
              "После загрузки отдельно показывается число импортированных, повторных, пропущенных и проблемных строк.",
            screen: "result"
          },
          {
            icon: "records",
            title: "3. Поиск записи в реестре",
            text:
              "Ищите по клиенту, телефону, логину или заявке. Используйте фильтры по дате, оператору, региону, дилеру и статусу.",
            screen: "records"
          },
          {
            icon: "privacy",
            title: "4. Просмотр правил приватности",
            text:
              "На странице правил приватности видно, какие столбцы не сохраняются, маскируются или остаются в исходном виде.",
            screen: "privacy"
          }
        ]
      },
      supervisor: {
        title: "Инструкция супервизора",
        intro:
          "Супервизор контролирует операторов в своем регионе, создает операторов, просматривает журнал аудита и следит за статистикой.",
        checklistTitle: "Последовательность супервизора",
        checklist: [
          "Проверьте общий импорт и активность операторов на панели управления.",
          "Контролируйте только операторов из закрепленного за вами региона.",
          "Создавайте операторов на странице пользователей и привязывайте их к филиалам своего региона.",
          "При необходимости блокируйте, активируйте пользователя или обновляйте пароль.",
          "Проверяйте входы, загрузки и действия операторов своего региона через журнал аудита.",
          "Смотрите детали импорта в истории загрузок и реестре."
        ],
        steps: [
          {
            icon: "dashboard",
            title: "1. Контроль статистики",
            text:
              "Панель управления показывает общее число записей, загрузки, импорт за последние 30 дней и рейтинг операторов.",
            screen: "dashboard"
          },
          {
            icon: "users",
            title: "2. Управление пользователями",
            text:
              "Создавайте операторов и привязывайте их только к филиалам своего региона. Супервизор не создает других супервизоров или менеджеров.",
            screen: "users"
          },
          {
            icon: "audit",
            title: "3. Проверка журнала аудита",
            text:
              "В аудите видно, кто вошел в систему, кто загрузил файл и какие действия были выполнены по пользователям.",
            screen: "audit"
          },
          {
            icon: "batches",
            title: "4. Контроль истории загрузок",
            text:
              "Отслеживайте все batch-загрузки по имени файла, оператору, импорту, повторам, проблемам и дате.",
            screen: "batches"
          }
        ]
      },
      manager: {
        title: "Инструкция менеджера",
        intro:
          "Менеджер управляет супервизорами и операторами по всем регионам, но не создает менеджеров или администраторов.",
        checklistTitle: "Последовательность менеджера",
        checklist: [
          "В панели менеджера смотрите общее состояние по регионам, филиалам и нижним ролям.",
          "На панели управления контролируйте импорт, активность операторов и тренды загрузок по всем регионам.",
          "На странице пользователей создавайте супервизоров или операторов.",
          "Привязывайте супервизора к региону, а оператора к филиалу.",
          "В Audit проверяйте действия только нижних ролей.",
          "В реестре и истории загрузок контролируйте импорт по всем регионам."
        ],
        steps: [
          {
            icon: "dashboard",
            title: "1. Контроль панели менеджера",
            text:
              "Панель менеджера показывает общий контроль по регионам, филиалам, супервизорам и операторам.",
            screen: "dashboard"
          },
          {
            icon: "users",
            title: "2. Создание супервизора или оператора",
            text:
              "Менеджер создает супервизоров и операторов. Менеджер не создает менеджеров и не получает права администратора.",
            screen: "users"
          },
          {
            icon: "audit",
            title: "3. Просмотр аудита нижних ролей",
            text:
              "В аудите видны действия супервизоров и операторов. Менеджер не управляет равными или более высокими ролями.",
            screen: "audit"
          },
          {
            icon: "batches",
            title: "4. Проверка загрузок по регионам",
            text:
              "В истории загрузок проверяйте оператора, филиал, результат импорта и дату по всем регионам.",
            screen: "batches"
          }
        ]
      },
      admin: {
        title: "Инструкция администратора",
        intro:
          "Администратор видит всех пользователей, создает менеджеров и контролирует общий аудит системы.",
        checklistTitle: "Последовательность администратора",
        checklist: [
          "В панели администратора смотрите общее состояние пользователей и ролей.",
          "На странице пользователей создавайте нового менеджера.",
          "Контролируйте общий список менеджеров, супервизоров и операторов.",
          "В аудите проверяйте важные действия по всем ролям.",
          "В реестре и истории загрузок следите за общим состоянием импорта.",
          "Управление нижними ролями после создания менеджера оставляйте полномочиям менеджера и супервизора."
        ],
        steps: [
          {
            icon: "dashboard",
            title: "1. Контроль панели администратора",
            text:
              "Панель администратора предназначена для верхнего уровня контроля менеджеров, нижних ролей, реестра и системы.",
            screen: "dashboard"
          },
          {
            icon: "users",
            title: "2. Создание менеджера",
            text:
              "Администратор создает менеджеров на странице пользователей. После этого менеджеры управляют супервизорами и операторами.",
            screen: "users"
          },
          {
            icon: "audit",
            title: "3. Проверка полного аудита",
            text:
              "Администратор видит основные действия менеджеров, супервизоров и операторов в полном журнале аудита.",
            screen: "audit"
          },
          {
            icon: "batches",
            title: "4. Контроль общей истории загрузок",
            text:
              "В истории загрузок проверяйте результаты импорта по всем филиалам и операторам.",
            screen: "batches"
          }
        ]
      }
    },
    screen: {
      browserTitle: "Вид страницы",
      upload: {
        title: "Загрузка файла",
        source: "Тип реестра",
        mobile: "Мобильный номер",
        internet: "Интернет",
        drop: "Выберите Excel файл или перетащите сюда",
        action: "Загрузить в базу"
      },
      result: {
        title: "Результат импорта",
        imported: "Импорт",
        duplicate: "Повторы",
        skipped: "Пропущено",
        issues: "Проблемы"
      },
      records: {
        title: "Записи реестра",
        search: "Клиент, телефон, логин...",
        columns: ["Клиент", "Тип", "Регион", "Статус", "Импорт"],
        rows: [
          ["Абд***", "Мобильный", "Ташкент", "Готово", "23.06"],
          ["Кар***", "Интернет", "Самарканд", "Готово", "23.06"]
        ]
      },
      privacy: {
        title: "Правила приватности",
        red: "Не сохраняется",
        yellow: "Маскируется",
        white: "Исходное значение"
      },
      dashboard: {
        title: "Панель управления",
        cards: ["Всего", "Загрузки", "Операторы", "30 дней"]
      },
      users: {
        title: "Пользователи",
        form: "Новый пользователь",
        table: "Список операторов"
      },
      audit: {
        title: "Журнал аудита",
        columns: ["Дата", "Пользователь", "Действие", "Детали"],
        rows: [
          ["23.06", "Администратор", "Импорт", "Готово"],
          ["23.06", "Оператор", "Вход", "IP"]
        ]
      },
      batches: {
        title: "История загрузок",
        columns: ["Файл", "Оператор", "Импорт", "Проблема"],
        rows: [
          ["reestr.xlsx", "Оператор", "124", "0"],
          ["internet.xlsx", "Супервизор", "98", "1"]
        ]
      }
    }
  }
};
