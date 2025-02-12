"use strict";
async function loadPageLanguageSelect() {
    const languageInformation = await fetchLanguageData("./assets/translations/lang.json");
    let currentLanguage = languageInformation?.languages[ACTIVE_LANGUAGE];
    console.log(currentLanguage);
    if (!currentLanguage)
        return;
    const found = ACTIVE_USED_LANGUAGES.find((isoID) => isoID === currentLanguage.id);
    if (found === undefined) {
        console.error("Selected Language is not an Active Language!");
        ACTIVE_LANGUAGE = DEFAULT_LANGUAGE;
        currentLanguage.id = ACTIVE_LANGUAGE;
    }
    const currentSelected = `
        <div class="custom-select-trigger">
            <img src="${currentLanguage.flagSrc}" alt="${currentLanguage.flagAlt}">
            <span>${PAGE_TRANSLATION_SETTINGS.displayInNative ?
        currentLanguage.languageName :
        currentLanguage.languageNameEN}
            </span>
        </div>
    `;
    let otherSelections = ``;
    for (let lang in languageInformation?.languages) {
        if (!ACTIVE_USED_LANGUAGES.includes(lang)) {
            continue;
        }
        const nextLanguage = languageInformation.languages[lang];
        otherSelections += `
            <div class="custom-option" data-value="${nextLanguage.id}" data-flag="${nextLanguage.flagSrc}">
                <img src="${nextLanguage.flagSrc}" alt="${nextLanguage.flagAlt}"> 
                ${PAGE_TRANSLATION_SETTINGS.displayInNative ?
            nextLanguage.languageName :
            nextLanguage.languageNameEN}
            </div>
        `;
        console.log(lang, nextLanguage);
    }
    document.getElementById('select-container').innerHTML = `
    <div class="custom-select" id="country-select">
                ${currentSelected}
                <div class="custom-options">     
                    ${otherSelections}
                </div>
            </div>
            `;
}
function changeLanguageOnPage() {
    if (languageSettings.reloadPageOnLanguageChange) {
        window.location.reload();
    }
    languageSettings.currentLanguageID = getLanguagePreference();
    const inputedLanguages = [...languageSettings.inputedLanguageStrings];
    languageSettings.inputedLanguageStrings = [];
    inputedLanguages.forEach(element => {
        runLanguageScript(element.textInput, element.strict, element.strictDefault);
    });
}
function setLanguagePreference(languageID) {
    if (Object.values(ACTIVE_USED_LANGUAGES).includes(languageID)) {
        ACTIVE_LANGUAGE = languageID;
        translatePage();
        localStorage.setItem('languageID', String(languageID));
    }
    else {
        console.error('Invalid languageID:', languageID);
    }
}
function getLanguagePreference() {
    const languageID = localStorage.getItem('languageID');
    if (!languageID)
        return;
    ACTIVE_LANGUAGE = languageID;
    translatePage();
    return Object.values(ACTIVE_USED_LANGUAGES).includes(languageID) ? languageID : DEFAULT_LANGUAGE;
}
function onLoad() {
    const selectTrigger = document.querySelector('.custom-select-trigger');
    const optionsContainer = document.querySelector('.custom-options');
    const optionsList = document.querySelectorAll('.custom-option');
    console.log(selectTrigger, optionsContainer, optionsList)
    if (selectTrigger && optionsContainer && optionsList) {
        selectTrigger.addEventListener('click', function () {
            optionsContainer.style.display = optionsContainer.style.display === 'block' ? 'none' : 'block';
        });
        optionsList.forEach(option => {
            option.addEventListener('click', function () {
                const value = option.getAttribute('data-value');
                if (value)
                    setLanguagePreference(value);
                const flagUrl = option.getAttribute('data-flag');
                const language = option.textContent?.trim();
                if (flagUrl && language) {
                    selectTrigger.innerHTML = `<img src="${flagUrl}" alt="${language} Flag"> <span>${language}</span>`;
                }
                optionsContainer.style.display = 'none';
            });
        });
        document.addEventListener('click', function (event) {
            if (!event.target.closest('.custom-select')) {
                optionsContainer.style.display = 'none';
            }
        });
    }
}
getLanguagePreference();
loadPageLanguageSelect();
