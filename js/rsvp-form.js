import { CONFIG } from './config.js';
import { sanitizeString } from './utils.js';
import db from './firebase-config.js'; 
import { collection, addDoc, query, where, orderBy, limit, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

export function initRsvpForm() {
    const form = document.getElementById('wedding-rsvp-form');
    if (!form) return;

    // Elementi Input del Modulo
    const guestNameInput = document.getElementById('guest-name');
    const acceptConditionsCheckbox = document.getElementById('accetto-condizioni');
    const attendanceRadios = document.getElementsByName('attendance');
    
    // Contatori Numerici Principali
    const adultsInput = document.getElementById('guests-adults');
    const kidsInput = document.getElementById('guests-kids');
    
    // Contatori Preferenze Menu (Campi nascosti gestiti in background)
    const fishInput = document.getElementById('menu-fish');
    const meatInput = document.getElementById('menu-meat');

    // Elementi Grafici d'Errore Custom
    const errorName = document.getElementById('error-guest-name');
    const errorConditions = document.getElementById('error-accetto-condizioni');
    const groupConditions = document.getElementById('group-accetto-condizioni');

    // Pulsante temporaneo di test per l'errore
    const btnTestError = document.getElementById('btn-test-rsvp-error');

    /**
     * Funzione per troncare i testi troppo lunghi inserendo solo i tre puntini sospensivi
     */
    function truncateTextForAlert(text, maxLength = 80) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        }
        return text;
    }

    /**
     * Funzione di utility per aggiornare lo stato (attivo/disattivato) dei pulsanti dei contatori
     */
    function updateCounterButtons(containerSelector, currentVal, min, max) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        const minusBtn = container.querySelector('.counter-btn:first-child');
        const plusBtn = container.querySelector('.counter-btn:last-child');
        
        if (minusBtn) minusBtn.disabled = (currentVal <= min);
        if (plusBtn) plusBtn.disabled = (currentVal >= max);
    }

    /**
     * Sincronizza silenziosamente i contatori delle preferenze del menu in background
     */
    function syncMenuPreferences() {
        const totalAdults = parseInt(adultsInput.value, 10);
        
        // Mantieni la logica coerente in background senza mostrare o animare nulla a schermo
        if (fishInput && meatInput) {
            fishInput.value = totalAdults;
            meatInput.value = 0;
        }
    }

    /**
     * Gestore logico per l'incremento e decremento dei contatori principali (Adulti e Bambini)
     */
    function setupCounter(minusBtnId, plusBtnId, inputId, containerSelector, min, max, onChangeCallback = null) {
        const minusBtn = document.getElementById(minusBtnId);
        const plusBtn = document.getElementById(plusBtnId);
        const input = document.getElementById(inputId);

        if (!minusBtn || !plusBtn || !input) return;

        // Inizializzazione bottoni al caricamento pagina
        updateCounterButtons(containerSelector, parseInt(input.value, 10), min, max);

        minusBtn.addEventListener('click', () => {
            let val = parseInt(input.value, 10);
            if (val > min) {
                val--;
                input.value = val;
                updateCounterButtons(containerSelector, val, min, max);
                if (onChangeCallback) onChangeCallback();
            }
        });

        plusBtn.addEventListener('click', () => {
            let val = parseInt(input.value, 10);
            if (val < max) {
                val++;
                input.value = val;
                updateCounterButtons(containerSelector, val, min, max);
                if (onChangeCallback) onChangeCallback();
            }
        });
    }

    // Collegamento logico Contatori Principali Ospiti (Adulti / Bambini)
    setupCounter('btn-adults-minus', 'btn-adults-plus', 'guests-adults', '#box-container-adults', CONFIG.LIMITS.MIN_ADULTS, CONFIG.LIMITS.MAX_ADULTS, syncMenuPreferences);
    setupCounter('btn-kids-minus', 'btn-kids-plus', 'guests-kids', '.counter-wrapper:last-child .counter-container', CONFIG.LIMITS.MIN_KIDS, CONFIG.LIMITS.MAX_KIDS);

    // Sincronizzazione iniziale silenziosa
    syncMenuPreferences();

    /**
     * Gestisce la visibilità dinamica dei campi del modulo in base alla scelta di presenza dell'ospite
     */
    function handleAttendanceChange() {
        const selectedAttendance = Array.from(attendanceRadios).find(radio => radio.checked)?.value;
        const guestsNumbersGroup = document.getElementById('guests-numbers-group');
        const dietaryGroup = document.getElementById('dietary-group');

        if (selectedAttendance === 'si') {
            if (guestsNumbersGroup) guestsNumbersGroup.classList.remove('hidden-field');
            if (dietaryGroup) dietaryGroup.classList.remove('hidden-field');
        } else {
            if (guestsNumbersGroup) guestsNumbersGroup.classList.add('hidden-field');
            if (dietaryGroup) dietaryGroup.classList.add('hidden-field');
        }
    }

    // Ascolto del cambio di selezione sui Radio Button della presenza
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', handleAttendanceChange);
    });

    // Reset dinamico degli errori grafici quando l'utente compila i campi
    guestNameInput.addEventListener('input', () => {
        if (guestNameInput.value.trim() !== "") {
            guestNameInput.classList.remove('input-error');
            errorName.style.display = 'none';
        }
    });

    acceptConditionsCheckbox.addEventListener('change', () => {
        if (acceptConditionsCheckbox.checked) {
            groupConditions.classList.remove('checkbox-error');
            errorConditions.style.display = 'none';
        }
    });

    /**
     * VALIDAZIONE E INVIO FORM
     */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Controllo Honeypot Antispam
        const honeypot = document.getElementById('user-email-address');
        if (honeypot && honeypot.value !== "") {
            console.warn("Spam block attivo.");
            return; 
        }

        let isFormValid = true;
        let firstErrorElement = null;

        // 1. Validazione campo Nome e Cognome
        if (guestNameInput.value.trim() === "") {
            guestNameInput.classList.add('input-error');
            errorName.style.display = 'block';
            isFormValid = false;
            if (!firstErrorElement) firstErrorElement = guestNameInput;
        } else {
            guestNameInput.classList.remove('input-error');
            errorName.style.display = 'none';
        }

        // 2. Validazione Checkbox Trattamento Dati Privacy
        if (!acceptConditionsCheckbox.checked) {
            groupConditions.classList.add('checkbox-error');
            errorConditions.style.display = 'block';
            isFormValid = false;
            if (!firstErrorElement) firstErrorElement = groupConditions;
        } else {
            groupConditions.classList.remove('checkbox-error');
            errorConditions.style.display = 'none';
        }

        // Se ci sono errori, blocca l'invio e porta l'utente sul primo campo errato
        if (!isFormValid) {
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        try {
            const attendance = Array.from(attendanceRadios).find(radio => radio.checked)?.value;
            const rawName = guestNameInput.value.trim();
            const sanitizedName = sanitizeString(rawName).toUpperCase();

            // Forza i valori a 0 se l'attendance è 'no'
            const numAdulti = (attendance === 'no') ? "0" : adultsInput.value;
            const numBambini = (attendance === 'no') ? "0" : kidsInput.value;

            const rawDietary = document.getElementById('dietary-restrictions').value.trim();
            const dietarySanitized = rawDietary !== "" ? sanitizeString(rawDietary) : "Nessuna";
            const dietaryForAlert = truncateTextForAlert(dietarySanitized, 80);

            const rawNotes = document.getElementById('notes').value.trim();
            const notesSanitized = rawNotes !== "" ? sanitizeString(rawNotes) : "";
            const notesForAlert = truncateTextForAlert(notesSanitized, 80);

            // --- LOGICA SEQUENZA (ID LEGGIBILE) ---
            const q = query(
                collection(db, "rsvp"), 
                where("nome", "==", sanitizedName), 
                orderBy("dataInvio", "desc"), 
                limit(1)
            );
            const querySnapshot = await getDocs(q);

            let prossimoNumero = 1;
            if (!querySnapshot.empty) {
                const ultimoDoc = querySnapshot.docs[0].data();
                if (ultimoDoc.sequenza) {
                    prossimoNumero = ultimoDoc.sequenza + 1;
                }
            }

            const idNominativo = `${sanitizedName}_${prossimoNumero}`;

            // --- SALVATAGGIO SU FIREBASE ---
            const docRef = doc(db, "rsvp", idNominativo);
            await setDoc(docRef, {
                nome: sanitizedName,
                sequenza: prossimoNumero,
                id_nominativo: idNominativo,
                presenza: attendance,
                adulti: numAdulti,
                bambini: numBambini,
                intolleranze: dietarySanitized,
                note: notesSanitized,
                dataInvio: new Date()
            });

            // --- MESSAGGI ALERT ORIGINALI ---
            let alertMessage = "";

            if (attendance === 'no') {
                let notesLineNo = "";
                if (notesSanitized !== "") {
                    notesLineNo = `\n\n- Messaggio per gli sposi: ${notesForAlert}`;
                }
                
                alertMessage = `Invio ricevuto, ci mancherai ${sanitizedName} ma ti ringraziamo per averci avvisato della tua assenza.${notesLineNo}`;
            } else {
                let notesLineSi = "";
                if (notesSanitized !== "") {
                    notesLineSi = `\n- Messaggio per gli sposi: ${notesForAlert}`;
                }

                alertMessage = `Grazie per la conferma ${sanitizedName} !\n\n` +
                            `Riepilogo:\n` +
                            `- Menù Adulti: ${adultsInput.value}\n` +
                            `- Menù Bambini: ${kidsInput.value}\n` +
                            `- Intolleranze: ${dietaryForAlert}` +
                            `${notesLineSi}\n\n` +
                            `I dati sono stati salvati!\n` +
                            `Grazie per averceli comunicati ❤️`;
            }

            alert(alertMessage);
            
            form.reset();
            syncMenuPreferences();
            handleAttendanceChange();

        } catch (error) {
            console.error("Errore durante l'elaborazione del modulo RSVP:", error);
            
            const errorMessage = `Ops, purtroppo qualcosa non ha funzionato!\n` +
                                `Prova ad aggiornare la pagina e a ricompilare il modulo, oppure comunicaci i dati di conferma contattandoci privatamente`;
            alert(errorMessage);
        }
    });

    // LOGICA DI TEST PER L'ALERT DI ERRORE CUSTOMIZZATO
    if (btnTestError) {
        btnTestError.addEventListener('click', () => {
            const errorMessage = `Ops, purtroppo qualcosa non ha funzionato!\n` +
                                 `Prova ad aggiornare la pagina e a ricompilare il modulo, oppure comunicaci i dati di conferma contattandoci privatamente`;
            alert(errorMessage);
        });
    }
}