import { initDateManager } from './date-manager.js';
import { initCountdown } from './countdown.js';
import { toggleSurpriseBanner } from './countdown.js';
import { initUiInteractions } from './ui.js';
import { initRsvpForm } from './rsvp-form.js';

document.fonts.ready.then(function () {
    document.body.classList.add('fonts-loaded');
});

window.addEventListener('DOMContentLoaded', () => {
    initUiInteractions();
    initDateManager();
    initRsvpForm();
    toggleSurpriseBanner(); //gestisce il surprise-banner
    // Avvia i moduli dell'applicazione in modo isolato
    initCountdown();
});