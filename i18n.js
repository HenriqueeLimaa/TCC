import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import enUS from './locales/en_US.json';
import ptBR from './locales/pt_BR.json';

const resources = {
  en: { translation: enUS },
  pt: { translation: ptBR },
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    const locales = Localization.getLocales();
    const languageTag = locales && locales[0] ? locales[0].languageTag : 'en';
    callback(languageTag);
    // if you want to force other language to appear, use this:
    // callback('pt');
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
