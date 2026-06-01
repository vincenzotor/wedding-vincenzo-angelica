import { initCountdown } from './countdown.js';
import { initUiInteractions } from './ui.js';
import { initRsvpForm } from './rsvp-form.js';

window.addEventListener('DOMContentLoaded', () => {
    // Avvia i moduli dell'applicazione in modo isolato
    initCountdown();
    initUiInteractions();
    initRsvpForm();
});