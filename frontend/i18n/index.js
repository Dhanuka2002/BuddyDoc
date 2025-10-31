import * as Localization from 'expo-localization';
import I18n from 'i18n-js';
import en from './en';
import si from './si';
import ta from './ta';

I18n.fallbacks = true;
I18n.translations = { en, si, ta };

export const t = (key) => I18n.t(key);
export const locale = Localization.locale;

export default I18n;
