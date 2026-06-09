import { CONFIG } from './config.js';

export function initDateManager() {
    const now = new Date();
    
    // Definiamo le soglie - si trovano nel file config.js
    // const weddingDay = new Date('2026-08-12T00:00:00');
    // const thankYouDay = new Date('2026-08-13T07:00:00');

    // Recuperiamo gli elementi (che ora sono nascosti di default dal CSS)
    const timeline = document.getElementById('box-countdown-timer');
    const wedding = document.getElementById('box-wedding-day');
    const thanks = document.getElementById('box-thank-you');

    // Applichiamo la logica
    if (now < CONFIG.WEDDING_DATE) {
        if (timeline) timeline.classList.remove('hidden-section');
    } else if (now >= CONFIG.WEDDING_DATE && now < CONFIG.THANK_YOU_DATE) {
        if (wedding) wedding.classList.remove('hidden-section');
    } else {
        if (thanks) thanks.classList.remove('hidden-section');
    }
}