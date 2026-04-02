export enum AppState {
  LOCKED = 'LOCKED',
  LANDING = 'LANDING',
  UNLOCKED = 'UNLOCKED'
}

export enum Language {
  EN = 'EN',
  CZ = 'CZ',
  SK = 'SK'
}

export interface Translations {
  title: string;
  uploadTitle: string;
  uploadDesc: string;
  onePersonWarning: string;
  browse: string;
  dragDrop: string;
  generate: string;
  generating: string;
  download: string;
  about: string;
  phone: string;
  aboutContent: string;
  useCamera: string;
  capture: string;
  cancel: string;
  selectStyle: string;
  styleClassic: string;
  styleCasual: string;
  styleCreative: string;
  styleOutdoor: string;
  styleExecutive: string;
  styleMinimalist: string;
}

export const DICTIONARY: Record<Language, Translations> = {
  [Language.EN]: {
    title: "Profile Photo Generator",
    uploadTitle: "Upload Photo",
    uploadDesc: "Upload a selfie or headshot. The AI will transform it into a professional Stanton Chase profile photo.",
    onePersonWarning: "IMPORTANT: The photo must contain ONLY ONE person.",
    browse: "Browse",
    dragDrop: "or drag and drop file here",
    generate: "Generate Profile Photo",
    generating: "Processing...",
    download: "Download Photo",
    about: "About Stanton Chase",
    phone: "Phone",
    aboutContent: "Stanton Chase is one of the leading global retained executive search firms, with over 75 offices in 45+ countries. We specialize in finding exceptional leaders for our clients worldwide.",
    useCamera: "Use Camera",
    capture: "Capture Photo",
    cancel: "Cancel",
    selectStyle: "Choose Style",
    styleClassic: "Classic Corporate",
    styleCasual: "Business Casual",
    styleCreative: "Creative Professional",
    styleOutdoor: "Outdoor Portrait",
    styleExecutive: "Executive Premium",
    styleMinimalist: "Minimalist Clean",
  },
  [Language.CZ]: {
    title: "Generátor Profilové Fotografie",
    uploadTitle: "Nahrát fotografii",
    uploadDesc: "Nahrajte selfie nebo portrét. AI ji přemění na profesionální profilovou fotku Stanton Chase.",
    onePersonWarning: "DŮLEŽITÉ: Na fotce musí být POUZE JEDNA osoba.",
    browse: "Procházet",
    dragDrop: "nebo přetáhněte soubor sem",
    generate: "Generovat fotku",
    generating: "Zpracovávám...",
    download: "Stáhnout fotku",
    about: "O nás",
    phone: "Telefon",
    aboutContent: "Stanton Chase je jedna z předních celosvětových firem pro vyhledávání vedoucích pracovníků, s více než 75 kancelářemi ve 45+ zemích. Specializujeme se na hledání výjimečných lídrů pro naše klienty po celém světě.",
    useCamera: "Použít fotoaparát",
    capture: "Vyfotit",
    cancel: "Zrušit",
    selectStyle: "Vyberte styl",
    styleClassic: "Klasický firemní",
    styleCasual: "Business Casual",
    styleCreative: "Kreativní profesionální",
    styleOutdoor: "Venkovní portrét",
    styleExecutive: "Exekutivní premium",
    styleMinimalist: "Minimalistický čistý",
  },
  [Language.SK]: {
    title: "Generátor Profilovej Fotografie",
    uploadTitle: "Nahrať fotografiu",
    uploadDesc: "Nahrajte selfie alebo portrét. AI ju premení na profesionálnu profilovú fotku Stanton Chase.",
    onePersonWarning: "DÔLEŽITÉ: Na fotke musí byť IBA JEDNA osoba.",
    browse: "Prechádzať",
    dragDrop: "alebo presuňte súbor sem",
    generate: "Generovať fotku",
    generating: "Spracovávam...",
    download: "Stiahnuť fotku",
    about: "O nás",
    phone: "Telefón",
    aboutContent: "Stanton Chase je jedna z popredných celosvetových firiem pre vyhľadávanie vedúcich pracovníkov, s viac ako 75 kanceláriami v 45+ krajinách. Špecializujeme sa na hľadanie výnimočných lídrov pre našich klientov po celom svete.",
    useCamera: "Použiť fotoaparát",
    capture: "Odfotiť",
    cancel: "Zrušiť",
    selectStyle: "Vyberte štýl",
    styleClassic: "Klasický firemný",
    styleCasual: "Business Casual",
    styleCreative: "Kreatívny profesionálny",
    styleOutdoor: "Vonkajší portrét",
    styleExecutive: "Exekutívny prémiový",
    styleMinimalist: "Minimalistický čistý",
  }
};