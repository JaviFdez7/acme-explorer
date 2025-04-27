import { registerLocaleData } from "@angular/common";
import { APP_INITIALIZER, Injectable, LOCALE_ID } from "@angular/core";
import { loadTranslations } from "@angular/localize";

@Injectable({
    providedIn: 'root'
})

class I18n {
    locale = 'en';

    async setLocale() {
        const isLocalStorageAvailable = typeof localStorage !== 'undefined';

        const userLocale = isLocalStorageAvailable ? localStorage.getItem('locale') : null;

        if (userLocale) {
            this.locale = userLocale;
        }

        const localeModule = await import(`../../node_modules/@angular/common/locales/${this.locale}.mjs`);

        //console.log('Locale module:', localeModule.default);

        registerLocaleData(localeModule.default);

        const localeTranslationsModule = await import(`../assets/i18n/messages.${this.locale}.json`);

        //console.log('Translations module:', localeTranslationsModule.default.translations);

        loadTranslations(localeTranslationsModule.default.translations);
    }
}

function setLocale() {
    return {
        provide: APP_INITIALIZER,
        useFactory: (i18n: I18n) => () => i18n.setLocale(),
        deps: [I18n],
        multi: true
    }
}

function setLocaleId() {
    return {
        provide: LOCALE_ID,
        useFactory: (i18n: I18n) => i18n.locale,
        deps: [I18n]
    }
}

export const I18nModule = {
    setLocale,
    setLocaleId
};
