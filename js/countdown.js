import { CONFIG } from './config.js';

// Funzione che gestisce lo scambio dei banner
export function toggleSurpriseBanner() {
    const now = new Date().getTime();
    const banner = document.getElementById('surprise-banner');
    const waitingSurpriseMsgPreWedd = document.getElementById('pre-wed-surprise-message');
    const waitingSurpriseMsgEarlyWedd = document.getElementById('early-wed-surprise-message');
    const surpriseBtn = document.getElementById('surprise-button-container');
    
    if (!banner) return;

    // Nascondi tutto inizialmente
    [waitingSurpriseMsgPreWedd, waitingSurpriseMsgEarlyWedd, surpriseBtn].forEach(el => el?.classList.add('hidden-field'));

    // Logica di visualizzazione
    if (now < CONFIG.EARLY_SURPRISE_START) {
        waitingSurpriseMsgPreWedd?.classList.remove('hidden-field');
    } else if (now >= CONFIG.EARLY_SURPRISE_START && now < CONFIG.EARLY_SURPRISE_END) {
        waitingSurpriseMsgEarlyWedd?.classList.remove('hidden-field');
    } else {
        surpriseBtn?.classList.remove('hidden-field');
    }

/*
    if (now >= CONFIG.EARLY_SURPRISE_START && now < CONFIG.EARLY_SURPRISE_END) {
        waitingSurpriseMsgEarlyWedd?.classList.remove('hidden-field');
    } else if (now >= CONFIG.EARLY_SURPRISE_END) {
        surpriseBtn?.classList.remove('hidden-field');
    } else {
        waitingSurpriseMsgPreWedd?.classList.remove('hidden-field');
    }
 */   
    banner.style.display = 'block';
}

export function initCountdown() {
    const targetTime = new Date(CONFIG.WEDDING_DATE).getTime();
    const now = new Date().getTime();
    const banner = document.getElementById('surprise-banner');

    // 1. Controllo immediato: Se il matrimonio è già passato o è oggi
    if (now >= targetTime) {
        toggleSurpriseBanner();
    } else {
        // Se siamo PRIMA della data, mostriamo il box ma teniamo il bottone nascosto
        if (banner) banner.style.display = 'block';
    }

    const elements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };

    function updateCounter() {
        const now = new Date().getTime();
        const difference = targetTime - now;

        if (difference <= 0) {
            clearInterval(timerInterval);
            // Assicuriamoci che i contatori siano a zero
            renderZeros(); 
            // Inneschiamo il cambio banner anche se l'utente è sulla pagina quando scatta la mezzanotte
            toggleSurpriseBanner(); 
            return;
        }

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        elements.days.textContent = d.toString().padStart(2, '0');
        elements.hours.textContent = h.toString().padStart(2, '0');
        elements.minutes.textContent = m.toString().padStart(2, '0');
        elements.seconds.textContent = s.toString().padStart(2, '0');
    }

    // Avvio timer
    const timerInterval = setInterval(updateCounter, 1000);
    updateCounter();
}