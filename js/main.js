// Menu burger pour mobile
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');

    if (burger) {
        burger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animation du burger
            burger.classList.toggle('active');
        });
    }

    // Fermer le menu en cliquant sur un lien
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (burger) {
                burger.classList.remove('active');
            }
        });
    });

    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});