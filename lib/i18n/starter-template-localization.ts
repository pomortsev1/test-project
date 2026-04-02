import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

type TranslationSet = Record<Locale, string>;

function normalizeTranslationKey(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function createTranslator(translations: Record<string, TranslationSet>) {
  const aliasMap = new Map<string, string>();

  for (const [key, labels] of Object.entries(translations)) {
    for (const label of Object.values(labels)) {
      aliasMap.set(normalizeTranslationKey(label), key);
    }
  }

  return (value: string, locale: Locale) => {
    const key = aliasMap.get(normalizeTranslationKey(value));

    if (!key) {
      return value;
    }

    return translations[key]?.[locale] ?? translations[key]?.[DEFAULT_LOCALE] ?? value;
  };
}

const STARTER_TEMPLATE_NAME_TRANSLATIONS = {
  "two-hour-trip": {
    en: "2-hour trip",
    es: "Viaje de 2 horas",
    ca: "Viatge de 2 hores",
    ru: "Поездка на 2 часа",
  },
  "one-day-trip": {
    en: "1-day trip essentials",
    es: "Imprescindibles para 1 día",
    ca: "Imprescindibles per a 1 dia",
    ru: "Необходимое на 1 день",
  },
  "one-night-trip": {
    en: "1-night light pack",
    es: "Equipaje ligero para 1 noche",
    ca: "Equipatge lleuger per a 1 nit",
    ru: "Лёгкий набор на 1 ночь",
  },
  "one-week-carry-on": {
    en: "1-week carry-on",
    es: "Equipaje de mano para 1 semana",
    ca: "Equipatge de mà per a 1 setmana",
    ru: "Ручная кладь на 1 неделю",
  },
  "extended-trip-with-baggage": {
    en: "1+ week with baggage",
    es: "Más de 1 semana con equipaje",
    ca: "Més d'1 setmana amb equipatge",
    ru: "Больше недели с багажом",
  },
  "starter-template": {
    en: "Starter Template",
    es: "Plantilla inicial",
    ca: "Plantilla inicial",
    ru: "Стартовый шаблон",
  },
} satisfies Record<string, TranslationSet>;

const SYSTEM_CATEGORY_TRANSLATIONS = {
  documents: {
    en: "Documents",
    es: "Documentos",
    ca: "Documents",
    ru: "Документы",
  },
  tech: {
    en: "Tech",
    es: "Tecnología",
    ca: "Tecnologia",
    ru: "Техника",
  },
  clothes: {
    en: "Clothes",
    es: "Ropa",
    ca: "Roba",
    ru: "Одежда",
  },
  toiletries: {
    en: "Toiletries",
    es: "Aseo",
    ca: "Higiene",
    ru: "Туалетные принадлежности",
  },
  health: {
    en: "Health",
    es: "Salud",
    ca: "Salut",
    ru: "Здоровье",
  },
  misc: {
    en: "Misc",
    es: "Varios",
    ca: "Divers",
    ru: "Разное",
  },
} satisfies Record<string, TranslationSet>;

const STARTER_ITEM_TRANSLATIONS = {
  keys: {
    en: "Keys",
    es: "Llaves",
    ca: "Claus",
    ru: "Ключи",
  },
  wallet: {
    en: "Wallet",
    es: "Cartera",
    ca: "Cartera",
    ru: "Кошелёк",
  },
  "mobile-phone": {
    en: "Mobile phone",
    es: "Móvil",
    ca: "Mòbil",
    ru: "Телефон",
  },
  "water-bottle": {
    en: "Water bottle",
    es: "Botella de agua",
    ca: "Ampolla d'aigua",
    ru: "Бутылка воды",
  },
  "id-card": {
    en: "ID card",
    es: "Documento de identidad",
    ca: "Document d'identitat",
    ru: "Удостоверение личности",
  },
  "phone-charger": {
    en: "Phone charger",
    es: "Cargador del móvil",
    ca: "Carregador del mòbil",
    ru: "Зарядка для телефона",
  },
  medication: {
    en: "Medication",
    es: "Medicación",
    ca: "Medicació",
    ru: "Лекарства",
  },
  sunglasses: {
    en: "Sunglasses",
    es: "Gafas de sol",
    ca: "Ulleres de sol",
    ru: "Солнцезащитные очки",
  },
  "t-shirts": {
    en: "T-shirts",
    es: "Camisetas",
    ca: "Samarretes",
    ru: "Футболки",
  },
  underwear: {
    en: "Underwear",
    es: "Ropa interior",
    ca: "Roba interior",
    ru: "Нижнее белье",
  },
  socks: {
    en: "Socks",
    es: "Calcetines",
    ca: "Mitjons",
    ru: "Носки",
  },
  toothbrush: {
    en: "Toothbrush",
    es: "Cepillo de dientes",
    ca: "Raspall de dents",
    ru: "Зубная щетка",
  },
  toothpaste: {
    en: "Toothpaste",
    es: "Pasta de dientes",
    ca: "Pasta de dents",
    ru: "Зубная паста",
  },
  deodorant: {
    en: "Deodorant",
    es: "Desodorante",
    ca: "Desodorant",
    ru: "Дезодорант",
  },
  pajamas: {
    en: "Pajamas",
    es: "Pijama",
    ca: "Pijama",
    ru: "Пижама",
  },
  passport: {
    en: "Passport",
    es: "Pasaporte",
    ca: "Passaport",
    ru: "Паспорт",
  },
  "power-bank": {
    en: "Power bank",
    es: "Batería externa",
    ca: "Bateria externa",
    ru: "Пауэрбанк",
  },
  trousers: {
    en: "Trousers",
    es: "Pantalones",
    ca: "Pantalons",
    ru: "Брюки",
  },
  shorts: {
    en: "Shorts",
    es: "Pantalones cortos",
    ca: "Pantalons curts",
    ru: "Шорты",
  },
  hoodie: {
    en: "Hoodie",
    es: "Sudadera con capucha",
    ca: "Dessuadora amb caputxa",
    ru: "Худи",
  },
  "lightweight-jacket": {
    en: "Lightweight jacket",
    es: "Chaqueta ligera",
    ca: "Jaqueta lleugera",
    ru: "Легкая куртка",
  },
  "travel-size-shampoo": {
    en: "Travel-size Shampoo",
    es: "Champú tamaño viaje",
    ca: "Xampú mida viatge",
    ru: "Шампунь дорожного формата",
  },
  "laundry-bag": {
    en: "Laundry bag",
    es: "Bolsa para la ropa sucia",
    ca: "Bossa per a la roba bruta",
    ru: "Мешок для грязного белья",
  },
  "boarding-pass": {
    en: "Boarding pass",
    es: "Tarjeta de embarque",
    ca: "Targeta d'embarcament",
    ru: "Посадочный талон",
  },
  laptop: {
    en: "Laptop",
    es: "Portátil",
    ca: "Portàtil",
    ru: "Ноутбук",
  },
  "laptop-charger": {
    en: "Laptop charger",
    es: "Cargador del portátil",
    ca: "Carregador del portàtil",
    ru: "Зарядка для ноутбука",
  },
  "travel-adapter": {
    en: "Travel adapter",
    es: "Adaptador de viaje",
    ca: "Adaptador de viatge",
    ru: "Дорожный адаптер",
  },
  "walking-shoes": {
    en: "Walking shoes",
    es: "Zapatillas para caminar",
    ca: "Sabates per caminar",
    ru: "Обувь для ходьбы",
  },
  sandals: {
    en: "Sandals",
    es: "Sandalias",
    ca: "Sandàlies",
    ru: "Сандалии",
  },
  sunscreen: {
    en: "Sunscreen",
    es: "Protector solar",
    ca: "Protector solar",
    ru: "Солнцезащитный крем",
  },
  "travel-size-body-wash": {
    en: "Travel-size Body wash",
    es: "Gel corporal tamaño viaje",
    ca: "Gel corporal mida viatge",
    ru: "Гель для душа дорожного формата",
  },
} satisfies Record<string, TranslationSet>;

const UNIT_TRANSLATIONS = {
  charger: {
    en: "charger",
    es: "cargador",
    ca: "carregador",
    ru: "зарядка",
  },
  pack: {
    en: "pack",
    es: "paquete",
    ca: "paquet",
    ru: "упаковка",
  },
  "t-shirt": {
    en: "t-shirt",
    es: "camiseta",
    ca: "samarreta",
    ru: "футболка",
  },
  "t-shirts": {
    en: "t-shirts",
    es: "camisetas",
    ca: "samarretes",
    ru: "футболки",
  },
  pair: {
    en: "pair",
    es: "par",
    ca: "parell",
    ru: "пара",
  },
  pairs: {
    en: "pairs",
    es: "pares",
    ca: "parells",
    ru: "пар",
  },
  set: {
    en: "set",
    es: "conjunto",
    ca: "conjunt",
    ru: "комплект",
  },
  hoodie: {
    en: "hoodie",
    es: "sudadera",
    ca: "dessuadora",
    ru: "худи",
  },
  jacket: {
    en: "jacket",
    es: "chaqueta",
    ca: "jaqueta",
    ru: "куртка",
  },
  tube: {
    en: "tube",
    es: "tubo",
    ca: "tub",
    ru: "тюбик",
  },
  bottle: {
    en: "bottle",
    es: "botella",
    ca: "ampolla",
    ru: "флакон",
  },
  adapter: {
    en: "adapter",
    es: "adaptador",
    ca: "adaptador",
    ru: "адаптер",
  },
} satisfies Record<string, TranslationSet>;

const translateTemplateName = createTranslator(STARTER_TEMPLATE_NAME_TRANSLATIONS);
const translateCategoryName = createTranslator(SYSTEM_CATEGORY_TRANSLATIONS);
const translateItemName = createTranslator(STARTER_ITEM_TRANSLATIONS);
const translateUnit = createTranslator(UNIT_TRANSLATIONS);

export function localizeStarterTemplateName(value: string, locale: Locale) {
  return translateTemplateName(value, locale);
}

export function localizeSystemCategoryName(value: string, locale: Locale) {
  return translateCategoryName(value, locale);
}

export function localizeStarterItemName(value: string, locale: Locale) {
  return translateItemName(value, locale);
}

export function localizeMeasurementUnit(value: string, locale: Locale) {
  return translateUnit(value, locale);
}
