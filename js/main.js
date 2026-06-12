import { initDateManager, updateSurpriseBanner } from './date-manager.js';
import { initCountdown } from './countdown.js';
import { initUiInteractions } from './ui.js';
import { initRsvpForm } from './rsvp-form.js';

document.fonts.ready.then(function () {
    document.body.classList.add('fonts-loaded');
});

window.addEventListener('DOMContentLoaded', () => {
    initUiInteractions();
    
    // 1. Prima accendiamo le logiche temporali (calendario e banner)
    initDateManager();
    updateSurpriseBanner(); 
    
    // 2. Poi avviamo il timer puro
    initCountdown();
    
    initRsvpForm();
});