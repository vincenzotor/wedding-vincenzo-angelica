import { initCountdown } from './countdown.js';
import { toggleSurpriseBanner } from './countdown.js';
import { initUiInteractions } from './ui.js';
import { initRsvpForm } from './rsvp-form.js';

window.addEventListener('DOMContentLoaded', () => {
    initUiInteractions();
    initRsvpForm();
    // Avvia i moduli dell'applicazione in modo isolato
    initCountdown();
    //toggleSurpriseBanner(); //temporanea, per mostrare il bottone per caricare le foto prima del 12/08/2026
});