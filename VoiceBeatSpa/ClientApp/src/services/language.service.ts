export class LanguageService  {
    public currentLanguageCode: string='hu';
    private static _instance: LanguageService;

    instance() {
        if (!LanguageService._instance) {
            LanguageService._instance = new LanguageService();
        }
        return LanguageService._instance;
    }

    setCurrentLanguage(langCode:string) {
        this.currentLanguageCode = langCode; 
        localStorage.setItem('currentLanguage',langCode);
    }
}