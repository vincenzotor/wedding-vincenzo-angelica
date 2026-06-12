import { CONFIG } from './config.js';

// 1. Gestisce i box grandi (Timer, Wedding, Thanks)
export function initDateManager() {
    const now = new Date().getTime();
    
    const timeline = document.getElementById('box-countdown-timer');
    const wedding = document.getElementById('box-wedding-day');
    const thanks = document.getElementById('box-thank-you');

    // Assicuriamoci di non lavorare su elementi nulli e li nascondiamo di base
    [timeline, wedding, thanks].forEach(el => el?.classList.add('hidden-section'));

    if (now < CONFIG.WEDDING_DATE) {
        if (timeline) timeline.classList.remove('hidden-section');
    } else if (now >= CONFIG.WEDDING_DATE && now < CONFIG.THANK_YOU_DATE) {
        if (wedding) wedding.classList.remove('hidden-section');
    } else {
        if (thanks) thanks.classList.remove('hidden-section');
    }
}

// 2. Gestisce i tre stati del Surprise Banner
export function updateSurpriseBanner() {
    const now = new Date().getTime();
    const banner = document.getElementById('surprise-banner');
    const msgPre = document.getElementById('pre-wed-surprise-message');
    const msgEarly = document.getElementById('early-wed-surprise-message');
    const btnContainer = document.getElementById('surprise-button-container');
    
    if (!banner) return;

    //Nascondi il banner quando la sorpresa è terminata
    if (now >= CONFIG.SURPRISE_OVER) {
        banner.style.display = 'none';
        return; 
    }

    // Nascondi tutti i testi del banner inizialmente
    [msgPre, msgEarly, btnContainer].forEach(el => el?.classList.add('hidden-field'));

    const start = CONFIG.EARLY_SURPRISE_START;
    const end = CONFIG.EARLY_SURPRISE_END;

    // Logica di visualizzazione basata sulle fasce orarie
    if (now < start) {
        msgPre?.classList.remove('hidden-field');
    } else if (now >= start && now < end) {
        msgEarly?.classList.remove('hidden-field');
    } else {
        btnContainer?.classList.remove('hidden-field');
    }
    
    banner.style.display = 'block';
}