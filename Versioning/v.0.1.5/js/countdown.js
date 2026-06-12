import { CONFIG } from './config.js';
import { initDateManager, updateSurpriseBanner } from './date-manager.js';

export function initCountdown() {
    const targetTime = CONFIG.WEDDING_DATE.getTime();
    
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
            
            // Mettiamo a zero i contatori
            Object.values(elements).forEach(el => {
                if(el) el.textContent = '00';
            });
            
            // Quando scatta l'ora X, chiediamo al date-manager di aggiornare i box
            initDateManager(); 
            updateSurpriseBanner(); 
            return;
        }

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        if(elements.days) elements.days.textContent = d.toString().padStart(2, '0');
        if(elements.hours) elements.hours.textContent = h.toString().padStart(2, '0');
        if(elements.minutes) elements.minutes.textContent = m.toString().padStart(2, '0');
        if(elements.seconds) elements.seconds.textContent = s.toString().padStart(2, '0');
    }

    // Avvio timer
    const timerInterval = setInterval(updateCounter, 1000);
    updateCounter();
}