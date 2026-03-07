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
    uploadDesc: "Upload a selfie or headshot. The AI will transform it into a professional CBRE profile photo.",
    onePersonWarning: "IMPORTANT: The photo must contain ONLY ONE person.",
    browse: "Browse",
    dragDrop: "or drag and drop file here",
    generate: "Generate Profile Photo",
    generating: "Processing...",
    download: "Download Photo",
    about: "About CBRE",
    phone: "Phone",
    aboutContent: "With more than 140,000 professionals in more than 100 countries, CBRE is the global leader in commercial real estate services and investment.",
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
    uploadDesc: "Nahrajte selfie nebo portrét. AI ji přemění na profesionální profilovou fotku CBRE.",
    onePersonWarning: "DŮLEŽITÉ: Na fotce musí být POUZE JEDNA osoba.",
    browse: "Procházet",
    dragDrop: "nebo přetáhněte soubor sem",
    generate: "Generovat fotku",
    generating: "Zpracovávám...",
    download: "Stáhnout fotku",
    about: "O nás",
    phone: "Telefon",
    aboutContent: "S více než 140 000 profesionály ve více než 100 zemích je CBRE globálním lídrem v oblasti služeb komerčních nemovitostí a investic.",
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
    uploadDesc: "Nahrajte selfie alebo portrét. AI ju premení na profesionálnu profilovú fotku CBRE.",
    onePersonWarning: "DÔLEŽITÉ: Na fotke musí byť IBA JEDNA osoba.",
    browse: "Prechádzať",
    dragDrop: "alebo presuňte súbor sem",
    generate: "Generovať fotku",
    generating: "Spracovávam...",
    download: "Stiahnuť fotku",
    about: "O nás",
    phone: "Telefón",
    aboutContent: "S viac ako 140 000 odborníkmi vo viac ako 100 krajinách je CBRE globálnym lídrom v oblasti služieb komerčných nehnuteľností a investícií.",
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