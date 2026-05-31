import { CONFIG } from './config.js';

export function initCountdown() {
    const targetTime = new Date(CONFIG.TARGET_DATE).getTime();

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
            renderZeros();
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

    function renderZeros() {
        Object.values(elements).forEach(el => el.textContent = '00');
    }

    const timerInterval = setInterval(updateCounter, 1000);
    updateCounter(); // Esecuzione immediata al caricamento
}