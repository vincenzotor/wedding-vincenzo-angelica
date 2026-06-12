/**
 * Pulisce e sanifica le stringhe in ingresso prevenendo attacchi XSS
 * @param {string} string - Testo grezzo inserito dall'utente
 * @returns {string} Stringa sanificata sicura per il DOM
 */
export function sanitizeString(string) {
    const tempDiv = document.createElement('div');
    tempDiv.textContent = string;
    return tempDiv.innerHTML;
}