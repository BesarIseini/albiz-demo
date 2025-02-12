"use strict";
const languages = document.querySelectorAll('[translation]');
let ACTIVE_LANGUAGE = 'al';
const ACTIVE_USED_LANGUAGES = ['en', 'al', 'mk', 'de', 'fr'];
const DEFAULT_LANGUAGE = 'en';
const PAGE_TRANSLATION_SETTINGS = {
    includeAll: false,
    displayInNative: true
};
const languageCache = {};
async function parseJSON(responseText) {
    try {
        return JSON.parse(responseText);
    }
    catch (error) {
        console.error("Failed to parse JSON", error, responseText);
        return null;
    }
}
async function fetchLanguageData(url) {
    if (languageCache[url]) {
        return languageCache[url];
    }
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parsedData = await parseJSON(text);
        languageCache[url] = parsedData;
        return parsedData;
    }
    catch (error) {
        console.error(`Failed to load language file: ${url}`, error);
        return null;
    }
}
async function translatePage() {
    const defaultLanguage = await fetchLanguageData('./assets/translations/en.json');
    let activeLanguage = await fetchLanguageData(`./assets/translations/${ACTIVE_LANGUAGE.toLowerCase()}.json`);
    if (!activeLanguage) {
        activeLanguage = defaultLanguage;
    }
    const translations = activeLanguage?.translation ?? {};
    const fragment = document.createDocumentFragment();
    languages.forEach(element => {
        const property = element.getAttribute('translation');
        const propertyType = element.getAttribute('translationType');
        if (!(property && translations[property]))
            return;
        console.log(propertyType);
        if (!propertyType) {
            element.textContent = translations[property];
        }
        else if (propertyType === "placeholder") {
            element.placeholder = translations[property];
        }
        frameElement?.appendChild(element.cloneNode(true));
    });
    document.body.appendChild(fragment);
}
