document.addEventListener('DOMContentLoaded', function() {
    // ===== Mobile Navigation =====
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.getElementById('nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.add('active');
        });
    }
    
    if (navClose && navLinks) {
        navClose.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    }
    
    // Close menu when clicking links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
        });
    });

    // ===== Loading Animation =====
    window.addEventListener('load', function() {
        const loader = document.querySelector('.loader');
        if (loader) loader.style.display = 'none';
    });

    // ===== Dark Mode Toggle =====
    const darkModeToggle = document.createElement('div');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    
    if (document.body) {
        document.body.appendChild(darkModeToggle);
        
        // Check for saved preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        }
        
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = darkModeToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
            }
            // Save preference
            localStorage.setItem('darkMode', 
                document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
        });
    }

    // ===== PROJECT FILTER ===== 
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filterValue = button.dataset.filter;
                
                projectCards.forEach(card => {
                    card.style.display = (filterValue === 'all' || card.dataset.category === filterValue) 
                        ? 'block' 
                        : 'none';
                });
            });
        });
    }
});