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
      manager: "Supervisor uchun"
    },
    roleNote: "Supervisor bo'limidagi amallar faqat supervisor huquqi bor foydalanuvchilarda ochiladi.",
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
      manager: {
        title: "Supervisor qo'llanmasi",
        intro:
          "Supervisor operator ish jarayonini kuzatadi, foydalanuvchilarni boshqaradi, audit loglarni ko'radi va statistikani nazorat qiladi.",
        checklistTitle: "Supervisor ketma-ketligi",
        checklist: [
          "Dashboard orqali umumiy import holatini va operator faolligini tekshiring.",
          "Kecha fayl yuklamagan operatorlar ro'yxatini nazorat qiling.",
          "Foydalanuvchilar sahifasida operator yarating yoki filialga biriktiring.",
          "Kerak bo'lsa foydalanuvchini bloklang, aktivlang yoki parolini yangilang.",
          "Audit log orqali login, upload va foydalanuvchi amallarini tekshiring.",
          "Yuklashlar tarixi va reestr sahifalarida import tafsilotlarini tekshiring."
        ],
        steps: [
          {
            icon: "dashboard",
            title: "1. Statistikani kuzatish",
            text:
              "Dashboard umumiy reestr soni, yuklashlar, oxirgi 30 kun importi va operator reytingini ko'rsatadi.",
            screen: "dashboard"
          },
          {
            icon: "users",
            title: "2. Foydalanuvchilarni boshqarish",
            text:
              "Yangi operator yarating va filialga biriktiring. Foydalanuvchi holatini bloklash, aktivlash va parolni almashtirish mumkin.",
            screen: "users"
          },
          {
            icon: "audit",
            title: "3. Audit loglarni tekshirish",
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
        columns: ["Mijoz", "Tur", "Region", "Status", "Import"]
      },
      privacy: {
        title: "Maxfiylik qoidalari",
        red: "Saqlanmaydi",
        yellow: "Maskalanadi",
        white: "Asl qiymat"
      },
      dashboard: {
        title: "Dashboard",
        cards: ["Jami reestr", "Yuklashlar", "Operatorlar", "30 kun"]
      },
      users: {
        title: "Foydalanuvchilar",
        form: "Yangi foydalanuvchi",
        table: "Operatorlar ro'yxati"
      },
      audit: {
        title: "Audit log",
        columns: ["Sana", "Foydalanuvchi", "Amal", "Tafsilot"]
      },
      batches: {
        title: "Yuklashlar tarixi",
        columns: ["Fayl", "Operator", "Import", "Muammo"]
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
      manager: "Супервизор учун"
    },
    roleNote: "Супервизор бўлимидаги амаллар фақат supervisor ҳуқуқи бор фойдаланувчиларда очилади.",
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
      manager: {
        title: "Супервизор қўлланмаси",
        intro:
          "Супервизор оператор иш жараёнини кузатади, фойдаланувчиларни бошқаради, audit logларни кўради ва статистикани назорат қилади.",
        checklistTitle: "Супервизор кетма-кетлиги",
        checklist: [
          "Dashboard орқали умумий импорт ҳолатини ва оператор фаоллигини текширинг.",
          "Кеча файл юкламаган операторлар рўйхатини назорат қилинг.",
          "Фойдаланувчилар саҳифасида оператор яратинг ёки филиалга бириктиринг.",
          "Керак бўлса фойдаланувчини блокланг, активланг ёки паролини янгиланг.",
          "Audit log орқали login, upload ва фойдаланувчи амалларини текширинг.",
          "Юклашлар тарихи ва реестр саҳифаларида импорт тафсилотларини текширинг."
        ],
        steps: [
          {
            icon: "dashboard",
            title: "1. Статистикани кузатиш",
            text:
              "Dashboard умумий реестр сони, юклашлар, охирги 30 кун импорти ва оператор рейтингини кўрсатади.",
            screen: "dashboard"
          },
          {
            icon: "users",
            title: "2. Фойдаланувчиларни бошқариш",
            text:
              "Янги оператор яратинг ва филиалга бириктиринг. Фойдаланувчи ҳолатини блоклаш, активлаш ва паролни алмаштириш мумкин.",
            screen: "users"
          },
          {
            icon: "audit",
            title: "3. Audit logларни текшириш",
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
        columns: ["Мижоз", "Тур", "Регион", "Статус", "Импорт"]
      },
      privacy: {
        title: "Махфийлик қоидалари",
        red: "Сақланмайди",
        yellow: "Маскаланади",
        white: "Асл қиймат"
      },
      dashboard: {
        title: "Dashboard",
        cards: ["Жами реестр", "Юклашлар", "Операторлар", "30 кун"]
      },
      users: {
        title: "Фойдаланувчилар",
        form: "Янги фойдаланувчи",
        table: "Операторлар рўйхати"
      },
      audit: {
        title: "Audit log",
        columns: ["Сана", "Фойдаланувчи", "Амал", "Тафсилот"]
      },
      batches: {
        title: "Юклашлар тарихи",
        columns: ["Файл", "Оператор", "Импорт", "Муаммо"]
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
      manager: "Для супервизора"
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
      manager: {
        title: "Инструкция супервизора",
        intro:
          "Супервизор контролирует работу операторов, управляет пользователями, просматривает audit log и следит за статистикой.",
        checklistTitle: "Последовательность супервизора",
        checklist: [
          "Проверьте общий импорт и активность операторов на Dashboard.",
          "Контролируйте список операторов, которые вчера не загрузили файл.",
          "Создавайте операторов и привязывайте их к филиалам на странице пользователей.",
          "При необходимости блокируйте, активируйте пользователя или обновляйте пароль.",
          "Проверяйте входы, загрузки и действия пользователей через Audit log.",
          "Смотрите детали импорта в истории загрузок и реестре."
        ],
        steps: [
          {
            icon: "dashboard",
            title: "1. Контроль статистики",
            text:
              "Dashboard показывает общее число записей, загрузки, импорт за последние 30 дней и рейтинг операторов.",
            screen: "dashboard"
          },
          {
            icon: "users",
            title: "2. Управление пользователями",
            text:
              "Создавайте операторов и привязывайте их к филиалам. Можно блокировать, активировать пользователя и менять пароль.",
            screen: "users"
          },
          {
            icon: "audit",
            title: "3. Проверка Audit log",
            text:
              "В audit видно, кто вошел в систему, кто загрузил файл и какие действия были выполнены по пользователям.",
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
        columns: ["Клиент", "Тип", "Регион", "Статус", "Импорт"]
      },
      privacy: {
        title: "Правила приватности",
        red: "Не сохраняется",
        yellow: "Маскируется",
        white: "Исходное значение"
      },
      dashboard: {
        title: "Dashboard",
        cards: ["Всего", "Загрузки", "Операторы", "30 дней"]
      },
      users: {
        title: "Пользователи",
        form: "Новый пользователь",
        table: "Список операторов"
      },
      audit: {
        title: "Audit log",
        columns: ["Дата", "Пользователь", "Действие", "Детали"]
      },
      batches: {
        title: "История загрузок",
        columns: ["Файл", "Оператор", "Импорт", "Проблема"]
      }
    }
  }
};
