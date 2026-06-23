// Excel reestr fayllaridagi rang-belgilash bo'yicha saqlash qoidalari.
// Bu ro'yxat backend/records/services.py dagi RED_FIELDS / MASKED_FIELDS
// bilan bir xil bo'lishi kerak — u yerda o'zgarish bo'lsa, shu faylni ham yangilang.

export const RULE_TONE = {
  RED: { key: "red", label: "Qizil", verdict: "Bazaga yozilmaydi" },
  YELLOW: { key: "yellow", label: "Sariq", verdict: "Shifrlangan holda saqlanadi" },
  WHITE: { key: "white", label: "Oq", verdict: "To'liq saqlanadi" }
};

export const PRIVACY_RULES = {
  mobile: {
    label: "Mobil raqam",
    sourceLabel: "GSM reestr",
    fields: [
      { name: "Стандарт", tone: "RED" },
      { name: "Регион", tone: "WHITE" },
      { name: "Дилер", tone: "WHITE" },
      { name: "Торговая точка", tone: "RED" },
      { name: "Наименование клиента", tone: "YELLOW", example: "SAF*** SAR***" },
      { name: "Тип документа", tone: "RED" },
      { name: "Серия и номер документа", tone: "RED" },
      { name: "Дата рождения", tone: "RED" },
      { name: "Тарифный план", tone: "WHITE" },
      { name: "Номер телефона", tone: "YELLOW", example: "******123" },
      { name: "Номер Sim-карты (ICC)", tone: "RED" },
      { name: "Номер контракта", tone: "RED" },
      { name: "Дата подключения", tone: "WHITE" },
      { name: "ФИО Оператора", tone: "YELLOW", example: "Bah*** Sir***" },
      { name: "Логин оператора", tone: "RED" },
      { name: "Сумма оплат в день подключения", tone: "WHITE" },
      { name: "Статус заявки", tone: "WHITE" },
      { name: "Метод идентификации абонента", tone: "WHITE" }
    ]
  },
  internet: {
    label: "Internet ulanish",
    sourceLabel: "SHPD reestr",
    fields: [
      { name: "Регион", tone: "WHITE" },
      { name: "Дилер", tone: "WHITE" },
      { name: "Торговая точка", tone: "RED" },
      { name: "Наименование клиента", tone: "YELLOW", example: "ABD*** DIL***" },
      { name: "Тип документа", tone: "RED" },
      { name: "Серия и номер документа", tone: "RED" },
      { name: "Дата рождения", tone: "RED" },
      { name: "Тарифный план", tone: "WHITE" },
      { name: "Технология", tone: "RED" },
      { name: "Логин интернет", tone: "YELLOW", example: "***590" },
      { name: "IP-телефон", tone: "RED" },
      { name: "Лицевой счёт", tone: "RED" },
      { name: "Модель модема", tone: "WHITE" },
      { name: "S/N модема", tone: "RED" },
      { name: "Стоимость модема", tone: "WHITE" },
      { name: "Тип передачи", tone: "WHITE" },
      { name: "Дата договора", tone: "WHITE" },
      { name: "ФИО Оператора", tone: "YELLOW", example: "Bah*** Sir***" },
      { name: "Логин оператора", tone: "RED" },
      { name: "Сумма оплат", tone: "WHITE" },
      { name: "Статус заявки", tone: "WHITE" },
      { name: "Текст ошибки", tone: "RED" },
      { name: "№ заявки", tone: "WHITE" },
      { name: "Метод идентификации абонента", tone: "WHITE" }
    ]
  }
};

export function countByTone(fields) {
  return fields.reduce(
    (acc, field) => {
      acc[field.tone] += 1;
      return acc;
    },
    { RED: 0, YELLOW: 0, WHITE: 0 }
  );
}
