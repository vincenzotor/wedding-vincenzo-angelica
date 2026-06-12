export function initUiInteractions() {
    // ---- Menu Mobile Toggle ----
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    // Funzione di chiusura standard
    const closeMenu = () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto'; // Sblocca lo scroll
    };

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita che il click si propaghi al document
            const isOpen = navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.style.overflow = isOpen ? 'hidden' : 'auto'; // Blocca/Sblocca scroll
        });

        // Chiude cliccando sui link
        document.querySelectorAll('.nav-item a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // 1. Chiude se clicchi fuori (sul body)
    document.addEventListener('click', (event) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            closeMenu();
        }
    });

    // 2. Chiude se inizi a scrollare la pagina
    window.addEventListener('scroll', () => {
        if (navMenu.classList.contains('active')) {
            closeMenu();
        }
    }, { passive: true });

    // ---- Accordion FAQ ----
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = question.nextElementSibling;
            
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            item.classList.toggle('active');
            answer.style.maxHeight = item.classList.contains('active') 
                ? `${answer.scrollHeight}px` 
                : null;
        });
    });
}