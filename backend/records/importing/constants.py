from records.models import UploadBatch


HEADER_ALIASES = {
    "standard": ["стандарт"],
    "region": ["регион"],
    "dealer": ["дилер"],
    "trade_point": ["торговая точка"],
    "client_name": ["наименование клиента"],
    "document_type": ["тип документа"],
    "document_number": ["серия и номер документа"],
    "birth_date": ["дата рождения"],
    "tariff_plan": ["тарифный план"],
    "phone_number": ["номер телефона"],
    "sim_card_number": ["номер sim-карты (icc)", "номер sim-карты"],
    "contract_number": ["номер контракта"],
    "connection_date": ["дата подключения"],
    "operator_full_name": ["фио оператора"],
    "operator_login": ["логин оператора", "логин"],
    "payment_amount": ["сумма оплат в день подключения", "сумма оплат"],
    "status": ["статус заявки"],
    "identification_method": ["метод идентификации абонента"],
    "technology": ["технология"],
    "internet_login": ["логин интернет"],
    "ip_phone": ["ip-телефрон", "ip-телефон"],
    "account_number": ["лицевой счёт", "лицевой счет"],
    "modem_model": ["модель модема"],
    "modem_serial": ["s/n модема"],
    "modem_cost": ["стоимость модема"],
    "transfer_type": ["тип передачи"],
    "contract_date": ["дата договора"],
    "error_text": ["текст ошибки"],
    "request_number": ["№ заявки", "номер заявки"],
}

DATETIME_FIELDS = {"connection_date", "contract_date"}
DATE_FIELDS = {"birth_date"}
DECIMAL_FIELDS = {"payment_amount", "modem_cost"}
MASKED_FIELDS = {
    UploadBatch.SourceType.MOBILE: {"client_name", "phone_number", "operator_full_name"},
    UploadBatch.SourceType.INTERNET: {"client_name", "internet_login", "operator_full_name"},
}
PART_MASK_FIELDS = {"client_name"}
SUFFIX_DIGIT_MASK_FIELDS = {"phone_number", "internet_login"}
RED_FIELDS = {
    UploadBatch.SourceType.MOBILE: {
        "standard",
        "trade_point",
        "document_type",
        "document_number",
        "birth_date",
        "sim_card_number",
        "contract_number",
        "operator_login",
    },
    UploadBatch.SourceType.INTERNET: {
        "trade_point",
        "document_type",
        "document_number",
        "birth_date",
        "technology",
        "ip_phone",
        "account_number",
        "modem_serial",
        "operator_login",
        "error_text",
    },
}
MAX_IMPORT_ERRORS = 100
