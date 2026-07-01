/**
 * Help page translations — contact info, FAQ per role, support guidelines.
 * Structure: HELP_TRANSLATIONS[lang] → { hero, contact, faq, guidelines }
 */
export const HELP_TRANSLATIONS = {
  /* ═══════════════════════════════════════════════════════════
     O'ZBEK TILI (lotin)
     ═══════════════════════════════════════════════════════════ */
  uz: {
    hero: {
      kicker: "Qo'llab-quvvatlash markazi",
      title: "Sizga qanday yordam bera olamiz?",
      description:
        "Tizim bilan ishlashda muammo tug'ildimi? Bizning jamoa sizga yordam berishga doim tayyor. O'zingizga qulay aloqa usulini tanlang yoki tez-tez so'raladigan savollarda javob toping."
    },

    contact: {
      title: "Biz bilan bog'laning",
      phone: {
        label: "Telefon orqali",
        description: "Tezkor yordam va to'g'ridan-to'g'ri muloqot uchun qo'ng'iroq qiling.",
        value: "+998 77 044 40 00",
        hours: "09:00 – 18:00 (Du–Ju)"
      },
      telegram: {
        label: "Telegram orqali",
        description: "Skrinshot va xatoliklar haqida batafsil yozish uchun qulay usul.",
        value: "@reestr_support",
        hours: "24/7 qabul qilinadi"
      },
      email: {
        label: "Elektron pochta",
        description: "Rasmiy murojaatlar va hujjatlar yuborish uchun pochta manzili.",
        value: "support@reestr.uz",
        hours: "1 ish kunida javob"
      }
    },

    faq: {
      title: "Tez-tez so'raladigan savollar",
      description: "Sizning rolingiz bo'yicha eng ko'p beriladigan savollar va javoblar.",
      searchPlaceholder: "Savol qidiring...",
      empty: "Savol topilmadi",

      operator: {
        label: "Operator savollari",
        items: [
          {
            question: "Excel fayl yuklanmayapti — nima qilish kerak?",
            answer:
              "Faqat .xlsx va .xlsm formatdagi fayllar qabul qilinadi. Fayl hajmi 10 MB dan oshmasligi kerak. Fayl ochiq (boshqa dasturda) bo'lmasligi kerak. Agar muammo davom etsa, faylni qayta saqlang va yana urinib ko'ring."
          },
          {
            question: "Import natijasida takroriy yozuvlar ko'p — nima uchun?",
            answer:
              "Tizim telefon raqami va ulanish sanasi bo'yicha dublikatni aniqlaydi. Agar avval yuklangan ma'lumotlarni qayta yuklamoqchi bo'lsangiz, takroriy deb belgilanadi. Bu normal holat — bazaga ikki marta yozilmaydi."
          },
          {
            question: "Reestrda yozuvim ko'rinmayapti",
            answer:
              "Reestr sahifasida filtr va qidiruvni tekshiring — sana, region yoki status filtri yozuvingizni yashirgan bo'lishi mumkin. Shuningdek, import natijasida \"muammoli\" deb belgilangan yozuvlar reestrga tushmaydi."
          },
          {
            question: "Qaysi Excel format qabul qilinadi?",
            answer:
              "Tizim .xlsx (Excel 2007+) va .xlsm (makroli) formatlarni qabul qiladi. Eski .xls format qo'llab-quvvatlanmaydi. Ustun nomlari shablon bo'yicha to'g'ri bo'lishi kerak."
          },
          {
            question: "KPI qanday hisoblanadi?",
            answer:
              "KPI sizning import qilgan yozuvlaringiz soni, muvaffaqiyatli import foizi va kunlik faollik asosida hisoblanadi. Har kuni fayl yuklash va minimal xatolik bilan ishlash KPI ni oshiradi."
          }
        ]
      },

      supervisor: {
        label: "Supervayzer savollari",
        items: [
          {
            question: "Operator yarata olmayapman — sabab nima?",
            answer:
              "Supervayzer faqat o'z hududidagi filialga operator yarata oladi. Agar siz boshqa hududdagi filialga biriktirmoqchi bo'lsangiz, ruxsat berilmaydi. Shuningdek, login allaqachon band bo'lmasligi kerak."
          },
          {
            question: "Monitoring sahifasida operator ko'rinmayapti",
            answer:
              "Monitoring faqat sizning hududingizga biriktirilgan operatorlarni ko'rsatadi. Agar operator boshqa hududda yoki bloklangan bo'lsa, ro'yxatda ko'rinmaydi."
          },
          {
            question: "Boshqa hududning operatorini ko'rib bo'ladimi?",
            answer:
              "Yo'q. Supervayzer faqat o'z hududidagi operator va yozuvlarni ko'radi. Bu xavfsizlik siyosati — har bir supervayzer faqat o'z hududi uchun javobgardir."
          },
          {
            question: "Operatorning parolini qanday yangilash mumkin?",
            answer:
              "Operatorlar sahifasida kerakli operatorni tanlang va 'Parolni yangilash' tugmasini bosing. Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak."
          }
        ]
      },

      manager: {
        label: "Menejer savollari",
        items: [
          {
            question: "Supervayzer yaratganim filialga birikkanmi?",
            answer:
              "Supervayzer hududga biriktiriladi, filialga emas. Supervayzer yaratganingizda hududni to'g'ri tanlashingiz kerak — keyin u shu hududdagi barcha filiallarga kirishga ega bo'ladi."
          },
          {
            question: "Barcha hududlar statistikasini qayerdan ko'raman?",
            answer:
              "Menejer paneli (/manager) sahifasida barcha hududlar, filiallar, operator va supervayzer sonlari, bugungi faollik va eng faol operatorlar ko'rsatiladi. Boshqaruv panelida esa grafik ko'rinishida statistika bor."
          },
          {
            question: "Menejer boshqa menejer yarata oladimi?",
            answer:
              "Yo'q. Menejer faqat supervayzer va operator yarata oladi. Yangi menejer yaratish faqat administrator huquqi bilan mumkin."
          },
          {
            question: "Operator monitoring'da nima ko'raman?",
            answer:
              "Monitoring sahifasida barcha operatorlarning bugungi faolligi ko'rsatiladi: kim yuklagan, kim yuklamagan, oxirgi yuklash vaqti, bugungi import soni va filial kesimi."
          }
        ]
      },

      admin: {
        label: "Administrator savollari",
        items: [
          {
            question: "Menejer yaratish qanday ishlaydi?",
            answer:
              "Administrator foydalanuvchilar sahifasida 'Yangi foydalanuvchi' tugmasini bosib menejer yaratadi. Menejer yaratilgach, u o'zi supervayzer va operatorlarni boshqaradi."
          },
          {
            question: "Tizimda nechta foydalanuvchi bor — qayerdan ko'raman?",
            answer:
              "Administrator paneli (/admin-panel) sahifasida barcha rollar bo'yicha foydalanuvchilar soni ko'rsatiladi: administrator, menejer, supervayzer va operator."
          },
          {
            question: "Administrator barcha yozuvlarni ko'ra oladimi?",
            answer:
              "Ha, administrator boshqaruv paneli va statistika sahifalarida barcha hududlar bo'yicha umumiy ma'lumotlarni ko'radi. Biroq detal reestr va yuklashlar administrator yon panelida yo'q — chunki administrator umumiy nazorat bilan shug'ullanadi."
          }
        ]
      }
    },

    guidelines: {
      title: "Murojaat qilish qoidalari",
      description: "Tezroq yordam olish uchun murojaatingizda quyidagilarni ko'rsating:",
      steps: [
        {
          title: "Muammo qayerda yuz berdi?",
          text: "Qaysi sahifada (masalan: Yuklash oynasi, Statistika) ekanligini ayting."
        },
        {
          title: "Qanday harakat qildingiz?",
          text: "Muammo chiqishidan oldin nima tugmani bosganingizni yozing."
        },
        {
          title: "Skrinshot ilova qiling",
          text: "Iloji boricha ekranni rasmga olib jo'nating, bu xatoni tez topishga yordam beradi."
        }
      ]
    }
  },

  /* ═══════════════════════════════════════════════════════════
     RUS TILI
     ═══════════════════════════════════════════════════════════ */
  ru: {
    hero: {
      kicker: "Центр поддержки",
      title: "Чем мы можем вам помочь?",
      description:
        "Возникли проблемы при работе с системой? Наша команда всегда готова помочь. Выберите удобный способ связи или найдите ответ в часто задаваемых вопросах."
    },

    contact: {
      title: "Свяжитесь с нами",
      phone: {
        label: "По телефону",
        description: "Для быстрой помощи и прямого общения позвоните нам.",
        value: "+998 77 044 40 00",
        hours: "09:00 – 18:00 (Пн–Пт)"
      },
      telegram: {
        label: "Через Telegram",
        description: "Удобный способ отправить скриншоты и описать ошибку подробно.",
        value: "@reestr_support",
        hours: "Принимаем 24/7"
      },
      email: {
        label: "Электронная почта",
        description: "Для официальных обращений и отправки документов.",
        value: "support@reestr.uz",
        hours: "Ответ в течение 1 рабочего дня"
      }
    },

    faq: {
      title: "Часто задаваемые вопросы",
      description: "Наиболее частые вопросы и ответы для вашей роли.",
      searchPlaceholder: "Поиск вопроса...",
      empty: "Вопрос не найден",

      operator: {
        label: "Вопросы оператора",
        items: [
          {
            question: "Excel файл не загружается — что делать?",
            answer:
              "Принимаются только файлы формата .xlsx и .xlsm. Размер файла не должен превышать 10 МБ. Файл не должен быть открыт в другой программе. Если проблема продолжается, пересохраните файл и попробуйте снова."
          },
          {
            question: "Много дубликатов при импорте — почему?",
            answer:
              "Система определяет дубликаты по номеру телефона и дате подключения. Если вы повторно загружаете ранее импортированные данные, они будут отмечены как дубликаты. Это нормально — данные не будут записаны дважды."
          },
          {
            question: "Моя запись не отображается в реестре",
            answer:
              "Проверьте фильтры и поиск на странице реестра — фильтр по дате, региону или статусу может скрывать вашу запись. Также записи, отмеченные как «проблемные» при импорте, не попадают в реестр."
          },
          {
            question: "Какие форматы Excel принимаются?",
            answer:
              "Система принимает .xlsx (Excel 2007+) и .xlsm (с макросами). Старый формат .xls не поддерживается. Названия столбцов должны соответствовать шаблону."
          },
          {
            question: "Как рассчитывается KPI?",
            answer:
              "KPI рассчитывается на основе количества импортированных записей, процента успешного импорта и ежедневной активности. Ежедневная загрузка файлов с минимальными ошибками повышает KPI."
          }
        ]
      },

      supervisor: {
        label: "Вопросы супервайзера",
        items: [
          {
            question: "Не могу создать оператора — в чём причина?",
            answer:
              "Супервайзер может создавать операторов только в филиалах своего региона. Если вы пытаетесь привязать к филиалу другого региона, доступ будет запрещён. Также логин не должен быть уже занят."
          },
          {
            question: "Оператор не отображается на странице мониторинга",
            answer:
              "Мониторинг показывает только операторов вашего региона. Если оператор привязан к другому региону или заблокирован, он не будет отображаться."
          },
          {
            question: "Можно ли видеть операторов другого региона?",
            answer:
              "Нет. Супервайзер видит только операторов и записи своего региона. Это политика безопасности — каждый супервайзер отвечает только за свою зону."
          },
          {
            question: "Как сбросить пароль оператора?",
            answer:
              "На странице операторов выберите нужного оператора и нажмите «Сбросить пароль». Новый пароль должен содержать не менее 8 символов."
          }
        ]
      },

      manager: {
        label: "Вопросы менеджера",
        items: [
          {
            question: "Созданный супервайзер привязан к филиалу?",
            answer:
              "Супервайзер привязывается к региону, а не к филиалу. При создании супервайзера нужно правильно выбрать регион — после этого он получит доступ ко всем филиалам этого региона."
          },
          {
            question: "Где посмотреть статистику по всем регионам?",
            answer:
              "На странице панели менеджера (/manager) отображаются все регионы, филиалы, количество операторов и супервайзеров, сегодняшняя активность и лучшие операторы. На панели управления есть статистика в виде графиков."
          },
          {
            question: "Может ли менеджер создать другого менеджера?",
            answer:
              "Нет. Менеджер может создавать только супервайзеров и операторов. Создание нового менеджера возможно только с правами администратора."
          },
          {
            question: "Что показывает мониторинг операторов?",
            answer:
              "На странице мониторинга отображается сегодняшняя активность всех операторов: кто загрузил, кто нет, время последней загрузки, количество импортированных записей и разбивка по филиалам."
          }
        ]
      },

      admin: {
        label: "Вопросы администратора",
        items: [
          {
            question: "Как создать менеджера?",
            answer:
              "Администратор создаёт менеджера на странице пользователей нажатием кнопки «Новый пользователь». После создания менеджер самостоятельно управляет супервайзерами и операторами."
          },
          {
            question: "Где посмотреть количество пользователей?",
            answer:
              "На странице панели администратора (/admin-panel) отображается количество пользователей по ролям: администратор, менеджер, супервайзер и оператор."
          },
          {
            question: "Может ли администратор видеть все записи?",
            answer:
              "Да, администратор видит общую информацию по всем регионам на панели управления и статистических страницах. Однако детальный реестр и загрузки отсутствуют в боковой панели — администратор занимается общим контролем."
          }
        ]
      }
    },

    guidelines: {
      title: "Правила обращения",
      description: "Для быстрого получения помощи укажите в обращении:",
      steps: [
        {
          title: "Где возникла проблема?",
          text: "Укажите, на какой странице (например: страница загрузки, статистика)."
        },
        {
          title: "Какие действия вы выполнили?",
          text: "Опишите, какую кнопку нажали перед появлением проблемы."
        },
        {
          title: "Приложите скриншот",
          text: "По возможности сделайте снимок экрана — это поможет быстрее найти ошибку."
        }
      ]
    }
  },

  /* ═══════════════════════════════════════════════════════════
     O'ZBEK TILI (kirill)
     ═══════════════════════════════════════════════════════════ */
  "uz-cyrl": {
    hero: {
      kicker: "Қўллаб-қувватлаш маркази",
      title: "Сизга қандай ёрдам бера оламиз?",
      description:
        "Тизим билан ишлашда муаммо туғилдими? Бизнинг жамоа сизга ёрдам беришга доим тайёр. Ўзингизга қулай алоқа усулини танланг ёки тез-тез сўраладиган саволларда жавоб топинг."
    },

    contact: {
      title: "Биз билан боғланинг",
      phone: {
        label: "Телефон орқали",
        description: "Тезкор ёрдам ва тўғридан-тўғри мулоқот учун қўнғироқ қилинг.",
        value: "+998 77 044 40 00",
        hours: "09:00 – 18:00 (Ду–Жу)"
      },
      telegram: {
        label: "Телеграм орқали",
        description: "Скриншот ва хатоликлар ҳақида батафсил ёзиш учун қулай усул.",
        value: "@reestr_support",
        hours: "24/7 қабул қилинади"
      },
      email: {
        label: "Электрон почта",
        description: "Расмий мурожаатлар ва ҳужжатлар юбориш учун почта манзили.",
        value: "support@reestr.uz",
        hours: "1 иш кунида жавоб"
      }
    },

    faq: {
      title: "Тез-тез сўраладиган саволлар",
      description: "Сизнинг ролингиз бўйича энг кўп бериладиган саволлар ва жавоблар.",
      searchPlaceholder: "Савол қидиринг...",
      empty: "Савол топилмади",

      operator: {
        label: "Оператор саволлари",
        items: [
          {
            question: "Excel файл юкланмаяпти — нима қилиш керак?",
            answer:
              "Фақат .xlsx ва .xlsm форматдаги файллар қабул қилинади. Файл ҳажми 10 МБ дан ошмаслиги керак. Файл очиқ (бошқа дастурда) бўлмаслиги керак. Агар муаммо давом этса, файлни қайта сақланг ва яна уриниб кўринг."
          },
          {
            question: "Импорт натижасида такрорий ёзувлар кўп — нима учун?",
            answer:
              "Тизим телефон рақами ва уланиш санаси бўйича дубликатни аниқлайди. Агар аввал юкланган маълумотларни қайта юкламоқчи бўлсангиз, такрорий деб белгиланади. Бу нормал ҳолат — базага икки марта ёзилмайди."
          },
          {
            question: "Реестрда ёзувим кўринмаяпти",
            answer:
              "Реестр саҳифасида филтр ва қидирувни текширинг — сана, регион ёки статус филтри ёзувингизни яширган бўлиши мумкин. Шунингдек, импорт натижасида \"муаммоли\" деб белгиланган ёзувлар реестрга тушмайди."
          },
          {
            question: "Қайси Excel формат қабул қилинади?",
            answer:
              "Тизим .xlsx (Excel 2007+) ва .xlsm (макроли) форматларни қабул қилади. Эски .xls формат қўллаб-қувватланмайди. Устун номлари шаблон бўйича тўғри бўлиши керак."
          },
          {
            question: "КПИ қандай ҳисобланади?",
            answer:
              "КПИ сизнинг импорт қилган ёзувларингиз сони, муваффақиятли импорт фоизи ва кунлик фаоллик асосида ҳисобланади. Ҳар куни файл юклаш ва минимал хатолик билан ишлаш КПИ ни оширади."
          }
        ]
      },

      supervisor: {
        label: "Супервайзер саволлари",
        items: [
          {
            question: "Оператор ярата олмаяпман — сабаб нима?",
            answer:
              "Супервайзер фақат ўз ҳудудидаги филиалга оператор ярата олади. Агар сиз бошқа ҳудуддаги филиалга бириктирмоқчи бўлсангиз, рухсат берилмайди. Шунингдек, логин аллақачон банд бўлмаслиги керак."
          },
          {
            question: "Мониторинг саҳифасида оператор кўринмаяпти",
            answer:
              "Мониторинг фақат сизнинг ҳудудингизга бириктирилган операторларни кўрсатади. Агар оператор бошқа ҳудудда ёки блокланган бўлса, рўйхатда кўринмайди."
          },
          {
            question: "Бошқа ҳудуднинг операторини кўриб бўладими?",
            answer:
              "Йўқ. Супервайзер фақат ўз ҳудудидаги оператор ва ёзувларни кўради. Бу хавфсизлик сиёсати — ҳар бир супервайзер фақат ўз зонаси учун жавобгардир."
          },
          {
            question: "Операторнинг паролини қандай янгилаш мумкин?",
            answer:
              "Операторлар саҳифасида керакли операторни танланг ва 'Паролни янгилаш' тугмасини босинг. Янги парол камида 8 та белгидан иборат бўлиши керак."
          }
        ]
      },

      manager: {
        label: "Менежер саволлари",
        items: [
          {
            question: "Супервайзер яратганим филиалга биркканми?",
            answer:
              "Супервайзер ҳудудга бириктирилади, филиалга эмас. Супервайзер яратганингизда ҳудудни тўғри танлашингиз керак — кейин у шу ҳудуддаги барча филиалларга киришга эга бўлади."
          },
          {
            question: "Барча ҳудудлар статистикасини қаердан кўраман?",
            answer:
              "Менежер панели (/manager) саҳифасида барча ҳудудлар, филиаллар, оператор ва супервайзер сонлари, бугунги фаоллик ва энг фаол операторлар кўрсатилади. Бошқарув панелида эса график кўринишида статистика бор."
          },
          {
            question: "Менежер бошқа менежер ярата оладими?",
            answer:
              "Йўқ. Менежер фақат супервайзер ва оператор ярата олади. Янги менежер яратиш фақат администратор ҳуқуқи билан мумкин."
          },
          {
            question: "Оператор мониторингда нима кўраман?",
            answer:
              "Мониторинг саҳифасида барча операторларнинг бугунги фаоллиги кўрсатилади: ким юклаган, ким юкламаган, охирги юклаш вақти, бугунги импорт сони ва филиал кесими."
          }
        ]
      },

      admin: {
        label: "Администратор саволлари",
        items: [
          {
            question: "Менежер яратиш қандай ишлайди?",
            answer:
              "Администратор фойдаланувчилар саҳифасида 'Янги фойдаланувчи' тугмасини босиб менежер яратади. Менежер яратилгач, у ўзи супервайзер ва операторларни бошқаради."
          },
          {
            question: "Тизимда нечта фойдаланувчи бор — қаердан кўраман?",
            answer:
              "Администратор панели (/admin-panel) саҳифасида барча роллар бўйича фойдаланувчилар сони кўрсатилади: администратор, менежер, супервайзер ва оператор."
          },
          {
            question: "Администратор барча ёзувларни кўра оладими?",
            answer:
              "Ҳа, администратор бошқарув панели ва статистика саҳифаларида барча ҳудудлар бўйича умумий маълумотларни кўради. Бироқ детал реестр ва юклашлар администратор ён панелида йўқ — чунки администратор умумий назорат билан шуғулланади."
          }
        ]
      }
    },

    guidelines: {
      title: "Мурожаат қилиш қоидалари",
      description: "Тезроқ ёрдам олиш учун мурожаатингизда қуйидагиларни кўрсатинг:",
      steps: [
        {
          title: "Муаммо қаерда юз берди?",
          text: "Қайси саҳифада (масалан: Юклаш ойнаси, Статистика) эканлигини айтинг."
        },
        {
          title: "Қандай ҳаракат қилдингиз?",
          text: "Муаммо чиқишидан олдин нима тугмани босганингизни ёзинг."
        },
        {
          title: "Скриншот илова қилинг",
          text: "Илоji борича экранни расмга олиб жўнатинг, бу хатони тез топишга ёрдам беради."
        }
      ]
    }
  }
};
